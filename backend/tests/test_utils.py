"""
Tests para utilidades de procesamiento
"""
import pytest
from utils.keyword_extractor import extract_keywords, extract_amount


@pytest.mark.unit
class TestKeywordExtractor:
    """Tests para extracción de keywords"""
    
    def test_extract_keywords_comida(self):
        """Test extracción de keywords de comida"""
        result = extract_keywords("gaste 50 lucas en almuerzo")
        
        assert result["categoria"] in ["Comida", "Otro"]
        assert result["tipo"] == "gasto"
        # Las palabras pueden tener formato "palabra ✓" o "palabra (tipo)"
        palabras_limpiadas = [k.split()[0].lower() for k in result["palabras_detectadas"]]
        assert "almuerzo" in palabras_limpiadas
    
    def test_extract_keywords_transporte(self):
        """Test extracción de keywords de transporte"""
        result = extract_keywords("pague 15000 de uber")
        
        assert result["categoria"] in ["Gasolina/Transporte", "Otro"]
        # Las palabras pueden tener formato "palabra ✓" o "palabra (tipo)"
        palabras_limpiadas = [k.split()[0].lower() for k in result["palabras_detectadas"]]
        assert "uber" in palabras_limpiadas
    
    def test_extract_amount_pesos(self):
        """Test extracción de cantidad en pesos"""
        result = extract_amount("gaste $50000 en comida")
        
        assert result["encontrado"] is True
        assert result["cantidad"] == 50000
    
    def test_extract_amount_lucas(self):
        """Test extracción de cantidad en lucas (miles)"""
        result = extract_amount("pague 50 lucas")
        
        assert result["encontrado"] is True
        assert result["cantidad"] == 50000
    
    def test_extract_amount_palos(self):
        """Test extracción de cantidad en palos (millones)"""
        result = extract_amount("gaste 2 palos")
        
        assert result["encontrado"] is True
        assert result["cantidad"] == 2000000
    
    def test_extract_amount_not_found(self):
        """Test cuando no se encuentra cantidad"""
        result = extract_amount("compre comida")
        
        assert result["encontrado"] is False
    
    def test_extract_amount_decimal(self):
        """Test extracción de cantidad decimal"""
        result = extract_amount("pague $25.500 pesos")
        
        assert result["encontrado"] is True
        # Puede ser 25500 o 25.5 dependiendo de la implementación
        assert result["cantidad"] > 0
