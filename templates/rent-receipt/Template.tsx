'use client';

import React from 'react';
import { formatCurrency, formatDate, numberToWords } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface RentReceiptProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<RentReceiptProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const currency = data.currency || styles?.currency || 'KES';
  const rent = Number(data.rentAmount) || 0;
  const sc = Number(data.serviceCharge) || 0;
  const balance = Number(data.balanceCarriedForward) || 0;
  const total = rent + sc;
  const totalInWords = numberToWords(total, currency);
  const landlord = data.landlord || {};
  const tenant = data.tenant || {};

  return (
    <div
      className="doc-rent-rec bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header */}
        <div className="border-b-2 border-slate-900 pb-5 flex justify-between items-start">
          <div>
            <h1 className="text-xl font-bold text-slate-900">{landlord.name || 'Landlord / Estate Manager'}</h1>
            <p className="text-slate-500 mt-0.5">{landlord.phone}</p>
            <p className="text-slate-500">{data.propertyAddress}</p>
          </div>
          <div className="text-right">
            <span className="text-xs uppercase font-extrabold tracking-widest text-blue-700 block">
              HOUSE RENT RECEIPT
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 mt-0.5 block">
              {data.docNumber || 'RR-2026-0001'}
            </span>
            <p className="mt-2 text-slate-600">Date: <strong className="text-slate-800">{formatDate(data.date)}</strong></p>
            {data.mpesaCode && (
              <p className="mt-1">
                Ref: <span className="font-mono font-bold text-emerald-800 bg-emerald-50 px-1 py-0.5 rounded border border-emerald-200">{data.mpesaCode}</span>
              </p>
            )}
          </div>
        </div>

        {/* Big Total Banner */}
        <div className="my-6 p-4 rounded-xl bg-blue-50/70 border border-blue-200 flex justify-between items-center">
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-700 block">
              TOTAL RENT & CHARGES PAID
            </span>
            <p className="text-2xl font-black font-mono text-blue-950 mt-0.5">
              {formatCurrency(total, currency)}
            </p>
          </div>
          <div className="text-right">
            <span className="text-xs text-blue-900 font-bold bg-white px-3 py-1 rounded-full border border-blue-200 shadow-2xs">
              Period: {data.monthPaidFor}
            </span>
          </div>
        </div>

        {/* Ledger Details */}
        <div className="space-y-4 my-6 text-xs">
          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              TENANT NAME:
            </span>
            <span className="col-span-8 font-bold text-slate-900 text-sm">
              {tenant.name}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              PREMISES OCCUPIED:
            </span>
            <span className="col-span-8 text-slate-800 font-medium">
              {data.propertyAddress}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              FOR THE MONTH OF:
            </span>
            <span className="col-span-8 font-bold text-blue-700">
              {data.monthPaidFor}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              AMOUNT IN WORDS:
            </span>
            <span className="col-span-8 italic text-slate-700">
              {totalInWords}
            </span>
          </div>

          <div className="grid grid-cols-12 gap-4 pb-3 border-b border-slate-200">
            <span className="col-span-4 font-bold text-slate-500 uppercase tracking-wider text-[11px]">
              PAYMENT BREAKDOWN:
            </span>
            <div className="col-span-8 space-y-1 font-mono">
              <div className="flex justify-between">
                <span className="text-slate-600 font-sans">Monthly Rent:</span>
                <span>{formatCurrency(rent, currency)}</span>
              </div>
              {sc > 0 && (
                <div className="flex justify-between">
                  <span className="text-slate-600 font-sans">Water & Service Charge:</span>
                  <span>{formatCurrency(sc, currency)}</span>
                </div>
              )}
              {balance > 0 && (
                <div className="flex justify-between text-amber-700 font-bold pt-1 border-t border-slate-200">
                  <span className="font-sans">Arrears Balance Remaining:</span>
                  <span>{formatCurrency(balance, currency)}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Signature */}
      <div className="pt-8 border-t border-slate-200 flex justify-between items-end">
        <p className="text-[11px] text-slate-400">
          Valid official rent receipt. Keep for tax declarations and tenancy records.
        </p>
        <div className="text-right">
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
          ) : (
            <div className="border-b border-slate-400 w-44 pb-1 mb-1 text-center italic text-[11px] text-slate-400">
              Landlord Signature
            </div>
          )}
          <p className="font-bold text-slate-800 text-[11px]">{landlord.name}</p>
          <p className="text-[10px] text-slate-400">Landlord / Authorized Agent</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
