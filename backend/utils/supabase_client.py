"""
Cliente para interactuar con Supabase
"""

import os
from pathlib import Path
from typing import Optional
import logging
from supabase import create_client, Client

logger = logging.getLogger(__name__)


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
PROJECT_ROOT = Path(__file__).resolve().parents[2]
_load_env_file(PROJECT_ROOT / ".env")


class SupabaseClient:
    """Cliente singleton para Supabase"""
    
    _instance: Optional[Client] = None
    
    @classmethod
    def get_client(cls) -> Client:
        """Obtiene la instancia del cliente de Supabase"""
        if cls._instance is None:
            url = os.getenv("SUPABASE_URL")
            key = os.getenv("SUPABASE_KEY")
            
            if not url or not key:
                raise ValueError(
                    "SUPABASE_URL y SUPABASE_KEY deben estar configuradas en .env"
                )
            
            cls._instance = create_client(url, key)
            logger.info("Cliente de Supabase inicializado")
        
        return cls._instance
    
    @classmethod
    def is_configured(cls) -> bool:
        """Verifica si Supabase está configurado"""
        return bool(os.getenv("SUPABASE_URL") and os.getenv("SUPABASE_KEY"))


def get_supabase() -> Client:
    """Helper function para obtener el cliente de Supabase"""
    return SupabaseClient.get_client()
