import logging
from typing import Any

import httpx
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

from .config import settings
from .onec_client import OneCClient, OneCConfigurationError

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(name)s: %(message)s")

app = FastAPI(title="Migrant CRM API", version="1.0.0")
app.add_middleware(
    CORSMiddleware,
    allow_origins=list(settings.cors_origins),
    allow_credentials=False,
    allow_methods=["GET"],
    allow_headers=["Accept", "Content-Type"],
)
onec_client = OneCClient()


def ensure_payload(payload: dict[str, Any], expected_item_type: type) -> dict[str, Any]:
    if payload.get("status") != "ok" or not isinstance(payload.get("data"), list):
        raise HTTPException(status_code=502, detail="1С вернула некорректный ответ.")
    if not all(isinstance(item, expected_item_type) for item in payload["data"]):
        raise HTTPException(status_code=502, detail="1С вернула данные в неожиданном формате.")
    return payload


async def proxy_call(operation: str, **kwargs: Any) -> dict[str, Any]:
    try:
        payload = await getattr(onec_client, operation)(**kwargs)
        return ensure_payload(payload, str if operation == "get_objects" else dict)
    except OneCConfigurationError as error:
        raise HTTPException(status_code=503, detail=str(error)) from error
    except httpx.TimeoutException as error:
        raise HTTPException(status_code=504, detail="1С не ответила за отведённое время.") from error
    except httpx.HTTPStatusError as error:
        if error.response is not None and error.response.status_code in (401, 403):
            detail, status_code = "Сессия авторизации 1С истекла.", 502
        else:
            detail, status_code = "1С временно недоступна.", 502
        raise HTTPException(status_code=status_code, detail=detail) from error
    except (httpx.HTTPError, ValueError) as error:
        raise HTTPException(status_code=502, detail="Не удалось получить данные из 1С.") from error


@app.get("/api/objects")
async def get_objects() -> dict[str, Any]:
    return await proxy_call("get_objects")


@app.get("/api/employees")
async def get_employees(fullName: str | None = Query(default=None, max_length=200)) -> dict[str, Any]:
    return await proxy_call("get_employees", full_name=fullName)


@app.get("/api/employees/{tn}")
async def get_employee(tn: str) -> dict[str, Any]:
    # 1C has no confirmed single-employee endpoint or tn query parameter.
    payload = await proxy_call("get_employees")
    employee = next((item for item in payload["data"] if item.get("tn") == tn), None)
    if employee is None:
        raise HTTPException(status_code=404, detail="Сотрудник не найден.")
    return {"status": "ok", "data": employee}
