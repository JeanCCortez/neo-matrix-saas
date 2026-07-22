# CLAUDE.md — NEO MATRIX SaaS


## Project Overview

SaaS for quantum circuit execution on IBM Quantum.

Users submit QASM3 circuits via API, we execute with SPAM calibration and return purified fidelity.


## Stack

- Backend: FastAPI + SQLite (dev) → PostgreSQL (prod)
- Auth: API Key via X-API-Key header
- Cache: In-memory SPAM cache (TTL 30min, shared per backend)
- Client: Python CLI (neo_client.py)


## Project Structure


server/
  app.py # FastAPI routes
  models.py # DB models
  spam_cache.py # SPAM calibration cache
  neo_pipeline.py # Core quantum pipeline (proprietary)
  payment_service.py # Stripe/MercadoPago integration (Tarefa 7)
  rate_limiter.py # Rate limiting logic

client_example/
  neo_client.py # CLI client

docs/
  terms_rascunho_tecnico.md

frontend/ # Tarefa 6 (React + TailwindCSS)
  src/
    components/
    pages/
    services/
  package.json
  vite.config.js

migrate_db.py # Tarefa 4 (SQLite → PostgreSQL)
Dockerfile # Tarefa 5
 docker-compose.yml # Tarefa 5



## Security Rules (mandatory)

- IBM tokens/CRN never stored — memory only during request
- No circuits stored anywhere
- Passwords: bcrypt (cost 12), migracao automatica no login
- API keys: hashed in DB
- Rate limiting required on all endpoints
- CORS: restrito via ALLOWED_ORIGINS (env var, lista separada por virgula)
- HTTPS: enforce in prod


## What's Done

- Register/login + API key generation
- /v1/run endpoint with auth, SPAM cache, token billing, IBM execution
- Admin panel (/v1/admin/*)
- Client CLI
- Token system: 10 free on signup, 2 tokens per shot
- Password migration SHA256 → bcrypt (v1.0 - 2026-07-21)
- Rate limiting em todos os endpoints (v1.0 - 2026-07-21)
- CORS restrito via ALLOWED_ORIGINS (v1.0 - 2026-07-21)
- PostgreSQL migration (Tarefa 4 - 2026-07-21)
- Docker containerization (Tarefa 5 - 2026-07-21)
- Frontend dashboard (Tarefa 6 - 2026-07-21)
- Stripe integration (Tarefa 7 - 2026-07-21)
- Frontend refactor (2026-07-22):
  - Removed RunCircuit page (pipeline runs via API/CLI only)
  - Removed SPAM/ZNE calibration options (pipeline runs full automatically)
  - i18n PT-BR and EN-US with language selector in navbar/landing
  - Dashboard: tokens, job history (IBM Quantum style), fidelity before/after chart, API key with copy + terminal instructions
  - Registration survey (3 questions) with POST /v1/survey endpoint
  - Admin survey results tab with distribution charts (pie/bar)
- Security hardening (2026-07-22):
  - SECRET_KEY forte (32 bytes hex) via env var
  - .env no .gitignore + .env.example com placeholders
  - Logging de falhas de autenticacao (email, IP, timestamp) - sem senhas
  - Security headers middleware (HSTS, X-Frame-Options, X-Content-Type-Options, X-XSS-Protection)
  - NEO_SEED configuravel via env var (fallback aleatorio)


## What's Needed (priority order)

1. ~~Password migration SHA256 → bcrypt/argon2~~ DONE
2. ~~Rate limiting on all endpoints~~ DONE
3. ~~CORS restriction~~ DONE
4. ~~PostgreSQL migration~~ DONE
5. ~~Docker containerization~~ DONE
6. ~~Frontend dashboard (mobile/tablet responsive)~~ DONE
7. ~~Stripe/MercadoPago integration (hooks ready)~~ DONE
8. ~~Security hardening (SECRET_KEY, logging, headers, NEO_SEED)~~ DONE
9. HTTPS + monitoring


## Coding Standards

- Functions < 50 lines
- Input validation on every endpoint (Pydantic)
- Parameterized queries only
- No secrets in code — environment variables
- Tests required for new code
- Error messages must not leak internals


## Token Economy

- Use smallest model for task
- Delegate research/summaries to OpenClaw agents
- Claude Code only for: architecture, complex bugs, security-sensitive code, refactoring