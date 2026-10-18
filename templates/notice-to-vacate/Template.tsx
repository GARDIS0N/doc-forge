'use client';

import React from 'react';
import { formatDate } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface NoticeToVacateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<NoticeToVacateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const landlord = data.landlord || {};
  const tenant = data.tenant || {};

  return (
    <div
      className="doc-ntv bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start pb-5 border-b-2 border-slate-900 mb-6">
          <div>
            <h1 className="text-lg font-bold text-slate-900">{landlord.name}</h1>
            <p className="text-slate-500">{landlord.phone}</p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-extrabold tracking-widest text-rose-700 block">
              FORMAL NOTICE TO VACATE
            </span>
            <span className="text-sm font-mono font-bold text-slate-900 mt-0.5 block">
              {data.docNumber || 'NTV-2026-0001'}
            </span>
            <p className="mt-1 text-slate-600 font-medium">Date: {formatDate(data.noticeDate, 'long')}</p>
          </div>
        </div>

        {/* Tenant Address */}
        <div className="mb-6">
          <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">SERVED UPON:</p>
          <p className="font-bold text-slate-900 text-sm">{tenant.name}</p>
          <p className="text-slate-600 font-medium">{data.propertyAddress}</p>
        </div>

        {/* Statutory Notice Banner */}
        <div className="my-6 p-4 rounded-xl bg-rose-50/70 border border-rose-200">
          <span className="text-[10px] font-bold uppercase tracking-wider text-rose-800 block">
            DEMAND FOR VACATION & PEACEABLE SURRENDER OF PREMISES
          </span>
          <p className="text-sm font-bold text-rose-950 mt-1">
            Vacation Deadline: {formatDate(data.vacateDate, 'long')} (5:00 PM)
          </p>
        </div>

        {/* Formal Notice Paragraphs */}
        <div className="space-y-4 text-slate-800 text-justify text-xs">
          <p>
            TAKE NOTICE that you are hereby required to quit, vacate, and peaceably deliver up possession of the residential premises known as{' '}
            <strong>{data.propertyAddress}</strong>, which you presently hold as a tenant, on or before the{' '}
            <strong>{formatDate(data.vacateDate, 'long')}</strong>.
          </p>

          {data.reason && (
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
              <span className="font-bold text-slate-700 block mb-0.5 text-[11px]">Reason for Notice:</span>
              <p className="text-slate-600 italic">{data.reason}</p>
            </div>
          )}

          {data.handoverInstructions && (
            <div>
              <span className="font-bold text-slate-900 block mb-1.5 uppercase text-[11px] tracking-wider">
                EXIT INSPECTION & HANDOVER CONDITIONS:
              </span>
              <p className="whitespace-pre-line leading-relaxed text-slate-700">{data.handoverInstructions}</p>
            </div>
          )}
        </div>
      </div>

      {/* Signature & Endorsement */}
      <div className="pt-8 border-t border-slate-200 flex justify-between items-end">
        <div className="text-slate-400 text-[11px]">
          <p>Issued pursuant to the Laws of Kenya.</p>
          <p>Copy retained on Landlord Tenancy Ledger.</p>
        </div>
        <div className="text-right">
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
          ) : (
            <div className="border-b border-slate-400 w-48 pb-1 mb-1 text-center italic text-[11px] text-slate-400">
              Landlord / Agent Signature
            </div>
          )}
          <p className="font-bold text-slate-900 text-xs">{landlord.name}</p>
          <p className="text-[10px] text-slate-400">Landlord / Registered Property Manager</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
