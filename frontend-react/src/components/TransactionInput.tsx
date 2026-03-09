// Componente TransactionInput

import { useState } from 'react';
import { useSpeechRecognition } from '../hooks/useSpeechRecognition';
import '../styles/components.css';

interface TransactionInputProps {
  onProcess: (text: string, useAi: boolean) => void;
  isLoading: boolean;
}

export const TransactionInput = ({ onProcess, isLoading }: TransactionInputProps) => {
  const [inputText, setInputText] = useState('');
  const [useAi, setUseAi] = useState(true);

  const {
    isRecording,
    transcript,
    isSupported,
    status,
    toggleRecording,
    resetTranscript,
  } = useSpeechRecognition();

  // Sincronizar transcript con inputText
  if (transcript && transcript !== inputText) {
    setInputText(transcript);
  }

  const handleProcess = () => {
    if (inputText.trim()) {
      onProcess(inputText, useAi);
    }
  };

  const handleClear = () => {
    setInputText('');
    resetTranscript();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && e.ctrlKey) {
      handleProcess();
    }
  };

  return (
    <section className="section input-section">
      <h2>📝 Registrar Transacción</h2>

      <div className="input-group">
        <textarea
          className="input-textarea"
          placeholder="Ej: Gasté 50 mil pesos en comida el domingo"
          rows={3}
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          onKeyDown={handleKeyDown}
          disabled={isLoading}
        />
        <div className="button-group">
          <button
            className="btn btn-secondary"
            onClick={toggleRecording}
            disabled={!isSupported || isLoading}
          >
            {isRecording ? '⏹️ Detener' : '🎤 Grabar'}
          </button>
          <button
            className="btn btn-primary"
            onClick={handleProcess}
            disabled={isLoading || !inputText.trim()}
          >
            Procesar
          </button>
          <button className="btn btn-secondary" onClick={handleClear} disabled={isLoading}>
            Limpiar
          </button>
        </div>
        <p className="voice-status">Voz: {status}</p>
      </div>

      <div className="checkbox-group">
        <label>
          <input
            type="checkbox"
            checked={useAi}
            onChange={(e) => setUseAi(e.target.checked)}
            disabled={isLoading}
          />
          Usar IA para clasificación mejorada
        </label>
      </div>
    </section>
  );
};
