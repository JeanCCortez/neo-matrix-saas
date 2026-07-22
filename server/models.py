"""
models.py - Modelos de dados (SQLAlchemy). Guardam APENAS o que precisa
persistir: usuario, saldo, historico de uso, intenção de assinatura.

NAO guardam: token IBM do cliente, CRN do cliente, credenciais brutas,
circuitos ou resultados enviados (a menos que o cliente explicitamente
opte no futuro).
"""
import os
import secrets
import hashlib
import logging
from datetime import datetime
from sqlalchemy import Column, String, Integer, Boolean, DateTime, Float, ForeignKey, Text, create_engine
from sqlalchemy.orm import declarative_base, relationship, sessionmaker

import bcrypt

Base = declarative_base()
logger = logging.getLogger("neo_saas.models")


def gen_id(prefix=""):
    return prefix + secrets.token_urlsafe(16)


def hash_password(pwd: str) -> str:
    """Gera hash bcrypt para nova senha. Cost factor 12 (padrao seguro)."""
    pwd_bytes = pwd.encode("utf-8")
    salt = bcrypt.gensalt(rounds=12)
    hashed = bcrypt.hashpw(pwd_bytes, salt)
    return f"bcrypt${hashed.decode('utf-8')}"


def _verify_sha256_legacy(pwd: str, stored: str) -> bool:
    """Verifica hash SHA256 legado (formato: sha256$salt$hash)."""
    try:
        _, salt, h = stored.split("$")
        return hashlib.sha256((salt + pwd).encode()).hexdigest() == h
    except Exception:
        return False


def _verify_bcrypt(pwd: str, stored: str) -> bool:
    """Verifica hash bcrypt (formato: bcrypt$hash)."""
    try:
        _, hashed = stored.split("$", 1)
        return bcrypt.checkpw(pwd.encode("utf-8"), hashed.encode("utf-8"))
    except Exception:
        return False


def verify_password(pwd: str, stored: str) -> bool:
    """Verifica senha contra hash armazenado (bcrypt ou SHA256 legado)."""
    if stored.startswith("bcrypt$"):
        return _verify_bcrypt(pwd, stored)
    elif stored.startswith("sha256$"):
        return _verify_sha256_legacy(pwd, stored)
    return False


def needs_rehash(stored: str) -> bool:
    """Retorna True se o hash precisa ser migrado para bcrypt."""
    return stored.startswith("sha256$")


def migrate_password_hash(user, pwd: str, db_session) -> None:
    """Migra hash SHA256 legado para bcrypt de forma transparente no login."""
    if needs_rehash(user.password_hash):
        user.password_hash = hash_password(pwd)
        db_session.commit()
        logger.info("Senha migrada para bcrypt user_id=%s", user.id)


class User(Base):
    __tablename__ = "users"
    id = Column(String, primary_key=True, default=lambda: gen_id("usr_"))
    email = Column(String, unique=True, nullable=False, index=True)
    password_hash = Column(String, nullable=False)
    api_key = Column(String, unique=True, nullable=False, index=True,
                     default=lambda: "nm_" + secrets.token_urlsafe(32))
    tokens_balance = Column(Integer, default=10)  # 10 tokens de teste inicial
    is_admin = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    would_subscribe = Column(Boolean, nullable=True)  # pesquisa de intencao
    subscription_feedback = Column(Text, nullable=True)

    usage = relationship("UsageRecord", back_populates="user")


class UsageRecord(Base):
    __tablename__ = "usage_records"
    id = Column(String, primary_key=True, default=lambda: gen_id("use_"))
    user_id = Column(String, ForeignKey("users.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow, index=True)
    backend_name = Column(String)
    ibm_job_id = Column(String)  # p/ auditoria
    tokens_charged = Column(Integer)
    success = Column(Boolean)
    purified_fidelity_pct = Column(Float, nullable=True)
    error_message = Column(String, nullable=True)
    # NUNCA guardar aqui: token IBM, CRN, circuito enviado
    user = relationship("User", back_populates="usage")


class TokenPurchase(Base):
    __tablename__ = "token_purchases"
    id = Column(String, primary_key=True, default=lambda: gen_id("prc_"))
    user_id = Column(String, ForeignKey("users.id"), index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    tokens_added = Column(Integer)
    amount_usd = Column(Float)
    payment_provider = Column(String)  # 'stripe', 'mercadopago', 'manual' etc.
    payment_reference = Column(String)  # ID do gateway
    status = Column(String)  # 'pending', 'completed', 'failed', 'refunded'


class SurveyResponse(Base):
    __tablename__ = "survey_responses"
    id = Column(String, primary_key=True, default=lambda: gen_id("srv_"))
    user_id = Column(String, ForeignKey("users.id"), unique=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    usage_intent = Column(String)  # 'academic', 'company', 'personal', 'other'
    circuits_per_month = Column(String)  # '1-10', '10-100', '100+', 'unknown'
    would_pay = Column(String)  # 'yes', 'maybe', 'no'


def init_db(database_url=None):
    """
    Inicializa o banco de dados.
    Em producao: usa NEO_DB_URL (PostgreSQL).
    Em desenvolvimento: fallback para SQLite se NEO_DB_URL nao estiver definida.
    """
    if database_url is None:
        database_url = os.environ.get("NEO_DB_URL", "sqlite:///./neo_saas.db")
    
    # Validacao basica para PostgreSQL
    if not database_url.startswith("postgresql://") and not database_url.startswith("sqlite://"):
        raise ValueError(
            "NEO_DB_URL deve ser uma URI PostgreSQL (ex: postgresql://user:***@host:port/db) "
            "ou SQLite (ex: sqlite:///./neo_saas.db)"
        )
    
    engine = create_engine(database_url, echo=False)
    Base.metadata.create_all(engine)
    return sessionmaker(bind=engine, autoflush=False, autocommit=False)
