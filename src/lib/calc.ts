import { numberToWords } from './format';
import { CurrencyCode } from './types';

export interface LineItem {
  description: string;
  qty?: number;
  unitPrice?: number;
  amount?: number;
  taxable?: boolean;
}

export interface InvoiceCalculations {
  subtotal: number;
  vatRate: number;
  vatAmount: number;
  grandTotal: number;
  amountPaid: number;
  balanceDue: number;
  totalInWords: string;
  itemsWithTotals: LineItem[];
}

export function calculateInvoice(data: {
  items?: LineItem[];
  applyVat?: boolean;
  vatRate?: number;
  amountPaid?: number;
  currency?: CurrencyCode;
}): InvoiceCalculations {
  const items = Array.isArray(data.items) ? data.items : [];
  const applyVat = data.applyVat !== false;
  const vatRate = typeof data.vatRate === 'number' ? data.vatRate : 16;
  const amountPaid = Number(data.amountPaid) || 0;
  const currency: CurrencyCode = data.currency || 'KES';

  let subtotal = 0;
  const itemsWithTotals = items.map((item) => {
    const qty = Number(item.qty) || 0;
    const unitPrice = Number(item.unitPrice) || 0;
    const amount = Math.round(qty * unitPrice * 100) / 100;
    subtotal += amount;
    return {
      ...item,
      qty,
      unitPrice,
      amount,
    };
  });

  subtotal = Math.round(subtotal * 100) / 100;
  const vatAmount = applyVat ? Math.round(subtotal * (vatRate / 100) * 100) / 100 : 0;
  const grandTotal = Math.round((subtotal + vatAmount) * 100) / 100;
  const balanceDue = Math.max(0, Math.round((grandTotal - amountPaid) * 100) / 100);
  const totalInWords = numberToWords(grandTotal, currency);

  return {
    subtotal,
    vatRate,
    vatAmount,
    grandTotal,
    amountPaid,
    balanceDue,
    totalInWords,
    itemsWithTotals,
  };
}
