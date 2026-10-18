'use client';

import React, { useRef, useState } from 'react';
import { useEditorStore } from '@/store/editor';
import { DocPage } from '@/components/doc/DocPage';
import { SignatureModal } from '@/components/signature/SignatureModal';
import {
  ZoomIn,
  ZoomOut,
  Maximize2,
  Download,
  RefreshCw,
  FileText,
  FileSpreadsheet,
  PenTool,
  Share2,
  Check,
} from 'lucide-react';

interface PreviewPaneProps {
  Component: React.ComponentType<{ data: any; styles?: any }>;
  title?: string;
}

export const PreviewPane: React.FC<PreviewPaneProps> = ({ Component, title = 'Document Preview' }) => {
  const {
    data,
    styles,
    zoom,
    setZoom,
    isExportingPdf,
    setIsExportingPdf,
    slug,
    docId,
    updateField,
  } = useEditorStore();

  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isSignatureOpen, setIsSignatureOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const documentRef = useRef<HTMLDivElement>(null);

  const handleZoomIn = () => setZoom(Math.min(zoom + 0.15, 1.5));
  const handleZoomOut = () => setZoom(Math.max(zoom - 0.15, 0.45));
  const handleResetZoom = () => setZoom(0.85);

  const handleDownloadPdf = async () => {
    try {
      setIsExportingPdf(true);

      if (!documentRef.current) {
        throw new Error('Preview element not found');
      }

      const htmlContent = documentRef.current.innerHTML;

      const response = await fetch('/api/export/pdf', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          slug,
          html: htmlContent,
          paperSize: styles.paperSize,
          docNumber: data.docNumber || slug || 'document',
          styles,
        }),
      });

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to generate PDF: ${errorText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      const fileName = `${data.docNumber || slug || 'document'}.pdf`;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error('PDF export error:', error);
      alert('Could not generate server-side PDF. Please check server logs.');
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
          slug,
          data,
          styles,
        }),
      });

      if (!res.ok) throw new Error('DOCX Export failed');
      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${data.docNumber || slug || 'document'}.docx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (e) {
      console.error(e);
      alert('Could not export DOCX document');
    } finally {
      setIsExportingDocx(false);
    }
  };

  const handleApplySignature = (sigUrl: string) => {
    updateField('signatureUrl', sigUrl);
  };

  const handleCopyShareLink = () => {
    if (typeof window !== 'undefined') {
      const shareUrl = docId
        ? `${window.location.origin}/view/${docId}`
        : window.location.href;
      navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <>
      <div className="flex flex-col h-full bg-slate-100 dark:bg-zinc-950 overflow-hidden select-none border-l border-slate-200 dark:border-zinc-800">
        {/* Top Preview Control Bar */}
        <div className="h-13 px-4 bg-white dark:bg-zinc-900 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between z-10 shrink-0 gap-2">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-600" />
            <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 truncate max-w-[150px] sm:max-w-[200px]">
              {title}
            </span>
            <span className="hidden sm:inline text-[10px] bg-slate-100 dark:bg-zinc-800 text-slate-500 dark:text-zinc-400 px-2 py-0.5 rounded-full font-mono uppercase">
              {styles.paperSize} • {styles.variant}
            </span>
          </div>

          {/* Controls: Zoom, Signature, DOCX, PDF, Share */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            {/* Zoom Controls */}
            <div className="hidden lg:flex items-center bg-slate-100 dark:bg-zinc-800 rounded-lg p-0.5 border border-slate-200 dark:border-zinc-700">
              <button
                onClick={handleZoomOut}
                title="Zoom out"
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-zinc-300 transition-colors"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>
              <span className="text-[11px] font-mono px-2 text-slate-600 dark:text-zinc-300 min-w-10 text-center">
                {Math.round(zoom * 100)}%
              </span>
              <button
                onClick={handleZoomIn}
                title="Zoom in"
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-zinc-300 transition-colors"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={handleResetZoom}
                title="Fit to view"
                className="p-1.5 hover:bg-white dark:hover:bg-zinc-700 rounded text-slate-600 dark:text-zinc-300 transition-colors border-l border-slate-200 dark:border-zinc-700 ml-0.5"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Signature Trigger */}
            <button
              onClick={() => setIsSignatureOpen(true)}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors"
              title="Add or update digital signature"
            >
              <PenTool className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden md:inline">Signature</span>
            </button>

            {/* Share Link */}
            <button
              onClick={handleCopyShareLink}
              className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors"
              title="Copy shareable link"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-emerald-600" />
                  <span className="text-emerald-600 hidden md:inline">Copied!</span>
                </>
              ) : (
                <>
                  <Share2 className="w-3.5 h-3.5" />
                  <span className="hidden md:inline">Share</span>
                </>
              )}
            </button>

            {/* DOCX Export */}
            <button
              onClick={handleDownloadDocx}
              disabled={isExportingDocx}
              className="hidden sm:inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 transition-colors"
              title="Download Microsoft Word .docx"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-blue-600" />
              <span>DOCX</span>
            </button>

            {/* PDF Export */}
            <button
              onClick={handleDownloadPdf}
              disabled={isExportingPdf}
              className="flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs font-medium px-3.5 py-1.5 rounded-lg shadow-sm transition-all"
            >
              {isExportingPdf ? (
                <>
                  <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                  <span>Exporting...</span>
                </>
              ) : (
                <>
                  <Download className="w-3.5 h-3.5" />
                  <span>Export PDF</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Preview Viewport */}
        <div className="flex-1 overflow-auto p-8 flex justify-center items-start custom-scrollbar">
          <div
            ref={documentRef}
            className="transition-transform duration-100 ease-out origin-top"
            style={{ transform: `scale(${zoom})` }}
          >
            <DocPage
              paperSize={styles.paperSize}
              marginSize={styles.marginSize}
              density={styles.density}
              colorTheme={styles.colorTheme}
              fontPair={styles.fontPair}
            >
              <Component data={data} styles={styles} />
            </DocPage>
          </div>
        </div>
      </div>

      {/* Signature Modal */}
      <SignatureModal
        isOpen={isSignatureOpen}
        onClose={() => setIsSignatureOpen(false)}
        onSave={handleApplySignature}
      />
    </>
  );
};

export default PreviewPane;
