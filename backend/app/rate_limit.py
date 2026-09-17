from slowapi import Limiter
from slowapi.util import get_remote_address
from starlette.requests import Request


# в проде мы за прокси (Render/Cloudflare) — реальный IP клиента лежит в X-Forwarded-For,
# а не в request.client.host (это был бы адрес самого прокси, один на всех — лимит бы не работал)
def _client_ip(request: Request) -> str:
    forwarded = request.headers.get("x-forwarded-for")
    if forwarded:
        return forwarded.split(",")[0].strip()
    return get_remote_address(request)


# in-memory хранилище лимитов достаточно: на бесплатном тарифе всегда один инстанс
limiter = Limiter(key_func=_client_ip)
