'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import {
  listDocuments,
  deleteDocument,
  duplicateDocument,
  updateDocumentStatus,
} from '@/lib/documents-repo';
import { SavedDocument, DocumentStatus } from '@/lib/types';
import { formatCurrency, formatDate } from '@/lib/format';
import { UserMenu } from '@/components/auth/UserMenu';
import { useAuth } from '@/contexts/AuthContext';
import {
  FileText,
  Plus,
  Search,
  Filter,
  Copy,
  Trash2,
  Edit3,
  ExternalLink,
  CheckCircle2,
  Clock,
  Sparkles,
  ArrowRight,
  TrendingUp,
} from 'lucide-react';

export default function DashboardPage() {
  const { user, isConfigured } = useAuth();
  const [documents, setDocuments] = useState<SavedDocument[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [isLoading, setIsLoading] = useState(true);

  const loadDocs = async () => {
    setIsLoading(true);
    const docs = await listDocuments();
    setDocuments(docs);
    setIsLoading(false);
  };

  useEffect(() => {
    loadDocs();
  }, [user]);

  const handleDuplicate = async (id: string) => {
    await duplicateDocument(id);
    await loadDocs();
  };

  const handleDelete = async (id: string, title: string) => {
    if (confirm(`Are you sure you want to delete "${title}"?`)) {
      await deleteDocument(id);
      await loadDocs();
    }
  };

  const handleStatusChange = async (id: string, newStatus: DocumentStatus) => {
    await updateDocumentStatus(id, newStatus);
    await loadDocs();
  };

  // Filtered documents
  const filteredDocs = useMemo(() => {
    return documents.filter((doc) => {
      const matchesStatus = statusFilter === 'All' || doc.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        doc.title.toLowerCase().includes(q) ||
        (doc.docNumber && doc.docNumber.toLowerCase().includes(q)) ||
        doc.templateSlug.toLowerCase().includes(q);
      return matchesStatus && matchesSearch;
    });
  }, [documents, searchQuery, statusFilter]);

  // Dashboard Stats
  const stats = useMemo(() => {
    const total = documents.length;
    const drafts = documents.filter((d) => d.status === 'Draft').length;
    const finalized = documents.filter((d) => d.status === 'Paid' || d.status === 'Signed').length;
    const totalValue = documents.reduce((sum, d) => sum + (d.grandTotal || 0), 0);
    return { total, drafts, finalized, totalValue };
  }, [documents]);

  const getStatusBadge = (status: DocumentStatus) => {
    switch (status) {
      case 'Paid':
        return 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/60 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800';
      case 'Sent':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-950/60 dark:text-blue-300 border-blue-200 dark:border-blue-800';
      case 'Signed':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-950/60 dark:text-purple-300 border-purple-200 dark:border-purple-800';
      case 'Draft':
      default:
        return 'bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col">
      {/* Top Navbar */}
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
                Dashboard
              </span>
            </div>
          </Link>

          <div className="flex items-center gap-3">
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl shadow-sm transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Create Document</span>
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 flex-1 w-full space-y-8">
        {/* Header & Quick Stats */}
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Documents Overview
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-zinc-400 mt-1">
            Manage your drafts, invoices, contracts, and exported records with instant cloud sync.
          </p>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6">
            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Documents
              </span>
              <span className="text-2xl font-black text-slate-900 dark:text-white font-mono">
                {stats.total}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Active Drafts
              </span>
              <span className="text-2xl font-black text-amber-600 dark:text-amber-400 font-mono">
                {stats.drafts}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Paid / Signed
              </span>
              <span className="text-2xl font-black text-emerald-600 dark:text-emerald-400 font-mono">
                {stats.finalized}
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-2xs">
              <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                Total Portfolio Value
              </span>
              <span className="text-xl sm:text-2xl font-black text-blue-600 dark:text-blue-400 font-mono truncate block">
                {formatCurrency(stats.totalValue, 'KES')}
              </span>
            </div>
          </div>
        </div>

        {/* Filters and Search Toolbar */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          {/* Status Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 custom-scrollbar">
            {['All', 'Draft', 'Sent', 'Paid', 'Signed'].map((status) => (
              <button
                key={status}
                onClick={() => setStatusFilter(status)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                  statusFilter === status
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-white dark:bg-zinc-900 text-slate-600 dark:text-zinc-400 hover:bg-slate-100 dark:hover:bg-zinc-800 border border-slate-200 dark:border-zinc-800'
                }`}
              >
                {status}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative w-full sm:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              placeholder="Search by title or document #..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full text-xs pl-9 pr-3 py-2 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all placeholder:text-slate-400"
            />
          </div>
        </div>

        {/* Documents Table / Grid */}
        <div className="bg-white dark:bg-zinc-900 rounded-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden shadow-2xs">
          {filteredDocs.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-zinc-800 bg-slate-50/70 dark:bg-zinc-800/40 text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-zinc-400">
                    <th className="py-3.5 px-5">Document Title</th>
                    <th className="py-3.5 px-4">Template</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Amount</th>
                    <th className="py-3.5 px-4">Last Updated</th>
                    <th className="py-3.5 px-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-zinc-800">
                  {filteredDocs.map((doc) => (
                    <tr
                      key={doc.id}
                      className="hover:bg-slate-50/60 dark:hover:bg-zinc-800/50 transition-colors group"
                    >
                      <td className="py-4 px-5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center shrink-0">
                            <FileText className="w-4 h-4" />
                          </div>
                          <div>
                            <Link
                              href={`/editor/${doc.templateSlug}?docId=${doc.id}`}
                              className="font-bold text-slate-900 dark:text-zinc-100 hover:text-blue-600 transition-colors text-sm"
                            >
                              {doc.title}
                            </Link>
                            {doc.docNumber && (
                              <p className="text-[11px] text-slate-400 font-mono mt-0.5">
                                {doc.docNumber}
                              </p>
                            )}
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-slate-600 dark:text-zinc-300 capitalize font-medium">
                        {doc.templateSlug.replace('-', ' ')}
                      </td>

                      <td className="py-4 px-4">
                        <div className="inline-flex items-center gap-1">
                          <select
                            value={doc.status}
                            onChange={(e) =>
                              handleStatusChange(doc.id, e.target.value as DocumentStatus)
                            }
                            className={`text-[11px] font-bold px-2.5 py-1 rounded-full border cursor-pointer focus:outline-hidden transition-all ${getStatusBadge(
                              doc.status
                            )}`}
                          >
                            <option value="Draft">Draft</option>
                            <option value="Sent">Sent</option>
                            <option value="Paid">Paid</option>
                            <option value="Signed">Signed</option>
                          </select>
                        </div>
                      </td>

                      <td className="py-4 px-4 text-right font-mono font-bold text-slate-900 dark:text-zinc-100">
                        {doc.grandTotal && doc.grandTotal > 0
                          ? formatCurrency(doc.grandTotal, doc.currency || 'KES')
                          : '—'}
                      </td>

                      <td className="py-4 px-4 text-slate-500 dark:text-zinc-400 text-[11px] whitespace-nowrap">
                        {formatDate(doc.updatedAt, 'standard')}
                      </td>

                      <td className="py-4 px-5 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <Link
                            href={`/editor/${doc.templateSlug}?docId=${doc.id}`}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-zinc-800 transition-colors"
                            title="Edit Document"
                          >
                            <Edit3 className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            onClick={() => handleDuplicate(doc.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
                            title="Duplicate Document"
                          >
                            <Copy className="w-3.5 h-3.5" />
                          </button>
                          <button
                            onClick={() => handleDelete(doc.id, doc.title)}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                            title="Delete Document"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="text-center py-16 p-6">
              <FileText className="w-10 h-10 text-slate-300 dark:text-zinc-600 mx-auto mb-3" />
              <h3 className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                No documents found
              </h3>
              <p className="text-xs text-slate-400 mt-1 mb-4">
                No documents match your current filter criteria.
              </p>
              <Link
                href="/templates"
                className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-3.5 py-2 rounded-xl transition-all"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Create a Document</span>
              </Link>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
