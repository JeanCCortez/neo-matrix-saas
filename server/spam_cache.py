"""
spam_cache.py - Cache em memoria da calibracao SPAM por backend.

Regra: SPAM da IBM muda ao longo do dia (recalibracao do chip).
Cachear pra sempre -> resultado errado. Nao cachear -> gasta 1 job extra
por chamada do cliente.

Solucao: TTL de 30 min por backend. Se dentro desse tempo outro cliente
(ou o mesmo) rodar no mesmo backend, reusa. Passou -> recalibra.

O cache eh COMPARTILHADO entre todos os usuarios: SPAM eh propriedade do
backend, nao do cliente. Isso reduz custo do servidor sem misturar dados
de clientes (t00/t11 nao sao dados privados).
"""
import time
import threading

_CACHE = {}  # backend_name -> {"t00":..., "t11":..., "ts": epoch, "job_id":..., "shots":...}
_LOCK = threading.Lock()

TTL_SECONDS = 30 * 60  # 30 minutos


def get(backend_name):
    """Retorna (t00, t11, from_cache, ibm_job_id) ou None se cache invalido."""
    with _LOCK:
        entry = _CACHE.get(backend_name)
        if entry is None:
            return None
        if time.time() - entry["ts"] > TTL_SECONDS:
            _CACHE.pop(backend_name, None)
            return None
        return entry["t00"], entry["t11"], True, entry["job_id"]


def put(backend_name, t00, t11, job_id):
    with _LOCK:
        _CACHE[backend_name] = {
            "t00": t00, "t11": t11, "ts": time.time(),
            "job_id": job_id,
        }


def invalidate(backend_name=None):
    with _LOCK:
        if backend_name is None:
            _CACHE.clear()
        else:
            _CACHE.pop(backend_name, None)


def stats():
    """Para o dashboard admin."""
    with _LOCK:
        now = time.time()
        return {
            "backends_cached": list(_CACHE.keys()),
            "entries": {
                k: {
                    "age_seconds": int(now - v["ts"]),
                    "ttl_remaining_seconds": max(0, TTL_SECONDS - int(now - v["ts"])),
                    "ibm_job_id": v["job_id"],
                } for k, v in _CACHE.items()
            }
        }
