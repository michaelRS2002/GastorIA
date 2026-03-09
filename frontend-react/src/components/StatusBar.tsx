// Componente StatusBar

import { useEffect, useState } from 'react';
import { apiClient } from '../services/api';
import type { HealthResponse } from '../types';
import '../styles/components.css';

export const StatusBar = () => {
  const [health, setHealth] = useState<HealthResponse | null>(null);

  const updateStatus = async () => {
    const healthData = await apiClient.checkHealth();
    setHealth(healthData);
  };

  useEffect(() => {
    updateStatus();
    const interval = setInterval(updateStatus, 10000);
    return () => clearInterval(interval);
  }, []);

  if (!health) {
    return (
      <div className="status">
        <span className="indicator offline"></span>
        <span>Conectando...</span>
      </div>
    );
  }

  const aiAvailable = health.ai_available ?? health.ollama_available;
  const aiProvider = health.ai_provider || 'ollama';
  const isOffline = health.status !== 'ok';

  return (
    <div className="status">
      <span className={`indicator ${isOffline || !aiAvailable ? 'offline' : ''}`}></span>
      <span>
        {isOffline
          ? '✗ Sin conexión'
          : aiAvailable
          ? `✓ Sistema en línea - IA disponible (${aiProvider})`
          : `⚠ Sistema en línea - IA no disponible (${aiProvider})`}
      </span>
    </div>
  );
};
