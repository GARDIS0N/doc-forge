'use client';

import React from 'react';
import { formatDate } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface MeetingMinutesProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<MeetingMinutesProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const actions = Array.isArray(data.actions) ? data.actions : [];

  return (
    <div
      className="doc-minutes bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Header */}
        <div className="pb-5 border-b-2 border-slate-900 mb-6">
          <div className="flex justify-between items-baseline">
            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">
              MINUTES OF PROCEEDINGS
            </span>
            <span className="font-mono text-xs text-slate-400">
              {data.docNumber || 'MIN-2026-01'}
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight mt-1">
            {data.meetingTitle || 'Meeting Minutes'}
          </h1>

          <div className="grid grid-cols-2 gap-4 mt-3 pt-3 border-t border-slate-100 text-[11px] text-slate-600">
            <div>
              <p>Date: <strong className="text-slate-800">{formatDate(data.date, 'long')}</strong></p>
              <p>Venue: {data.timeLocation}</p>
            </div>
            <div className="text-right">
              <p>Chairperson: <strong className="text-slate-800">{data.chairperson}</strong></p>
              <p>Secretary: {data.secretary}</p>
            </div>
          </div>
        </div>

        {/* Attendees & Apologies Box */}
        <div className="p-3.5 rounded-xl bg-slate-50 border border-slate-200 mb-6 space-y-2 text-xs">
          <div>
            <span className="font-bold text-slate-900 text-[11px] uppercase tracking-wider block">
              ATTENDANCE:
            </span>
            <p className="text-slate-700 leading-normal mt-0.5">{data.attendees}</p>
          </div>

          {data.apologies && (
            <div className="pt-2 border-t border-slate-200">
              <span className="font-semibold text-slate-500 text-[11px]">Apologies with leave: </span>
              <span className="text-slate-600 italic">{data.apologies}</span>
            </div>
          )}
        </div>

        {/* Agenda */}
        {data.agendaSummary && (
          <div className="mb-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200 mb-2">
              MEETING AGENDA
            </h2>
            <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed pl-3 border-l-2 border-blue-600">
              {data.agendaSummary}
            </div>
          </div>
        )}

        {/* Deliberations & Resolutions */}
        <div className="mb-6">
          <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200 mb-3">
            DELIBERATIONS & BOARD RESOLUTIONS
          </h2>
          <div className="text-xs text-slate-700 whitespace-pre-line leading-relaxed space-y-3 text-justify">
            {data.deliberations}
          </div>
        </div>

        {/* Action Items Matrix Table */}
        {actions.length > 0 && (
          <div className="my-6">
            <h2 className="text-[11px] font-bold uppercase tracking-wider text-slate-400 pb-1 border-b border-slate-200 mb-3">
              ACTION ITEMS & RESPONSIBILITY MATRIX
            </h2>
            <div className="doc-table-wrapper">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b-2 border-slate-800 text-[11px] font-bold uppercase tracking-wider text-slate-600 bg-slate-50">
                    <th className="py-2.5 px-3">Action Item / Task</th>
                    <th className="py-2.5 px-3 w-36">Owner</th>
                    <th className="py-2.5 px-3 w-28">Deadline</th>
                    <th className="py-2.5 px-3 w-28 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 text-xs">
                  {actions.map((act: any, idx: number) => (
                    <tr key={idx} className="hover:bg-slate-50/40">
                      <td className="py-2.5 px-3 font-medium text-slate-800">{act.action}</td>
                      <td className="py-2.5 px-3 text-slate-600">{act.owner}</td>
                      <td className="py-2.5 px-3 font-mono text-slate-500 text-[11px]">{act.deadline}</td>
                      <td className="py-2.5 px-3 text-center">
                        <span className="inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                          {act.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Sign-off by Chair and Secretary */}
      <div className="pt-6 border-t border-slate-200 grid grid-cols-2 gap-10 text-xs">
        <div>
          <div className="border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px]">
            Secretary Signature
          </div>
          <p className="font-bold text-slate-800">{data.secretary || 'Secretary'}</p>
          <p className="text-[10px] text-slate-400">Minutes Recorded & Prepared</p>
        </div>

        <div className="text-right">
          {data.signatureUrl ? (
            <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto ml-auto mb-1" />
          ) : (
            <div className="border-b border-slate-400 pb-1 mb-1 italic text-slate-400 text-[11px]">
              Chairperson Signature
            </div>
          )}
          <p className="font-bold text-slate-800">{data.chairperson || 'Chairperson'}</p>
          <p className="text-[10px] text-slate-400">Confirmed as True Record</p>
        </div>
      </div>
    </div>
  );
};

export default Template;
