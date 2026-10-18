import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { numberToWords, formatCurrency, formatDate, generateDocNumber } from '../../src/lib/format';

describe('numberToWords', () => {
  test('handles zero values correctly across currencies', () => {
    assert.equal(numberToWords(0, 'KES'), 'Zero shillings only');
    assert.equal(numberToWords(0, 'USD'), 'Zero usd only');
    assert.equal(numberToWords(0, 'EUR'), 'Zero eur only');
  });

  test('converts round thousands and millions correctly', () => {
    assert.equal(numberToWords(20000, 'KES'), 'Twenty thousand shillings only');
    assert.equal(numberToWords(1000000, 'KES'), 'One million shillings only');
    assert.equal(numberToWords(1500000, 'KES'), 'One million, five hundred thousand shillings only');
  });

  test('handles complex multi-digit amounts with commas and hyphens', () => {
    // 24,570
    assert.equal(
      numberToWords(24570, 'KES'),
      'Twenty-four thousand, five hundred and seventy shillings only'
    );

    // 123,456
    assert.equal(
      numberToWords(123456, 'KES'),
      'One hundred and twenty-three thousand, four hundred and fifty-six shillings only'
    );
  });

  test('converts decimal cents correctly', () => {
    // 1500.50
    assert.equal(
      numberToWords(1500.5, 'KES'),
      'One thousand, five hundred shillings and fifty cents only'
    );

    // 99.05 -> 5 cents
    assert.equal(
      numberToWords(99.05, 'USD'),
      'Ninety-nine dollars and five cents only'
    );
  });

  test('handles single dollar / pound / euro singular inflection', () => {
    assert.equal(numberToWords(1, 'USD'), 'One dollar only');
    assert.equal(numberToWords(2, 'USD'), 'Two dollars only');
    assert.equal(numberToWords(1, 'GBP'), 'One pound only');
    assert.equal(numberToWords(1, 'EUR'), 'One euro only');
  });

  test('handles invalid, null, or undefined inputs gracefully without throwing', () => {
    assert.equal(numberToWords(NaN), '');
    // @ts-expect-error test undefined
    assert.equal(numberToWords(undefined), '');
    // @ts-expect-error test null
    assert.equal(numberToWords(null), '');
  });

  test('handles negative amounts cleanly', () => {
    assert.equal(
      numberToWords(-500, 'KES'),
      'Negative five hundred shillings only'
    );
  });
});

describe('formatCurrency', () => {
  test('formats Kenyan Shillings with KES prefix', () => {
    const formatted = formatCurrency(50000, 'KES');
    assert.match(formatted, /^KES\s+50[,\s]000\.00$/);
  });

  test('formats USD with dollar sign', () => {
    const formatted = formatCurrency(1250.75, 'USD');
    assert.match(formatted, /^\$1[,\s]250\.75$/);
  });

  test('handles zero or missing values', () => {
    const formatted = formatCurrency(undefined, 'KES');
    assert.match(formatted, /^KES\s+0\.00$/);
  });
});

describe('formatDate', () => {
  test('formats standard British/Kenyan date format (e.g. 17 Oct 2026)', () => {
    const d = new Date('2026-10-17T12:00:00Z');
    const result = formatDate(d, 'standard');
    assert.match(result, /17\s+Oct\s+2026/);
  });

  test('formats short numeric date (DD/MM/YYYY)', () => {
    const d = new Date('2026-10-17T12:00:00Z');
    const result = formatDate(d, 'short');
    assert.equal(result, '17/10/2026');
  });

  test('formats long full month name', () => {
    const d = new Date('2026-10-17T12:00:00Z');
    const result = formatDate(d, 'long');
    assert.match(result, /17\s+October\s+2026/);
  });
});

describe('generateDocNumber', () => {
  test('generates standard prefix-year-seq string', () => {
    const date = new Date('2026-05-10');
    assert.equal(generateDocNumber('INV', 1, date), 'INV-2026-0001');
    assert.equal(generateDocNumber('QUO', 42, date), 'QUO-2026-0042');
    assert.equal(generateDocNumber('PO', 1050, date), 'PO-2026-1050');
  });
});
