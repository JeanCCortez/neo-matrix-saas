"""
test_rate_limiting.py - Testes para rate limiting.

Verifica:
  - Limites corretos por endpoint
  - Headers de rate limit nas respostas
  - Erro 429 com mensagem clara
  - Rate limit por IP vs por API key
"""
import pytest
from unittest.mock import MagicMock
import json

import sys
import os
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from rate_limiter import (
    limiter,
    get_api_key_or_ip,
    get_ip_address,
    rate_limit_exceeded_handler,
    LIMIT_REGISTER,
    LIMIT_LOGIN,
    LIMIT_RUN,
    LIMIT_ADMIN,
)


class TestRateLimiterKeyFunctions:
    """Testa funcoes de extracao de chave para rate limiting."""

    def test_get_ip_address_returns_ip_prefix(self):
        request = MagicMock()
        request.client.host = "192.168.1.100"
        result = get_ip_address(request)
        assert result.startswith("ip:")

    def test_get_api_key_or_ip_with_api_key(self):
        request = MagicMock()
        request.headers = {"X-API-Key": "nm_test123abc"}
        result = get_api_key_or_ip(request)
        assert result == "apikey:nm_test123abc"

    def test_get_api_key_or_ip_without_api_key(self):
        request = MagicMock()
        request.headers = {}
        request.client.host = "10.0.0.1"
        result = get_api_key_or_ip(request)
        assert result.startswith("ip:")

    def test_get_api_key_or_ip_with_empty_api_key(self):
        request = MagicMock()
        request.headers = {"X-API-Key": ""}
        request.client.host = "10.0.0.1"
        result = get_api_key_or_ip(request)
        assert result.startswith("ip:")


class TestRateLimitConstants:
    """Verifica se os limites estao configurados corretamente."""

    def test_register_limit(self):
        assert LIMIT_REGISTER == "5/hour"

    def test_login_limit(self):
        assert LIMIT_LOGIN == "10/hour"

    def test_run_limit(self):
        assert LIMIT_RUN == "100/hour"

    def test_admin_limit(self):
        assert LIMIT_ADMIN == "30/hour"


class TestRateLimitExceededHandler:
    """Testa o handler de erro 429."""

    def _create_mock_exception(self):
        """Cria uma exception mock que simula RateLimitExceeded."""
        exc = MagicMock()
        exc.detail = "5 per 1 hour, retry after 3600 seconds"
        return exc

    def test_returns_429_status(self):
        request = MagicMock()
        exc = self._create_mock_exception()
        response = rate_limit_exceeded_handler(request, exc)
        assert response.status_code == 429

    def test_response_has_error_message_in_portuguese(self):
        request = MagicMock()
        exc = self._create_mock_exception()
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)
        assert "error" in body
        assert "Limite de requisicoes excedido" in body["error"]

    def test_response_has_detail_field(self):
        request = MagicMock()
        exc = self._create_mock_exception()
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)
        assert "detail" in body
        assert "Tente novamente" in body["detail"]

    def test_response_has_retry_after_header(self):
        request = MagicMock()
        exc = self._create_mock_exception()
        response = rate_limit_exceeded_handler(request, exc)
        assert "Retry-After" in response.headers

    def test_response_has_rate_limit_headers(self):
        request = MagicMock()
        exc = self._create_mock_exception()
        response = rate_limit_exceeded_handler(request, exc)
        assert "X-RateLimit-Remaining" in response.headers
        assert response.headers["X-RateLimit-Remaining"] == "0"

    def test_response_has_limit_field(self):
        request = MagicMock()
        exc = self._create_mock_exception()
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)
        assert "limit" in body


class TestRateLimitByKey:
    """Testa que diferentes chaves (IP/API key) sao limitadas separadamente."""

    def test_different_ips_have_separate_limits(self):
        request1 = MagicMock()
        request1.headers = {}
        request1.client.host = "192.168.1.1"

        request2 = MagicMock()
        request2.headers = {}
        request2.client.host = "192.168.1.2"

        key1 = get_ip_address(request1)
        key2 = get_ip_address(request2)

        assert key1 != key2

    def test_different_api_keys_have_separate_limits(self):
        request1 = MagicMock()
        request1.headers = {"X-API-Key": "nm_user1key"}

        request2 = MagicMock()
        request2.headers = {"X-API-Key": "nm_user2key"}

        key1 = get_api_key_or_ip(request1)
        key2 = get_api_key_or_ip(request2)

        assert key1 != key2
        assert key1 == "apikey:nm_user1key"
        assert key2 == "apikey:nm_user2key"

    def test_same_ip_same_key(self):
        request1 = MagicMock()
        request1.headers = {}
        request1.client.host = "192.168.1.1"

        request2 = MagicMock()
        request2.headers = {}
        request2.client.host = "192.168.1.1"

        key1 = get_ip_address(request1)
        key2 = get_ip_address(request2)

        assert key1 == key2

    def test_same_api_key_same_key(self):
        request1 = MagicMock()
        request1.headers = {"X-API-Key": "nm_samekey123"}

        request2 = MagicMock()
        request2.headers = {"X-API-Key": "nm_samekey123"}

        key1 = get_api_key_or_ip(request1)
        key2 = get_api_key_or_ip(request2)

        assert key1 == key2


class TestRateLimitExhaustion:
    """Testa comportamento quando limite e atingido."""

    def test_error_message_is_user_friendly(self):
        """Verifica que mensagem de erro e clara para o usuario."""
        request = MagicMock()
        exc = MagicMock()
        exc.detail = "5 per 1 hour"
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)

        assert "error" in body
        assert "limit" in body
        assert any(word in body["error"].lower() for word in ["limite", "excedido"])

    def test_detail_includes_retry_info(self):
        """Verifica que mensagem inclui informacao de quando tentar novamente."""
        request = MagicMock()
        exc = MagicMock()
        exc.detail = "5 per 1 hour, retry after 3600 seconds"
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)

        assert "detail" in body
        assert "novamente" in body["detail"].lower()


class TestRateLimitHeadersPresent:
    """Verifica presenca de headers de rate limit em respostas."""

    def test_limiter_has_headers_enabled(self):
        assert limiter._headers_enabled is True

    def test_limiter_configured_correctly(self):
        assert limiter is not None


class TestEdgeCases:
    """Testes de casos extremos."""

    def test_get_api_key_or_ip_with_none_header(self):
        request = MagicMock()
        request.headers = {"X-API-Key": None}
        request.client.host = "10.0.0.1"
        result = get_api_key_or_ip(request)
        assert result.startswith("ip:")

    def test_response_body_is_valid_json(self):
        request = MagicMock()
        exc = MagicMock()
        exc.detail = "10 per 1 hour"
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)
        assert isinstance(body, dict)

    def test_response_contains_all_required_fields(self):
        request = MagicMock()
        exc = MagicMock()
        exc.detail = "10 per 1 hour"
        response = rate_limit_exceeded_handler(request, exc)
        body = json.loads(response.body)
        required_fields = ["error", "detail", "limit"]
        for field in required_fields:
            assert field in body, f"Campo '{field}' ausente na resposta"
