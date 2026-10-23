'use client';

import React, { useState, useRef, useEffect } from 'react';
import Link from 'next/link';
import { useAuth } from '@/contexts/AuthContext';
import {
  User as UserIcon,
  LogOut,
  Sparkles,
  Database,
  FileText,
  ChevronDown,
  Building2,
  CheckCircle2,
  LogIn,
} from 'lucide-react';

interface UserMenuProps {
  onOpenBrandKit?: () => void;
  className?: string;
}

export const UserMenu: React.FC<UserMenuProps> = ({ onOpenBrandKit, className = '' }) => {
  const { user, isConfigured, openAuthModal, signOut } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  if (!user) {
    return (
      <div className={`flex items-center gap-2 ${className}`}>
        <button
          onClick={() => openAuthModal('signin')}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 text-slate-700 dark:text-zinc-200 text-xs font-semibold shadow-2xs transition-all"
        >
          <LogIn className="w-3.5 h-3.5 text-blue-600" />
          <span>Sign In</span>
        </button>
      </div>
    );
  }

  // Get user initials
  const initials = user.fullName
    ? user.fullName
        .split(' ')
        .map((n) => n[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()
    : user.email.slice(0, 2).toUpperCase();

  return (
    <div className={`relative ${className}`} ref={menuRef}>
      <button
        onClick={() => setDropdownOpen(!dropdownOpen)}
        className="flex items-center gap-2 p-1 pl-1.5 pr-2.5 rounded-full border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 hover:bg-slate-50 dark:hover:bg-zinc-800 transition-all shadow-2xs"
        title={user.email}
      >
        <div className="w-6 h-6 rounded-full bg-linear-to-tr from-blue-600 to-indigo-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs">
          {initials}
        </div>
        <span className="text-xs font-semibold text-slate-700 dark:text-zinc-200 max-w-[110px] truncate hidden sm:inline">
          {user.fullName || user.email.split('@')[0]}
        </span>
        <ChevronDown className="w-3 h-3 text-slate-400" />
      </button>

      {dropdownOpen && (
        <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl border border-slate-200 dark:border-zinc-800 p-2 z-50 animate-in fade-in zoom-in-95 duration-100">
          {/* User Info Header */}
          <div className="p-3 bg-slate-50 dark:bg-zinc-800/60 rounded-xl mb-2">
            <div className="flex items-center justify-between mb-1">
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100 truncate">
                {user.fullName || 'User'}
              </span>
              {user.isDemo ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-300 font-semibold">
                  Demo
                </span>
              ) : isConfigured ? (
                <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-2.5 h-2.5" />
                  <span>Cloud</span>
                </span>
              ) : null}
            </div>
            <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate font-mono">
              {user.email}
            </p>
          </div>

          {/* Menu Items */}
          <div className="space-y-0.5 text-xs font-medium text-slate-700 dark:text-zinc-300">
            <Link
              href="/dashboard"
              onClick={() => setDropdownOpen(false)}
              className="flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <FileText className="w-3.5 h-3.5 text-blue-600" />
              <span>My Documents</span>
            </Link>

            {onOpenBrandKit && (
              <button
                type="button"
                onClick={() => {
                  setDropdownOpen(false);
                  onOpenBrandKit();
                }}
                className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
              >
                <Building2 className="w-3.5 h-3.5 text-indigo-600" />
                <span>Company Brand Kit</span>
              </button>
            )}

            <button
              type="button"
              onClick={() => {
                setDropdownOpen(false);
                openAuthModal('settings');
              }}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
            >
              <Database className="w-3.5 h-3.5 text-slate-500" />
              <span>Supabase Cloud Config</span>
            </button>

            <div className="my-1 border-t border-slate-100 dark:border-zinc-800" />

            <button
              type="button"
              onClick={async () => {
                setDropdownOpen(false);
                await signOut();
              }}
              className="w-full text-left flex items-center gap-2.5 px-3 py-2 rounded-xl text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
