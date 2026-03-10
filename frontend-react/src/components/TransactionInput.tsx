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
      onProcess(inputText, true); // Siempre usar IA
    }
  };

  const handleClear = () => {
    setInputText('');
    resetTranscript();
  };

  return (
    <section className="section input-section">
      <div className="input-group">
        <button
          className="btn btn-secondary"
          style={{ width: '100%', marginBottom: '15px' }}
          onClick={toggleRecording}
          disabled={!isSupported || isLoading}
        >
          {isRecording ? '⏹️ Detener' : '🎤 Grabar'}
        </button>

        <div className="transcript-display">
          {inputText || (
            <span className="transcript-placeholder">
              Di algo como: "Gasté 50 mil pesos en comida el domingo"
            </span>
          )}
        </div>

        <div className="button-group" style={{ marginTop: '15px' }}>
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
    </section>
  );
};
