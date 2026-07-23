"""
Smith Program - Quantum Error Mitigation SaaS
Backend API built with FastAPI.

Key Features:
- User authentication (JWT)
- Quantum error mitigation pipeline
- Token-based usage system
- Admin dashboard
- LGPD/GDPR compliance (data deletion, breach notification)
"""

import os
import logging
from datetime import datetime, timedelta
from typing import List, Optional

from fastapi import FastAPI, Depends, HTTPException, status, BackgroundTasks, Request
from fastapi.responses import JSONResponse
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from jose import JWTError, jwt
from pydantic import BaseModel
from sqlalchemy import create_engine, Column, Integer, String, Boolean, DateTime, JSON, Float
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from slowapi import Limiter
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from server.models import User as DBUser, verify_password as _model_verify_password, hash_password as _model_hash_password
from server.rate_limiter import limiter
import requests
import smtplib
from email.mime.text import MIMEText

# --- Configurações ---
SECRET_KEY = os.getenv('SECRET_KEY', 'dev-key-change-in-prod')
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

DATABASE_URL = os.getenv("DATABASE_URL") or os.getenv("NEO_DB_URL", "sqlite:///./quantum.db")
IBM_QUANTUM_API_URL = os.getenv("IBM_QUANTUM_API_URL", "https://api.quantum-computing.ibm.com")

# --- Logging ---
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# --- FastAPI App ---
app = FastAPI(title="Smith Program API", version="1.0.0")

# Rate Limiter
app.state.limiter = limiter

# CORS — ALLOWED_ORIGINS obrigatório em produção (lista separada por vírgula)
ALLOWED_ORIGINS = os.getenv("ALLOWED_ORIGINS", "").split(",")
ALLOWED_ORIGINS = [o.strip() for o in ALLOWED_ORIGINS if o.strip()]
_cors_allow_credentials = bool(ALLOWED_ORIGINS)
if not ALLOWED_ORIGINS:
    logger.warning(
        "ALLOWED_ORIGINS env var not set — defaulting to [\"*\"] with credentials disabled. "
        "Set ALLOWED_ORIGINS=https://yourdomain.com in production!"
    )
    ALLOWED_ORIGINS = ["*"]
app.add_middleware(
    CORSMiddleware,
    allow_origins=ALLOWED_ORIGINS,
    allow_credentials=_cors_allow_credentials,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- Database ---
Base = declarative_base()
engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# --- Schemas ---
class User(BaseModel):
    email: str
    is_active: bool
    is_admin: bool
    tokens_balance: int
    
    class Config:
        orm_mode = True

class UserCreate(BaseModel):
    email: str
    password: str

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class QuantumJob(BaseModel):
    backend: str
    circuit: str
    shots: int = 1024

# --- Security ---
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="v1/auth/login")

# --- Database Session ---
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# --- Auth Utils ---
def verify_password(plain_password: str, hashed_password: str):
    return _model_verify_password(plain_password, hashed_password)

def get_password_hash(password: str):
    return _model_hash_password(password)

def get_user(db: Session, email: str):
    return db.query(DBUser).filter(DBUser.email == email).first()

def authenticate_user(db: Session, email: str, password: str):
    user = get_user(db, email)
    if not user:
        return False
    if not verify_password(password, user.password_hash):
        return False
    return user

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

async def get_current_user(token: str = Depends(oauth2_scheme), db: Session = Depends(get_db)):
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
        token_data = TokenData(email=email)
    except JWTError:
        raise credentials_exception
    user = get_user(db, email=token_data.email)
    if user is None:
        raise credentials_exception
    return user

# --- Email Utils ---
def send_email(to: str, subject: str, body: str):
    """Enviar e-mail (simulação)."""
    try:
        msg = MIMEText(body)
        msg['Subject'] = subject
        msg['From'] = "no-reply@smithprogram.com"
        msg['To'] = to
        
        # Simular envio (substituir por integração real com SendGrid/Mailgun)
        with smtplib.SMTP("localhost") as server:
            server.send_message(msg)
        logger.info(f"Email sent to {to}: {subject}")
    except Exception as e:
        logger.error(f"Failed to send email to {to}: {e}")

# --- Data Breach Notification ---
async def send_anpd_notification(breach_details: str):
    """Notificar a ANPD sobre violação de dados."""
    try:
        # Simular envio para a ANPD (substituir por integração real)
        logger.warning(f"[ANPD NOTIFICATION] Data breach reported at {datetime.utcnow()}: {breach_details}")
        # Exemplo: requests.post("https://anpd.gov.br/api/breach", json={"details": breach_details})
    except Exception as e:
        logger.error(f"Failed to notify ANPD: {e}")

async def send_user_notification(email: str, breach_details: str):
    """Notificar usuário afetado por violação de dados."""
    subject = "Notificação de Violação de Dados Pessoais"
    body = f"Prezado usuário,\n\nDetectamos uma violação de dados que pode ter afetado suas informações pessoais.\n\nDetalhes: {breach_details}\n\nRecomendamos que você altere sua senha e revise suas atividades recentes.\n\nAtenciosamente,\nEquipe Smith Program"
    send_email(email, subject, body)

# --- Endpoints ---
@app.post("/v1/auth/register", response_model=Token)
@limiter.limit("5/minute")
async def register_user(
    request: Request,
    user: UserCreate,
    db: Session = Depends(get_db)
):
    """Registrar novo usuário."""
    db_user = get_user(db, email=user.email)
    if db_user:
        raise HTTPException(status_code=400, detail="Email already registered")
    
    hashed_password = get_password_hash(user.password)
    db_user = DBUser(email=user.email, password_hash=hashed_password)
    db.add(db_user)
    db.commit()
    db.refresh(db_user)
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/v1/auth/login", response_model=Token)
@limiter.limit("10/minute")
async def login_user(
    request: Request,
    form_data: OAuth2PasswordRequestForm = Depends(),
    db: Session = Depends(get_db)
):
    """Autenticar usuário."""
    user = authenticate_user(db, form_data.username, form_data.password)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.email}, expires_delta=access_token_expires
    )
    
    # Atualizar último login
    user.last_login = datetime.utcnow()
    db.commit()
    
    return {"access_token": access_token, "token_type": "bearer"}

@app.post("/v1/me/request-data-deletion")
async def request_data_deletion(
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Solicitar exclusão de dados pessoais (LGPD, Art. 18)."""
    try:
        # Enviar e-mail de confirmação
        subject = "Confirmação de Solicitação de Exclusão de Dados"
        body = f"Prezado usuário,\n\nRecebemos sua solicitação de exclusão de dados pessoais. Para confirmar, clique no link abaixo:\n\n[LINK DE CONFIRMAÇÃO]\n\nAtenciosamente,\nEquipe Smith Program"
        send_email(user.email, subject, body)
        
        # Registrar solicitação no banco de dados
        user.data_deletion_requested = True
        user.data_deletion_requested_at = datetime.utcnow()
        db.commit()
        
        return {"message": "Data deletion request received. Confirm via email."}
    except Exception as e:
        logger.error(f"Failed to process deletion request for {user.email}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.get("/v1/me/data-access")
async def request_data_access(user: User = Depends(get_current_user)):
    """Solicitar acesso aos dados pessoais (LGPD, Art. 18)."""
    try:
        # Gerar relatório de dados
        data_report = {
            "email": user.email,
            "account_created_at": user.created_at,
            "last_login": user.last_login,
            "tokens_balance": user.tokens_balance,
            "survey_responses": user.survey_responses,
        }
        return {"data": data_report}
    except Exception as e:
        logger.error(f"Failed to generate data report for {user.email}: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

@app.post("/v1/internal/notify-data-breach")
async def notify_data_breach(
    user_emails: List[str],
    breach_details: str,
    background_tasks: BackgroundTasks,
    user: User = Depends(get_current_user)
):
    """
    Notificar violação de dados (ANPD + usuários).
    Acesso restrito a administradores.
    """
    if not user.is_admin:
        raise HTTPException(status_code=403, detail="Forbidden")
    
    # Notificar ANPD
    background_tasks.add_task(send_anpd_notification, breach_details)
    
    # Notificar usuários afetados
    for email in user_emails:
        background_tasks.add_task(send_user_notification, email, breach_details)
    
    return {"message": "Data breach notifications queued successfully."}

@app.post("/v1/quantum/execute")
async def execute_quantum_job(
    job: QuantumJob,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Executar job de mitigação de erros quânticos."""
    if user.tokens_balance < 2:
        raise HTTPException(status_code=400, detail="Insufficient tokens")
    
    # Simular execução (substituir por integração real com IBM Quantum)
    try:
        # Deduzir tokens
        user.tokens_balance -= 2
        db.commit()
        
        return {
            "message": "Job executed successfully",
            "remaining_tokens": user.tokens_balance,
            "result": {"fidelity": 0.95, "error_rate": 0.05}
        }
    except Exception as e:
        logger.error(f"Failed to execute quantum job: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

class SurveySubmission(BaseModel):
    usage: str
    circuits: str
    payment: str
    consent: bool

@app.post("/v1/user/submit-survey")
async def submit_survey(
    survey: SurveySubmission,
    user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """
    Submeter respostas do survey pós-cadastro.
    Base legal LGPD: consentimento do titular (Art. 7, I).
    """
    if not survey.consent:
        raise HTTPException(
            status_code=400,
            detail="Consentimento obrigatório para coleta de dados (LGPD Art. 7, I)"
        )
    try:
        user.survey_responses = {
            "usage": survey.usage,
            "circuits": survey.circuits,
            "payment": survey.payment,
            "consent": True,
            "consent_timestamp": datetime.utcnow().isoformat(),
            "legal_basis": "LGPD Art. 7, I - Consentimento do titular"
        }
        db.commit()
        return {"message": "Survey submitted successfully"}
    except Exception as e:
        logger.error(f"Failed to submit survey: {e}")
        raise HTTPException(status_code=500, detail="Internal server error")

# --- Error Handlers ---
@app.exception_handler(RateLimitExceeded)
async def rate_limit_exceeded_handler(request: Request, exc: RateLimitExceeded):
    return JSONResponse(
        status_code=429,
        content={"detail": "Too many requests. Please try again later."},
    )

# --- Initialize DB ---
Base.metadata.create_all(bind=engine)

# --- Mount Static Files ---
if os.path.isdir("static"):
    app.mount("/static", StaticFiles(directory="static"), name="static")
else:
    logger.warning("'static' directory not found — skipping static file serving")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)