'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useParams, notFound } from 'next/navigation';
import Link from 'next/link';
import { getDocumentById } from '@/lib/documents-repo';
import { getTemplate } from '@/lib/registry';
import { SavedDocument } from '@/lib/types';
import { DocPage } from '@/components/doc/DocPage';
import { generateDocxBlob } from '@/lib/docx-generator';
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

export function ViewClient({ id: propId }: { id?: string }) {
  const params = useParams();
  const id = propId || (params?.id as string) || '';

  const [docRecord, setDocRecord] = useState<SavedDocument | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [copied, setCopied] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const documentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function load() {
      if (id && id !== 'sample') {
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
    return (
      <div className="h-screen w-screen flex flex-col items-center justify-center bg-slate-50 dark:bg-zinc-950 text-slate-700 dark:text-zinc-300 p-6 text-center">
        <FileText className="w-12 h-12 text-slate-400 mb-3" />
        <h2 className="text-lg font-bold mb-1">Document Not Found</h2>
        <p className="text-xs text-slate-500 max-w-sm mb-4">
          This document may have been deleted, or it was created in another browser session.
        </p>
        <Link
          href="/templates"
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-lg"
        >
          Explore Templates
        </Link>
      </div>
    );
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

      let exported = false;
      try {
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

        if (res.ok) {
          const blob = await res.blob();
          const url = window.URL.createObjectURL(blob);
          const a = window.document.createElement('a');
          a.href = url;
          a.download = `${docRecord.docNumber || 'document'}.pdf`;
          window.document.body.appendChild(a);
          a.click();
          window.URL.revokeObjectURL(url);
          window.document.body.removeChild(a);
          exported = true;
        }
      } catch {
        // Fallback to client print
      }

      if (!exported) {
        window.print();
      }
    } catch (e) {
      console.error(e);
      window.print();
    } finally {
      setIsExportingPdf(false);
    }
  };

  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      const blob = await generateDocxBlob(
        docRecord.templateSlug,
        docRecord.data,
        docRecord.styles
      );
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
      alert('Could not export DOCX document');
    } finally {
      setIsExportingDocx(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-zinc-950 flex flex-col">
      {/* Top Read-Only Bar */}
      <header className="h-14 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 px-4 sm:px-6 flex items-center justify-between sticky top-0 z-20 shadow-2xs no-print">
        <div className="flex items-center gap-3">
          <Link
            href="/templates"
            className="flex items-center gap-2 text-slate-800 dark:text-zinc-100 font-bold text-sm tracking-tight hover:opacity-85"
          >
            <div className="w-6 h-6 rounded-md bg-blue-600 flex items-center justify-center text-white font-black text-xs">
              D
            </div>
            <span>DocForge</span>
          </Link>
          <span className="text-slate-300 dark:text-zinc-700">/</span>
          <span className="text-xs font-medium text-slate-600 dark:text-zinc-400 truncate max-w-[140px] sm:max-w-[200px]">
            {docRecord.title}
          </span>
          <span className="text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 font-mono px-2 py-0.5 rounded-full uppercase hidden md:inline">
            Read-Only
          </span>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleCopyLink}
            className="inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors shadow-2xs"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-600">Copied Link</span>
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
            title="Print Document"
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
