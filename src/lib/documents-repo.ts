import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { SavedDocument, DocumentStatus } from './types';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

let supabaseClient: SupabaseClient | null = null;
if (SUPABASE_URL && SUPABASE_ANON_KEY) {
  try {
    supabaseClient = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
  } catch (e) {
    console.warn('Could not initialize Supabase client:', e);
  }
}

export function getSupabase(): SupabaseClient | null {
  return supabaseClient;
}

const STORAGE_KEY = 'docforge_saved_documents_v1';

// Initial sample seed documents so dashboard displays realistic documents right away
const SEED_DOCUMENTS: SavedDocument[] = [
  {
    id: 'doc-seed-1',
    templateSlug: 'invoice',
    title: 'Q4 Cloud Infrastructure & Architecture',
    docNumber: 'INV-2026-0042',
    status: 'Sent',
    data: {
      docNumber: 'INV-2026-0042',
      issueDate: '2026-10-17',
      dueDate: '2026-10-31',
      currency: 'KES',
      sender: {
        businessName: 'Apex Digital Solutions Ltd',
        email: 'billing@apexdigital.co.ke',
        phone: '+254 712 345 678',
        kraPin: 'P051234567Z',
      },
      client: {
        name: 'Savannah Logistics Kenya Ltd',
        email: 'finance@savannahlogistics.co.ke',
      },
      items: [
        { description: 'Next.js Web Portal Development', qty: 1, unitPrice: 150000 },
        { description: 'Cloud Infrastructure & Supabase Architecture', qty: 1, unitPrice: 65000 },
      ],
      applyVat: true,
      vatRate: 16,
      amountPaid: 100000,
    },
    styles: {
      variant: 'modern',
      density: 'comfortable',
      paperSize: 'A4',
      marginSize: 'normal',
      currency: 'KES',
    },
    grandTotal: 249400,
    currency: 'KES',
    createdAt: '2026-10-17T14:30:00.000Z',
    updatedAt: '2026-10-17T18:45:00.000Z',
  },
  {
    id: 'doc-seed-2',
    templateSlug: 'cv-modern',
    title: 'David Mwangi — Solutions Architect Resume',
    docNumber: 'CV-2026-0001',
    status: 'Signed',
    data: {
      fullName: 'David Kimani Mwangi',
      title: 'Lead Full-Stack & Cloud Solutions Architect',
      email: 'david.mwangi@techkenya.io',
      phone: '+254 722 890 123',
      location: 'Nairobi, Kenya',
      summary: 'Versatile Full-Stack Systems Architect with 8+ years experience.',
    },
    styles: {
      variant: 'modern',
      density: 'comfortable',
      paperSize: 'A4',
      marginSize: 'normal',
      currency: 'KES',
    },
    grandTotal: 0,
    currency: 'KES',
    createdAt: '2026-10-16T09:15:00.000Z',
    updatedAt: '2026-10-17T11:20:00.000Z',
  },
];

function getLocalDocuments(): SavedDocument[] {
  if (typeof window === 'undefined') return SEED_DOCUMENTS;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(SEED_DOCUMENTS));
      return SEED_DOCUMENTS;
    }
    return JSON.parse(raw);
  } catch (e) {
    console.warn('Error reading from localStorage:', e);
    return SEED_DOCUMENTS;
  }
}

function setLocalDocuments(docs: SavedDocument[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(docs));
  } catch (e) {
    console.warn('Error writing to localStorage:', e);
  }
}

export async function listDocuments(): Promise<SavedDocument[]> {
  if (supabaseClient) {
    try {
      const { data, error } = await supabaseClient
        .from('documents')
        .select('*')
        .order('updated_at', { ascending: false });

      if (!error && data) {
        return data.map((d: any) => ({
          id: d.id,
          userId: d.user_id,
          templateSlug: d.template_slug,
          title: d.title,
          docNumber: d.doc_number,
          status: d.status as DocumentStatus,
          data: d.data,
          styles: d.styles,
          grandTotal: Number(d.grand_total) || 0,
          currency: d.currency,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (e) {
      console.warn('Supabase fetch failed, falling back to local storage:', e);
    }
  }

  return getLocalDocuments().sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function getDocumentById(id: string): Promise<SavedDocument | null> {
  const all = await listDocuments();
  return all.find((d) => d.id === id) || null;
}

export async function saveDocument(doc: Partial<SavedDocument> & { templateSlug: string }): Promise<SavedDocument> {
  const now = new Date().toISOString();
  const id = doc.id || `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;

  const completeDoc: SavedDocument = {
    id,
    templateSlug: doc.templateSlug,
    title: doc.title || 'Untitled Document',
    docNumber: doc.docNumber || doc.data?.docNumber,
    status: doc.status || 'Draft',
    data: doc.data || {},
    styles: doc.styles || {
      variant: 'modern',
      density: 'comfortable',
      paperSize: 'A4',
      marginSize: 'normal',
      currency: 'KES',
    },
    grandTotal: doc.grandTotal || 0,
    currency: doc.currency || doc.styles?.currency || 'KES',
    createdAt: doc.createdAt || now,
    updatedAt: now,
  };

  if (supabaseClient) {
    try {
      await supabaseClient.from('documents').upsert({
        id: completeDoc.id,
        template_slug: completeDoc.templateSlug,
        title: completeDoc.title,
        doc_number: completeDoc.docNumber,
        status: completeDoc.status,
        data: completeDoc.data,
        styles: completeDoc.styles,
        grand_total: completeDoc.grandTotal,
        currency: completeDoc.currency,
        updated_at: completeDoc.updatedAt,
      });
    } catch (e) {
      console.warn('Supabase save failed, saving locally:', e);
    }
  }

  const existing = getLocalDocuments();
  const index = existing.findIndex((d) => d.id === id);
  if (index >= 0) {
    existing[index] = completeDoc;
  } else {
    existing.unshift(completeDoc);
  }
  setLocalDocuments(existing);

  return completeDoc;
}

export async function duplicateDocument(id: string): Promise<SavedDocument | null> {
  const original = await getDocumentById(id);
  if (!original) return null;

  const newDoc: SavedDocument = {
    ...JSON.parse(JSON.stringify(original)),
    id: `doc-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    title: `Copy of ${original.title}`,
    status: 'Draft',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  return saveDocument(newDoc);
}

export async function updateDocumentStatus(id: string, status: DocumentStatus): Promise<boolean> {
  const doc = await getDocumentById(id);
  if (!doc) return false;
  doc.status = status;
  doc.updatedAt = new Date().toISOString();
  await saveDocument(doc);
  return true;
}

export async function deleteDocument(id: string): Promise<boolean> {
  if (supabaseClient) {
    try {
      await supabaseClient.from('documents').delete().eq('id', id);
    } catch (e) {
      console.warn('Supabase delete failed:', e);
    }
  }

  const existing = getLocalDocuments();
  const filtered = existing.filter((d) => d.id !== id);
  setLocalDocuments(filtered);
  return true;
}
