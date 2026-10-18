'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/format';
import { calculateInvoice } from '@/lib/calc';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface QuotationTemplateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<QuotationTemplateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const calc = calculateInvoice({
    items: data.items,
    applyVat: data.applyVat,
    vatRate: 16,
    currency,
  });

  const sender = data.sender || {};
  const client = data.client || {};

  return (
    <div
      className="doc-quotation bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start gap-8 pb-6 border-b border-slate-200">
          <div className="max-w-[60%]">
            {sender.logoUrl && (
              <img src={sender.logoUrl} alt="Logo" className="h-10 w-auto mb-2 rounded" />
            )}
            <h1 className="text-xl font-bold text-slate-900">{sender.businessName || 'Business Name'}</h1>
            <p className="text-slate-500 mt-1 whitespace-pre-line">{sender.address}</p>
            <div className="flex gap-4 mt-1 text-slate-500">
              {sender.email && <span>{sender.email}</span>}
              {sender.phone && <span>{sender.phone}</span>}
            </div>
            {sender.kraPin && (
              <p className="mt-1 font-semibold text-slate-700">
                KRA PIN: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">{sender.kraPin}</span>
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-600 block">
              PRICE QUOTATION
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 mt-0.5 block">
              {data.docNumber || 'QUO-2026-0001'}
            </span>
            <div className="mt-3 space-y-1 text-slate-600">
              <p>Date: <strong className="text-slate-800">{formatDate(data.date)}</strong></p>
              <p>Valid Until: <strong className="text-blue-700">{formatDate(data.validUntil)}</strong></p>
              {data.preparedBy && <p className="text-[11px] text-slate-500">By: {data.preparedBy}</p>}
            </div>
          </div>
        </div>

        {/* Client Box */}
        <div className="my-6 p-4 rounded-xl bg-blue-50/50 border border-blue-100">
          <span className="text-[11px] font-bold uppercase tracking-wider text-blue-600 block mb-1">
            PREPARED EXCLUSIVELY FOR:
          </span>
          <p className="font-bold text-slate-900 text-sm">{client.name}</p>
          {client.contactPerson && <p className="text-slate-600 font-medium">{client.contactPerson}</p>}
          {client.address && <p className="text-slate-500 mt-0.5">{client.address}</p>}
          {client.email && <p className="text-slate-500">{client.email}</p>}
        </div>

        {/* Line Items Table */}
        <div className="doc-table-wrapper my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Scope / Item Description</th>
                <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                <th className="py-2.5 px-3 w-32 text-right">Amount</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {calc.itemsWithTotals.map((item, idx) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 px-3 text-center text-slate-600 font-mono">{item.qty}</td>
                  <td className="py-3 px-3 text-right text-slate-600 font-mono">{formatCurrency(item.unitPrice, currency)}</td>
                  <td className="py-3 px-3 text-right font-bold text-slate-900 font-mono">{formatCurrency(item.amount, currency)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals & Terms */}
        <div className="grid grid-cols-12 gap-8 my-6 items-start">
          <div className="col-span-7 space-y-3">
            {data.terms && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                  TERMS & CONDITIONS
                </span>
                <p className="whitespace-pre-line leading-relaxed">{data.terms}</p>
              </div>
            )}
          </div>

          <div className="col-span-5 bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-2">
            <div className="flex justify-between text-slate-600">
              <span>Subtotal:</span>
              <span className="font-mono font-medium">{formatCurrency(calc.subtotal, currency)}</span>
            </div>
            {data.applyVat && (
              <div className="flex justify-between text-slate-600">
                <span>VAT (16% Kenya):</span>
                <span className="font-mono font-medium">{formatCurrency(calc.vatAmount, currency)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-base text-slate-900">
              <span>Grand Total:</span>
              <span className="font-mono text-blue-700">{formatCurrency(calc.grandTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Acceptance Sign-off block */}
      <div className="pt-6 border-t border-slate-200">
        <p className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-4">
          CLIENT ACCEPTANCE & AUTHORIZATION (SIGN & RETURN)
        </p>
        <div className="grid grid-cols-2 gap-8">
          <div>
            <div className="border-b border-slate-400 pb-1 mb-1 italic text-[11px] text-slate-400">
              Client Signature
            </div>
            <p className="text-[11px] text-slate-600">Authorized Signatory for {client.name || 'Client'}</p>
            <p className="text-[10px] text-slate-400">Date: ________________________</p>
          </div>

          <div className="text-right">
            {data.signatureUrl ? (
              <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
            ) : (
              <div className="border-b border-slate-400 pb-1 mb-1 italic text-[11px] text-slate-400">
                Issuer Signature
              </div>
            )}
            <p className="text-[11px] font-bold text-slate-800">{data.preparedBy || sender.businessName}</p>
            <p className="text-[10px] text-slate-400">For {sender.businessName}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
