'use client';

import React from 'react';
import { formatCurrency, formatDate, numberToWords } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface TenancyProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<TenancyProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const landlord = data.landlord || {};
  const tenant = data.tenant || {};
  const rent = Number(data.monthlyRent) || 0;
  const deposit = Number(data.securityDeposit) || 0;
  const utilityDep = Number(data.waterElectricityDeposit) || 0;
  const rentInWords = numberToWords(rent, currency);

  return (
    <div
      className="doc-tenancy bg-white text-slate-800 w-full min-h-full font-serif text-[11.5px] leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Title */}
        <div className="text-center pb-5 border-b-2 border-slate-900 mb-6">
          <h1 className="text-xl font-bold uppercase tracking-widest text-slate-900 font-sans">
            RESIDENTIAL TENANCY AGREEMENT
          </h1>
          <p className="text-xs text-slate-500 font-sans mt-1">
            REPUBLIC OF KENYA • THE LANDLORD AND TENANT ACT
          </p>
          <span className="text-[10px] font-mono text-slate-400 mt-0.5 block">
            Agreement No: {data.docNumber || 'TA-2026-001'}
          </span>
        </div>

        {/* Preamble */}
        <p className="text-justify mb-4 text-slate-700">
          THIS TENANCY AGREEMENT is made and entered into on this <strong>{formatDate(data.agreementDate, 'long')}</strong>,
          BETWEEN <strong>{landlord.name || 'THE LANDLORD'}</strong> ({landlord.idNumber || 'ID/Passport'})
          (hereinafter referred to as the <em>"Landlord"</em>, which expression shall include legal heirs and assigns) of the one part;
          AND <strong>{tenant.name || 'THE TENANT'}</strong> ({tenant.idNumber || 'ID/Passport'})
          (hereinafter referred to as the <em>"Tenant"</em>) of the other part.
        </p>

        {/* Premises Declaration */}
        <div className="p-3.5 rounded-lg bg-slate-50 border border-slate-200 mb-5 font-sans text-xs">
          <span className="font-bold uppercase tracking-wider text-[10px] text-slate-500 block mb-1">
            DEMISED PREMISES & DURATION:
          </span>
          <p className="font-semibold text-slate-900">{data.propertyAddress}</p>
          <div className="flex justify-between items-center mt-2 text-slate-600 text-[11px] pt-2 border-t border-slate-200">
            <span>Commencement: <strong>{formatDate(data.commencementDate)}</strong></span>
            <span>Duration: <strong>{data.leaseTerm || '1 Year'}</strong></span>
            <span>Notice Period: <strong>{data.noticePeriod}</strong></span>
          </div>
        </div>

        {/* Core Covenants */}
        <div className="space-y-3 text-slate-800 text-justify text-xs">
          <h2 className="font-sans font-bold text-xs uppercase tracking-wider text-slate-900 pb-1 border-b border-slate-200">
            TERMS, RENT & MUTUAL COVENANTS
          </h2>

          <div className="space-y-2">
            <p>
              <strong>1. MONTHLY RENT:</strong> The Tenant shall pay to the Landlord a monthly rent of{' '}
              <strong className="font-sans font-bold text-slate-950">{formatCurrency(rent, currency)}</strong>{' '}
              ({rentInWords}), payable in advance {data.rentDueDay}. Payment shall be made via {data.mpesaAccount}.
            </p>

            <p>
              <strong>2. SECURITY DEPOSIT:</strong> The Tenant has paid a refundable security deposit of{' '}
              <strong>{formatCurrency(deposit, currency)}</strong>, plus utility deposit of{' '}
              <strong>{formatCurrency(utilityDep, currency)}</strong>. The deposit shall be refunded within 14 days of vacating, less legitimate deductions for repairs or unpaid utility bills.
            </p>

            <p>
              <strong>3. USER OF PREMISES:</strong> The demised premises shall be utilized strictly and solely for private residential purposes and not for commercial trade, illegal gatherings, or nuisance to neighbors.
            </p>

            <p>
              <strong>4. REPAIRS & MAINTENANCE:</strong> The Landlord shall be responsible for structural and exterior repairs. The Tenant shall be liable for interior maintenance, replacement of blown bulbs, unblocking drains, and keeping the premises clean.
            </p>

            <p>
              <strong>5. DETERMINATION & NOTICE:</strong> Either party may terminate this tenancy by issuing {data.noticePeriod} written notice or paying rent in lieu thereof.
            </p>
          </div>
        </div>
      </div>

      {/* Dual Signature Blocks & Witnesses */}
      <div className="pt-6 border-t border-slate-300 font-sans text-xs mt-6">
        <div className="grid grid-cols-2 gap-10">
          <div>
            <p className="font-bold text-slate-800 mb-6">SIGNED by the LANDLORD:</p>
            <div className="border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px]">
              Signature
            </div>
            <p className="font-bold text-slate-900">{landlord.name}</p>
            <p className="text-[10px] text-slate-500">{landlord.idNumber} • Tel: {landlord.phone}</p>
          </div>

          <div>
            <p className="font-bold text-slate-800 mb-6">SIGNED by the TENANT:</p>
            {data.signatureUrl ? (
              <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto mb-1" />
            ) : (
              <div className="border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px]">
                Signature
              </div>
            )}
            <p className="font-bold text-slate-900">{tenant.name}</p>
            <p className="text-[10px] text-slate-500">{tenant.idNumber} • Tel: {tenant.phone}</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-slate-100 flex justify-between text-[10px] text-slate-400 italic">
          <span>In the presence of: ________________________________ (Witness Signature)</span>
          <span>Tenancy Agreement • Certified Kenyan Draft</span>
        </div>
      </div>
    </div>
  );
};

export default Template;
