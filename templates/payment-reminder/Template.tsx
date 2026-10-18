'use client';

import React from 'react';
import { formatCurrency, formatDate } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface PaymentReminderProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<PaymentReminderProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const sender = data.sender || {};
  const recipient = data.recipient || {};
  const amountDue = Number(data.amountDue) || 0;

  return (
    <div
      className="doc-reminder bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Letterhead */}
        <div className="flex justify-between items-start gap-8 pb-6 border-b border-slate-200">
          <div>
            {sender.logoUrl && (
              <img src={sender.logoUrl} alt="Logo" className="h-10 w-auto mb-2 rounded" />
            )}
            <h1 className="text-xl font-bold text-slate-900">{sender.businessName}</h1>
            <p className="text-slate-500 mt-1 whitespace-pre-line">{sender.address}</p>
            <div className="flex gap-4 mt-1 text-slate-500">
              {sender.phone && <span>Tel: {sender.phone}</span>}
              {sender.email && <span>Email: {sender.email}</span>}
            </div>
          </div>
          <div className="text-right">
            <span className="font-mono text-xs text-slate-400 block">Ref: {data.docNumber || 'REM-2026-0001'}</span>
            <p className="font-semibold text-slate-800 mt-1">{formatDate(data.date, 'long')}</p>
          </div>
        </div>

        {/* Recipient Address */}
        <div className="my-6">
          <p className="font-bold text-slate-900 text-sm">{recipient.name}</p>
          {recipient.attention && <p className="text-slate-600 font-medium">Attn: {recipient.attention}</p>}
          <p className="text-slate-500 whitespace-pre-line mt-0.5">{recipient.address}</p>
        </div>

        {/* Subject Header */}
        <div className="mb-6 pb-2 border-b-2 border-slate-900">
          <h2 className="text-sm font-bold uppercase tracking-wide text-slate-900">
            {data.subject || 'STATEMENT & OVERDUE PAYMENT REMINDER'}
          </h2>
        </div>

        {/* Overdue Alert Callout Card */}
        <div className="mb-6 p-4 rounded-xl bg-amber-50/70 border border-amber-200 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-amber-800 block">
              OUTSTANDING ARREARS BALANCE
            </span>
            <p className="text-2xl font-black font-mono text-amber-950 mt-0.5">
              {formatCurrency(amountDue, currency)}
            </p>
          </div>
          <div className="text-right text-xs space-y-0.5">
            <p className="text-slate-600">Original Invoice: <strong className="font-mono text-slate-900">{data.invoiceRef}</strong></p>
            <p className="text-amber-800 font-semibold">{data.daysOverdue} Days Overdue</p>
          </div>
        </div>

        {/* Letter Body */}
        <div className="space-y-3.5 text-slate-700 leading-relaxed whitespace-pre-line text-xs">
          {data.bodyParagraphs}
        </div>

        {/* Remittance Block */}
        {data.paymentInstructions && (
          <div className="my-6 p-4 rounded-xl border border-slate-200 bg-slate-50 text-[11px] text-slate-700">
            <span className="font-bold text-slate-900 uppercase tracking-wider text-[10px] block mb-1.5">
              REMITTANCE INSTRUCTIONS
            </span>
            <p className="whitespace-pre-line leading-relaxed">{data.paymentInstructions}</p>
          </div>
        )}
      </div>

      {/* Sign-off */}
      <div className="pt-8 border-t border-slate-200">
        <p className="text-slate-600 mb-6">Sincerely,</p>
        {data.signatureUrl ? (
          <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto mb-1" />
        ) : (
          <div className="border-b border-slate-400 w-44 pb-1 mb-1 italic text-[11px] text-slate-400">
            Authorized Signature
          </div>
        )}
        <p className="font-bold text-slate-900 text-xs">{data.signatory || 'Finance Controller'}</p>
        <p className="text-[11px] text-slate-500">{sender.businessName}</p>
      </div>
    </div>
  );
};

export default Template;
