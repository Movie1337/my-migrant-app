import asyncio
import logging
from datetime import datetime, timezone
from time import perf_counter
from typing import Any

import httpx

from .config import Settings, settings

logger = logging.getLogger(__name__)


class OneCConfigurationError(RuntimeError):
    pass


class OneCClient:
    """Calls 1C from the backend and keeps authorization credentials private."""

    def __init__(self, client_settings: Settings = settings) -> None:
        self.settings = client_settings
        self._token: str | None = None
        self._token_valid_to: datetime | None = None
        self._token_lock = asyncio.Lock()

    def _url(self, path: str) -> str:
        return (
            f"{self.settings.onec_base_url.rstrip('/')}/"
            f"{self.settings.onec_service_path.strip('/')}/"
            f"{path.lstrip('/')}"
        )

    def _has_valid_token(self) -> bool:
        return bool(
            self._token
            and self._token_valid_to
            and datetime.now(timezone.utc) < self._token_valid_to
        )

    @staticmethod
    def _parse_valid_to(value: Any) -> datetime:
        if not isinstance(value, str) or not value:
            raise OneCConfigurationError("1С не вернула validTo временного кода.")
        try:
            parsed = datetime.fromisoformat(value.replace("Z", "+00:00"))
        except ValueError as error:
            raise OneCConfigurationError("1С вернула некорректное значение validTo.") from error
        return parsed.replace(tzinfo=timezone.utc) if parsed.tzinfo is None else parsed.astimezone(timezone.utc)

    async def get_auth_token(self, force_refresh: bool = False) -> str:
        if not force_refresh and self._has_valid_token():
            return self._token or ""

        async with self._token_lock:
            if not force_refresh and self._has_valid_token():
                return self._token or ""
            if not self.settings.onec_auth_secret:
                raise OneCConfigurationError("Не указан ONEC_AUTH_SECRET в настройках backend.")

            started_at = perf_counter()
            async with httpx.AsyncClient(timeout=self.settings.onec_timeout_seconds) as client:
                response = await client.get(
                    self._url("enter"),
                    headers={
                        "My-Authorization": self.settings.onec_auth_secret,
                        "Accept": "application/json",
                    },
                )
            logger.info(
                "1C GET enter returned %s in %.0f ms",
                response.status_code,
                (perf_counter() - started_at) * 1000,
            )
            response.raise_for_status()

            payload = response.json()
            if not isinstance(payload, dict) or payload.get("status") != "ok":
                raise OneCConfigurationError("1С не подтвердила получение временного кода.")
            token = payload.get("authorization")
            if not isinstance(token, str) or not token:
                raise OneCConfigurationError("1С не вернула временный код авторизации.")

            logger.info("1C auth validTo received: %s", payload.get("validTo"))
            
            self._token = token
            self._token_valid_to = self._parse_valid_to(payload.get("validTo"))
            return token

    async def request(self, path: str, params: dict[str, str] | None = None) -> dict[str, Any]:
        for attempt in range(2):
            token = await self.get_auth_token(force_refresh=attempt == 1)
            started_at = perf_counter()
            try:
                async with httpx.AsyncClient(timeout=self.settings.onec_timeout_seconds) as client:
                    response = await client.get(
                        self._url(path),
                        params=params,
                        headers={"My-Authorization": token, "Accept": "application/json"},
                    )
                logger.info(
                    "1C GET %s returned %s in %.0f ms",
                    path,
                    response.status_code,
                    (perf_counter() - started_at) * 1000,
                )
                if response.status_code in (401, 403) and attempt == 0:
                    self._token = None
                    self._token_valid_to = None
                    continue
                response.raise_for_status()
                payload = response.json()
                if not isinstance(payload, dict):
                    raise httpx.DecodingError("Ответ 1С должен быть JSON-объектом", request=response.request)
                return payload
            except (httpx.HTTPError, ValueError) as error:
                logger.warning("1C GET %s failed: %s", path, error)
                raise

        raise OneCConfigurationError("Авторизация 1С отклонена после повторной попытки.")

    async def get_objects(self) -> dict[str, Any]:
        return await self.request("objects")

    async def get_employees(self, full_name: str | None = None) -> dict[str, Any]:
        return await self.request("employees", params={"fullName": full_name} if full_name else None)
