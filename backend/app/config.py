from dataclasses import dataclass
from os import getenv

from dotenv import load_dotenv

load_dotenv()

@dataclass(frozen=True)
class Settings:
    onec_base_url: str = getenv("ONEC_BASE_URL", "http://135.181.220.43")
    onec_service_path: str = getenv("ONEC_SERVICE_PATH", "/Proffart_hrm/hs/datatransfer")
    onec_auth_secret: str = getenv("ONEC_AUTH_SECRET", "")
    onec_timeout_seconds: float = float(getenv("ONEC_TIMEOUT_SECONDS", "20"))
    cors_origins: tuple[str, ...] = tuple(
        origin.strip()
        for origin in getenv("CORS_ORIGINS", "http://localhost:5173,http://127.0.0.1:5173").split(",")
        if origin.strip()
    )


settings = Settings()
