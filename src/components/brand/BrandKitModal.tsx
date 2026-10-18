'use client';

import React, { useState } from 'react';
import { useBrandKitStore } from '@/store/brandKit';
import {
  X,
  Building2,
  CreditCard,
  Palette,
  Upload,
  Trash2,
  Check,
  Sparkles,
  Phone,
  Mail,
  MapPin,
  Globe,
} from 'lucide-react';

interface BrandKitModalProps {
  isOpen: boolean;
  onClose: () => void;
  onApplied?: () => void;
}

export const BrandKitModal: React.FC<BrandKitModalProps> = ({ isOpen, onClose, onApplied }) => {
  const {
    brand,
    updateBrand,
    updateBankDetails,
    updateMpesaDetails,
    setLogo,
    applyToActiveDocument,
  } = useBrandKitStore();

  const [activeTab, setActiveTab] = useState<'profile' | 'payment' | 'style'>('profile');
  const [justApplied, setJustApplied] = useState(false);

  if (!isOpen) return null;

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleApply = () => {
    applyToActiveDocument();
    setJustApplied(true);
    if (onApplied) onApplied();
    setTimeout(() => {
      setJustApplied(false);
      onClose();
    }, 900);
  };

  const colorPresets = [
    { primary: '#0f2b48', accent: '#1e4976', label: 'Navy' },
    { primary: '#047857', accent: '#065f46', label: 'Emerald' },
    { primary: '#1e293b', accent: '#334155', label: 'Slate' },
    { primary: '#831843', accent: '#9d174d', label: 'Burgundy' },
    { primary: '#1d4ed8', accent: '#2563eb', label: 'Blue' },
    { primary: '#b45309', accent: '#d97706', label: 'Amber' },
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white dark:bg-zinc-900 rounded-2xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 dark:border-zinc-800 overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
              <Building2 className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900 dark:text-zinc-100">
                Brand Kit Settings
              </h2>
              <p className="text-xs text-slate-500 dark:text-zinc-400">
                Your business identity, KRA tax details, and payment settlement accounts
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 dark:hover:text-zinc-200 hover:bg-slate-100 dark:hover:bg-zinc-800 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 dark:border-zinc-800 px-6 gap-6 bg-slate-50/50 dark:bg-zinc-900/50 shrink-0">
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'profile'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            <span>Business Profile</span>
          </button>
          <button
            onClick={() => setActiveTab('payment')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'payment'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <CreditCard className="w-3.5 h-3.5" />
            <span>Bank & M-Pesa</span>
          </button>
          <button
            onClick={() => setActiveTab('style')}
            className={`py-3 text-xs font-semibold flex items-center gap-2 border-b-2 transition-all ${
              activeTab === 'style'
                ? 'border-blue-600 text-blue-600 dark:text-blue-400'
                : 'border-transparent text-slate-500 hover:text-slate-800 dark:text-zinc-400'
            }`}
          >
            <Palette className="w-3.5 h-3.5" />
            <span>Brand Colors & Logo</span>
          </button>
        </div>

        {/* Tab Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar text-xs">
          {activeTab === 'profile' && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-slate-700 dark:text-zinc-300">
                    Business Name *
                  </label>
                  <input
                    type="text"
                    value={brand.businessName}
                    onChange={(e) => updateBrand({ businessName: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700 dark:text-zinc-300">
                    Tagline / Description
                  </label>
                  <input
                    type="text"
                    value={brand.tagline || ''}
                    onChange={(e) => updateBrand({ tagline: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                    <Mail className="w-3.5 h-3.5 text-slate-400" />
                    <span>Email Address *</span>
                  </label>
                  <input
                    type="email"
                    value={brand.email}
                    onChange={(e) => updateBrand({ email: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                    <Phone className="w-3.5 h-3.5 text-slate-400" />
                    <span>Phone Number</span>
                  </label>
                  <input
                    type="text"
                    value={brand.phone}
                    onChange={(e) => updateBrand({ phone: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  <span>Physical Address</span>
                </label>
                <textarea
                  rows={2}
                  value={brand.address}
                  onChange={(e) => updateBrand({ address: e.target.value })}
                  className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="font-medium text-slate-700 dark:text-zinc-300">
                    KRA PIN (Kenya)
                  </label>
                  <input
                    type="text"
                    value={brand.kraPin || ''}
                    placeholder="e.g. P051234567Z"
                    onChange={(e) => updateBrand({ kraPin: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100 font-mono"
                  />
                </div>

                <div className="space-y-1">
                  <label className="font-medium text-slate-700 dark:text-zinc-300 flex items-center gap-1">
                    <Globe className="w-3.5 h-3.5 text-slate-400" />
                    <span>Website URL</span>
                  </label>
                  <input
                    type="text"
                    value={brand.website || ''}
                    placeholder="https://..."
                    onChange={(e) => updateBrand({ website: e.target.value })}
                    className="w-full px-3 py-2 bg-slate-50 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                  />
                </div>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-5">
              {/* Bank Details */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
                <h3 className="font-bold text-slate-900 dark:text-zinc-100 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-blue-600" />
                  <span>Bank Account Instructions</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-600 dark:text-zinc-400">Bank Name</label>
                    <input
                      type="text"
                      value={brand.bankDetails?.bankName || ''}
                      placeholder="e.g. NCBA Bank / KCB"
                      onChange={(e) => updateBankDetails({ bankName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-600 dark:text-zinc-400">Account Name</label>
                    <input
                      type="text"
                      value={brand.bankDetails?.accountName || ''}
                      onChange={(e) => updateBankDetails({ accountName: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-600 dark:text-zinc-400">Account Number</label>
                    <input
                      type="text"
                      value={brand.bankDetails?.accountNumber || ''}
                      onChange={(e) => updateBankDetails({ accountNumber: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100 font-mono"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-600 dark:text-zinc-400">Branch & Code</label>
                    <input
                      type="text"
                      value={brand.bankDetails?.branch || ''}
                      placeholder="e.g. Westlands Branch"
                      onChange={(e) => updateBankDetails({ branch: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                    />
                  </div>
                </div>
              </div>

              {/* M-Pesa Details */}
              <div className="p-4 rounded-xl border border-emerald-200 dark:border-emerald-900/40 bg-emerald-50/30 dark:bg-emerald-950/20 space-y-3">
                <h3 className="font-bold text-emerald-800 dark:text-emerald-300 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-500" />
                  <span>M-Pesa Business Settlement</span>
                </h3>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="font-medium text-slate-600 dark:text-zinc-400">Type</label>
                    <select
                      value={brand.mpesaDetails?.type || 'Paybill'}
                      onChange={(e) => updateMpesaDetails({ type: e.target.value as any })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100"
                    >
                      <option value="Paybill">Paybill</option>
                      <option value="Buy Goods">Buy Goods / Till Number</option>
                      <option value="Send Money">Send Money</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="font-medium text-slate-600 dark:text-zinc-400">
                      Business / Till Number
                    </label>
                    <input
                      type="text"
                      value={brand.mpesaDetails?.businessNumber || ''}
                      placeholder="e.g. 522522"
                      onChange={(e) => updateMpesaDetails({ businessNumber: e.target.value })}
                      className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100 font-mono"
                    />
                  </div>

                  {brand.mpesaDetails?.type === 'Paybill' && (
                    <div className="col-span-2 space-y-1">
                      <label className="font-medium text-slate-600 dark:text-zinc-400">
                        Default Account Number
                      </label>
                      <input
                        type="text"
                        value={brand.mpesaDetails?.accountNumber || ''}
                        placeholder="e.g. 8492019482"
                        onChange={(e) => updateMpesaDetails({ accountNumber: e.target.value })}
                        className="w-full px-3 py-1.5 bg-white dark:bg-zinc-900 border border-slate-200 dark:border-zinc-700 rounded-lg text-slate-900 dark:text-zinc-100 font-mono"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'style' && (
            <div className="space-y-5">
              {/* Logo Upload */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
                <label className="font-bold text-slate-900 dark:text-zinc-100 block">
                  Company / Organization Logo
                </label>

                {brand.logoUrl ? (
                  <div className="flex items-center gap-4 p-3 bg-white dark:bg-zinc-900 rounded-lg border border-slate-200 dark:border-zinc-700">
                    <img
                      src={brand.logoUrl}
                      alt="Logo preview"
                      className="h-12 w-auto max-w-[120px] object-contain rounded"
                    />
                    <div className="flex-1">
                      <p className="font-medium text-slate-800 dark:text-zinc-200">Custom Logo Loaded</p>
                      <p className="text-[11px] text-slate-400">Applied automatically to invoice & letterheads</p>
                    </div>
                    <button
                      onClick={() => setLogo(undefined)}
                      className="text-red-500 hover:text-red-700 p-1.5 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/40 transition-colors"
                      title="Remove Logo"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <label className="border-2 border-dashed border-slate-200 dark:border-zinc-700 hover:border-blue-500 rounded-xl p-6 flex flex-col items-center justify-center cursor-pointer transition-colors bg-white dark:bg-zinc-900 group">
                    <Upload className="w-6 h-6 text-slate-400 group-hover:text-blue-500 transition-colors mb-2" />
                    <span className="font-semibold text-slate-700 dark:text-zinc-300">
                      Upload Logo Image
                    </span>
                    <span className="text-[11px] text-slate-400 mt-1">PNG, JPG, or SVG up to 2MB</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleLogoUpload}
                      className="hidden"
                    />
                  </label>
                )}
              </div>

              {/* Color Swatches */}
              <div className="p-4 rounded-xl border border-slate-200 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 space-y-3">
                <label className="font-bold text-slate-900 dark:text-zinc-100 block">
                  Primary Brand Palette Presets
                </label>
                <div className="grid grid-cols-3 gap-2.5">
                  {colorPresets.map((preset) => (
                    <button
                      key={preset.label}
                      type="button"
                      onClick={() => updateBrand({ primaryColor: preset.primary, accentColor: preset.accent })}
                      className={`p-2.5 rounded-lg border text-left flex items-center gap-2.5 transition-all ${
                        brand.primaryColor === preset.primary
                          ? 'border-blue-600 bg-blue-50/40 dark:bg-blue-900/20'
                          : 'border-slate-200 dark:border-zinc-700 bg-white dark:bg-zinc-900'
                      }`}
                    >
                      <div className="flex gap-1">
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.primary }} />
                        <span className="w-4 h-4 rounded-full" style={{ backgroundColor: preset.accent }} />
                      </div>
                      <span className="font-medium text-slate-700 dark:text-zinc-300">{preset.label}</span>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 dark:bg-zinc-900 border-t border-slate-200 dark:border-zinc-800 flex items-center justify-between shrink-0">
          <p className="text-[11px] text-slate-400">
            Changes save automatically to your browser storage.
          </p>

          <div className="flex items-center gap-2">
            <button
              onClick={handleApply}
              disabled={justApplied}
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs px-4 py-2 rounded-xl shadow-sm flex items-center gap-1.5 transition-all"
            >
              {justApplied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-white" />
                  <span>Applied to Document!</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Apply to Document</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandKitModal;
