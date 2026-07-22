"""
migrate_db.py - Script de migracao SQLite -> PostgreSQL para NEO MATRIX SaaS.

Uso:
  1. Instale as dependencias:
     pip install sqlalchemy pgloader

  2. Configure a URI do PostgreSQL:
     set NEO_DB_URL=postgresql://user:password@localhost:5432/neomatrix

  3. Execute:
     python migrate_db.py

O script:
  - Cria as tabelas no PostgreSQL (se nao existirem).
  - Usa pgloader para migrar dados do SQLite (neo_saas.db) para PostgreSQL.
  - Mantem fallback para SQLite em desenvolvimento (se NEO_DB_URL nao estiver definida).
"""
import os
import subprocess
import logging
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
import models

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(levelname)s %(message)s")
logger = logging.getLogger("neo_saas.migrate")

# Configuracao
SQLITE_DB = "./neo_saas.db"
POSTGRES_DB_URL = os.environ.get("NEO_DB_URL", "")


def create_postgres_tables():
    """Cria tabelas no PostgreSQL (se nao existirem)."""
    if not POSTGRES_DB_URL:
        logger.warning("NEO_DB_URL nao definida. Usando SQLite para desenvolvimento.")
        return
    
    if not POSTGRES_DB_URL.startswith("postgresql://"):
        logger.error("NEO_DB_URL deve ser uma URI PostgreSQL (ex: postgresql://user:***@host:port/db)")
        return
    
    try:
        engine = create_engine(POSTGRES_DB_URL, echo=False)
        models.Base.metadata.create_all(engine)
        logger.info("Tabelas criadas no PostgreSQL: %s", POSTGRES_DB_URL)
    except Exception as e:
        logger.error("Falha ao criar tabelas no PostgreSQL: %s", e)
        raise


def migrate_data_with_pgloader():
    """Migra dados do SQLite para PostgreSQL usando pgloader."""
    if not POSTGRES_DB_URL:
        logger.warning("Migracao pulada: NEO_DB_URL nao definida.")
        return
    
    if not os.path.exists(SQLITE_DB):
        logger.warning("Arquivo SQLite nao encontrado: %s", SQLITE_DB)
        return
    
    pgloader_conf = f"""
LOAD DATABASE
     FROM sqlite:///{os.path.abspath(SQLITE_DB)}
     INTO {POSTGRES_DB_URL}

WITH include drop, create tables, create indexes, reset sequences

SET work_mem to '16MB', maintenance_work_mem to '512 MB';
    """
    
    conf_file = "pgloader_migrate.load"
    with open(conf_file, "w") as f:
        f.write(pgloader_conf)
    
    try:
        logger.info("Iniciando migracao com pgloader...")
        result = subprocess.run(
            ["pgloader", conf_file],
            capture_output=True,
            text=True,
            check=True,
        )
        logger.info("Migracao concluida:\n%s", result.stdout)
    except subprocess.CalledProcessError as e:
        logger.error("Falha na migracao:\n%s", e.stderr)
        raise
    except FileNotFoundError:
        logger.error("pgloader nao encontrado. Instale com: pip install pgloader")
        raise
    finally:
        if os.path.exists(conf_file):
            os.remove(conf_file)


def verify_migration():
    """Verifica se a migracao foi bem-sucedida (contagem de registros)."""
    if not POSTGRES_DB_URL:
        logger.info("Verificacao pulada: usando SQLite.")
        return
    
    try:
        engine = create_engine(POSTGRES_DB_URL, echo=False)
        Session = sessionmaker(bind=engine)
        session = Session()
        
        users_count = session.query(models.User).count()
        usage_count = session.query(models.UsageRecord).count()
        purchases_count = session.query(models.TokenPurchase).count()
        
        logger.info("Verificacao de migracao:")
        logger.info("  Usuarios: %d", users_count)
        logger.info("  Registros de uso: %d", usage_count)
        logger.info("  Compras de tokens: %d", purchases_count)
        
        session.close()
    except Exception as e:
        logger.error("Falha na verificacao: %s", e)
        raise


if __name__ == "__main__":
    logger.info("=== Migracao SQLite -> PostgreSQL ===")
    create_postgres_tables()
    migrate_data_with_pgloader()
    verify_migration()
    logger.info("Migracao concluida com sucesso!")