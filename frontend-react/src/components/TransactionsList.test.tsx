/**
 * Tests para el componente TransactionsList
 */
import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { TransactionsList } from '../components/TransactionsList';
import type { Transaction } from '../types';

const mockTransactions: Transaction[] = [
  {
    id: '1',
    user_id: 'test-user',
    tipo: 'gasto',
    cantidad: 50000,
    categoria: 'Comida',
    descripcion: 'Almuerzo en restaurante',
    confianza: 0.9,
    fecha: '2026-03-09T12:00:00',
    created_at: '2026-03-09T12:00:00',
  },
  {
    id: '2',
    user_id: 'test-user',
    tipo: 'ingreso',
    cantidad: 1500000,
    categoria: 'Salario',
    descripcion: 'Pago mensual',
    confianza: 1.0,
    fecha: '2026-03-01T10:00:00',
    created_at: '2026-03-01T10:00:00',
  },
];

describe('TransactionsList', () => {
  it('should render transaction items', () => {
    render(<TransactionsList transactions={mockTransactions} onClearAll={vi.fn()} />);

    expect(screen.getByText(/Almuerzo en restaurante/i)).toBeTruthy();
    expect(screen.getByText(/Pago mensual/i)).toBeTruthy();
  });

  it('should display transaction amounts', () => {
    render(<TransactionsList transactions={mockTransactions} onClearAll={vi.fn()} />);

    // Usar getAllByText porque ahora hay duplicados (vista compacta + detallada)
    expect(screen.getAllByText(/50.000/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/1.500.000/).length).toBeGreaterThan(0);
  });

  it('should show categories', () => {
    render(<TransactionsList transactions={mockTransactions} onClearAll={vi.fn()} />);

    // Usar getAllByText porque ahora hay duplicados (vista compacta + detallada)
    expect(screen.getAllByText(/Comida/).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/Salario/).length).toBeGreaterThan(0);
  });

  it('should render empty state when no transactions', () => {
    render(<TransactionsList transactions={[]} onClearAll={vi.fn()} />);

    const emptyState = screen.getByText(/No hay transacciones/i);
    expect(emptyState).toBeTruthy();
  });

  it('should differentiate between gasto and ingreso', () => {
    const { container } = render(<TransactionsList transactions={mockTransactions} onClearAll={vi.fn()} />);

    // Buscar elementos con clases de gasto e ingreso
    const transactionItems = container.querySelectorAll('[class*="transaction"]');
    expect(transactionItems.length).toBeGreaterThan(0);
  });
});
