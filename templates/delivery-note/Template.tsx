'use client';

import React from 'react';
import { formatDate } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface DeliveryNoteProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<DeliveryNoteProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const sender = data.sender || {};
  const recipient = data.recipient || {};
  const items = Array.isArray(data.items) ? data.items : [];

  return (
    <div
      className="doc-delivery bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header */}
        <div className="flex justify-between items-start gap-8 pb-6 border-b border-slate-200">
          <div className="max-w-[60%]">
            {sender.logoUrl && (
              <img src={sender.logoUrl} alt="Logo" className="h-10 w-auto mb-2 rounded" />
            )}
            <h1 className="text-xl font-bold text-slate-900">{sender.businessName || 'Dispatching Co.'}</h1>
            <p className="text-slate-500 mt-1 whitespace-pre-line">{sender.address}</p>
            <div className="flex gap-4 mt-1 text-slate-500">
              {sender.phone && <span>Tel: {sender.phone}</span>}
              {sender.email && <span>Email: {sender.email}</span>}
            </div>
          </div>

          <div className="text-right">
            <span className="text-xs uppercase font-extrabold tracking-widest text-emerald-700 block">
              DELIVERY NOTE
            </span>
            <span className="text-lg font-mono font-bold text-slate-900 mt-0.5 block">
              {data.docNumber || 'DN-2026-0001'}
            </span>
            <div className="mt-3 space-y-1 text-slate-600">
              <p>Delivery Date: <strong className="text-slate-800">{formatDate(data.date)}</strong></p>
              {data.orderRef && <p>LPO / Order Ref: <strong className="font-mono text-slate-800">{data.orderRef}</strong></p>}
              {data.vehicleReg && <p className="text-[11px] text-slate-500">Vehicle: {data.vehicleReg}</p>}
            </div>
          </div>
        </div>

        {/* Consignee Address */}
        <div className="my-6 p-4 rounded-xl border border-emerald-200 bg-emerald-50/40">
          <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800 block mb-1">
            DELIVER TO (CONSIGNEE):
          </span>
          <p className="font-bold text-slate-900 text-sm">{recipient.name}</p>
          <p className="text-slate-600 whitespace-pre-line mt-0.5">{recipient.address}</p>
          {recipient.phone && <p className="text-slate-500 text-[11px] mt-1">Recipient Phone: {recipient.phone}</p>}
        </div>

        {/* Dispatched Packages Table */}
        <div className="doc-table-wrapper my-6">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600">
                <th className="py-2.5 px-3 w-12 text-center">#</th>
                <th className="py-2.5 px-3">Item Description & Serial / Batch</th>
                <th className="py-2.5 px-3 w-24 text-center">Ordered</th>
                <th className="py-2.5 px-3 w-24 text-center">Delivered</th>
                <th className="py-2.5 px-3 w-48">Condition & Remarks</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {items.map((item: any, idx: number) => (
                <tr key={idx} className="hover:bg-slate-50/40">
                  <td className="py-3 px-3 text-center text-slate-400 font-mono">{idx + 1}</td>
                  <td className="py-3 px-3 font-medium text-slate-800">{item.description}</td>
                  <td className="py-3 px-3 text-center font-mono text-slate-600">{item.orderedQty}</td>
                  <td className="py-3 px-3 text-center font-mono font-bold text-emerald-800 bg-emerald-50/50">
                    {item.deliveredQty}
                  </td>
                  <td className="py-3 px-3 text-slate-600 text-[11px]">{item.remarks}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Declaration Statement */}
        {data.declaration && (
          <div className="my-6 p-3.5 rounded-xl border border-slate-200 bg-slate-50 text-[11px] text-slate-600">
            <span className="font-bold text-slate-800 uppercase tracking-wider text-[10px] block mb-1">
              RECIPIENT ACKNOWLEDGEMENT STATEMENT
            </span>
            <p>{data.declaration}</p>
          </div>
        )}
      </div>

      {/* 2-Way Sign-off: Driver and Receiver */}
      <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">
            DISPATCHED & DELIVERED BY:
          </p>
          <div className="border-b border-slate-400 pb-1 mb-1 italic text-[11px] text-slate-500">
            Driver / Courier Signature
          </div>
          <p className="font-bold text-slate-800 text-[11px]">{data.vehicleReg || 'Driver / Dispatch Officer'}</p>
          <p className="text-[10px] text-slate-400">Date: {formatDate(data.date)}</p>
        </div>

        <div className="text-right">
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mb-6">
            RECEIVED IN GOOD ORDER BY:
          </p>
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
          ) : (
            <div className="border-b border-slate-400 pb-1 mb-1 italic text-[11px] text-slate-500">
              Recipient Signature & Official Stamp
            </div>
          )}
          <p className="font-bold text-slate-800 text-[11px]">{data.receivedByPerson || 'Authorized Stores Officer'}</p>
          <p className="text-[10px] text-slate-400">For {recipient.name || 'Consignee'}</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
