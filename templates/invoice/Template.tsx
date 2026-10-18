'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/format';
import { calculateInvoice } from '@/lib/calc';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface InvoiceTemplateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<InvoiceTemplateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const calculations = calculateInvoice({
    items: data.items,
    applyVat: data.applyVat,
    vatRate: data.vatRate,
    amountPaid: data.amountPaid,
    currency,
  });

  const sender = data.sender || {};
  const client = data.client || {};
  const payment = data.payment || {};

  return (
    <div
      className="doc-invoice bg-white text-slate-800 w-full min-h-full font-sans text-[13px] leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Top Accent Strip (variant responsive) */}
        {variant === 'classic' && (
          <div className="h-3 w-full bg-[#0f2b48] mb-6" />
        )}
        {variant === 'bold' && (
          <div className="h-3 w-full bg-[#047857] mb-6" />
        )}

        {/* Header Section */}
        <div className="flex justify-between items-start gap-8 pb-8 border-b border-slate-200">
          <div className="max-w-[60%]">
            {sender.logoUrl && (
              <div className="mb-3">
                <img
                  src={sender.logoUrl}
                  alt={sender.businessName || 'Business Logo'}
                  className="h-12 w-auto max-w-[180px] object-contain rounded"
                />
              </div>
            )}
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {sender.businessName || 'Your Business Name'}
            </h1>
            {sender.tagline && (
              <p className="text-xs text-slate-500 font-medium mt-0.5">
                {sender.tagline}
              </p>
            )}

            <div className="mt-3 text-xs text-slate-600 space-y-0.5">
              {sender.address && <p className="whitespace-pre-line">{sender.address}</p>}
              <div className="flex flex-wrap gap-x-4 gap-y-0.5 pt-1">
                {sender.email && <span>Email: {sender.email}</span>}
                {sender.phone && <span>Tel: {sender.phone}</span>}
              </div>
              {sender.kraPin && (
                <p className="font-semibold text-slate-700 pt-0.5">
                  KRA PIN: <span className="font-mono text-[12px] bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200">{sender.kraPin}</span>
                </p>
              )}
            </div>
          </div>

          {/* Doc Title & Meta Box */}
          <div className="text-right">
            <div className="inline-block">
              <span className="text-xs uppercase tracking-widest font-bold text-slate-400 block">
                {data.applyVat ? 'TAX INVOICE' : 'INVOICE'}
              </span>
              <p className="text-xl font-mono font-bold text-slate-900 tracking-tight mt-0.5">
                {data.docNumber || 'INV-2026-0001'}
              </p>
            </div>

            <div className="mt-4 space-y-1.5 text-xs text-slate-600">
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Date:</span>
                <span className="font-medium text-slate-800">{formatDate(data.issueDate)}</span>
              </div>
              <div className="flex justify-between gap-4">
                <span className="text-slate-400">Due Date:</span>
                <span className="font-medium text-slate-800">{formatDate(data.dueDate)}</span>
              </div>
              {calculations.balanceDue > 0 ? (
                <div className="inline-flex items-center gap-1.5 bg-amber-50 text-amber-800 border border-amber-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px] mt-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  Balance Due: {formatCurrency(calculations.balanceDue, currency)}
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 bg-emerald-50 text-emerald-800 border border-emerald-200 px-2.5 py-0.5 rounded-full font-semibold text-[11px] mt-1">
                  ✓ Paid in Full
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Client / Billed To Section */}
        <div className="grid grid-cols-2 gap-8 my-6 text-xs">
          <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80">
            <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
              BILLED TO:
            </p>
            <h3 className="font-bold text-slate-900 text-sm">
              {client.name || 'Client Name'}
            </h3>
            {client.contactPerson && (
              <p className="text-slate-600 font-medium">{client.contactPerson}</p>
            )}
            {client.address && (
              <p className="text-slate-500 whitespace-pre-line mt-1">{client.address}</p>
            )}
            {client.email && (
              <p className="text-slate-500 mt-1">{client.email}</p>
            )}
            {client.kraPin && (
              <p className="text-slate-600 font-medium mt-1.5">
                KRA PIN: <span className="font-mono text-slate-800">{client.kraPin}</span>
              </p>
            )}
          </div>

          <div className="p-4 rounded-lg bg-slate-50/80 border border-slate-200/80 flex flex-col justify-between">
            <div>
              <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                PAYMENT SUMMARY
              </p>
              <div className="space-y-1 text-slate-600">
                <div className="flex justify-between">
                  <span>Total Amount:</span>
                  <span className="font-semibold text-slate-800">{formatCurrency(calculations.grandTotal, currency)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Paid so far:</span>
                  <span className="font-medium text-emerald-700">{formatCurrency(calculations.amountPaid, currency)}</span>
                </div>
              </div>
            </div>
            <div className="pt-2 border-t border-slate-200 mt-2 flex justify-between items-baseline">
              <span className="font-bold text-slate-700">Balance Due:</span>
              <span className="text-base font-bold font-mono text-slate-900">
                {formatCurrency(calculations.balanceDue, currency)}
              </span>
            </div>
          </div>
        </div>

        {/* Line Items Table */}
        <div className="doc-table-wrapper my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Description</th>
                <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                <th className="py-2.5 px-3 w-32 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 text-xs">
              {calculations.itemsWithTotals.length > 0 ? (
                calculations.itemsWithTotals.map((item, index) => (
                  <tr key={index} className="hover:bg-slate-50/50 transition-colors">
                    <td className="py-3 px-3 text-center text-slate-400 font-mono text-[11px]">
                      {index + 1}
                    </td>
                    <td className="py-3 px-3 text-slate-800 font-medium">
                      <div className="whitespace-pre-line">{item.description || 'Item description'}</div>
                    </td>
                    <td className="py-3 px-3 text-center text-slate-600 font-mono">
                      {item.qty}
                    </td>
                    <td className="py-3 px-3 text-right text-slate-600 font-mono">
                      {formatCurrency(item.unitPrice, currency)}
                    </td>
                    <td className="py-3 px-3 text-right font-semibold font-mono text-slate-900">
                      {formatCurrency(item.amount, currency)}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="py-6 text-center text-slate-400 italic">
                    No line items added yet.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Totals Breakdown & In-Words section */}
        <div className="grid grid-cols-12 gap-8 my-6 items-start">
          {/* Left: Total in words & notes */}
          <div className="col-span-7 space-y-4">
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400 block mb-0.5">
                AMOUNT IN WORDS
              </span>
              <p className="text-xs font-medium text-slate-700 italic">
                {calculations.totalInWords}
              </p>
            </div>

            {/* Payment details block */}
            {(payment.bankName || payment.mpesaPaybill) && (
              <div className="p-3.5 rounded-lg border border-slate-200 bg-white shadow-xs">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-500 block mb-2">
                  SETTLEMENT / BANK & M-PESA INSTRUCTIONS
                </span>
                <div className="grid grid-cols-2 gap-3 text-xs">
                  {payment.bankName && (
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-800">{payment.bankName}</p>
                      <p className="text-slate-500">Acc: <span className="font-mono text-slate-800 font-medium">{payment.accountNumber}</span></p>
                      <p className="text-slate-500">Name: {payment.accountName}</p>
                      {payment.branch && <p className="text-slate-400 text-[11px]">{payment.branch}</p>}
                    </div>
                  )}
                  {payment.mpesaPaybill && (
                    <div className="space-y-0.5 pl-3 border-l border-slate-100">
                      <p className="font-semibold text-emerald-700">M-PESA Payment</p>
                      <p className="text-slate-700 font-mono font-medium">{payment.mpesaPaybill}</p>
                      <p className="text-slate-400 text-[11px]">Instant settlement via Safaricom</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Right: Calculation Table */}
          <div className="col-span-5 bg-slate-50/90 rounded-lg p-4 border border-slate-200 space-y-2 text-xs">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(calculations.subtotal, currency)}</span>
            </div>

            {data.applyVat && (
              <div className="flex justify-between text-slate-600">
                <span>VAT ({calculations.vatRate}%):</span>
                <span className="font-mono font-medium">{formatCurrency(calculations.vatAmount, currency)}</span>
              </div>
            )}

            <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-sm text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono">{formatCurrency(calculations.grandTotal, currency)}</span>
            </div>

            {calculations.amountPaid > 0 && (
              <>
                <div className="flex justify-between text-emerald-700 font-medium pt-1">
                  <span>Less Amount Paid:</span>
                  <span className="font-mono">-{formatCurrency(calculations.amountPaid, currency)}</span>
                </div>
                <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-base text-slate-900">
                  <span>Balance Due:</span>
                  <span className="font-mono text-indigo-700">{formatCurrency(calculations.balanceDue, currency)}</span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Footer & Signature / Terms */}
      <div className="pt-6 border-t border-slate-200 mt-6 text-xs text-slate-500">
        <div className="flex justify-between items-end gap-6">
          <div className="max-w-[70%] space-y-1">
            {data.terms && (
              <div>
                <span className="font-bold text-slate-700 text-[11px]">Terms: </span>
                <span>{data.terms}</span>
              </div>
            )}
            {data.footerNote && (
              <p className="text-slate-400 italic text-[11px]">{data.footerNote}</p>
            )}
          </div>
          <div className="text-right">
            <div className="border-b border-slate-400 w-44 pb-1 mb-1 text-center font-serif text-[11px] text-slate-600 italic">
              Authorized Signature
            </div>
            <p className="text-[10px] text-slate-400 uppercase tracking-wider">For {sender.businessName || 'Issuer'}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
