"""
Pytest fixtures compartidas para todos los tests
"""
import pytest
import os
from pathlib import Path
from datetime import datetime
from app import app as flask_app
from models.transaction import Transaction, TransactionType, ExpenseCategory

# Configurar variables de entorno para testing
os.environ["AI_PROVIDER"] = "groq"
os.environ["AI_API_BASE_URL"] = "https://api.groq.com/openai/v1"
os.environ["AI_API_KEY"] = "test_key"
os.environ["AI_API_MODEL"] = "llama-3.3-70b-versatile"
os.environ["SUPABASE_URL"] = "https://test.supabase.co"
os.environ["SUPABASE_KEY"] = "test_key"
os.environ["FLASK_DEBUG"] = "True"


@pytest.fixture
def app():
    """Flask app para testing"""
    flask_app.config.update({
        "TESTING": True,
    })
    yield flask_app


@pytest.fixture
def client(app):
    """Cliente de test de Flask"""
    return app.test_client()


@pytest.fixture
def sample_transaction():
    """Transacción de ejemplo para tests"""
    return Transaction(
        tipo=TransactionType.GASTO,
        cantidad=50000,
        categoria=ExpenseCategory.COMIDA,
        descripcion="Almuerzo en restaurante",
        confianza=0.9
    )


@pytest.fixture
def sample_ingreso():
    """Ingreso de ejemplo para tests"""
    return Transaction(
        tipo=TransactionType.INGRESO,
        cantidad=1500000,
        categoria=ExpenseCategory.SALARIO,
        descripcion="Salario mensual",
        confianza=1.0
    )


@pytest.fixture
def mock_jwt_token():
    """Token JWT de prueba"""
    return "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJ0ZXN0LXVzZXItaWQiLCJpYXQiOjE1MTYyMzkwMjJ9.test"


@pytest.fixture
def auth_headers(mock_jwt_token):
    """Headers de autenticación para requests"""
    return {
        "Authorization": f"Bearer {mock_jwt_token}",
        "Content-Type": "application/json"
    }
