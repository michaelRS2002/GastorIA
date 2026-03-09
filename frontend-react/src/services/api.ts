// Servicio API para comunicación con el backend

import type {
  HealthResponse,
  ProcessAudioResponse,
  TransactionsResponse,
  AnalysisResponse,
  SuggestionsResponse,
  AnalysisWithSuggestionsResponse,
  ClearTransactionsResponse,
  AnalysisPeriod,
} from '../types';

// Si VITE_API_BASE_URL ya incluye /api, úsalo tal cual
// Si no, agregar /api automáticamente para desarrollo
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL 
  ? import.meta.env.VITE_API_BASE_URL.endsWith('/api') 
    ? import.meta.env.VITE_API_BASE_URL 
    : `${import.meta.env.VITE_API_BASE_URL}/api`
  : '/api';

class ApiClient {
  private baseUrl: string;

  constructor() {
    this.baseUrl = API_BASE_URL;
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    try {
      // Obtener token de autenticación si existe
      const token = await this.getAuthToken();
      
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...(options.headers as Record<string, string>),
      };

      // Agregar token si existe
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        headers,
        ...options,
      });

      if (!response.ok) {
        // Si es 401, la sesión expiró
        if (response.status === 401) {
          window.dispatchEvent(new CustomEvent('auth:session-expired'));
          throw new Error('Sesión expirada. Por favor, inicia sesión nuevamente.');
        }
        
        // Intentar obtener el mensaje de error del backend
        try {
          const errorData = await response.json();
          throw new Error(errorData.error || `HTTP ${response.status}: ${response.statusText}`);
        } catch (jsonError) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
      }

      return await response.json();
    } catch (error) {
      console.error('Request failed:', error);
      throw error;
    }
  }

  private async getAuthToken(): Promise<string | null> {
    try {
      // Importar dinámicamente para evitar dependencias circulares
      const { supabase } = await import('./supabase');
      const { data } = await supabase.auth.getSession();
      return data.session?.access_token ?? null;
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  }

  async checkHealth(): Promise<HealthResponse> {
    try {
      return await this.request<HealthResponse>('/health');
    } catch (error) {
      console.error('Health check failed:', error);
      return {
        status: 'error',
        groq_available: false,
        ai_available: false,
        timestamp: new Date().toISOString(),
      };
    }
  }

  async processAudio(text: string, useAi = false): Promise<ProcessAudioResponse> {
    return await this.request<ProcessAudioResponse>('/process-audio', {
      method: 'POST',
      body: JSON.stringify({
        text,
        use_ai: useAi,
      }),
    });
  }

  async getTransactions(): Promise<TransactionsResponse> {
    return await this.request<TransactionsResponse>('/transactions');
  }

  async getTransactionsByCategory(category: string): Promise<TransactionsResponse> {
    return await this.request<TransactionsResponse>(
      `/transactions/category/${encodeURIComponent(category)}`
    );
  }

  async getAnalysis(period: AnalysisPeriod): Promise<AnalysisResponse> {
    return await this.request<AnalysisResponse>(`/analysis/${period}`);
  }

  async getSuggestions(period: AnalysisPeriod = 'mensual'): Promise<SuggestionsResponse> {
    return await this.request<SuggestionsResponse>(`/suggestions?period=${period}`);
  }

  async getAnalysisWithSuggestions(
    period: AnalysisPeriod
  ): Promise<AnalysisWithSuggestionsResponse> {
    return await this.request<AnalysisWithSuggestionsResponse>(
      `/analysis-with-suggestions/${period}`
    );
  }

  async clearAllTransactions(): Promise<ClearTransactionsResponse> {
    return await this.request<ClearTransactionsResponse>('/transactions', {
      method: 'DELETE',
    });
  }
}

export const apiClient = new ApiClient();
