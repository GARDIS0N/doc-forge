'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useEditorStore } from '@/store/editor';
import { TemplateMeta } from '@/lib/types';
import { BrandKitModal } from '@/components/brand/BrandKitModal';
import { StyleDrawer } from '@/components/editor/StyleDrawer';
import {
  ArrowLeft,
  RotateCcw,
  Undo2,
  Redo2,
  Palette,
  Building2,
  Sliders,
  Check,
  Loader2,
  FolderOpen,
} from 'lucide-react';

interface ToolbarProps {
  meta: TemplateMeta;
  sampleData: Record<string, any>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ meta, sampleData }) => {
  const {
    styles,
    saveStatus,
    updateStyle,
    resetToSample,
    undo,
    redo,
    historyIndex,
    history,
  } = useEditorStore();
  const [isBrandKitOpen, setIsBrandKitOpen] = useState(false);
  const [isStyleDrawerOpen, setIsStyleDrawerOpen] = useState(false);

  return (
    <>
      <header className="h-14 px-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between gap-4 shrink-0 z-20">
        {/* Left: Navigation, Title & Save Status */}
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-900 dark:text-zinc-400 dark:hover:text-zinc-100 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            title="Back to Templates"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-sm text-slate-900 dark:text-zinc-100">
                {meta.name}
              </span>
              <span className="text-[10px] bg-blue-50 dark:bg-blue-900/40 text-blue-700 dark:text-blue-300 font-semibold px-2 py-0.5 rounded-full">
                {meta.category}
              </span>

              {/* Autosave Status Pill */}
              <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-50 dark:bg-zinc-800 border border-slate-200/60 dark:border-zinc-700 text-[10px] font-medium text-slate-500 dark:text-zinc-400">
                {saveStatus === 'saving' && (
                  <>
                    <Loader2 className="w-3 h-3 text-blue-500 animate-spin" />
                    <span>Saving...</span>
                  </>
                )}
                {saveStatus === 'saved' && (
                  <>
                    <Check className="w-3 h-3 text-emerald-600" />
                    <span>Autosaved</span>
                  </>
                )}
                {saveStatus === 'unsaved' && (
                  <>
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
                    <span>Unsaved</span>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Center: Style & Brand Controls */}
        <div className="hidden md:flex items-center gap-2.5">
          {/* Variant Selector */}
          <div className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-zinc-700">
            <Palette className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span className="text-xs text-slate-500 dark:text-zinc-400 font-medium">Style:</span>
            <select
              value={styles.variant}
              onChange={(e) => updateStyle('variant', e.target.value)}
              className="text-xs bg-transparent text-slate-800 dark:text-zinc-200 font-medium focus:outline-hidden cursor-pointer"
            >
              {meta.variants.map((v) => (
                <option key={v.id} value={v.id} className="bg-white dark:bg-zinc-900">
                  {v.name}
                </option>
              ))}
            </select>
          </div>

          {/* Brand Kit Trigger */}
          <button
            onClick={() => setIsBrandKitOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-colors"
          >
            <Building2 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
            <span>Brand Kit</span>
          </button>

          {/* Style Controls Drawer Trigger */}
          <button
            onClick={() => setIsStyleDrawerOpen(true)}
            className="flex items-center gap-1.5 bg-slate-100 dark:bg-zinc-800 hover:bg-slate-200 dark:hover:bg-zinc-700 px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 text-xs font-semibold text-slate-700 dark:text-zinc-200 transition-colors"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-500 dark:text-zinc-400" />
            <span>Design Settings</span>
          </button>
        </div>

        {/* Right: History, Dashboard Link & Reset Actions */}
        <div className="flex items-center gap-1.5">
          <Link
            href="/dashboard"
            className="hidden sm:inline-flex items-center gap-1 text-xs text-slate-600 dark:text-zinc-300 hover:text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors mr-1 border border-transparent hover:border-slate-200 dark:hover:border-zinc-700 font-medium"
            title="My Saved Documents"
          >
            <FolderOpen className="w-3.5 h-3.5 text-blue-600" />
            <span>Dashboard</span>
          </Link>

          <button
            onClick={undo}
            disabled={historyIndex <= 0}
            title="Undo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            onClick={redo}
            disabled={historyIndex >= history.length - 1}
            title="Redo"
            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 disabled:opacity-30 disabled:pointer-events-none transition-colors"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <button
            onClick={() => resetToSample(sampleData)}
            title="Reset to sample values"
            className="inline-flex items-center gap-1 text-xs text-slate-500 hover:text-slate-800 dark:text-zinc-400 dark:hover:text-zinc-200 px-2 py-1.5 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors ml-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        </div>
      </header>

      {/* Brand Kit Modal */}
      <BrandKitModal
        isOpen={isBrandKitOpen}
        onClose={() => setIsBrandKitOpen(false)}
      />

      {/* Style Drawer */}
      <StyleDrawer
        isOpen={isStyleDrawerOpen}
        onClose={() => setIsStyleDrawerOpen(false)}
      />
    </>
  );
};

export default Toolbar;
