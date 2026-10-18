'use client';

import React from 'react';
import { StyleSettings } from '@/lib/types';
import './styles.css';

interface CVTemplateProps {
  data: Record<string, any>;
  styles?: Partial<StyleSettings>;
}

export const Template: React.FC<CVTemplateProps> = ({ data = {}, styles }) => {
  const variant = styles?.variant || 'modern';
  const skills = data.skills || {};
  const experience = Array.isArray(data.experience) ? data.experience : [];
  const education = Array.isArray(data.education) ? data.education : [];

  return (
    <div
      className="doc-cv bg-white text-slate-800 w-full min-h-full font-sans text-[12.5px] leading-relaxed flex flex-col justify-between"
      data-variant={variant}
    >
      <div>
        {/* Top Accent Strip */}
        {variant === 'bold' && <div className="h-2 w-full bg-[#0f766e] mb-6" />}
        {variant === 'classic' && <div className="h-2 w-full bg-[#0f2b48] mb-6" />}

        {/* Header Block */}
        <div className="pb-5 border-b border-slate-200">
          <div className="flex justify-between items-baseline flex-wrap gap-2">
            <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">
              {data.fullName || 'Full Name'}
            </h1>
            <p className="text-sm font-semibold text-blue-600 tracking-wide uppercase">
              {data.title || 'Professional Title'}
            </p>
          </div>

          {/* Contact Bar */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-2.5 text-xs text-slate-600">
            {data.email && (
              <span className="flex items-center gap-1">
                <span className="text-slate-400">✉</span> {data.email}
              </span>
            )}
            {data.phone && (
              <span className="flex items-center gap-1">
                <span className="text-slate-400">📞</span> {data.phone}
              </span>
            )}
            {data.location && (
              <span className="flex items-center gap-1">
                <span className="text-slate-400">📍</span> {data.location}
              </span>
            )}
            {data.website && (
              <span className="flex items-center gap-1 text-slate-700 font-mono text-[11px]">
                {data.website}
              </span>
            )}
          </div>
        </div>

        {/* Executive Summary */}
        {data.summary && (
          <div className="my-5">
            <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 mb-1.5">
              EXECUTIVE PROFILE
            </h2>
            <p className="text-xs text-slate-700 leading-relaxed pl-3 border-l-2 border-blue-600">
              {data.summary}
            </p>
          </div>
        )}

        {/* Main 2-Column Content */}
        <div className="grid grid-cols-12 gap-8 my-5">
          {/* Left Column: Work Experience (8 cols) */}
          <div className="col-span-8 space-y-5">
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-1.5 border-b border-slate-200 mb-3">
                PROFESSIONAL EXPERIENCE
              </h2>

              <div className="space-y-4">
                {experience.map((exp: any, idx: number) => (
                  <div key={idx} className="relative pl-3 border-l border-slate-200">
                    <div className="absolute -left-[5px] top-1.5 w-2 h-2 rounded-full bg-blue-600" />
                    <div className="flex justify-between items-baseline">
                      <h3 className="font-bold text-slate-900 text-xs">
                        {exp.role || 'Job Role'}
                      </h3>
                      <span className="text-[11px] font-mono text-slate-500 font-medium">
                        {exp.period}
                      </span>
                    </div>
                    <p className="text-xs font-medium text-slate-600 mb-1.5">
                      {exp.company}
                    </p>
                    {exp.highlights && (
                      <div className="text-[11.5px] text-slate-600 whitespace-pre-line leading-relaxed space-y-1">
                        {exp.highlights}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Skills & Education (4 cols) */}
          <div className="col-span-4 space-y-6">
            {/* Skills Block */}
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-1.5 border-b border-slate-200 mb-3">
                CORE COMPETENCIES
              </h2>
              <div className="space-y-3 text-xs">
                {skills.languages && (
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      Languages & Frameworks
                    </span>
                    <p className="text-slate-600 mt-0.5 text-[11.5px]">{skills.languages}</p>
                  </div>
                )}
                {skills.cloud && (
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      Cloud & Infrastructure
                    </span>
                    <p className="text-slate-600 mt-0.5 text-[11.5px]">{skills.cloud}</p>
                  </div>
                )}
                {skills.fintech && (
                  <div>
                    <span className="font-semibold text-slate-800 block text-[11px]">
                      Domain & APIs
                    </span>
                    <p className="text-slate-600 mt-0.5 text-[11.5px]">{skills.fintech}</p>
                  </div>
                )}
              </div>
            </div>

            {/* Education Block */}
            <div>
              <h2 className="text-[11px] font-bold uppercase tracking-widest text-slate-400 pb-1.5 border-b border-slate-200 mb-3">
                EDUCATION & CREDENTIALS
              </h2>
              <div className="space-y-3 text-xs">
                {education.map((edu: any, idx: number) => (
                  <div key={idx} className="space-y-0.5">
                    <p className="font-bold text-slate-800 text-[11.5px]">{edu.degree}</p>
                    <p className="text-slate-600 text-[11px]">{edu.institution}</p>
                    {edu.year && <p className="text-slate-400 font-mono text-[10px]">{edu.year}</p>}
                    {edu.details && <p className="text-slate-500 text-[11px] italic">{edu.details}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="pt-4 border-t border-slate-100 flex justify-between items-center text-[10px] text-slate-400">
        <span>References available upon request</span>
        <span>Curriculum Vitae — {data.fullName || 'Candidate'}</span>
      </div>
    </div>
  );
};

export default Template;
