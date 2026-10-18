'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/format';
import { calculateInvoice } from '@/lib/calc';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface POTemplateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<POTemplateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const calc = calculateInvoice({
    items: data.items,
    applyVat: data.applyVat,
    vatRate: 16,
    currency,
  });

  const sender = data.sender || {};
  const vendor = data.vendor || {};

  return (
    <div
      className="doc-po bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start gap-8 pb-6 border-b border-slate-200">
          <div className="max-w-[60%]">
            {sender.logoUrl && (
              <img src={sender.logoUrl} alt="Logo" className="h-10 w-auto mb-2 rounded" />
            )}
            <h1 className="text-xl font-bold text-slate-900">{sender.businessName || 'Ordering Company'}</h1>
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
            <span className="text-xs uppercase font-extrabold tracking-widest text-[#0f2b48] block">
              PURCHASE ORDER (LPO)
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 mt-0.5 block">
              {data.docNumber || 'PO-2026-0001'}
            </span>
            <div className="mt-3 space-y-1 text-slate-600">
              <p>PO Date: <strong className="text-slate-800">{formatDate(data.date)}</strong></p>
              <p>Delivery Due: <strong className="text-blue-700">{formatDate(data.deliveryDate)}</strong></p>
              {data.shippingMethod && <p className="text-[11px] text-slate-500">Ship Via: {data.shippingMethod}</p>}
            </div>
          </div>
        </div>

        {/* Vendor and Ship To 2-Column Grid */}
        <div className="grid grid-cols-2 gap-6 my-6">
          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              VENDOR / SUPPLIER:
            </span>
            <p className="font-bold text-slate-900 text-sm">{vendor.name}</p>
            {vendor.address && <p className="text-slate-500 mt-0.5">{vendor.address}</p>}
            <div className="mt-1 text-slate-500 text-[11px] space-y-0.5">
              {vendor.email && <p>Email: {vendor.email}</p>}
              {vendor.phone && <p>Tel: {vendor.phone}</p>}
            </div>
          </div>

          <div className="p-4 rounded-xl border border-slate-200 bg-slate-50/70">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              SHIP TO / DELIVERY DESTINATION:
            </span>
            <p className="font-bold text-slate-900 text-sm">{sender.businessName}</p>
            <p className="text-slate-600 whitespace-pre-line mt-0.5">{sender.address}</p>
          </div>
        </div>

        {/* Ordered Items Table */}
        <div className="doc-table-wrapper my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Item Description / Part Number</th>
                <th className="py-2.5 px-3 w-20 text-center">Qty</th>
                <th className="py-2.5 px-3 w-28 text-right">Unit Price</th>
                <th className="py-2.5 px-3 w-32 text-right">Total Cost</th>
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

        {/* Totals & Notes */}
        <div className="grid grid-cols-12 gap-8 my-6 items-start">
          <div className="col-span-7 space-y-3">
            {data.terms && (
              <div className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/60 text-[11px] text-slate-600">
                <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
                  PURCHASE ORDER INSTRUCTIONS & SLA
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
                <span>VAT (16%):</span>
                <span className="font-mono font-medium">{formatCurrency(calc.vatAmount, currency)}</span>
              </div>
            )}
            <div className="pt-2 border-t border-slate-300 flex justify-between font-bold text-base text-slate-900">
              <span>Order Value:</span>
              <span className="font-mono text-[#0f2b48]">{formatCurrency(calc.grandTotal, currency)}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Signature Authorization Block */}
      <div className="pt-6 border-t border-slate-200 flex justify-between items-end">
        <p className="text-[11px] text-slate-400 max-w-[60%]">
          This Purchase Order constitutes a legally binding commitment upon delivery acceptance.
        </p>
        <div className="text-right">
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
          ) : (
            <div className="border-b border-slate-400 w-44 pb-1 mb-1 text-center italic text-[11px] text-slate-400">
              Authorized Signature
            </div>
          )}
          <p className="font-bold text-slate-800 text-[11px]">{data.authorizedBy || 'Procurement Manager'}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">For {sender.businessName}</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
