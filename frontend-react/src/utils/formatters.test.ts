/**
 * Tests para utilidades de formateo
 */
import { describe, it, expect } from 'vitest';
import { formatCurrency, formatDate, formatPercentage } from '../utils/formatters';

describe('Formatters', () => {
  describe('formatCurrency', () => {
    it('should format number as Colombian pesos', () => {
      expect(formatCurrency(1000000)).toContain('1.000.000');
      expect(formatCurrency(50000)).toContain('50.000');
      expect(formatCurrency(500)).toContain('500');
    });

    it('should handle zero', () => {
      expect(formatCurrency(0)).toContain('0');
    });

    it('should handle negative numbers', () => {
      const result = formatCurrency(-5000);
      expect(result).toContain('5.000');
    });

    it('should handle decimal numbers', () => {
      expect(formatCurrency(1500.75)).toContain('1.501');
    });
  });

  describe('formatDate', () => {
    it('should format ISO date string', () => {
      const isoDate = '2026-03-09T10:30:00';
      const result = formatDate(isoDate);
      expect(result).toBeTruthy();
      expect(typeof result).toBe('string');
    });

    it('should format Date object', () => {
      const date = new Date('2026-03-09T10:30:00');
      const result = formatDate(date);
      expect(result).toBeTruthy();
    });
  });

  describe('formatPercentage', () => {
    it('should format percentage with one decimal', () => {
      expect(formatPercentage(45.67)).toBe('45.7%');
      expect(formatPercentage(100)).toBe('100.0%');
      expect(formatPercentage(0)).toBe('0.0%');
    });

    it('should handle small decimals', () => {
      expect(formatPercentage(0.5)).toBe('0.5%');
    });
  });
});
