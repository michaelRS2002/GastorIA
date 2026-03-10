"""
API Backend con Flask
"""

from flask import Flask, request, jsonify
from flask_cors import CORS
from pathlib import Path
import logging
from datetime import datetime, timezone
import os
import jwt
from functools import wraps

# Configurar logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

# Importar servicios
from models.financial_service import FinancialAnalysisService
from utils.supabase_client import get_supabase

# Crear aplicación
app = Flask(__name__)

# Configurar CORS de forma más permisiva
# En producción, Render maneja HTTPS automáticamente
CORS(app, 
     resources={r"/api/*": {
         "origins": "*",  # Permitir todos los orígenes temporalmente
         "methods": ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         "allow_headers": ["Content-Type", "Authorization"],
         "supports_credentials": False,  # Cambiar a False cuando origins es *
         "max_age": 3600
     }})

logger.info("CORS configurado con orígenes permitidos: *")

# Directorio base
BASE_DIR = Path(__file__).parent
SCHEMA_DIR = BASE_DIR / "schemas"

# Inicializar servicio
service = FinancialAnalysisService(schema_dir=SCHEMA_DIR)
supabase = get_supabase()

# ==================== MIDDLEWARE DE AUTENTICACIÓN ====================

def get_user_id_and_token():
    """Extrae el user_id y token JWT de Supabase"""
    auth_header = request.headers.get('Authorization')
    
    if not auth_header or not auth_header.startswith('Bearer '):
        return None, None
    
    token = auth_header.split(' ')[1]
    
    try:
        # Decodificar el token sin verificar la firma (Supabase ya lo verificó)
        # En producción, deberías verificar con el JWT_SECRET de Supabase
        decoded = jwt.decode(token, options={"verify_signature": False})
        user_id = decoded.get('sub')  # 'sub' contiene el user_id
        return user_id, token
    except Exception as e:
        logger.error(f"Error decodificando token: {e}")
        return None, None

def require_auth(f):
    """Decorador para requerir autenticación"""
    @wraps(f)
    def decorated_function(*args, **kwargs):
        user_id, access_token = get_user_id_and_token()
        if not user_id or not access_token:
            return jsonify({
                "success": False,
                "error": "No autorizado. Token inválido o faltante"
            }), 401
        return f(user_id, access_token, *args, **kwargs)
    return decorated_function

# ==================== RUTAS DE TRANSACCIONES ====================

@app.route('/api/health', methods=['GET'])
def health():
    """Verifica estado de la API"""
    ai_available = service.groq_client.is_available()
    ai_provider = service.groq_client.provider
    return jsonify({
        "status": "ok",
        "groq_available": ai_available,
        "ai_available": ai_available,
        "ai_provider": ai_provider,
        "timestamp": datetime.now(timezone.utc).isoformat()
    })

@app.route('/api/transactions', methods=['GET'])
@require_auth
def get_transactions(user_id, access_token):
    """Obtiene todas las transacciones del usuario"""
    try:
        transactions = service.get_all_transactions(user_id, access_token)
        return jsonify({
            "success": True,
            "total": len(transactions),
            "transactions": transactions
        })
    except Exception as e:
        logger.error(f"Error al obtener transacciones: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/transactions/category/<category>', methods=['GET'])
@require_auth
def get_transactions_by_category(user_id, access_token, category):
    """Obtiene transacciones por categoría del usuario"""
    try:
        transactions = service.get_transactions_by_category(user_id, access_token, category)
        return jsonify({
            "success": True,
            "category": category,
            "total": len(transactions),
            "transactions": transactions
        })
    except Exception as e:
        logger.error(f"Error al obtener transacciones por categoría: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/transactions', methods=['DELETE'])
@require_auth
def clear_transactions(user_id, access_token):
    """Elimina todas las transacciones del usuario"""
    try:
        count = service.clear_all_transactions(user_id, access_token)
        return jsonify({
            "success": True,
            "message": f"Se eliminaron {count} transacciones",
            "deleted": count
        })
    except Exception as e:
        logger.error(f"Error al eliminar transacciones: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ==================== RUTA DE PROCESAMIENTO DE AUDIO ====================

@app.route('/api/process-audio', methods=['POST'])
@require_auth
def process_audio(user_id, access_token):
    """
    Procesa entrada de audio/texto
    
    Ejemplo:
    {
        "text": "Gasté 50 mil pesos en comida el domingo",
        "use_ai": true
    }
    """
    try:
        data = request.get_json()
        
        if not data or 'text' not in data:
            return jsonify({
                "success": False,
                "error": "Campo 'text' requerido"
            }), 400
        
        text = data.get('text', '').strip()
        use_ai = data.get('use_ai', False)
        
        if not text:
            return jsonify({
                "success": False,
                "error": "El texto no puede estar vacío"
            }), 400
        
        logger.info(f"Procesando para usuario {user_id}: {text}")
        result = service.process_audio_input(text, user_id, access_token, use_ai=use_ai)
        
        return jsonify(result)
    
    except Exception as e:
        logger.error(f"Error procesando audio: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ==================== RUTAS DE ANÁLISIS ====================

@app.route('/api/analysis/<period>', methods=['GET'])
@require_auth
def get_analysis(user_id, access_token, period):
    """
    Obtiene análisis para un período
    
    Periodos válidos: diario, semanal, mensual, bimestral, semestral, anual
    """
    try:
        valid_periods = ["diario", "semanal", "mensual", "bimestral", "semestral", "anual"]
        
        if period not in valid_periods:
            return jsonify({
                "success": False,
                "error": f"Período inválido. Válidos: {', '.join(valid_periods)}"
            }), 400
        
        analysis = service.generate_analysis(user_id, access_token, period=period)
        
        return jsonify({
            "success": True,
            "analysis": analysis.to_dict()
        })
    
    except Exception as e:
        logger.error(f"Error generando análisis: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/suggestions', methods=['GET'])
@require_auth
def get_suggestions(user_id, access_token):
    """Obtiene sugerencias basadas en el análisis mensual"""
    try:
        period = request.args.get('period', 'mensual')
        analysis = service.generate_analysis(user_id, access_token, period=period)
        suggestions = service.get_suggestions(analysis)
        
        return jsonify({
            "success": True,
            "period": period,
            "suggestions": [s.to_dict() for s in suggestions]
        })
    
    except Exception as e:
        logger.error(f"Error generando sugerencias: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

@app.route('/api/analysis-with-suggestions/<period>', methods=['GET'])
@require_auth
def get_analysis_with_suggestions(user_id, access_token, period):
    """Obtiene análisis completo con sugerencias"""
    try:
        valid_periods = ["diario", "semanal", "mensual", "bimestral", "semestral", "anual"]
        
        if period not in valid_periods:
            return jsonify({
                "success": False,
                "error": f"Período inválido. Válidos: {', '.join(valid_periods)}"
            }), 400
        
        analysis = service.generate_analysis(user_id, access_token, period=period)
        suggestions = service.get_suggestions(analysis)
        
        return jsonify({
            "success": True,
            "analysis": analysis.to_dict(),
            "suggestions": [s.to_dict() for s in suggestions]
        })
    
    except Exception as e:
        logger.error(f"Error generando análisis con sugerencias: {e}")
        return jsonify({
            "success": False,
            "error": str(e)
        }), 500

# ==================== RUTAS DE PRUEBAS ====================

@app.route('/api/test/classify', methods=['POST'])
def test_classify():
    """Ruta de prueba para clasificación"""
    try:
        data = request.get_json()
        text = data.get('text', '')
        
        if not text:
            return jsonify({"error": "Se requiere 'text'"}), 400
        
        from utils.keyword_extractor import extract_keywords, extract_amount, verify_classification
        
        keywords = extract_keywords(text, debug=True)
        amount = extract_amount(text)
        
        verification = None
        if keywords["categoría"]:
            verification = verify_classification(text, keywords["categoría"], keywords["confianza"])
        
        return jsonify({
            "text": text,
            "keywords": keywords,
            "amount": amount,
            "verification": verification
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

@app.route('/api/keywords', methods=['GET'])
def get_keywords_info():
    """Obtiene información de palabras clave"""
    try:
        from utils.keyword_extractor import CATEGORY_KEYWORDS
        
        return jsonify({
            "success": True,
            "categories": {cat: {
                "keywords": data["palabras"][:10],  # Primeras 10
                "total_keywords": len(data["palabras"])
            } for cat, data in CATEGORY_KEYWORDS.items()}
        })
    
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# ==================== MANEJO DE ERRORES ====================

@app.errorhandler(404)
def not_found(error):
    """Manejo de ruta no encontrada"""
    return jsonify({
        "success": False,
        "error": "Ruta no encontrada"
    }), 404

@app.errorhandler(500)
def internal_error(error):
    """Manejo de error interno"""
    logger.error(f"Error interno: {error}")
    return jsonify({
        "success": False,
        "error": "Error interno del servidor"
    }), 500

# ==================== PUNTO DE ENTRADA ====================

if __name__ == '__main__':
    logger.info("Iniciando API Financiera...")
    logger.info(f"Groq disponible: {service.groq_client.is_available()}")
    logger.info("Usando Supabase para almacenamiento")
    
    app.run(
        host='0.0.0.0',
        port=5000,
        debug=True
    )
