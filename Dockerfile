# Dockerfile para NEO MATRIX SaaS
# Usa multi-stage build para manter a imagem final pequena.

# -------------------
# Stage 1: Build
# -------------------
FROM python:3.11-slim as builder

# Configuracao
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1

# Instala dependencias de build
RUN apt-get update && apt-get install -y --no-install-recommends gcc python3-dev

# Copia e instala dependencias Python
COPY server/requirements.txt .
RUN pip install --user -r requirements.txt

# -------------------
# Stage 2: Runtime
# -------------------
FROM python:3.11-slim

# Configuracao
WORKDIR /app
ENV PYTHONDONTWRITEBYTECODE 1
ENV PYTHONUNBUFFERED 1
ENV NEO_DB_URL=postgresql://user:pass@postgres:5432/neomatrix

# Instala dependencias runtime
RUN apt-get update && apt-get install -y --no-install-recommends \
    && rm -rf /var/lib/apt/lists/*

# Copia arquivos do builder
COPY --from=builder /root/.local /root/.local
COPY . .

# Garante que scripts em .local sejam encontrados
ENV PATH=/root/.local/bin:$PATH

# Cria usuario nao-root para rodar a aplicacao
RUN useradd -m neo_user && chown -R neo_user:neo_user /app
USER neo_user

# Porta exposta
EXPOSE 8000

# Comando de inicializacao
CMD ["uvicorn", "server.app:app", "--host", "0.0.0.0", "--port", "8000"]