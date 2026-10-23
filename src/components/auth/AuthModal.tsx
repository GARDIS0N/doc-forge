'use client';

import React, { useState, useEffect } from 'react';
import { useAuth, AuthTab } from '@/contexts/AuthContext';
import { getSupabaseCredentials } from '@/lib/supabase';
import {
  X,
  Mail,
  Lock,
  User as UserIcon,
  Sparkles,
  AlertCircle,
  CheckCircle2,
  Database,
  ArrowRight,
  Eye,
  EyeOff,
  KeyRound,
  ShieldCheck,
  Loader2,
  ExternalLink,
} from 'lucide-react';

export const AuthModal: React.FC = () => {
  const {
    authModalOpen,
    authModalTab,
    closeAuthModal,
    signIn,
    signUp,
    signInDemo,
    resetPassword,
    updateSupabaseConfig,
    isConfigured,
  } = useAuth();

  const [activeTab, setActiveTab] = useState<AuthTab>(authModalTab);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Supabase Settings form
  const [supabaseUrl, setSupabaseUrl] = useState('');
  const [supabaseAnonKey, setSupabaseAnonKey] = useState('');

  // Status feedback
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setActiveTab(authModalTab);
    setErrorMsg(null);
    setSuccessMsg(null);
  }, [authModalTab, authModalOpen]);

  useEffect(() => {
    if (authModalOpen) {
      const creds = getSupabaseCredentials();
      setSupabaseUrl(creds.url);
      setSupabaseAnonKey(creds.anonKey);
    }
  }, [authModalOpen]);

  if (!authModalOpen) return null;

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setIsSubmitting(true);
    const result = await signIn(email, password);
    setIsSubmitting(false);

    if (!result.success) {
      setErrorMsg(result.error || 'Failed to sign in.');
    }
  };

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Passwords do not match.');
      return;
    }

    setIsSubmitting(true);
    const result = await signUp(email, password, fullName);
    setIsSubmitting(false);

    if (result.success) {
      if (result.confirmationRequired) {
        setSuccessMsg('Account created! Please check your email to confirm your account before signing in.');
      } else {
        setSuccessMsg('Welcome to DocForge! Your account has been created.');
      }
    } else {
      setErrorMsg(result.error || 'Failed to sign up.');
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!email) {
      setErrorMsg('Please enter your email address.');
      return;
    }

    setIsSubmitting(true);
    const result = await resetPassword(email);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Password reset instructions sent to your email.');
    } else {
      setErrorMsg(result.error || 'Failed to send reset link.');
    }
  };

  const handleSaveSettings = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setSuccessMsg(null);

    if (!supabaseUrl || !supabaseAnonKey) {
      setErrorMsg('Please enter both Supabase URL and Anon Key.');
      return;
    }

    setIsSubmitting(true);
    const result = await updateSupabaseConfig(supabaseUrl, supabaseAnonKey);
    setIsSubmitting(false);

    if (result.success) {
      setSuccessMsg('Supabase connected successfully! You can now sign in or register.');
      setTimeout(() => setActiveTab('signin'), 1200);
    } else {
      setErrorMsg(result.error || 'Could not connect to Supabase. Check your URL and Key.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div
        className="w-full max-w-md bg-white dark:bg-zinc-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-6 pt-6 pb-4 border-b border-slate-100 dark:border-zinc-800/80 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/30">
              <KeyRound className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                {activeTab === 'signin' && 'Sign In to DocForge'}
                {activeTab === 'signup' && 'Create Your Account'}
                {activeTab === 'forgot' && 'Reset Password'}
                {activeTab === 'demo' && 'Quick Demo Access'}
                {activeTab === 'settings' && 'Supabase Cloud Config'}
              </h2>
              <p className="text-[11px] text-slate-500 dark:text-zinc-400">
                {activeTab === 'settings' ? 'Configure Supabase project keys' : 'Secure document synchronization & RLS'}
              </p>
            </div>
          </div>
          <button
            onClick={closeAuthModal}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Buttons */}
        <div className="flex border-b border-slate-100 dark:border-zinc-800 text-xs font-semibold px-6 bg-slate-50/50 dark:bg-zinc-900/50">
          <button
            onClick={() => { setActiveTab('signin'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'signin'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            Sign In
          </button>
          <button
            onClick={() => { setActiveTab('signup'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'signup'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            Sign Up
          </button>
          <button
            onClick={() => { setActiveTab('demo'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-3 px-3 border-b-2 transition-colors ${
              activeTab === 'demo'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            Demo User
          </button>
          <button
            onClick={() => { setActiveTab('settings'); setErrorMsg(null); setSuccessMsg(null); }}
            className={`py-3 px-3 border-b-2 transition-colors ml-auto flex items-center gap-1.5 ${
              activeTab === 'settings'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 dark:text-zinc-400 hover:text-slate-800 dark:hover:text-zinc-200'
            }`}
          >
            <Database className="w-3 h-3" />
            <span>Config</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6">
          {/* Status Alert Banners */}
          {errorMsg && (
            <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-800 text-rose-700 dark:text-rose-300 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{errorMsg}</div>
            </div>
          )}

          {successMsg && (
            <div className="mb-4 p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-300 text-xs flex items-start gap-2.5">
              <CheckCircle2 className="w-4 h-4 shrink-0 mt-0.5" />
              <div className="flex-1">{successMsg}</div>
            </div>
          )}

          {/* Cloud Status indicator if unconfigured */}
          {!isConfigured && activeTab !== 'settings' && activeTab !== 'demo' && (
            <div className="mb-4 p-3 rounded-xl bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-200 text-xs">
              <div className="flex items-center gap-1.5 font-semibold mb-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                <span>Supabase keys not detected in environment</span>
              </div>
              <p className="text-[11px] text-amber-700 dark:text-amber-300">
                You can try the instant{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('demo')}
                  className="font-bold underline hover:text-amber-900 dark:hover:text-white"
                >
                  Demo Account
                </button>{' '}
                or connect your Supabase project in the{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('settings')}
                  className="font-bold underline hover:text-amber-900 dark:hover:text-white"
                >
                  Config tab
                </button>.
              </p>
            </div>
          )}

          {/* 1. SIGN IN TAB */}
          {activeTab === 'signin' && (
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.co.ke"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300">
                    Password
                  </label>
                  <button
                    type="button"
                    onClick={() => setActiveTab('forgot')}
                    className="text-[11px] text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Signing in...</span>
                  </>
                ) : (
                  <>
                    <span>Sign In</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signup')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Create one
                </button>
              </div>
            </form>
          )}

          {/* 2. SIGN UP TAB */}
          {activeTab === 'signup' && (
            <form onSubmit={handleSignUp} className="space-y-3.5">
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Full Name
                </label>
                <div className="relative">
                  <UserIcon className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="David Kimani"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.co.ke"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Password (min. 6 characters)
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-10 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 mt-3"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Creating account...</span>
                  </>
                ) : (
                  <>
                    <ShieldCheck className="w-4 h-4" />
                    <span>Create Account</span>
                  </>
                )}
              </button>

              <div className="pt-2 text-center text-xs text-slate-500 dark:text-zinc-400">
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Sign in
                </button>
              </div>
            </form>
          )}

          {/* 3. FORGOT PASSWORD TAB */}
          {activeTab === 'forgot' && (
            <form onSubmit={handleForgotPassword} className="space-y-4">
              <p className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Enter your registered email address and we'll send you a link to reset your password.
              </p>
              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1.5">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="you@company.co.ke"
                    className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    <span>Sending...</span>
                  </>
                ) : (
                  <span>Send Reset Link</span>
                )}
              </button>

              <div className="text-center text-xs">
                <button
                  type="button"
                  onClick={() => setActiveTab('signin')}
                  className="font-semibold text-blue-600 dark:text-blue-400 hover:underline"
                >
                  Back to Sign In
                </button>
              </div>
            </form>
          )}

          {/* 4. DEMO USER TAB */}
          {activeTab === 'demo' && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-blue-50/70 dark:bg-blue-950/30 border border-blue-200/70 dark:border-blue-900/50 text-slate-800 dark:text-zinc-200 text-xs">
                <div className="flex items-center gap-2 font-bold text-blue-700 dark:text-blue-300 mb-1.5">
                  <Sparkles className="w-4 h-4" />
                  <span>Instant Demo Mode</span>
                </div>
                <p className="leading-relaxed text-[11px] text-slate-600 dark:text-zinc-400">
                  Test DocForge immediately without creating an account or configuring credentials.
                  Logs you in as <strong>David Kimani (Solutions Architect)</strong> with pre-populated invoices, CVs, and company Brand Kit.
                </p>
              </div>

              <div className="space-y-2">
                <button
                  type="button"
                  onClick={() => signInDemo('david.mwangi@techkenya.io', 'David Kimani')}
                  className="w-full py-2.5 px-4 bg-slate-900 hover:bg-slate-800 dark:bg-white dark:hover:bg-zinc-100 text-white dark:text-slate-900 font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>Continue as David Kimani (Architect)</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>

                <button
                  type="button"
                  onClick={() => signInDemo('sarah.wanjiku@savannah.co.ke', 'Sarah Wanjiku')}
                  className="w-full py-2.5 px-4 bg-white dark:bg-zinc-800 hover:bg-slate-50 dark:hover:bg-zinc-700 text-slate-800 dark:text-zinc-200 border border-slate-200 dark:border-zinc-700 font-semibold text-xs rounded-xl shadow-2xs transition-all flex items-center justify-between"
                >
                  <div className="flex items-center gap-2">
                    <UserIcon className="w-4 h-4" />
                    <span>Continue as Sarah Wanjiku (CFO)</span>
                  </div>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}

          {/* 5. SUPABASE SETTINGS TAB */}
          {activeTab === 'settings' && (
            <form onSubmit={handleSaveSettings} className="space-y-3.5">
              <div className="text-xs text-slate-600 dark:text-zinc-400 leading-relaxed">
                Provide your project credentials from your{' '}
                <a
                  href="https://supabase.com/dashboard"
                  target="_blank"
                  rel="noreferrer"
                  className="font-semibold text-blue-600 dark:text-blue-400 inline-flex items-center gap-1 hover:underline"
                >
                  <span>Supabase Dashboard</span>
                  <ExternalLink className="w-3 h-3" />
                </a>{' '}
                (Settings → API).
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Project URL
                </label>
                <input
                  type="url"
                  required
                  value={supabaseUrl}
                  onChange={(e) => setSupabaseUrl(e.target.value)}
                  placeholder="https://xyzproject.supabase.co"
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-[11px]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 dark:text-zinc-300 mb-1">
                  Anon / Public API Key
                </label>
                <textarea
                  rows={2}
                  required
                  value={supabaseAnonKey}
                  onChange={(e) => setSupabaseAnonKey(e.target.value)}
                  placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                  className="w-full px-3 py-2 text-xs rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-800/80 text-slate-900 dark:text-zinc-100 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent font-mono text-[11px] resize-none"
                />
              </div>

              <div className="pt-1 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>Validating...</span>
                    </>
                  ) : (
                    <>
                      <Database className="w-3.5 h-3.5" />
                      <span>Test & Save Config</span>
                    </>
                  )}
                </button>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-200/60 dark:border-zinc-800 text-[11px] text-slate-500 dark:text-zinc-400 space-y-1">
                <p className="font-semibold text-slate-700 dark:text-zinc-300">Environment Variables Option:</p>
                <p>
                  You can also add these in <code className="bg-slate-200 dark:bg-zinc-700 px-1 py-0.5 rounded">.env.local</code>:
                </p>
                <p className="font-mono text-[10px] text-blue-600 dark:text-blue-400">
                  NEXT_PUBLIC_SUPABASE_URL=...<br />
                  NEXT_PUBLIC_SUPABASE_ANON_KEY=...
                </p>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
