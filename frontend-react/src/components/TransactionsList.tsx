// Componente TransactionsList

import { useState } from 'react';
import type { Transaction } from '../types';
import { formatCurrency, formatDate, getStatusEmoji } from '../utils/formatters';
import '../styles/components.css';

interface TransactionsListProps {
  transactions: Transaction[];
  onClearAll: () => void;
}

export const TransactionsList = ({ transactions, onClearAll }: TransactionsListProps) => {
  const [expandedIds, setExpandedIds] = useState<Set<string>>(new Set());

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  const toggleExpand = (id: string) => {
    setExpandedIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  return (
    <section className="section transactions-section">
      {transactions.length > 0 && (
        <div style={{ marginBottom: '20px', textAlign: 'right' }}>
          <button className="btn btn-danger" onClick={onClearAll}>
            Borrar Todo
          </button>
        </div>
      )}

      <div className="transactions-content">
        {transactions.length === 0 ? (
          <p className="empty-state">📭 No hay transacciones registradas</p>
        ) : (
          sortedTransactions.map((transaction) => {
            const confidencePercent = (transaction.confianza * 100).toFixed(0);
            const isExpanded = expandedIds.has(transaction.id);
            
            return (
              <div
                key={transaction.id}
                className={`transaction-card ${transaction.tipo} ${isExpanded ? 'expanded' : ''}`}
                onClick={() => toggleExpand(transaction.id)}
              >
                {/* Vista compacta para móvil */}
                <div className="transaction-compact">
                  <div className="transaction-category">
                    {getStatusEmoji(transaction.categoria)} {transaction.categoria}
                  </div>
                  <div className="transaction-compact-right">
                    <div className={`transaction-amount ${transaction.tipo}`}>
                      {formatCurrency(transaction.cantidad)}
                    </div>
                    <span className="expand-icon">{isExpanded ? '▼' : '▶'}</span>
                  </div>
                </div>

                {/* Detalles completos (expandible en móvil, siempre visible en desktop) */}
                <div className="transaction-details">
                  <div className="transaction-header">
                    <span className="transaction-category">
                      {getStatusEmoji(transaction.categoria)} {transaction.categoria}
                    </span>
                    <div
                      className="confidence"
                      style={
                        {
                          '--confidence': transaction.confianza,
                        } as React.CSSProperties
                      }
                    >
                      {confidencePercent}%
                    </div>
                  </div>
                  <div className={`transaction-amount ${transaction.tipo}`}>
                    {getStatusEmoji(transaction.tipo)} {formatCurrency(transaction.cantidad)}
                  </div>
                  <div className="transaction-type">{transaction.tipo.toUpperCase()}</div>
                  <div className="transaction-description">{transaction.descripcion}</div>
                  <div className="transaction-footer">
                    <span>{formatDate(transaction.fecha)}</span>
                    <span>ID: {transaction.id.slice(0, 8)}...</span>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </section>
  );
};
