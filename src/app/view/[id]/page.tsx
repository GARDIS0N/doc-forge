'use client';

import React, { useEffect, useState, useRef, Suspense } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getDocumentById } from '@/lib/documents-repo';
import { getTemplate } from '@/lib/registry';
import { SavedDocument } from '@/lib/types';
import { DocPage } from '@/components/doc/DocPage';
import {
  FileText,
  Download,
  Share2,
  Printer,
  Edit3,
  Check,
  Loader2,
  FileSpreadsheet,
} from 'lucide-react';

function ViewDocumentContent() {
  const params = useParams();
  const id = (params?.id as string) || '';

  const [docRecord, setDocRecord] = useState<SavedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      if (id) {
        const doc = await getDocumentById(id);
        setDocRecord(doc);
      }
      setIsLoading(false);
    }
    load();
  }, [id]);

  if (isLoading) {
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-500">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
        <p className="text-xs font-medium">Loading shareable document...</p>
      </div>
    );
  }

  if (!docRecord) {
    return notFound();
  }

  const template = getTemplate(docRecord.templateSlug);
  if (!template) {
    return notFound();
  }

  const { Component } = template;

  const handleCopyLink = () => {
    if (typeof window !== 'undefined') {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);
      if (!documentRef.current) return;

      const htmlContent = documentRef.current.innerHTML;
      const res = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: docRecord.templateSlug,
          html: htmlContent,
          paperSize: docRecord.styles.paperSize || 'A4',
          docNumber: docRecord.docNumber || 'document',
          styles: docRecord.styles,
        }),
      });

      if (!res.ok) throw new Error('PDF Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${docRecord.docNumber || 'document'}.pdf`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert('Could not export PDF');
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const res = await fetch('/api/export/docx', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          slug: docRecord.templateSlug,
          data: docRecord.data,
          styles: docRecord.styles,
        }),
      });

      if (!res.ok) throw new Error('DOCX Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement('a');
      a.href = url;
      a.download = `${docRecord.docNumber || 'document'}.docx`;
      window.document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      window.document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert('Could not export DOCX');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex flex-col">
      {/* Top Floating Control Bar */}
      <header className="sticky top-0 z-30 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-8 py-3 flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-3">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <FileText className="w-4 h-4" />
            </div>
            <span className="font-extrabold text-sm text-slate-900 dark:text-white">
              DocForge
            </span>
          </Link>
          <span className="text-slate-300 dark:text-zinc-700">|</span>
          <span className="text-xs font-semibold text-slate-700 dark:text-zinc-300 truncate max-w-xs sm:max-w-md">
            {docRecord.title}
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 font-mono px-2 py-0.5 rounded-full uppercase">
            {docRecord.status}
          </span>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Link Copied!</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Share Link</span>
              </>
            )}
          </button>

          <button
            onClick={() => window.print()}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors shadow-2xs"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print</span>
          </button>

          <button
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors shadow-2xs"
          >
            <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
            <span>Export DOCX</span>
          </button>

          <button
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span>{isExportingPdf ? 'Exporting...' : 'Download PDF'}</span>
          </button>

          <Link
            href={`/editor/${docRecord.templateSlug}?docId=${docRecord.id}`}
            className="p-1.5 text-slate-500 hover:text-blue-600 rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800 ml-1 transition-colors"
            title="Edit Document in Studio"
          >
            <Edit3 className="w-4 h-4" />
          </Link>
        </div>
      </header>

      {/* Main Document Viewer Sheet */}
      <main className="flex-1 py-10 px-4 flex justify-center items-start overflow-auto">
        <div ref={documentRef} className="origin-top">
          <DocPage
            paperSize={docRecord.styles.paperSize}
            marginSize={docRecord.styles.marginSize}
            density={docRecord.styles.density}
            colorTheme={docRecord.styles.colorTheme}
            fontPair={docRecord.styles.fontPair}
          >
            <Component data={docRecord.data} styles={docRecord.styles} />
          </DocPage>
        </div>
      </main>
    </div>
  );
}

export default function ViewDocumentPage() {
  return (
    <Suspense
      fallback={
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-500">
          <Loader2 className="w-8 h-8 animate-spin text-blue-600 mb-2" />
          <p className="text-xs font-medium">Loading document viewer...</p>
        </div>
      }
    >
      <ViewDocumentContent />
    </Suspense>
  );
}
