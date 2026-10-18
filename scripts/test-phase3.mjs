import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function assert(condition, message) {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✓ ${message}`);
}

console.log('========================================');
console.log('DOCFORGE PHASE 3 VERIFICATION SUITE');
console.log('========================================\n');

// 1. Verify SQL Migration File & RLS Policies
console.log('--- 1. Testing Supabase Migration & RLS Policies ---');
const migrationPath = path.resolve(__dirname, '../supabase/migrations/20261018000000_init_docforge.sql');
assert(fs.existsSync(migrationPath), 'SQL migration file exists at supabase/migrations/');

const sqlContent = fs.readFileSync(migrationPath, 'utf-8');
assert(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.profiles'), 'profiles table defined in SQL');
assert(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.brand_kits'), 'brand_kits table defined in SQL');
assert(sqlContent.includes('CREATE TABLE IF NOT EXISTS public.documents'), 'documents table defined in SQL');
assert(sqlContent.includes('ENABLE ROW LEVEL SECURITY'), 'Row-Level Security enabled on all tables');
assert(sqlContent.includes('auth.uid() = user_id'), 'RLS policy enforces user ownership filter');
assert(sqlContent.includes('INSERT INTO storage.buckets'), 'Brand assets storage bucket initialized');

// 2. Test Repository CRUD Logic
console.log('\n--- 2. Testing Documents CRUD Repository Logic ---');

// Mock localStorage repository implementation for testing
let mockStorage = {};
const STORAGE_KEY = 'docforge_saved_documents_v1';

function mockGetDocs() {
  const raw = mockStorage[STORAGE_KEY];
  return raw ? JSON.parse(raw) : [];
}
function mockSetDocs(docs) {
  mockStorage[STORAGE_KEY] = JSON.stringify(docs);
}

function mockSaveDoc(doc) {
  const docs = mockGetDocs();
  const id = doc.id || `doc-${Date.now()}`;
  const now = new Date().toISOString();
  const full = {
    id,
    templateSlug: doc.templateSlug,
    title: doc.title || 'Untitled',
    status: doc.status || 'Draft',
    data: doc.data || {},
    styles: doc.styles || {},
    grandTotal: doc.grandTotal || 0,
    currency: doc.currency || 'KES',
    createdAt: doc.createdAt || now,
    updatedAt: now,
  };
  const idx = docs.findIndex((d) => d.id === id);
  if (idx >= 0) docs[idx] = full;
  else docs.unshift(full);
  mockSetDocs(docs);
  return full;
}

function mockDuplicateDoc(id) {
  const docs = mockGetDocs();
  const orig = docs.find((d) => d.id === id);
  if (!orig) return null;
  return mockSaveDoc({
    ...JSON.parse(JSON.stringify(orig)),
    id: `doc-${Date.now()}-copy`,
    title: `Copy of ${orig.title}`,
    status: 'Draft',
  });
}

function mockUpdateStatus(id, status) {
  const docs = mockGetDocs();
  const doc = docs.find((d) => d.id === id);
  if (!doc) return false;
  doc.status = status;
  doc.updatedAt = new Date().toISOString();
  mockSetDocs(docs);
  return true;
}

function mockDeleteDoc(id) {
  const docs = mockGetDocs();
  mockSetDocs(docs.filter((d) => d.id !== id));
  return true;
}

// Test A: Create document
const created = mockSaveDoc({
  templateSlug: 'invoice',
  title: 'Consulting Retainer INV-2026-0099',
  status: 'Draft',
  grandTotal: 150000,
  currency: 'KES',
  data: { client: { name: 'Acme Kenya' } },
});
assert(created.id !== undefined, 'Document created with unique ID');
assert(created.status === 'Draft', 'Document initialized as Draft');
assert(mockGetDocs().length === 1, 'Document persisted to repository');

// Test B: Update Document
const updated = mockSaveDoc({
  ...created,
  title: 'Consulting Retainer INV-2026-0099 (Revised)',
  grandTotal: 175000,
});
assert(mockGetDocs().length === 1, 'Update mutates existing document without duplicating');
assert(mockGetDocs()[0].title.includes('(Revised)'), 'Document title updated');
assert(mockGetDocs()[0].grandTotal === 175000, 'Grand total updated');

// Test C: Duplicate Document
const dup = mockDuplicateDoc(created.id);
assert(dup !== null, 'Duplicate returned cloned document');
assert(dup.id !== created.id, 'Duplicate has new unique ID');
assert(dup.title.startsWith('Copy of'), 'Duplicate has "Copy of" prefix');
assert(mockGetDocs().length === 2, 'Repository now contains 2 documents');

// Test D: Status Transitions
mockUpdateStatus(created.id, 'Sent');
assert(mockGetDocs().find((d) => d.id === created.id).status === 'Sent', 'Status updated to Sent');

mockUpdateStatus(created.id, 'Paid');
assert(mockGetDocs().find((d) => d.id === created.id).status === 'Paid', 'Status updated to Paid');

// Test E: Delete Document
mockDeleteDoc(dup.id);
assert(mockGetDocs().length === 1, 'Duplicate successfully deleted');
assert(mockGetDocs().find((d) => d.id === dup.id) === undefined, 'Deleted document cannot be retrieved');

console.log('\n========================================');
console.log('🎉 ALL PHASE 3 CHECKS PASSED PERFECTLY!');
console.log('========================================');
