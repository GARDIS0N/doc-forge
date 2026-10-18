import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { calculateInvoice } from '../../src/lib/calc';

describe('calculateInvoice', () => {
  test('calculates subtotal and 16% VAT correctly for standard line items', () => {
    const result = calculateInvoice({
      items: [
        { description: 'Web Design', qty: 2, unitPrice: 25000 },
        { description: 'Hosting Annual', qty: 1, unitPrice: 15000 },
      ],
      applyVat: true,
      vatRate: 16,
      amountPaid: 0,
      currency: 'KES',
    });

    assert.equal(result.subtotal, 65000);
    assert.equal(result.vatRate, 16);
    assert.equal(result.vatAmount, 10400); // 16% of 65000
    assert.equal(result.grandTotal, 75400);
    assert.equal(result.amountPaid, 0);
    assert.equal(result.balanceDue, 75400);
    assert.match(result.totalInWords, /Seventy-five thousand, four hundred shillings only/i);
    assert.equal(result.itemsWithTotals.length, 2);
    assert.equal(result.itemsWithTotals[0].amount, 50000);
    assert.equal(result.itemsWithTotals[1].amount, 15000);
  });

  test('handles VAT disabled (0 VAT)', () => {
    const result = calculateInvoice({
      items: [
        { description: 'Consulting', qty: 10, unitPrice: 5000 },
      ],
      applyVat: false,
      vatRate: 16,
      amountPaid: 20000,
      currency: 'KES',
    });

    assert.equal(result.subtotal, 50000);
    assert.equal(result.vatAmount, 0);
    assert.equal(result.grandTotal, 50000);
    assert.equal(result.amountPaid, 20000);
    assert.equal(result.balanceDue, 30000);
  });

  test('handles partial payments and overpayments without negative balance', () => {
    // Partial payment
    const partial = calculateInvoice({
      items: [{ description: 'Item A', qty: 1, unitPrice: 100 }],
      applyVat: false,
      amountPaid: 40,
    });
    assert.equal(partial.balanceDue, 60);

    // Overpayment (should clamp balance to 0, not negative)
    const overpaid = calculateInvoice({
      items: [{ description: 'Item B', qty: 1, unitPrice: 100 }],
      applyVat: false,
      amountPaid: 150,
    });
    assert.equal(overpaid.balanceDue, 0);
  });

  test('handles floating point cents rounding accurately', () => {
    const result = calculateInvoice({
      items: [
        { description: 'Item Cents', qty: 3, unitPrice: 33.33 },
      ],
      applyVat: true,
      vatRate: 16,
    });

    // 3 * 33.33 = 99.99
    assert.equal(result.subtotal, 99.99);
    // 99.99 * 0.16 = 15.9984 -> rounds to 16.00
    assert.equal(result.vatAmount, 16.00);
    assert.equal(result.grandTotal, 115.99);
  });

  test('handles empty or undefined items safely', () => {
    const result = calculateInvoice({});
    assert.equal(result.subtotal, 0);
    assert.equal(result.vatAmount, 0);
    assert.equal(result.grandTotal, 0);
    assert.equal(result.balanceDue, 0);
    assert.equal(result.itemsWithTotals.length, 0);
  });

  test('handles missing or zero qty and unitPrice safely', () => {
    const result = calculateInvoice({
      items: [
        { description: 'Free sample', qty: 0, unitPrice: 100 },
        { description: 'Unpriced item', qty: 5 },
      ],
      applyVat: false,
    });
    assert.equal(result.subtotal, 0);
    assert.equal(result.grandTotal, 0);
  });
});
