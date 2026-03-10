// Componente SuggestionsSection

import type { Suggestion } from '../types';
import { formatCurrency } from '../utils/formatters';
import '../styles/components.css';

interface SuggestionsSectionProps {
  suggestions: Suggestion[];
}

export const SuggestionsSection = ({ suggestions }: SuggestionsSectionProps) => {
  if (suggestions.length === 0) return null;

  return (
    <section className="section suggestions-section">
      <div className="suggestions-content">
        {suggestions.map((suggestion, idx) => (
          <div key={idx} className={`suggestion-card ${suggestion.prioridad}`}>
            <div className="suggestion-title">{suggestion.titulo}</div>
            <div className="suggestion-description">{suggestion.descripcion}</div>
            <div className="suggestion-meta">
              <span className="badge">Prioridad: {suggestion.prioridad.toUpperCase()}</span>
              {suggestion.ahorro_estimado && (
                <span className="badge">💰 {formatCurrency(suggestion.ahorro_estimado)}</span>
              )}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};
