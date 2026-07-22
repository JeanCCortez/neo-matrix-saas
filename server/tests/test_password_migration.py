"""
test_password_migration.py - Testes para migracao SHA256 -> bcrypt.

Verifica:
  - Novos usuarios recebem hash bcrypt
  - Usuarios legados (SHA256) conseguem logar
  - Hash e migrado para bcrypt apos login bem-sucedido
  - Usuarios ja migrados nao sao re-processados
"""
import secrets
import hashlib
import pytest
from unittest.mock import MagicMock

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from models import (
    hash_password,
    verify_password,
    needs_rehash,
    migrate_password_hash,
)


def create_legacy_sha256_hash(pwd: str) -> str:
    """Cria hash no formato SHA256 legado para testes."""
    salt = secrets.token_hex(16)
    h = hashlib.sha256((salt + pwd).encode()).hexdigest()
    return f"sha256${salt}${h}"


class TestHashPassword:
    def test_new_hash_uses_bcrypt(self):
        hashed = hash_password("senhaSegura123")
        assert hashed.startswith("bcrypt$")

    def test_different_passwords_different_hashes(self):
        h1 = hash_password("senha1")
        h2 = hash_password("senha2")
        assert h1 != h2

    def test_same_password_different_salts(self):
        h1 = hash_password("mesmasenha")
        h2 = hash_password("mesmasenha")
        assert h1 != h2


class TestVerifyPassword:
    def test_verify_bcrypt_correct(self):
        pwd = "minhasenha123"
        hashed = hash_password(pwd)
        assert verify_password(pwd, hashed) is True

    def test_verify_bcrypt_incorrect(self):
        hashed = hash_password("senhaCorreta")
        assert verify_password("senhaErrada", hashed) is False

    def test_verify_sha256_legacy_correct(self):
        pwd = "senhaLegada456"
        legacy_hash = create_legacy_sha256_hash(pwd)
        assert verify_password(pwd, legacy_hash) is True

    def test_verify_sha256_legacy_incorrect(self):
        legacy_hash = create_legacy_sha256_hash("senhaOriginal")
        assert verify_password("senhaErrada", legacy_hash) is False

    def test_verify_unknown_format_returns_false(self):
        assert verify_password("qualquer", "formato_invalido") is False

    def test_verify_malformed_hash_returns_false(self):
        assert verify_password("senha", "sha256$") is False
        assert verify_password("senha", "bcrypt$") is False


class TestNeedsRehash:
    def test_sha256_needs_rehash(self):
        legacy = create_legacy_sha256_hash("teste")
        assert needs_rehash(legacy) is True

    def test_bcrypt_no_rehash(self):
        modern = hash_password("teste")
        assert needs_rehash(modern) is False


class TestMigratePasswordHash:
    def test_migrates_sha256_to_bcrypt(self):
        pwd = "migrarEsta"
        legacy_hash = create_legacy_sha256_hash(pwd)

        user = MagicMock()
        user.password_hash = legacy_hash
        user.id = "usr_test123"

        db_session = MagicMock()

        migrate_password_hash(user, pwd, db_session)

        assert user.password_hash.startswith("bcrypt$")
        assert verify_password(pwd, user.password_hash) is True
        db_session.commit.assert_called_once()

    def test_skips_already_bcrypt(self):
        pwd = "jaModerna"
        bcrypt_hash = hash_password(pwd)

        user = MagicMock()
        user.password_hash = bcrypt_hash
        original_hash = bcrypt_hash

        db_session = MagicMock()

        migrate_password_hash(user, pwd, db_session)

        assert user.password_hash == original_hash
        db_session.commit.assert_not_called()


class TestPasswordSecurityRequirements:
    def test_bcrypt_cost_factor(self):
        import bcrypt as bcrypt_lib
        hashed = hash_password("testandoCost")
        _, hash_part = hashed.split("$", 1)
        cost = int(hash_part.split("$")[2][:2])
        assert cost >= 12

    def test_handles_unicode_passwords(self):
        pwd = "senhaComAcentos123"
        hashed = hash_password(pwd)
        assert verify_password(pwd, hashed) is True

    def test_handles_special_characters(self):
        pwd = "P@$$w0rd!#%&*()[]{}|;:,.<>?/~`"
        hashed = hash_password(pwd)
        assert verify_password(pwd, hashed) is True

    def test_handles_long_passwords(self):
        pwd = "a" * 72
        hashed = hash_password(pwd)
        assert verify_password(pwd, hashed) is True
