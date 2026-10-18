'use client';

import React, { useEffect, useState, Suspense, useRef } from 'react';
import { useParams, useSearchParams, notFound } from 'next/navigation';
import { getTemplate } from '@/lib/registry';
import { useEditorStore } from '@/store/editor';
import { getDocumentById, saveDocument } from '@/lib/documents-repo';
import { Toolbar } from '@/components/editor/Toolbar';
import { FormPanel } from '@/components/editor/FormPanel';
import { PreviewPane } from '@/components/editor/PreviewPane';
import { Edit3, Eye, Loader2 } from 'lucide-react';

function EditorContent() {
  const params = useParams();
  const searchParams = useSearchParams();
  const slug = (params?.slug as string) || '';
  const docIdParam = searchParams?.get('docId') || undefined;

  const template = getTemplate(slug);
  const [mobileTab, setMobileTab] = useState<'form' | 'preview'>('form');
  const [isInitializing, setIsInitializing] = useState(true);

  const {
    data,
    styles,
    docId,
    saveStatus,
    initDoc,
    setDocId,
    setSaveStatus,
  } = useEditorStore();

  const isInitialMount = useRef(true);

  // Initialize document (either from existing saved doc or template defaults)
  useEffect(() => {
    let isMounted = true;
    async function load() {
      if (!template) return;

      if (docIdParam) {
        const saved = await getDocumentById(docIdParam);
        if (saved && isMounted) {
          initDoc(slug, saved.data, saved.styles, saved.id);
          setIsInitializing(false);
          return;
        }
      }

      // Default initialization
      if (isMounted) {
        initDoc(
          slug,
          template.sampleData,
          {
            variant: template.meta.variants[0]?.id || 'modern',
            paperSize: template.meta.paper || 'A4',
          },
          undefined
        );
        setIsInitializing(false);
      }
    }

    load();
    return () => {
      isMounted = false;
    };
  }, [slug, template, docIdParam, initDoc]);

  // Debounced Autosave (triggers 1200ms after user mutation)
  useEffect(() => {
    if (isInitialMount.current || isInitializing || saveStatus !== 'unsaved') {
      isInitialMount.current = false;
      return;
    }

    const timer = setTimeout(async () => {
      setSaveStatus('saving');
      try {
        let computedTotal = 0;
        if (template?.schema?.computed) {
          const comp = template.schema.computed(data);
          if (typeof comp.grandTotal === 'number') {
            computedTotal = comp.grandTotal;
          }
        }

        const saved = await saveDocument({
          id: docId,
          templateSlug: slug,
          title: data.docNumber ? `${template?.meta.name} (${data.docNumber})` : data.fullName || template?.meta.name || 'Untitled Document',
          docNumber: data.docNumber,
          data,
          styles,
          grandTotal: computedTotal,
          currency: data.currency || styles.currency || 'KES',
        });

        if (!docId && saved.id) {
          setDocId(saved.id);
        }
        setSaveStatus('saved');
      } catch (err) {
        console.error('Autosave error:', err);
        setSaveStatus('unsaved');
      }
    }, 1200);

    return () => clearTimeout(timer);
  }, [data, styles, saveStatus, docId, slug, template, isInitializing, setDocId, setSaveStatus]);

  if (!template) {
    return notFound();
  }

  const { meta, schema, sampleData, Component } = template;

  if (isInitializing) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-xs font-medium">Loading document...</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-zinc-950">
      {/* Top Controls Toolbar */}
      <Toolbar meta={meta} sampleData={sampleData} />

      {/* Mobile Tab Switcher */}
      <div className="flex md:hidden border-b border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 px-4 py-2 gap-2">
        <button
          onClick={() => setMobileTab('form')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'form'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Edit3 className="w-3.5 h-3.5" />
          <span>Edit Form</span>
        </button>
        <button
          onClick={() => setMobileTab('preview')}
          className={`flex-1 py-1.5 text-xs font-semibold rounded-lg flex items-center justify-center gap-1.5 transition-colors ${
            mobileTab === 'preview'
              ? 'bg-blue-600 text-white shadow-2xs'
              : 'text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800'
          }`}
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Live Preview</span>
        </button>
      </div>

      {/* Main Split Screen Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Column: Form Panel */}
        <div
          className={`w-full md:w-[480px] lg:w-[540px] shrink-0 border-r border-slate-200 dark:border-zinc-800 h-full overflow-hidden ${
            mobileTab === 'form' ? 'block' : 'hidden md:block'
          }`}
        >
          <FormPanel schema={schema} />
        </div>

        {/* Right Column: Live A4 Preview Pane */}
        <div
          className={`flex-1 h-full overflow-hidden ${
            mobileTab === 'preview' ? 'block' : 'hidden md:block'
          }`}
        >
          <PreviewPane Component={Component} title={meta.name} />
        </div>
      </div>
    </div>
  );
}

export default function EditorPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-xs font-medium">Loading DocForge Editor...</p>
        </div>
      }
    >
      <EditorContent />
    </Suspense>
  );
}
