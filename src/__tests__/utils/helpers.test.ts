// @ts-nocheck

import { formatDate, validateEmail, truncateText, formatCurrency } from '../../utils/helpers';

describe('Helper Functions', () => {
  describe('formatDate', () => {
    test('formats date correctly', () => {
      const date = new Date('2024-01-01');
      expect(formatDate(date)).toBe('01/01/2024');
    });

    test('handles invalid date', () => {
      expect(formatDate(new Date('invalid'))).toBe('Invalid Date');
    });
  });

  describe('validateEmail', () => {
    test('validates correct email formats', () => {
      expect(validateEmail('test@example.com')).toBe(true);
      expect(validateEmail('test.name@example.co.uk')).toBe(true);
      expect(validateEmail('test+label@example.com')).toBe(true);
    });

    test('invalidates incorrect email formats', () => {
      expect(validateEmail('test@')).toBe(false);
      expect(validateEmail('test@example')).toBe(false);
      expect(validateEmail('test.example.com')).toBe(false);
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('truncateText', () => {
    test('truncates text longer than specified length', () => {
      expect(truncateText('This is a long text', 10)).toBe('This is...');
    });

    test('does not truncate text shorter than specified length', () => {
      expect(truncateText('Short', 10)).toBe('Short');
    });

    test('handles empty string', () => {
      expect(truncateText('', 10)).toBe('');
    });
  });

  describe('formatCurrency', () => {
    test('formats USD currency correctly', () => {
      expect(formatCurrency(1234.56, 'USD')).toBe('$1,234.56');
      expect(formatCurrency(1000000, 'USD')).toBe('$1,000,000.00');
    });

    test('formats negative numbers correctly', () => {
      expect(formatCurrency(-1234.56, 'USD')).toBe('-$1,234.56');
    });

    test('handles zero correctly', () => {
      expect(formatCurrency(0, 'USD')).toBe('$0.00');
    });

    test('handles different currencies', () => {
      expect(formatCurrency(1234.56, 'EUR')).toBe('€1,234.56');
      expect(formatCurrency(1234.56, 'GBP')).toBe('£1,234.56');
    });
  });
}); 