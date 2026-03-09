// Hook para reconocimiento de voz (Web Speech API)

import { useState, useEffect, useRef, useCallback } from 'react';

interface SpeechRecognitionEvent extends Event {
  resultIndex: number;
  results: SpeechRecognitionResultList;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message: string;
}

interface SpeechRecognitionResult {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternative;
}

interface SpeechRecognitionAlternative {
  transcript: string;
  confidence: number;
}

interface SpeechRecognitionResultList {
  length: number;
  item(index: number): SpeechRecognitionResult;
  [index: number]: SpeechRecognitionResult;
}

interface SpeechRecognitionInterface {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start(): void;
  stop(): void;
  onstart: (() => void) | null;
  onend: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
}

declare global {
  interface Window {
    SpeechRecognition: new () => SpeechRecognitionInterface;
    webkitSpeechRecognition: new () => SpeechRecognitionInterface;
  }
}

const MAX_RECORDING_MS = 60000;

export const useSpeechRecognition = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [status, setStatus] = useState('lista');

  const recognitionRef = useRef<SpeechRecognitionInterface | null>(null);
  const timeoutIdRef = useRef<NodeJS.Timeout | null>(null);
  const transcriptRef = useRef('');

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setIsSupported(false);
      setStatus('no soportada en este navegador');
      return;
    }

    setIsSupported(true);

    const recognition = new SpeechRecognition();
    recognition.lang = 'es-ES';
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.maxAlternatives = 1;

    recognition.onstart = () => {
      setIsRecording(true);
      transcriptRef.current = '';
      setStatus('grabando... tienes hasta 60 segundos');

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }

      timeoutIdRef.current = setTimeout(() => {
        if (recognitionRef.current) {
          recognitionRef.current.stop();
          setStatus('grabación finalizada por tiempo (60s)');
        }
      }, MAX_RECORDING_MS);
    };

    recognition.onresult = (event: SpeechRecognitionEvent) => {
      let interimTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const result = event.results[i];
        const transcriptPart = result[0].transcript;

        if (result.isFinal) {
          transcriptRef.current += `${transcriptPart} `;
        } else {
          interimTranscript += transcriptPart;
        }
      }

      setTranscript(`${transcriptRef.current}${interimTranscript}`.trim());
      setStatus('transcribiendo...');
    };

    recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
      setStatus(`error (${event.error})`);
      console.error('Speech recognition error:', event.error);
    };

    recognition.onend = () => {
      setIsRecording(false);

      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
        timeoutIdRef.current = null;
      }

      setStatus((prevStatus) => {
        // Si no es un error, volver a "lista"
        if (!prevStatus.includes('error')) {
          return 'lista';
        }
        return prevStatus;
      });
    };

    recognitionRef.current = recognition;

    return () => {
      if (timeoutIdRef.current) {
        clearTimeout(timeoutIdRef.current);
      }
    };
  }, []);

  const startRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.start();
      } catch (error) {
        console.error('Error starting recognition:', error);
      }
    }
  }, []);

  const stopRecording = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (error) {
        console.error('Error stopping recognition:', error);
      }
    }
  }, []);

  const toggleRecording = useCallback(() => {
    if (isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  }, [isRecording, startRecording, stopRecording]);

  const resetTranscript = useCallback(() => {
    setTranscript('');
    transcriptRef.current = '';
  }, []);

  return {
    isRecording,
    transcript,
    isSupported,
    status,
    startRecording,
    stopRecording,
    toggleRecording,
    resetTranscript,
  };
};
