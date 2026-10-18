'use client';

import React from 'react';
import { formatCurrency, formatDate, numberToWords } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface ReceiptTemplateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<ReceiptTemplateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const amountPaid = Number(data.amountPaid) || 0;
  const balanceRemaining = Number(data.balanceRemaining) || 0;
  const inWords = numberToWords(amountPaid, currency);
  const sender = data.sender || {};
  const receivedFrom = data.receivedFrom || {};

  return (
    <div
      className="doc-receipt bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Decorative receipt header banner */}
        <div className="border-b-2 border-emerald-600 pb-6 flex justify-between items-start gap-6">
          <div className="max-w-[65%]">
            {sender.logoUrl && (
              <img
                src={sender.logoUrl}
                alt="Logo"
                className="h-10 w-auto object-contain mb-2 rounded"
              />
            )}
            <h1 className="text-xl font-black text-slate-900 tracking-tight">
              {sender.businessName || 'Organization Name'}
            </h1>
            <p className="text-slate-500 mt-1">{sender.address}</p>
            <div className="flex gap-4 mt-1 text-slate-500">
              {sender.phone && <span>Tel: {sender.phone}</span>}
              {sender.email && <span>Email: {sender.email}</span>}
            </div>
            {sender.kraPin && (
              <p className="mt-1 font-semibold text-slate-700">
                KRA PIN: <span className="font-mono bg-slate-100 px-1 py-0.5 rounded">{sender.kraPin}</span>
              </p>
            )}
          </div>

          <div className="text-right">
            <span className="text-xs uppercase tracking-widest font-black text-emerald-700 block">
              OFFICIAL RECEIPT
            </span>
            <span className="text-lg font-bold font-mono text-slate-900 mt-0.5 block">
              {data.docNumber || 'REC-2026-0001'}
            </span>
            <div className="mt-3 text-slate-600 space-y-0.5">
              <p>Date: <strong className="text-slate-800">{formatDate(data.date)}</strong></p>
              <p>Method: <strong className="text-slate-800">{data.paymentMethod || 'M-Pesa'}</strong></p>
              {data.mpesaReference && (
                <p className="mt-1">
                  Ref Code: <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1.5 py-0.5 rounded border border-emerald-200">{data.mpesaReference}</span>
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Amount Paid Callout Banner */}
        <div className="my-6 p-5 rounded-xl bg-emerald-50/70 border border-emerald-200 flex items-center justify-between">
          <div>
            <span className="text-[11px] uppercase font-bold tracking-wider text-emerald-800 block">
              TOTAL AMOUNT RECEIVED
            </span>
            <p className="text-2xl font-black font-mono text-emerald-950 mt-0.5">
              {formatCurrency(amountPaid, currency)}
            </p>
          </div>
          <div className="text-right">
            <span className="inline-flex items-center gap-1.5 bg-emerald-600 text-white font-bold text-[11px] px-3 py-1 rounded-full uppercase tracking-wider shadow-2xs">
              ✓ Verified Payment
            </span>
          </div>
        </div>

        {/* Structured Receipt Ledger */}
        <div className="space-y-4 my-6 text-xs">
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              RECEIVED FROM:
            </span>
            <div className="col-span-9">
              <p className="font-bold text-slate-900 text-sm">{receivedFrom.name}</p>
              {receivedFrom.contact && <p className="text-slate-500 mt-0.5">{receivedFrom.contact}</p>}
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              AMOUNT IN WORDS:
            </span>
            <div className="col-span-9">
              <p className="font-medium text-slate-800 italic">{inWords}</p>
            </div>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-3 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              BEING PAYMENT FOR:
            </span>
            <div className="col-span-9">
              <p className="text-slate-700 leading-relaxed">{data.forPaymentOf}</p>
            </div>
          </div>

          {balanceRemaining > 0 && (
            <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
              <span className="col-span-3 font-bold text-amber-700 uppercase tracking-wider text-[11px]">
                BALANCE REMAINING:
              </span>
              <div className="col-span-9">
                <p className="font-bold font-mono text-amber-800">{formatCurrency(balanceRemaining, currency)}</p>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Signature & Seal Block */}
      <div className="pt-8 border-t border-slate-200 flex justify-between items-end gap-8">
        <div className="text-slate-400 text-[11px] max-w-[60%]">
          <p>Official computer-generated receipt issued in Nairobi, Kenya.</p>
          <p className="mt-0.5">Retain this receipt for tax, audit, and account reconciliation purposes.</p>
        </div>

        <div className="text-right">
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
          ) : (
            <div className="border-b border-slate-400 w-48 pb-1 mb-1 text-center italic text-[11px] text-slate-500">
              Authorized Stamp / Signature
            </div>
          )}
          <p className="font-bold text-slate-800 text-[11px]">{data.receivedBy || 'Finance Department'}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-wider">For {sender.businessName || 'Issuer'}</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
