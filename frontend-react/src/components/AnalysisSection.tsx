// Componente AnalysisSection

import { useState } from 'react';
import type { Analysis, AnalysisPeriod } from '../types';
import { formatCurrency, getStatusEmoji } from '../utils/formatters';
import '../styles/components.css';

interface AnalysisSectionProps {
  analysis: Analysis | null;
  onAnalyze: (period: AnalysisPeriod) => void;
  isLoading: boolean;
}

export const AnalysisSection = ({ analysis, onAnalyze, isLoading }: AnalysisSectionProps) => {
  const [period, setPeriod] = useState<AnalysisPeriod>('mensual');

  const handleAnalyze = () => {
    onAnalyze(period);
  };

  return (
    <section className="section analysis-section">
      <h2>📊 Análisis</h2>

      <div className="period-selector">
        <label htmlFor="periodSelect">Período:</label>
        <select
          id="periodSelect"
          className="select-input"
          value={period}
          onChange={(e) => setPeriod(e.target.value as AnalysisPeriod)}
          disabled={isLoading}
        >
          <option value="diario">Diario</option>
          <option value="semanal">Semanal</option>
          <option value="mensual">Mensual</option>
          <option value="bimestral">Bimestral</option>
          <option value="semestral">Semestral</option>
          <option value="anual">Anual</option>
        </select>
        <button className="btn btn-primary" onClick={handleAnalyze} disabled={isLoading}>
          Analizar
        </button>
      </div>

      {analysis && (
        <div className="analysis-content">
          <div className="stat-card income">
            <div className="stat-label">💰 Ingresos</div>
            <div className="stat-value">{formatCurrency(analysis.ingresos_totales)}</div>
          </div>
          <div className="stat-card expense">
            <div className="stat-label">💸 Gastos</div>
            <div className="stat-value">{formatCurrency(analysis.gastos_totales)}</div>
          </div>
          <div className={`stat-card ${analysis.balance >= 0 ? 'income' : 'expense'}`}>
            <div className="stat-label">📊 Balance</div>
            <div className="stat-value">{formatCurrency(analysis.balance)}</div>
          </div>
        </div>
      )}

      {analysis && Object.entries(analysis.por_categoria).length > 0 && (
        <div className="category-breakdown">
          <h3 style={{ marginBottom: '15px', fontSize: '1.1rem' }}>Desglose por Categoría</h3>
          {Object.entries(analysis.por_categoria)
            .sort(([, a], [, b]) => b.total - a.total)
            .map(([category, data]) => (
              <div key={category} className="category-item">
                <span className="category-name">
                  {getStatusEmoji(category)} {category}
                </span>
                <div className="category-bar">
                  <div
                    className="category-fill"
                    style={{ width: `${data.porcentaje}%` }}
                  ></div>
                </div>
                <div className="category-stats">
                  <div className="category-percentage">{data.porcentaje.toFixed(1)}%</div>
                  <div className="category-amount">{formatCurrency(data.total)}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                    {data.transacciones} transacción{data.transacciones !== 1 ? 'es' : ''}
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      {analysis && Object.entries(analysis.por_categoria).length === 0 && (
        <p style={{ color: 'var(--text-secondary)', textAlign: 'center', padding: '20px' }}>
          No hay datos de gastos por categoría
        </p>
      )}
    </section>
  );
};
