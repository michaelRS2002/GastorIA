// Componente principal App

import { useState, useEffect, useCallback } from 'react';
import { apiClient } from './services/api';
import { useToast } from './hooks/useToast';
import { AuthProvider, useAuthContext } from './context/AuthContext';
import type {
  ProcessAudioResponse,
  Transaction,
  Analysis,
  Suggestion,
  AnalysisPeriod,
} from './types';

// Componentes
import {
  Header,
  StatusBar,
  TransactionInput,
  ResultDisplay,
  AnalysisSection,
  SuggestionsSection,
  TransactionsList,
  Loading,
  ToastContainer,
  Login,
  UserProfile,
} from './components';

import './styles/app.css';
import './styles/components.css';

// Componente interno que usa el contexto de autenticación
function AppContent() {
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [isLoading, setIsLoading] = useState(false);
  const [lastResult, setLastResult] = useState<ProcessAudioResponse | null>(null);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [analysis, setAnalysis] = useState<Analysis | null>(null);
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [currentPeriod, setCurrentPeriod] = useState<AnalysisPeriod>('mensual');

  const { toasts, showToast, removeToast } = useToast();

  // Manejar sesión expirada
  useEffect(() => {
    const handleSessionExpired = () => {
      showToast('Sesión expirada. Por favor, inicia sesión nuevamente.', 'warning');
    };

    window.addEventListener('auth:session-expired', handleSessionExpired);
    return () => window.removeEventListener('auth:session-expired', handleSessionExpired);
  }, [showToast]);

  // Cargar transacciones iniciales
  const loadTransactions = useCallback(async () => {
    if (!isAuthenticated) return;
    
    try {
      const data = await apiClient.getTransactions();
      if (data.success && data.transactions) {
        setTransactions(data.transactions);
      }
    } catch (error) {
      console.error('Error loading transactions:', error);
      showToast('Error cargando transacciones', 'error');
    }
  }, [isAuthenticated, showToast]);

  // Cargar análisis
  const loadAnalysis = useCallback(async (period: AnalysisPeriod = currentPeriod) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const data = await apiClient.getAnalysisWithSuggestions(period);

      if (!data.success) {
        showToast(`Error: ${data.error}`, 'error');
        return;
      }

      setAnalysis(data.analysis);
      setSuggestions(data.suggestions || []);
      setCurrentPeriod(period);
    } catch (error) {
      const err = error as Error;
      console.error('Error loading analysis:', error);
      showToast(`Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Procesar transacción
  const handleProcessTransaction = async (text: string, useAi: boolean) => {
    if (!isAuthenticated) return;
    
    setIsLoading(true);
    try {
      const result = await apiClient.processAudio(text, useAi);
      setLastResult(result);

      if (result.success) {
        showToast('✓ Transacción registrada', 'success');
        await loadTransactions();
        await loadAnalysis(); // Actualizar análisis automáticamente
      } else {
        showToast(`⚠ ${result.error || 'Error al procesar'}`, 'warning');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error:', error);
      showToast(`✗ Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Borrar todas las transacciones
  const handleClearAll = async () => {
    if (!isAuthenticated) return;
    
    if (
      !window.confirm(
        '¿Estás seguro de que quieres borrar TODAS las transacciones? Esta acción no se puede deshacer.'
      )
    ) {
      return;
    }

    setIsLoading(true);
    try {
      const result = await apiClient.clearAllTransactions();

      if (result.success) {
        showToast(`✓ ${result.message}`, 'success');
        setTransactions([]);
        setLastResult(null);
        setSuggestions([]);
        await loadAnalysis();
      } else {
        showToast(`✗ Error: ${result.error}`, 'error');
      }
    } catch (error) {
      const err = error as Error;
      console.error('Error clearing data:', error);
      showToast(`✗ Error: ${err.message}`, 'error');
    } finally {
      setIsLoading(false);
    }
  };

  // Cargar datos iniciales cuando el usuario está autenticado
  useEffect(() => {
    if (isAuthenticated && !authLoading) {
      loadTransactions();
      loadAnalysis();

      // Actualizar transacciones periódicamente
      const interval = setInterval(() => {
        loadTransactions();
      }, 30000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated, authLoading, loadTransactions, loadAnalysis]);

  // Mostrar pantalla de carga mientras verifica autenticación
  if (authLoading) {
    return <Loading show={true} />;
  }

  // Mostrar pantalla de login si no está autenticado
  if (!isAuthenticated) {
    return (
      <>
        <Login />
        <ToastContainer toasts={toasts} onRemove={removeToast} />
      </>
    );
  }

  // Aplicación principal (usuario autenticado)
  return (
    <div className="container">
      <Header />
      <UserProfile />
      <StatusBar />

      <main className="main-content">
        <TransactionInput onProcess={handleProcessTransaction} isLoading={isLoading} />

        <ResultDisplay result={lastResult} />

        <AnalysisSection
          analysis={analysis}
          onAnalyze={loadAnalysis}
          isLoading={isLoading}
        />

        <SuggestionsSection suggestions={suggestions} />

        <TransactionsList transactions={transactions} onClearAll={handleClearAll} />
      </main>

      <footer className="footer">
        <p>💰 Asistente Financiero © 2026 - Powered by IA</p>
      </footer>

      <Loading show={isLoading} />
      <ToastContainer toasts={toasts} onRemove={removeToast} />
    </div>
  );
}

// Componente principal con Provider
function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
