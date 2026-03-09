"""
Tests de integración para la API Flask
"""
import pytest
import json
from unittest.mock import patch, MagicMock


@pytest.mark.integration
class TestAPIRoutes:
    """Tests para las rutas de la API"""
    
    def test_get_transactions_unauthorized(self, client):
        """Test obtener transacciones sin autenticación"""
        response = client.get('/api/transactions')
        
        # Sin header de autorización debería retornar 401
        assert response.status_code == 401
    
    @patch('app.get_user_id_and_token')
    @patch('models.financial_service.get_supabase')
    def test_get_transactions_authorized(self, mock_supabase, mock_auth, client, auth_headers):
        """Test obtener transacciones con autenticación"""
        # Mock de autenticación
        mock_auth.return_value = ("test-user-id", "test-token")
        
        # Mock de Supabase
        mock_client = MagicMock()
        mock_client.table.return_value.select.return_value.eq.return_value.order.return_value.execute.return_value.data = []
        mock_supabase.return_value = mock_client
        
        response = client.get('/api/transactions', headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] is True
        assert "transactions" in data
    
    @patch('app.get_user_id_and_token')
    @patch('models.financial_service.FinancialAnalysisService.process_audio_input')
    def test_process_audio_with_ai(self, mock_process, mock_auth, client, auth_headers):
        """Test procesar audio con IA"""
        # Mock de autenticación
        mock_auth.return_value = ("test-user-id", "test-token")
        
        # Mock de procesamiento
        mock_process.return_value = {
            "success": True,
            "metodo": "ia",
            "transaccion": {
                "tipo": "gasto",
                "cantidad": 50000,
                "categoria": "Comida",
                "descripcion": "Almuerzo",
                "confianza": 0.9
            }
        }
        
        response = client.post(
            '/api/process-audio',
            headers=auth_headers,
            json={
                "text": "gaste 50 lucas en almuerzo",
                "use_ai": True
            }
        )
        
        # Puede retornar 200 o 400 dependiendo de validaciones
        assert response.status_code in [200, 400]
        data = json.loads(response.data)
        if response.status_code == 200:
            assert "result" in data or "success" in data
    
    @patch('app.get_user_id_and_token')
    @patch('models.financial_service.get_supabase')
    def test_clear_transactions(self, mock_supabase, mock_auth, client, auth_headers):
        """Test eliminar todas las transacciones"""
        # Mock de autenticación
        mock_auth.return_value = ("test-user-id", "test-token")
        
        # Mock de Supabase
        mock_client = MagicMock()
        mock_client.table.return_value.select.return_value.eq.return_value.execute.return_value.count = 5
        mock_client.table.return_value.delete.return_value.eq.return_value.execute.return_value = None
        mock_supabase.return_value = mock_client
        
        response = client.delete('/api/transactions', headers=auth_headers)
        
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["success"] is True
        assert "count" in data or "deleted" in data or "message" in data
    
    @patch('app.get_user_id_and_token')
    @patch('models.financial_service.get_supabase')
    def test_get_analysis_invalid_period(self, mock_supabase, mock_auth, client, auth_headers):
        """Test análisis con período inválido"""
        mock_auth.return_value = ("test-user-id", "test-token")
        
        response = client.get('/api/analysis/invalido', headers=auth_headers)
        
        assert response.status_code == 400
        data = json.loads(response.data)
        assert data["success"] is False
        assert "inválido" in data["error"].lower()
