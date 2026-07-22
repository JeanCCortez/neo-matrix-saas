#!/usr/bin/env python3
"""
migrate_passwords_batch.py - Script administrativo para migracao em lote.

USO: Apenas se quiser forcar migracao de TODOS os usuarios de uma vez.
     A migracao automatica no login ja cobre a maioria dos casos.

IMPORTANTE: Este script requer que o admin tenha as senhas em texto claro
            de alguma forma (ex: importacao de sistema legado), ou que seja
            executado ANTES de um deadline de seguranca. Para usuarios normais,
            a migracao transparente no login eh suficiente.

Execucao:
    python scripts/migrate_passwords_batch.py --dry-run   # simula
    python scripts/migrate_passwords_batch.py             # executa

Requer: NEO_DB_URL no ambiente (ou usa sqlite padrao).
"""
import os
import sys
import argparse

sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import init_db, User, needs_rehash


def count_legacy_users(db):
    """Conta usuarios com hash SHA256 legado."""
    users = db.query(User).all()
    return sum(1 for u in users if needs_rehash(u.password_hash))


def list_legacy_users(db):
    """Lista IDs e emails de usuarios com hash legado."""
    users = db.query(User).all()
    return [(u.id, u.email) for u in users if needs_rehash(u.password_hash)]


def main():
    parser = argparse.ArgumentParser(description="Relatorio de migracao de senhas")
    parser.add_argument("--dry-run", action="store_true", help="Apenas exibe estatisticas")
    args = parser.parse_args()

    db_url = os.environ.get("NEO_DB_URL", "sqlite:///./neo_saas.db")
    SessionLocal = init_db(db_url)
    db = SessionLocal()

    try:
        total = db.query(User).count()
        legacy_count = count_legacy_users(db)
        migrated = total - legacy_count

        print(f"\n{'='*50}")
        print("RELATORIO DE MIGRACAO DE SENHAS - NEO MATRIX SaaS")
        print(f"{'='*50}")
        print(f"Total de usuarios:     {total}")
        print(f"Ja migrados (bcrypt):  {migrated}")
        print(f"Pendentes (SHA256):    {legacy_count}")
        print(f"{'='*50}\n")

        if legacy_count > 0:
            print("Usuarios pendentes de migracao:")
            for uid, email in list_legacy_users(db):
                print(f"  - {uid}: {email}")
            print()
            print("NOTA: Estes usuarios serao migrados automaticamente")
            print("      no proximo login bem-sucedido.")
            print()

        if args.dry_run:
            print("[DRY-RUN] Nenhuma alteracao realizada.")
        else:
            print("A migracao ocorre automaticamente no login.")
            print("Este script eh apenas para monitoramento.")

    finally:
        db.close()


if __name__ == "__main__":
    main()
