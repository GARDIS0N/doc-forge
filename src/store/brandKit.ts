import { create } from 'zustand';
import { BrandKit } from '@/lib/types';
import { useEditorStore } from './editor';

interface BrandKitState {
  brand: BrandKit;
  isLoaded: boolean;
  updateBrand: (partial: Partial<BrandKit>) => void;
  updateBankDetails: (details: Partial<NonNullable<BrandKit['bankDetails']>>) => void;
  updateMpesaDetails: (details: Partial<NonNullable<BrandKit['mpesaDetails']>>) => void;
  setLogo: (logoUrl: string | undefined) => void;
  resetToDefaults: () => void;
  applyToActiveDocument: () => void;
}

const defaultBrandKit: BrandKit = {
  businessName: 'Apex Digital Solutions Ltd',
  tagline: 'Enterprise Software & Cloud Architecture',
  email: 'billing@apexdigital.co.ke',
  phone: '+254 712 345 678',
  address: 'Suite 4B, The Promenade, General Mathenge Drive, Westlands, Nairobi, Kenya',
  website: 'https://apexdigital.co.ke',
  kraPin: 'P051234567Z',
  primaryColor: '#0f2b48',
  accentColor: '#1e4976',
  bankDetails: {
    bankName: 'NCBA Bank Kenya PLC',
    accountName: 'Apex Digital Solutions Ltd',
    accountNumber: '8492019482',
    branch: 'Westlands Branch (Code: 07000)',
    swiftCode: 'NCBAKENX',
  },
  mpesaDetails: {
    type: 'Paybill',
    businessNumber: '522522',
    accountNumber: '8492019482',
  },
};

const STORAGE_KEY = 'docforge_brand_kit_v1';

export const useBrandKitStore = create<BrandKitState>((set, get) => {
  // Load initial from localStorage if in browser
  let initialBrand = defaultBrandKit;
  if (typeof window !== 'undefined') {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        initialBrand = { ...defaultBrandKit, ...JSON.parse(stored) };
      }
    } catch (e) {
      console.warn('Could not load brand kit from localStorage:', e);
    }
  }

  const persist = (brand: BrandKit) => {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(brand));
      } catch (e) {
        console.warn('Could not persist brand kit:', e);
      }
    }
  };

  return {
    brand: initialBrand,
    isLoaded: true,

    updateBrand: (partial) => {
      set((state) => {
        const updated = { ...state.brand, ...partial };
        persist(updated);
        return { brand: updated };
      });
    },

    updateBankDetails: (details) => {
      set((state) => {
        const updatedBank = { ...(state.brand.bankDetails || {}), ...details } as any;
        const updated = { ...state.brand, bankDetails: updatedBank };
        persist(updated);
        return { brand: updated };
      });
    },

    updateMpesaDetails: (details) => {
      set((state) => {
        const updatedMpesa = { ...(state.brand.mpesaDetails || {}), ...details } as any;
        const updated = { ...state.brand, mpesaDetails: updatedMpesa };
        persist(updated);
        return { brand: updated };
      });
    },

    setLogo: (logoUrl) => {
      set((state) => {
        const updated = { ...state.brand, logoUrl };
        persist(updated);
        return { brand: updated };
      });
    },

    resetToDefaults: () => {
      persist(defaultBrandKit);
      set({ brand: defaultBrandKit });
    },

    applyToActiveDocument: () => {
      const { brand } = get();
      const editor = useEditorStore.getState();
      const currentData = { ...editor.data };

      // Map brand kit to document sender fields
      const sender = {
        ...(currentData.sender || {}),
        businessName: brand.businessName,
        tagline: brand.tagline,
        email: brand.email,
        phone: brand.phone,
        address: brand.address,
        website: brand.website,
        kraPin: brand.kraPin,
        logoUrl: brand.logoUrl,
      };

      // Map payment details
      const payment = {
        ...(currentData.payment || {}),
        bankName: brand.bankDetails?.bankName,
        accountName: brand.bankDetails?.accountName,
        accountNumber: brand.bankDetails?.accountNumber,
        branch: brand.bankDetails?.branch,
        swiftCode: brand.bankDetails?.swiftCode,
        mpesaPaybill: brand.mpesaDetails
          ? `${brand.mpesaDetails.businessNumber}${
              brand.mpesaDetails.accountNumber ? ` (Acc: ${brand.mpesaDetails.accountNumber})` : ''
            }`
          : undefined,
      };

      currentData.sender = sender;
      currentData.payment = payment;

      editor.updateData(currentData);
    },
  };
});
