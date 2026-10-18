'use client';

import React from 'react';
import { formatDate } from '@/lib/format';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface CoverLetterProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<CoverLetterProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';

  return (
    <div
      className="doc-cl bg-white text-slate-800 w-full min-h-full font-sans text-xs leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Applicant Header */}
        <div className="pb-5 border-b border-slate-200">
          <h1 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {data.fullName || 'Full Name'}
          </h1>
          {data.title && (
            <p className="text-xs font-semibold text-blue-600 mt-0.5">
              {data.title}
            </p>
          )}

          <div className="flex flex-wrap gap-x-4 gap-y-1 mt-2 text-[11px] text-slate-500">
            {data.email && <span>{data.email}</span>}
            {data.phone && <span>{data.phone}</span>}
            {data.location && <span>{data.location}</span>}
          </div>
        </div>

        {/* Date */}
        <div className="my-5 text-slate-600 text-xs font-medium">
          {formatDate(data.date, 'long')}
        </div>

        {/* Employer Address */}
        <div className="mb-6 text-xs text-slate-800 space-y-0.5">
          {data.hiringManager && <p className="font-semibold text-slate-900">{data.hiringManager}</p>}
          <p className="font-bold text-slate-900">{data.companyName}</p>
          {data.companyAddress && <p className="text-slate-500 whitespace-pre-line">{data.companyAddress}</p>}
        </div>

        {/* RE: Subject */}
        {data.jobTitle && (
          <div className="mb-5 pb-1 border-b border-slate-200">
            <p className="font-bold text-slate-900 text-xs uppercase tracking-wide">
              RE: APPLICATION FOR {data.jobTitle}
            </p>
          </div>
        )}

        {/* Salutation */}
        <p className="font-bold text-slate-900 mb-4 text-xs">
          {data.salutation || 'Dear Hiring Manager,'}
        </p>

        {/* Letter Body */}
        <div className="text-slate-700 leading-relaxed space-y-4 whitespace-pre-line text-xs text-justify">
          {data.body}
        </div>
      </div>

      {/* Sign-off */}
      <div className="pt-8 border-t border-slate-100">
        <p className="text-slate-600 mb-6">Sincerely,</p>
        {data.signatureUrl ? (
          <img src={data.signatureUrl} alt="Signature" className="h-10 w-auto mb-1" />
        ) : (
          <div className="border-b border-slate-300 w-44 pb-1 mb-1 italic text-[11px] text-slate-400">
            Digital Signature
          </div>
        )}
        <p className="font-bold text-slate-900 text-sm">{data.fullName}</p>
        <p className="text-[11px] text-slate-500">{data.title}</p>
      </div>
    </div>
  );
};

export default Template;
