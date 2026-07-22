# Dockerfile para NEO MATRIX SaaS (contexto: server/)
# Usa multi-stage build para manter a imagem final pequena.

# -------------------
# Stage 1: Build
# -------------------
FROM python:3.11-slim AS builder

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Instala dependencias de build
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev \
    && rm -rf /var/lib/apt/lists/*

# Copia e instala dependencias Python
COPY requirements.txt .
RUN pip install --user --no-cache-dir -r requirements.txt

# -------------------
# Stage 2: Runtime
# -------------------
FROM python:3.11-slim

WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE=1
ENV PYTHONUNBUFFERED=1

# Copia dependencias do builder
COPY --from=builder /root/.local /root/.local
ENV PATH=/root/.local/bin:$PATH

# Copia codigo da aplicacao
COPY . .

# Cria usuario nao-root para rodar a aplicacao
RUN useradd -m -u 1000 neo_user && chown -R neo_user:neo_user /app

USER neo_user

EXPOSE 8000

CMD ["uvicorn", "app:app", "--host", "0.0.0.0", "--port", "8000"]
