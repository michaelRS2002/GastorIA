// Componente TransactionsList

import type { Transaction } from '../types';
import { formatCurrency, formatDate, getStatusEmoji } from '../utils/formatters';
import '../styles/components.css';

interface TransactionsListProps {
  transactions: Transaction[];
  onClearAll: () => void;
}

export const TransactionsList = ({ transactions, onClearAll }: TransactionsListProps) => {
  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime()
  );

  return (
    <section className="section transactions-section">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h2>📋 Transacciones Recientes</h2>
        {transactions.length > 0 && (
          <button className="btn btn-danger" onClick={onClearAll}>
            Borrar Todo
          </button>
        )}
      </div>

      <div className="transactions-content">
        {transactions.length === 0 ? (
          <p className="empty-state">📭 No hay transacciones registradas</p>
        ) : (
          sortedTransactions.map((transaction) => {
            const confidencePercent = (transaction.confianza * 100).toFixed(0);
            return (
              <div key={transaction.id} className={`transaction-card ${transaction.tipo}`}>
                <div className="transaction-header">
                  <div>
                    <span className="transaction-category">
                      {getStatusEmoji(transaction.categoria)} {transaction.categoria}
                    </span>
                  </div>
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
            );
          })
        )}
      </div>
    </section>
  );
};
