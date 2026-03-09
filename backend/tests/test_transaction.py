"""
Tests unitarios para el modelo Transaction
"""
import pytest
from datetime import datetime
from models.transaction import Transaction, TransactionType, ExpenseCategory


@pytest.mark.unit
class TestTransaction:
    """Tests para la clase Transaction"""
    
    def test_create_transaction_gasto(self):
        """Test crear transacción de gasto"""
        trans = Transaction(
            tipo=TransactionType.GASTO,
            cantidad=25000,
            categoria=ExpenseCategory.COMIDA,
            descripcion="Almuerzo",
            confianza=0.85
        )
        
        assert trans.tipo == TransactionType.GASTO
        assert trans.cantidad == 25000
        assert trans.categoria == ExpenseCategory.COMIDA
        assert trans.confianza == 0.85
        assert trans.id is not None
    
    def test_create_transaction_ingreso(self):
        """Test crear transacción de ingreso"""
        trans = Transaction(
            tipo=TransactionType.INGRESO,
            cantidad=1000000,
            categoria=ExpenseCategory.SALARIO,
            descripcion="Pago mensual",
            confianza=1.0
        )
        
        assert trans.tipo == TransactionType.INGRESO
        assert trans.cantidad == 1000000
        assert trans.categoria == ExpenseCategory.SALARIO
    
    def test_transaction_from_string_tipo(self):
        """Test que acepta tipo como string"""
        trans = Transaction(
            tipo="gasto",
            cantidad=10000,
            categoria=ExpenseCategory.TRANSPORTE,
            descripcion="Uber",
            confianza=0.9
        )
        
        assert trans.tipo == TransactionType.GASTO
    
    def test_transaction_normalize_categoria(self):
        """Test normalización de categorías con acentos"""
        trans = Transaction(
            tipo="gasto",
            cantidad=5000,
            categoria="Educación",  # Con tilde
            descripcion="Curso",
            confianza=0.8
        )
        
        assert trans.categoria == ExpenseCategory.EDUCACION  # Sin tilde
    
    def test_transaction_invalid_confianza(self):
        """Test que confianza fuera de rango genera error"""
        with pytest.raises(ValueError, match="Confianza debe estar entre 0 y 1"):
            Transaction(
                tipo="gasto",
                cantidad=10000,
                categoria=ExpenseCategory.OTRO,
                descripcion="Test",
                confianza=1.5  # Inválido
            )
    
    def test_transaction_negative_cantidad(self):
        """Test que cantidad negativa genera error"""
        with pytest.raises(ValueError, match="La cantidad no puede ser negativa"):
            Transaction(
                tipo="gasto",
                cantidad=-5000,  # Inválido
                categoria=ExpenseCategory.OTRO,
                descripcion="Test",
                confianza=0.5
            )
    
    def test_transaction_to_dict(self, sample_transaction):
        """Test conversión a diccionario"""
        data = sample_transaction.to_dict()
        
        assert data["tipo"] == "gasto"
        assert data["cantidad"] == 50000
        assert data["categoria"] == "Comida"
        assert data["descripcion"] == "Almuerzo en restaurante"
        assert data["confianza"] == 0.9
        assert "fecha" in data
        assert "id" in data
    
    def test_transaction_from_dict(self):
        """Test crear transacción desde diccionario"""
        data = {
            "tipo": "ingreso",
            "cantidad": 500000,
            "categoria": "Salario",
            "descripcion": "Pago quincenal",
            "confianza": 1.0
        }
        
        trans = Transaction.from_dict(data)
        
        assert trans.tipo == TransactionType.INGRESO
        assert trans.cantidad == 500000
        assert trans.categoria == ExpenseCategory.SALARIO
    
    def test_transaction_with_fecha_string(self):
        """Test que acepta fecha como string ISO"""
        trans = Transaction(
            tipo="gasto",
            cantidad=15000,
            categoria=ExpenseCategory.OCIO,
            descripcion="Cine",
            confianza=0.9,
            fecha="2026-03-09T10:30:00"
        )
        
        assert isinstance(trans.fecha, datetime)
        assert trans.fecha.year == 2026
        assert trans.fecha.month == 3
        assert trans.fecha.day == 9
    
    def test_transaction_with_supabase_fields(self):
        """Test que acepta campos adicionales de Supabase"""
        trans = Transaction(
            tipo="gasto",
            cantidad=20000,
            categoria=ExpenseCategory.COMIDA,
            descripcion="Mercado",
            confianza=0.95,
            user_id="test-user-123",
            metodo_procesamiento="ia",
            palabras_clave=["mercado", "comida"]
        )
        
        assert trans.user_id == "test-user-123"
        assert trans.metodo_procesamiento == "ia"
        assert trans.palabras_clave == ["mercado", "comida"]
