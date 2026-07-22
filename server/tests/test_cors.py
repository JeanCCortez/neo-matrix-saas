"""
test_cors.py - Testes para configuracao CORS.

Verifica:
  - Origins permitidos via variavel de ambiente ALLOWED_ORIGINS
  - Fallback para localhost em desenvolvimento
  - Metodos HTTP permitidos
  - Headers permitidos
  - Credentials habilitado
  - Requisicoes preflight (OPTIONS)
"""
import pytest
import os
from unittest.mock import patch

import sys
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))


class TestCorsConfig:
    """Testes para funcao get_allowed_origins."""

    def test_dev_origins_fallback(self):
        """Sem ALLOWED_ORIGINS, deve usar localhost:3000 e localhost:8000."""
        with patch.dict(os.environ, {}, clear=True):
            if "ALLOWED_ORIGINS" in os.environ:
                del os.environ["ALLOWED_ORIGINS"]

            from app import get_allowed_origins, DEV_ORIGINS
            origins = get_allowed_origins()

            assert origins == DEV_ORIGINS
            assert "http://localhost:3000" in origins
            assert "http://localhost:8000" in origins

    def test_single_origin_from_env(self):
        """ALLOWED_ORIGINS com um dominio."""
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": "https://neomatrix.io"}, clear=False):
            from importlib import reload
            import app
            reload(app)

            origins = app.get_allowed_origins()
            assert origins == ["https://neomatrix.io"]

    def test_multiple_origins_from_env(self):
        """ALLOWED_ORIGINS com multiplos dominios separados por virgula."""
        test_origins = "https://neomatrix.io,https://api.neomatrix.io,https://dashboard.neomatrix.io"
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": test_origins}, clear=False):
            from importlib import reload
            import app
            reload(app)

            origins = app.get_allowed_origins()
            assert len(origins) == 3
            assert "https://neomatrix.io" in origins
            assert "https://api.neomatrix.io" in origins
            assert "https://dashboard.neomatrix.io" in origins

    def test_origins_with_whitespace(self):
        """ALLOWED_ORIGINS com espacos deve ser tratado corretamente."""
        test_origins = " https://neomatrix.io , https://api.neomatrix.io "
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": test_origins}, clear=False):
            from importlib import reload
            import app
            reload(app)

            origins = app.get_allowed_origins()
            assert len(origins) == 2
            assert "https://neomatrix.io" in origins
            assert "https://api.neomatrix.io" in origins

    def test_empty_origins_fallback(self):
        """ALLOWED_ORIGINS vazio deve usar fallback de desenvolvimento."""
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": ""}, clear=False):
            from importlib import reload
            import app
            reload(app)

            origins = app.get_allowed_origins()
            assert "http://localhost:3000" in origins
            assert "http://localhost:8000" in origins

    def test_whitespace_only_origins_fallback(self):
        """ALLOWED_ORIGINS so com espacos deve usar fallback."""
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": "   "}, clear=False):
            from importlib import reload
            import app
            reload(app)

            origins = app.get_allowed_origins()
            assert "http://localhost:3000" in origins


class TestCorsMiddleware:
    """Testes de integracao para middleware CORS."""

    @pytest.fixture
    def client(self):
        """Cliente de teste com CORS configurado para dev."""
        with patch.dict(os.environ, {}, clear=True):
            if "ALLOWED_ORIGINS" in os.environ:
                del os.environ["ALLOWED_ORIGINS"]

            from importlib import reload
            import app
            reload(app)

            from fastapi.testclient import TestClient
            return TestClient(app.app)

    @pytest.fixture
    def prod_client(self):
        """Cliente de teste com CORS configurado para producao."""
        with patch.dict(os.environ, {"ALLOWED_ORIGINS": "https://neomatrix.io"}, clear=False):
            from importlib import reload
            import app
            reload(app)

            from fastapi.testclient import TestClient
            return TestClient(app.app)

    def test_cors_headers_allowed_origin(self, client):
        """Requisicao de origin permitido deve ter headers CORS."""
        response = client.get(
            "/v1/health",
            headers={"Origin": "http://localhost:3000"}
        )

        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "http://localhost:3000"
        assert response.headers.get("access-control-allow-credentials") == "true"

    def test_cors_headers_blocked_origin(self, client):
        """Requisicao de origin nao permitido nao deve ter headers CORS."""
        response = client.get(
            "/v1/health",
            headers={"Origin": "https://evil.com"}
        )

        assert response.status_code == 200
        assert "access-control-allow-origin" not in response.headers

    def test_cors_preflight_allowed_method(self, client):
        """Preflight para metodo permitido deve retornar 200."""
        response = client.options(
            "/v1/health",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
            }
        )

        assert response.status_code == 200
        assert "GET" in response.headers.get("access-control-allow-methods", "")

    def test_cors_preflight_post_method(self, client):
        """Preflight para POST deve ser permitido."""
        response = client.options(
            "/v1/auth/login",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "POST",
            }
        )

        assert response.status_code == 200
        assert "POST" in response.headers.get("access-control-allow-methods", "")

    def test_cors_preflight_put_method(self, client):
        """Preflight para PUT deve ser permitido."""
        response = client.options(
            "/v1/me",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "PUT",
            }
        )

        assert response.status_code == 200
        assert "PUT" in response.headers.get("access-control-allow-methods", "")

    def test_cors_preflight_delete_method(self, client):
        """Preflight para DELETE deve ser permitido."""
        response = client.options(
            "/v1/me",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "DELETE",
            }
        )

        assert response.status_code == 200
        assert "DELETE" in response.headers.get("access-control-allow-methods", "")

    def test_cors_preflight_custom_headers(self, client):
        """Preflight deve permitir headers customizados (X-API-Key, Authorization)."""
        response = client.options(
            "/v1/me",
            headers={
                "Origin": "http://localhost:3000",
                "Access-Control-Request-Method": "GET",
                "Access-Control-Request-Headers": "X-API-Key, Authorization, Content-Type",
            }
        )

        assert response.status_code == 200
        allowed_headers = response.headers.get("access-control-allow-headers", "").lower()
        assert "x-api-key" in allowed_headers
        assert "authorization" in allowed_headers
        assert "content-type" in allowed_headers

    def test_cors_production_origin(self, prod_client):
        """Em producao, apenas origins configurados sao permitidos."""
        response = prod_client.get(
            "/v1/health",
            headers={"Origin": "https://neomatrix.io"}
        )

        assert response.status_code == 200
        assert response.headers.get("access-control-allow-origin") == "https://neomatrix.io"

    def test_cors_production_blocks_localhost(self, prod_client):
        """Em producao, localhost deve ser bloqueado."""
        response = prod_client.get(
            "/v1/health",
            headers={"Origin": "http://localhost:3000"}
        )

        assert response.status_code == 200
        assert "access-control-allow-origin" not in response.headers
