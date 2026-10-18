'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { allTemplates, RegisteredTemplate } from '@/lib/registry';
import { DocPage } from '@/components/doc/DocPage';
import { Search, Sparkles, Eye, ArrowRight, X, FileText, CheckCircle2 } from 'lucide-react';

export default function TemplateGalleryPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [previewingTemplate, setPreviewingTemplate] = useState<RegisteredTemplate | null>(null);

  const categories = ['All', 'Business', 'Property / Legal', 'Career / Education', 'Other'];

  const filteredTemplates = useMemo(() => {
    return allTemplates.filter((t) => {
      const matchesCategory =
        selectedCategory === 'All' || t.meta.category === selectedCategory;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        t.meta.name.toLowerCase().includes(q) ||
        t.meta.description.toLowerCase().includes(q) ||
        t.meta.tags.some((tag) => tag.toLowerCase().includes(q));
      return matchesCategory && matchesSearch;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100">
      {/* Top Header */}
      <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/80 dark:bg-zinc-900/80 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <div>
              <span className="font-extrabold text-base tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
                DocForge
              </span>
              <span className="text-[10px] text-blue-600 dark:text-blue-400 font-mono font-semibold ml-1.5 uppercase tracking-wider">
                Studio
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              My Documents
            </Link>
          </div>
        </div>
      </header>

      {/* Hero & Search Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-10 pb-8">
        <div className="max-w-2xl">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-3 border border-blue-200/60 dark:border-blue-800/60">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Designer-Grade Document Architecture</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Choose a Template
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-zinc-400 leading-relaxed">
            Pick a meticulously designed template, customize it in real-time with guided calculations and Kenyan localizations, and export pixel-perfect PDFs.
          </p>
        </div>

        {/* Search & Filter Controls */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-stretch md:items-center justify-between">
          {/* Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 custom-scrollbar">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  selectedCategory === cat
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search templates, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredTemplates.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredTemplates.map((item) => {
              const { meta, sampleData, Component } = item;
              return (
                <div
                  key={meta.slug}
                  className="group bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 hover:border-blue-500/50 dark:hover:border-blue-500/50 hover:shadow-xl dark:hover:shadow-blue-500/5 transition-all flex flex-col overflow-hidden"
                >
                  {/* Thumbnail Container (Scaled interactive live preview) */}
                  <div className="relative h-64 bg-slate-100 dark:bg-zinc-950/60 overflow-hidden border-b border-slate-100 dark:border-zinc-800 flex items-start justify-center pt-4">
                    {/* Scaled-down live preview */}
                    <div
                      className="origin-top pointer-events-none transition-transform duration-300 group-hover:scale-[0.29] scale-[0.27]"
                      style={{ width: '210mm' }}
                    >
                      <DocPage paperSize="A4" density="compact" marginSize="compact">
                        <Component data={sampleData} styles={{ variant: meta.variants[0]?.id || 'modern' }} />
                      </DocPage>
                    </div>

                    {/* Gradient overlay to prevent clipping visual artifacts */}
                    <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-white dark:from-zinc-900 to-transparent pointer-events-none" />

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-1.5 z-10">
                      {meta.badges?.map((badge) => (
                        <span
                          key={badge}
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                            badge === 'Popular'
                              ? 'bg-amber-500 text-white shadow-xs'
                              : 'bg-emerald-500 text-white shadow-xs'
                          }`}
                        >
                          {badge}
                        </span>
                      ))}
                    </div>

                    {/* Quick Preview Hover Overlay */}
                    <div className="absolute inset-0 bg-slate-900/20 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                      <button
                        onClick={() => setPreviewingTemplate(item)}
                        className="px-3.5 py-1.5 rounded-lg bg-white/95 text-slate-800 font-semibold text-xs shadow-lg hover:bg-white flex items-center gap-1.5 transition-transform hover:scale-105"
                      >
                        <Eye className="w-3.5 h-3.5" />
                        <span>Quick Preview</span>
                      </button>
                    </div>
                  </div>

                  {/* Card Content */}
                  <div className="p-5 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between text-xs text-slate-400 dark:text-zinc-500 mb-1">
                        <span className="font-semibold text-blue-600 dark:text-blue-400">
                          {meta.category}
                        </span>
                        <span className="font-mono text-[11px]">{meta.variants.length} styles</span>
                      </div>

                      <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100 group-hover:text-blue-600 transition-colors">
                        {meta.name}
                      </h3>

                      <p className="mt-1 text-xs text-slate-500 dark:text-zinc-400 line-clamp-2 leading-relaxed">
                        {meta.description}
                      </p>

                      {/* Tags */}
                      <div className="flex flex-wrap gap-1 mt-3">
                        {meta.tags.map((tag) => (
                          <span
                            key={tag}
                            className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-400 px-2 py-0.5 rounded font-medium"
                          >
                            #{tag}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="mt-5 pt-4 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between">
                      <button
                        onClick={() => setPreviewingTemplate(item)}
                        className="text-xs font-semibold text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-zinc-100 transition-colors"
                      >
                        Preview
                      </button>

                      <Link
                        href={`/editor/${meta.slug}`}
                        className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all group-hover:gap-2"
                      >
                        <span>Use Template</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 p-8">
            <FileText className="w-12 h-12 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
            <h3 className="text-base font-bold text-slate-800 dark:text-zinc-200">
              No templates found
            </h3>
            <p className="text-xs text-slate-500 dark:text-zinc-400 mt-1">
              Try adjusting your search query or switching category filters.
            </p>
          </div>
        )}
      </main>

      {/* Preview Modal */}
      {previewingTemplate && (
        <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-100 dark:bg-zinc-900 rounded-2xl w-full max-w-4xl h-[90vh] flex flex-col shadow-2xl overflow-hidden border border-slate-200 dark:border-zinc-800">
            {/* Modal Header */}
            <div className="px-5 py-3.5 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="font-bold text-sm text-slate-900 dark:text-white">
                  {previewingTemplate.meta.name}
                </span>
                <span className="text-[11px] bg-slate-100 dark:bg-zinc-800 text-slate-600 dark:text-zinc-300 px-2 py-0.5 rounded-full font-medium">
                  {previewingTemplate.meta.category}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <Link
                  href={`/editor/${previewingTemplate.meta.slug}`}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold px-3.5 py-1.5 rounded-lg shadow-sm flex items-center gap-1.5 transition-colors"
                >
                  <span>Customize in Editor</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
                <button
                  onClick={() => setPreviewingTemplate(null)}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Scrollable A4 Document */}
            <div className="flex-1 overflow-auto p-6 sm:p-10 flex justify-center items-start custom-scrollbar">
              <div className="scale-[0.85] origin-top">
                <DocPage paperSize="A4">
                  <previewingTemplate.Component
                    data={previewingTemplate.sampleData}
                    styles={{ variant: previewingTemplate.meta.variants[0]?.id || 'modern' }}
                  />
                </DocPage>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
