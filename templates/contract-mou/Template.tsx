'use client';

import React from 'react';
import { formatCurrency, formatDate, numberToWords } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface MOUProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<MOUProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const partyA = data.partyA || {};
  const partyB = data.partyB || {};
  const val = Number(data.contractValue) || 0;
  const valInWords = numberToWords(val, currency);

  return (
    <div
      className="doc-mou bg-white text-slate-800 w-full min-h-full font-serif text-[11.5px] leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header Title */}
        <div className="text-center pb-5 border-b-2 border-slate-900 mb-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-slate-400 block mb-1">
            Ref: {data.docNumber || 'MOU-2026-001'}
          </span>
          <h1 className="text-lg font-bold font-sans uppercase tracking-wider text-slate-900">
            {data.agreementTitle || 'MEMORANDUM OF UNDERSTANDING'}
          </h1>
          <p className="text-[11px] font-sans text-slate-500 mt-1">
            EFFECTIVE AS OF {formatDate(data.effectiveDate, 'long').toUpperCase()}
          </p>
        </div>

        {/* Contracting Parties Preamble */}
        <p className="text-justify mb-5 text-slate-700">
          THIS AGREEMENT is entered into on <strong>{formatDate(data.effectiveDate, 'long')}</strong>, by and between:
        </p>

        <div className="grid grid-cols-2 gap-6 my-4 font-sans text-xs">
          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              PARTY A (SERVICE PROVIDER):
            </span>
            <p className="font-bold text-slate-900">{partyA.name}</p>
            {partyA.representative && <p className="text-slate-600 mt-0.5">{partyA.representative}</p>}
            {partyA.address && <p className="text-slate-500 mt-0.5 whitespace-pre-line text-[11px]">{partyA.address}</p>}
          </div>

          <div className="p-3.5 rounded-lg border border-slate-200 bg-slate-50">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
              PARTY B (CLIENT):
            </span>
            <p className="font-bold text-slate-900">{partyB.name}</p>
            {partyB.representative && <p className="text-slate-600 mt-0.5">{partyB.representative}</p>}
            {partyB.address && <p className="text-slate-500 mt-0.5 whitespace-pre-line text-[11px]">{partyB.address}</p>}
          </div>
        </div>

        {/* Recitals & Purpose */}
        <div className="space-y-4 my-5 text-xs text-justify text-slate-800">
          <div>
            <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-1.5">
              1. PURPOSE & COMMERCIAL SCOPE
            </h2>
            <p className="leading-relaxed text-slate-700">{data.purpose}</p>
          </div>

          {val > 0 && (
            <div className="p-3 rounded-lg bg-blue-50/60 border border-blue-200 font-sans">
              <div className="flex justify-between items-center">
                <span className="font-bold text-blue-900 uppercase tracking-wider text-[11px]">
                  TOTAL CONTRACT CONSIDERATION:
                </span>
                <span className="font-mono font-bold text-base text-blue-950">
                  {formatCurrency(val, currency)}
                </span>
              </div>
              <p className="text-[11px] text-blue-800 mt-0.5 italic font-serif">
                ({valInWords})
              </p>
            </div>
          )}

          <div>
            <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200 mb-1.5">
              2. TERMS, COVENANTS & OBLIGATIONS
            </h2>
            <p className="whitespace-pre-line leading-relaxed text-slate-700">{data.obligations}</p>
          </div>
        </div>
      </div>

      {/* Dual Execution Sign-off */}
      <div className="pt-6 border-t border-slate-300 font-sans text-xs">
        <p className="text-[10px] text-slate-400 uppercase tracking-wider mb-6">
          IN WITNESS WHEREOF, the authorized representatives of the parties hereto have executed this Agreement:
        </p>

        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="font-bold text-slate-800 mb-6">For and on behalf of PARTY A:</p>
            <div className="border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px]">
              Authorized Signature & Seal
            </div>
            <p className="font-bold text-slate-900">{partyA.representative || partyA.name}</p>
            <p className="text-[10px] text-slate-400">Date: {formatDate(data.effectiveDate)}</p>
          </div>

          <div className="text-right">
            <p className="font-bold text-slate-800 mb-6">For and on behalf of PARTY B:</p>
            {data.signatureUrl ? (
              <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
            ) : (
              <div className="border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px]">
                Authorized Signature & Seal
              </div>
            )}
            <p className="font-bold text-slate-900">{partyB.representative || partyB.name}</p>
            <p className="text-[10px] text-slate-400">Date: {formatDate(data.effectiveDate)}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
