// Utilidades para formateo y helpers

import type { TransactionType, Category } from '../types';

export const formatCurrency = (amount: number): string => {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

export const formatPercentage = (value: number): string => {
  return `${value.toFixed(1)}%`;
};

export const getStatusEmoji = (type: TransactionType | Category | string): string => {
  const emojis: Record<string, string> = {
    gasto: '📉',
    ingreso: '📈',
    Comida: '🍽️',
    Ocio: '🎮',
    'Gasolina/Transporte': '🚗',
    'Gastos del hogar': '🏠',
    Ropa: '👕',
    Viajes: '✈️',
    Servicios: '🔧',
    Salud: '🏥',
    Educacion: '📚',
    Salario: '💵',
    Bonificacion: '🎁',
    Freelance: '💻',
    Otro: '📦',
  };
  return emojis[type] || '💰';
};
