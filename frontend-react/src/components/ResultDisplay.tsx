// Componente ResultDisplay

import type { ProcessAudioResponse } from '../types';
import { formatCurrency, formatDate, getStatusEmoji } from '../utils/formatters';
import '../styles/components.css';

interface ResultDisplayProps {
  result: ProcessAudioResponse | null;
}

export const ResultDisplay = ({ result }: ResultDisplayProps) => {
  if (!result) return null;

  if (!result.success) {
    return (
      <section className="section results-section">
        <h2>✅ Último Resultado</h2>
        <div className="result-content error">
          <strong>❌ Error:</strong> {result.error || 'Error desconocido'}
          {result.advertencias && result.advertencias.length > 0 && (
            <p style={{ marginTop: '10px', fontSize: '0.9rem' }}>
              <strong>Advertencias:</strong> {result.advertencias.join(', ')}
            </p>
          )}
        </div>
      </section>
    );
  }

  const transaccion = result.transaccion!;
  const emoji = getStatusEmoji(transaccion.tipo);

  return (
    <section className="section results-section">
      <h2>✅ Último Resultado</h2>
      <div className="result-content">
        <div className="result-grid">
          <div style={{ textAlign: 'center' }}>
            <strong>Tipo:</strong>
            <br />
            {emoji} {transaccion.tipo.toUpperCase()}
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong>Cantidad:</strong>
            <br />
            <span className="result-amount">{formatCurrency(transaccion.cantidad)}</span>
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong>Confianza:</strong>
            <br />
            <span className="result-confidence">
              {(transaccion.confianza * 100).toFixed(0)}%
            </span>
          </div>
        </div>

        <div className="result-grid">
          <div style={{ textAlign: 'center' }}>
            <strong>Categoría:</strong>
            <br />
            {getStatusEmoji(transaccion.categoria)} {transaccion.categoria}
          </div>
          <div style={{ textAlign: 'center' }}>
            <strong>Fecha:</strong>
            <br />
            {formatDate(transaccion.fecha)}
          </div>
        </div>

        {transaccion.notas && (
          <div style={{ marginTop: '10px' }}>
            <strong>Notas:</strong> {transaccion.notas}
          </div>
        )}

        {result.keywords && result.keywords.length > 0 && (
          <div style={{ marginTop: '10px' }}>
            <strong>Palabras clave detectadas:</strong>
            <br />
            <div className="keywords">
              {result.keywords.map((kw, idx) => (
                <span key={idx} className="keyword">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
};
