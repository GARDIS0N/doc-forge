'use client';

import React from 'react';
import { formatDate } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface CertificateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<CertificateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';

  return (
    <div
      className="doc-cert bg-white text-slate-800 w-full min-h-full font-serif text-center flex flex-col justify-between p-8 border-8 border-amber-600/30 rounded-2xl relative"
      data-variant={variant}
    >
      {/* Inner Ornamental Border */}
      <div className="border-2 border-amber-500/60 p-8 rounded-xl h-full flex flex-col justify-between relative bg-amber-50/10">
        {/* Certificate Emblem & Title */}
        <div className="space-y-3">
          <p className="font-sans font-bold text-xs uppercase tracking-widest text-amber-700">
            {data.issuerName || 'Academy of Software Engineering'}
          </p>

          <h1 className="text-3xl font-extrabold uppercase tracking-wider text-slate-900 font-sans mt-2">
            {data.certificateTitle || 'CERTIFICATE OF ACHIEVEMENT'}
          </h1>

          <div className="w-24 h-0.5 bg-amber-500 mx-auto mt-2" />
        </div>

        {/* Recipient */}
        <div className="my-8 space-y-4">
          <p className="italic text-slate-500 text-sm">
            {data.presentedToText || 'This certificate is proudly awarded to'}
          </p>

          <h2 className="text-3xl font-black text-slate-900 font-sans tracking-tight py-2 border-b-2 border-slate-300 max-w-md mx-auto">
            {data.recipientName || 'Recipient Full Name'}
          </h2>

          <p className="text-xs text-slate-600 max-w-lg mx-auto leading-relaxed pt-2">
            {data.reasonText}
          </p>
        </div>

        {/* Certificate Signatures & Seal */}
        <div className="pt-8 border-t border-amber-200/80">
          <div className="flex justify-between items-end max-w-xl mx-auto font-sans text-xs">
            <div className="text-center w-48">
              <div className="border-b border-slate-400 pb-1 mb-1 italic text-[11px] text-slate-400">
                Authorized Signature
              </div>
              <p className="font-bold text-slate-900 text-xs">{data.authority1 || 'President'}</p>
            </div>

            {/* Gold Seal Medallion */}
            <div className="w-16 h-16 rounded-full border-4 border-amber-500 bg-amber-100 flex items-center justify-center shadow-md">
              <span className="text-[9px] font-bold uppercase tracking-widest text-amber-900 text-center leading-tight">
                OFFICIAL<br />SEAL
              </span>
            </div>

            <div className="text-center w-48">
              {data.signatureUrl ? (
                <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto mx-auto mb-1" />
              ) : (
                <div className="border-b border-slate-400 pb-1 mb-1 italic text-[11px] text-slate-400">
                  Authorized Signature
                </div>
              )}
              <p className="font-bold text-slate-900 text-xs">{data.authority2 || 'Registrar'}</p>
            </div>
          </div>

          <div className="mt-6 flex justify-between items-center text-[10px] text-slate-400 font-sans">
            <span>Certificate ID: {data.docNumber || 'CERT-2026-001'}</span>
            <span>Date Conferred: {formatDate(data.date, 'long')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Template;
