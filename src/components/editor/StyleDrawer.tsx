'use client';

import React from 'react';
import { useEditorStore } from '@/store/editor';
import { COLOR_THEMES, FONT_PAIRINGS } from '@/lib/themes';
import { Density, PaperSize, CurrencyCode } from '@/lib/types';
import { X, Palette, Sliders, Type, FileText } from 'lucide-react';

interface StyleDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export const StyleDrawer: React.FC<StyleDrawerProps> = ({ isOpen, onClose }) => {
  const { styles, updateStyle } = useEditorStore();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-80 bg-white dark:bg-zinc-900 shadow-2xl border-l border-slate-200 dark:border-zinc-800 flex flex-col animate-in slide-in-from-right duration-200">
      {/* Drawer Header */}
      <div className="px-5 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <Palette className="w-4 h-4 text-blue-600" />
          <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
            Document Styling
          </h2>
        </div>
        <button
          onClick={onClose}
          className="p-1 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Drawer Content */}
      <div className="flex-1 overflow-y-auto p-5 space-y-6 custom-scrollbar text-xs">
        {/* Color Palette */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-zinc-300">
              Color Theme
            </label>
            <span className="text-[10px] text-slate-400 font-mono">
              {styles.colorTheme || 'Default'}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-2">
            {COLOR_THEMES.map((theme) => {
              const isSelected = styles.colorTheme === theme.id;
              return (
                <button
                  key={theme.id}
                  onClick={() => updateStyle('colorTheme', theme.id)}
                  className={`p-2.5 rounded-xl border text-left flex items-center gap-2 transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30 shadow-2xs'
                      : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300 dark:hover:border-zinc-700'
                  }`}
                >
                  <span
                    className="w-4 h-4 rounded-full shrink-0 shadow-2xs border border-white"
                    style={{ backgroundColor: theme.primary }}
                  />
                  <span className="font-medium text-slate-800 dark:text-zinc-200 truncate text-[11.5px]">
                    {theme.name}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Font Pairing */}
        <div className="space-y-3 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <Type className="w-3.5 h-3.5 text-slate-400" />
              <span>Typography Pairing</span>
            </label>
          </div>

          <div className="space-y-2">
            {FONT_PAIRINGS.map((font) => {
              const isSelected = (styles.fontPair || 'modern') === font.id;
              return (
                <button
                  key={font.id}
                  onClick={() => updateStyle('fontPair', font.id)}
                  className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                    isSelected
                      ? 'border-blue-600 bg-blue-50/50 dark:bg-blue-950/30'
                      : 'border-slate-200 dark:border-zinc-800 hover:border-slate-300'
                  }`}
                >
                  <div className="flex justify-between items-center">
                    <span className="font-semibold text-slate-900 dark:text-zinc-100">
                      {font.name}
                    </span>
                    {isSelected && (
                      <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
                    )}
                  </div>
                  <p className="text-[10.5px] text-slate-400 mt-0.5 line-clamp-1">
                    {font.description}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Paper & Margins */}
        <div className="space-y-4 pt-3 border-t border-slate-100 dark:border-zinc-800">
          <div className="flex items-center justify-between">
            <label className="font-bold uppercase tracking-wider text-[11px] text-slate-700 dark:text-zinc-300 flex items-center gap-1.5">
              <FileText className="w-3.5 h-3.5 text-slate-400" />
              <span>Paper & Density</span>
            </label>
          </div>

          {/* Paper Size */}
          <div className="space-y-1">
            <label className="text-slate-500 font-medium text-[11px]">Paper Standard</label>
            <div className="grid grid-cols-2 gap-2">
              {(['A4', 'Letter'] as PaperSize[]).map((size) => (
                <button
                  key={size}
                  onClick={() => updateStyle('paperSize', size)}
                  className={`py-1.5 px-3 rounded-lg border font-medium text-center transition-all ${
                    styles.paperSize === size
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>

          {/* Margins */}
          <div className="space-y-1">
            <label className="text-slate-500 font-medium text-[11px]">Margins</label>
            <div className="grid grid-cols-3 gap-1.5">
              {(['compact', 'normal', 'spacious'] as const).map((m) => (
                <button
                  key={m}
                  onClick={() => updateStyle('marginSize', m)}
                  className={`py-1.5 px-2 rounded-lg border font-medium text-center capitalize transition-all ${
                    styles.marginSize === m
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>
          </div>

          {/* Density */}
          <div className="space-y-1">
            <label className="text-slate-500 font-medium text-[11px]">Content Density</label>
            <div className="grid grid-cols-2 gap-2">
              {(['comfortable', 'compact'] as Density[]).map((d) => (
                <button
                  key={d}
                  onClick={() => updateStyle('density', d)}
                  className={`py-1.5 px-3 rounded-lg border font-medium text-center capitalize transition-all ${
                    styles.density === d
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
          </div>

          {/* Currency */}
          <div className="space-y-1">
            <label className="text-slate-500 font-medium text-[11px]">Default Currency</label>
            <div className="grid grid-cols-4 gap-1.5">
              {(['KES', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((cur) => (
                <button
                  key={cur}
                  onClick={() => updateStyle('currency', cur)}
                  className={`py-1.5 px-2 rounded-lg border font-mono font-medium text-center transition-all ${
                    styles.currency === cur
                      ? 'border-blue-600 bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300'
                      : 'border-slate-200 dark:border-zinc-800 text-slate-600 dark:text-zinc-400'
                  }`}
                >
                  {cur}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StyleDrawer;
