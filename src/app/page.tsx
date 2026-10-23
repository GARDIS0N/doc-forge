import Link from 'next/link';
import { ArrowRight, FileText, CheckCircle2, Zap, Shield, Sparkles } from 'lucide-react';
import { UserMenu } from '@/components/auth/UserMenu';

export default function Home() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-zinc-950 text-slate-900 dark:text-zinc-100 flex flex-col justify-between">
      {/* Top Navbar */}
      <header className="border-b border-slate-200 dark:border-zinc-800 bg-white/70 dark:bg-zinc-900/70 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold shadow-md shadow-blue-500/20">
              <FileText className="w-5 h-5" />
            </div>
            <span className="font-extrabold text-lg tracking-tight bg-linear-to-r from-slate-900 to-slate-700 dark:from-white dark:to-zinc-300 bg-clip-text text-transparent">
              DocForge
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/dashboard"
              className="text-xs font-semibold text-slate-600 dark:text-zinc-300 hover:text-slate-900 dark:hover:text-white px-3 py-2 rounded-xl transition-colors hidden sm:inline"
            >
              My Documents
            </Link>
            <Link
              href="/templates"
              className="inline-flex items-center gap-1.5 bg-blue-600 hover:bg-blue-700 text-white font-medium text-xs px-4 py-2 rounded-xl shadow-sm transition-all"
            >
              <span>Explore Templates</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
            <UserMenu />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 flex-1 flex flex-col items-center justify-center text-center">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-xs font-semibold mb-6 border border-blue-200/60 dark:border-blue-800/60 shadow-2xs">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Pixel-Perfect Web-to-PDF Document Generator</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-slate-900 dark:text-white max-w-4xl leading-tight">
          Craft executive documents that command authority.
        </h1>

        <p className="mt-5 text-base sm:text-lg text-slate-600 dark:text-zinc-400 max-w-2xl leading-relaxed">
          Pick a designer-grade template, fill out guided forms with automated Kenyan tax & currency calculations, preview live on A4 paper, and export publication-ready PDFs.
        </p>

        <div className="mt-8 flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/templates"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm px-6 py-3 rounded-xl shadow-md shadow-blue-500/20 hover:shadow-lg transition-all"
          >
            <span>Browse 12+ Templates</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/editor/invoice"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white dark:bg-zinc-900 hover:bg-slate-100 dark:hover:bg-zinc-800 text-slate-800 dark:text-zinc-200 font-semibold text-sm px-6 py-3 rounded-xl border border-slate-200 dark:border-zinc-800 shadow-2xs transition-all"
          >
            <span>Try Invoice Template</span>
          </Link>
        </div>

        {/* Value Props Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-20 max-w-5xl text-left">
          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-900/30 text-blue-600 flex items-center justify-center mb-4">
              <Zap className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">
              Live Split-Screen Engine
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Every keystroke in the guided form updates the A4 preview instantly. Zoom, adjust density, toggle variants with zero latency.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 flex items-center justify-center mb-4">
              <CheckCircle2 className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">
              Kenyan Fiscal & Currency Intelligence
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
              Auto-calculates VAT (16%), M-Pesa paybill instructions, KRA PIN fields, and number-to-words currency amounts in Kenyan Shillings.
            </p>
          </div>

          <div className="p-6 rounded-2xl bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-800 shadow-xs">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-900/30 text-purple-600 flex items-center justify-center mb-4">
              <Shield className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-base text-slate-900 dark:text-zinc-100">
              Server-Side Precision PDF
            </h3>
            <p className="text-xs text-slate-600 dark:text-zinc-400 mt-2 leading-relaxed">
              What you see in the browser is exactly what renders in your PDF. Powered by headless Chromium print rendering.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-200 dark:border-zinc-800 py-6 text-center text-xs text-slate-500 dark:text-zinc-500">
        <p>© 2026 DocForge Studio. Designed for professionals and businesses.</p>
      </footer>
    </div>
  );
}
