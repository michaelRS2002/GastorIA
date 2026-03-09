"""
Cliente para interactuar con Groq API (OpenAI-compatible)
"""

import requests
import json
from typing import Optional, Dict, Any
import logging
import os
from pathlib import Path


def _load_env_file(env_path: Path) -> None:
    """Carga variables de entorno desde archivo .env"""
    if not env_path.exists():
        return

    for raw_line in env_path.read_text(encoding="utf-8").splitlines():
        line = raw_line.strip()
        if not line or line.startswith("#") or "=" not in line:
            continue

        key, value = line.split("=", 1)
        key = key.strip()
        value = value.strip().strip('"').strip("'")
        if key and key not in os.environ:
            os.environ[key] = value


# Cargar variables de entorno
PROJECT_ROOT = Path(__file__).resolve().parents[1]  # backend/
_load_env_file(PROJECT_ROOT / ".env")

logger = logging.getLogger(__name__)


class GroqClient:
    """Cliente para interactuar con Groq API."""
    
    def __init__(self):
        self.base_url = os.getenv("AI_API_BASE_URL", "https://api.groq.com/openai/v1")
        self.api_key = os.getenv("AI_API_KEY", "")
        self.model = os.getenv("AI_API_MODEL", "llama-3.3-70b-versatile")
        self.provider = "groq"
    
    def is_available(self) -> bool:
        """Verifica si Groq API está disponible."""
        if not self.api_key:
            logger.warning("AI_API_KEY no configurada")
            return False

        try:
            # Intenta hacer una petición simple para verificar conectividad
            response = requests.get(
                f"{self.base_url.rstrip('/')}/models",
                headers={"Authorization": f"Bearer {self.api_key}"},
                timeout=10
            )
            # Groq puede devolver 401/403 si la ruta no existe, pero eso indica que la API responde
            return response.status_code in [200, 401, 403]
        except (requests.ConnectionError, requests.Timeout) as e:
            logger.error(f"Error conectando con Groq API: {e}")
            return False
    
    def generate_response(
        self, 
        prompt: str, 
        model: Optional[str] = None,
        temperature: float = 0.7
    ) -> Dict[str, Any]:
        """
        Genera respuesta usando Groq API
        
        Args:
            prompt: Prompt para el modelo
            model: Modelo a usar (default: llama-3.3-70b-versatile)
            temperature: Control de aleatoriedad (0-1)
            
        Returns:
            dict con la respuesta
        """
        model = model or self.model

        if not self.api_key:
            return {
                "success": False,
                "error": "AI_API_KEY no configurada"
            }

        try:
            response = requests.post(
                f"{self.base_url.rstrip('/')}/chat/completions",
                headers={
                    "Authorization": f"Bearer {self.api_key}",
                    "Content-Type": "application/json"
                },
                json={
                    "model": model,
                    "messages": [
                        {"role": "user", "content": prompt}
                    ],
                    "temperature": temperature
                },
                timeout=60
            )

            if response.status_code != 200:
                error_msg = f"Status code: {response.status_code} - {response.text[:200]}"
                logger.error(f"Error de Groq API: {error_msg}")
                return {
                    "success": False,
                    "error": error_msg
                }

            payload = response.json()
            content = payload.get("choices", [{}])[0].get("message", {}).get("content", "")
            
            return {
                "success": True,
                "response": {
                    "response": content,
                    "provider": self.provider,
                    "model": model
                }
            }
        except Exception as e:
            logger.error(f"Error llamando a Groq API: {str(e)}")
            return {
                "success": False,
                "error": str(e)
            }
    
    def extract_json_from_response(self, response_text: str) -> Optional[Dict]:
        """Extrae JSON de la respuesta del modelo"""
        try:
            # Intenta encontrar JSON en la respuesta
            start = response_text.find('{')
            end = response_text.rfind('}') + 1
            
            if start != -1 and end > start:
                json_str = response_text[start:end]
                return json.loads(json_str)
        except json.JSONDecodeError:
            logger.warning("No se encontró JSON válido en la respuesta")
        
        return None


# ==================== PROMPTS ====================

SYSTEM_PROMPTS = {
    "clasificador_gastos": """Eres un asistente financiero experto colombiano. Tu tarea es analizar descripciones de gastos e ingresos en español colombiano y extraer TODA la información.

JERGA COLOMBIANA PARA DINERO (MUY IMPORTANTE):
- "palo", "palos", "barra", "barras", "melon", "melones" = MILLONES (1 palo = 1.000.000 pesos)
- "luca", "lucas" = MIL pesos (1 luca = 1.000 pesos, 50 lucas = 50.000 pesos)
- "un millón doscientos" = 1.200.000 (doscientos son doscientos MIL)
- "dos palos y medio" = 2.500.000
- "50 lucas" = 50.000
- "cien lucas" = 100.000
- "una luca" = 1.000
- "5 lucas" = 5.000

Debes responder SIEMPRE en JSON con este formato exacto:
{
    "tipo": "gasto" o "ingreso",
    "categoria": "Comida" | "Ocio" | "Gasolina/Transporte" | "Gastos del hogar" | "Ropa" | "Viajes" | "Servicios" | "Salud" | "Educacion" | "Salario" | "Bonificacion" | "Freelance" | "Otro",
    "cantidad": número entero en pesos colombianos (SIN puntos ni comas, ej: 2500000),
    "descripcion": resumen corto del gasto,
    "confianza": número entre 0.7 y 1.0,
    "palabras_clave": ["palabra1", "palabra2"]
}

REGLAS CRÍTICAS:
1. La cantidad SIEMPRE debe ser un número entero positivo SIN formato (ej: 2500000, NO "2.500.000")
2. Interpreta correctamente la jerga colombiana:
   - "dos palos" = 2000000
   - "50 lucas" = 50000
   - "una luca" = 1000
   - "5 lucas" = 5000
3. "millón doscientos" = 1200000 (el doscientos son miles)
4. Clasifica por CONTEXTO semántico:
   - hamburguesa, almuerzo, comida, restaurante → Comida
   - taxi, uber, bus, gasolina, parqueadero → Gasolina/Transporte
   - luz, agua, internet, arriendo → Gastos del hogar
   - ropa, zapatos, camisas → Ropa
   - médico, farmacia, eps → Salud
5. Si dice "me pagaron", "recibí", "cobré", "me consignó" → tipo es "ingreso"
6. Si dice "gasté", "pagué", "compré", "me costó" → tipo es "gasto"

Ejemplos de extracción correcta:
- "me pagaron dos palos" → {"cantidad": 2000000, "tipo": "ingreso", "categoria": "Salario"}
- "gasté un millón doscientos en mercado" → {"cantidad": 1200000, "tipo": "gasto", "categoria": "Comida"}
- "pague 50 lucas de taxi" → {"cantidad": 50000, "tipo": "gasto", "categoria": "Gasolina/Transporte"}
- "compre hamburguesa por 28 mil" → {"cantidad": 28000, "tipo": "gasto", "categoria": "Comida"}
- "me dieron una luca" → {"cantidad": 1000, "tipo": "ingreso", "categoria": "Otro"}
- "gaste 5 lucas en parqueadero" → {"cantidad": 5000, "tipo": "gasto", "categoria": "Gasolina/Transporte"}
""",
    
    "analizador_tendencias": """Eres un analista financiero experto. Analiza los patrones de gasto y proporciona sugerencias de inversión.
    
Responde en JSON con este formato:
{
    "resumen": string,
    "areas_preocupacion": array,
    "oportunidades_ahorro": array,
    "sugerencias_inversion": array,
    "recomendaciones": array
}""",
    
    "corrector_clasificacion": """Eres un verificador de clasificaciones financieras. Revisa si una clasificación es correcta.

Responde en JSON:
{
    "es_correcta": boolean,
    "confianza": número 0-1,
    "problemas": array de strings,
    "sugerencias": array de strings,
    "clasificacion_alternativa": object opcional
}"""
}


def create_expense_classification_prompt(text: str) -> str:
    """
    Crea prompt para clasificación de gastos/ingresos.
    Este es el prompt principal que se envía a Groq.
    """
    return f"""{SYSTEM_PROMPTS['clasificador_gastos']}

Texto del usuario: "{text}"

Responde ÚNICAMENTE con el JSON, sin explicaciones, sin markdown, sin texto adicional.
El campo "cantidad" debe ser un número entero (ej: 2500000), NO un string."""


def create_verification_prompt(text: str, clasificacion: Dict) -> str:
    """Crea prompt para verificar clasificación"""
    return f"""{SYSTEM_PROMPTS['corrector_clasificacion']}

Texto original: "{text}"
Clasificación propuesta: {json.dumps(clasificacion, ensure_ascii=False)}

Verifica si es correcta o sugiere cambios. Responde SOLO JSON."""


def create_analysis_prompt(transactions_summary: Dict) -> str:
    """Crea prompt para análisis de tendencias"""
    return f"""{SYSTEM_PROMPTS['analizador_tendencias']}

Resumen de transacciones:
{json.dumps(transactions_summary, ensure_ascii=False, indent=2)}

Analiza esto y proporciona sugerencias. Responde SOLO JSON."""
