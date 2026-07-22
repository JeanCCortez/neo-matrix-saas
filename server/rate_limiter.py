"""
rate_limiter.py - Rate limiting para NEO MATRIX SaaS.

Usa slowapi (baseado em limits) com storage em memoria.
Regras:
  - /v1/auth/register: 5/hora por IP
  - /v1/auth/login: 10/hora por IP
  - /v1/run: 100/hora por API key
  - /v1/me: 30/hora por API key
  - /v1/me/usage: 30/hora por API key
  - /v1/me/subscription-intent: 10/hora por API key
  - /v1/tokens/purchase/init: 10/hora por API key
  - /v1/health: 100/hora por IP
  - endpoints admin: 30/hora por IP

Headers de rate limit sao incluidos automaticamente nas respostas.
"""
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from fastapi import Request, Response
from fastapi.responses import JSONResponse


def get_api_key_or_ip(request: Request) -> str:
    """Extrai API key do header ou fallback para IP.

    Usado para rate limiting no /v1/run onde queremos limitar por usuario.
    """
    api_key = request.headers.get("X-API-Key")
    if api_key:
        return f"apikey:{api_key}"
    return f"ip:{get_remote_address(request)}"


def get_ip_address(request: Request) -> str:
    """Extrai IP do request para rate limiting por IP."""
    return f"ip:{get_remote_address(request)}"


limiter = Limiter(
    key_func=get_remote_address,
    default_limits=[],
    headers_enabled=True,
)

# Constantes de limites (centralizadas para facil ajuste)
LIMIT_REGISTER = "5/hour"
LIMIT_LOGIN = "10/hour"
LIMIT_RUN = "100/hour"
LIMIT_ME = "30/hour"
LIMIT_ME_USAGE = "30/hour"
LIMIT_ME_INTENT = "10/hour"
LIMIT_PURCHASE_INIT = "10/hour"
LIMIT_HEALTH = "100/hour"
LIMIT_ADMIN = "30/hour"


def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded) -> JSONResponse:
    """Handler customizado para erro 429 com mensagem clara em portugues."""
    retry_after = exc.detail.split("retry after ")[1] if "retry after" in exc.detail else "1 hora"

    response = JSONResponse(
        status_code=429,
        content={
            "error": "Limite de requisicoes excedido.",
            "detail": f"Voce atingiu o limite de requisicoes para este endpoint. Tente novamente em {retry_after}.",
            "limit": str(exc.detail).split(" ")[0] if exc.detail else "unknown",
        }
    )

    response.headers["Retry-After"] = retry_after
    response.headers["X-RateLimit-Limit"] = str(exc.detail).split(" ")[0] if exc.detail else "0"
    response.headers["X-RateLimit-Remaining"] = "0"

    return response