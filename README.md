# DocForge — Modern Web-Based Document Generator & PDF Engine

DocForge is a high-performance web-based document studio where users select from designer-crafted templates, fill out dynamic guided forms with real-time calculations, inspect live split-screen A4/Letter paper previews, and export pixel-perfect PDFs and native Microsoft Word (`.docx`) files.

---

## Key Features

1. **14 Designer-Grade Document Templates**
   - **Business:** Commercial Invoice, Official Receipt (with M-Pesa stamp), Quotation/Proforma, Purchase Order (LPO), Delivery Note, Payment Reminder Letter.
   - **Property & Legal:** Residential Tenancy Agreement (Kenyan Landlord/Tenant Act compliant), Rent Receipt, Formal Notice to Vacate.
   - **Career & Education:** Modern Tech CV / Resume, Formal Cover Letter, Certificate of Achievement with ornamental borders and seal.
   - **Executive & Administrative:** Board / Corporate Meeting Minutes (with action item tracker), Commercial MOU & Contract.

2. **Split-Screen WYSIWYG Editor**
   - Live paper sheet preview (A4 & Letter) with zoom controls (45% – 150%) and responsive fit.
   - Mobile-first adaptive layout: seamless toggle between form builder and live preview on phones/tablets.
   - Strict CSS print-media pagination: clean multi-page breaks, repeated table headers, and orphan/widow prevention.

3. **Dynamic Zod-Powered Form Engine**
   - Schema-driven fields: text, textarea, numeric, date pickers, dropdown selects, and dynamic repeat-groups (e.g. invoice line items).
   - Real-time automated calculations: line item subtotals, standard 16% VAT, customizable discounts, payments, balance due.
   - **Kenyan Localization:** Default KES currency formatting, number-to-words conversion (e.g. *"One hundred and twenty thousand shillings only"*), KRA PINs, and M-Pesa payment blocks.

4. **Digital Signature Modal**
   - **Draw:** Smooth HTML5 canvas signature capture with customizable ink thickness.
   - **Type:** Instant cursive signature generation from user's full name.
   - **Upload:** Direct PNG/JPEG image upload with automatic background blending.
   - Placed directly onto document sign-off blocks.

5. **Style Controls & Theming**
   - Document-level theme presets (*Classic Slate*, *Corporate Indigo*, *Emerald Prestige*, *Minimal Charcoal*, *Burgundy Executive*).
   - Designer font pairings (*Inter + Playfair Display*, *DM Sans + Lora*, *Manrope + Source Serif*).
   - Document density modes (*Compact* vs *Comfortable*).
   - Variant styles (*Classic*, *Modern*, *Minimal*).

6. **Unified Brand Kit**
   - One-click company profile synchronization across all templates: Company Logo, Trading Name, Physical Address, Phone, Email, KRA PIN, Bank Details, and M-Pesa Paybill/Till numbers.

7. **Export & Sharing**
   - **Server-Side PDF:** Headless Chromium/Edge rendering of the live preview DOM (`/api/export/pdf`), ensuring **preview == output** down to the single pixel.
   - **Native Microsoft Word DOCX:** Clean `.docx` generation via the `docx` library (`/api/export/docx`).
   - **Shareable Links:** Read-only permalinks (`/view/[id]`) for clients or partners to view and download documents directly.

8. **Persistence & Autosave**
   - Background autosave with debounced synchronization and status indicators (*Saving... / Saved*).
   - Documents Dashboard (`/dashboard`) with live search, status tags (*Draft*, *Sent*, *Paid*, *Signed*), duplicate, and delete actions.
   - Supabase PostgreSQL persistence with Row-Level Security (RLS) and automatic, zero-config local storage fallback.

---

## Tech Stack

- **Framework:** [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language:** TypeScript 5
- **Styling:** [Tailwind CSS v4](https://tailwindcss.com/)
- **Icons:** [Lucide React](https://lucide.dev/)
- **State Management:** [Zustand](https://github.com/pmndrs/zustand)
- **Validation:** [Zod](https://zod.dev/) & [React Hook Form](https://react-hook-form.com/)
- **PDF Generation:** [Puppeteer Core](https://pptr.dev/) (headless Chrome / Microsoft Edge)
- **DOCX Generation:** [`docx`](https://docx.js.org/)
- **Database / Auth:** [Supabase](https://supabase.com/) (PostgreSQL + RLS)

---

## Project Structure

```
docforge/
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── export/
│   │   │   │   ├── pdf/route.ts      # Headless browser PDF export
│   │   │   │   └── docx/route.ts     # Native Word DOCX export
│   │   ├── dashboard/page.tsx        # Saved documents dashboard
│   │   ├── editor/[slug]/page.tsx    # Split-screen editor studio
│   │   ├── templates/page.tsx        # Searchable template gallery
│   │   ├── view/[id]/page.tsx        # Shareable read-only viewer
│   │   ├── layout.tsx                # App layout & theme provider
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── brand/BrandKitModal.tsx   # Company branding profile modal
│   │   ├── doc/DocPage.tsx           # A4/Letter paper container
│   │   ├── editor/                   # FormPanel, PreviewPane, StyleDrawer, Toolbar
│   │   └── signature/SignatureModal.tsx # Draw/Type/Upload signature modal
│   ├── lib/
│   │   ├── calc.ts                   # Financial & tax calculation engine
│   │   ├── documents-repo.ts         # Supabase & offline storage repository
│   │   ├── format.ts                 # Currency, number-to-words, date utils
│   │   ├── registry.ts               # Template registry loader
│   │   ├── registry.generated.ts     # Auto-generated template registry
│   │   ├── schema-validator.ts       # Dynamic Zod form builder
│   │   ├── supabase.ts               # Supabase client singleton
│   │   ├── themes.ts                 # Color themes and font pairings
│   │   └── types.ts                  # Core TypeScript types
│   └── store/
│       ├── brandKit.ts               # Brand Kit store
│       └── editor.ts                 # Editor state & history store
├── templates/                        # Pluggable data-driven templates
│   ├── invoice/
│   ├── receipt/
│   ├── quotation/
│   ├── purchase-order/
│   ├── delivery-note/
│   ├── payment-reminder/
│   ├── tenancy-agreement/
│   ├── rent-receipt/
│   ├── notice-to-vacate/
│   ├── cv-modern/
│   ├── cover-letter/
│   ├── certificate/
│   ├── meeting-minutes/
│   └── contract-mou/
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Supabase tables and RLS policies
├── scripts/
│   └── gen-registry.js               # Automatic template discovery script
└── tests/
    ├── unit/                         # Unit tests (calculations, number-to-words)
    └── e2e/                          # Puppeteer end-to-end PDF & stress tests
```

---

## Getting Started

### 1. Installation

Clone the repository and install dependencies:

```bash
cd docforge
npm install
```

### 2. Environment Variables

Create a `.env.local` file in the project root:

```env
# Optional: Supabase configuration (app falls back to localStorage if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### 3. Run the Development Server

The template registry automatically synchronizes prior to starting the dev server:

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Production Build

```bash
npm run build
npm run start
```

---

## Supabase Database Setup (Optional)

If you wish to use cloud persistence and multi-device synchronization:

1. Create a new Supabase project at [https://supabase.com](https://supabase.com).
2. Go to the **SQL Editor** tab in the Supabase Dashboard.
3. Open `supabase/migrations/001_initial_schema.sql` and run the script.
4. Copy your Project URL and Anon API Key into `.env.local`.

The migration creates:
- `documents`: Document store with metadata, JSON document data, style tokens, and document status.
- `brand_kits`: User brand profiles (logo, colors, company info, tax details).
- **Row-Level Security (RLS)** policies ensuring users can only read, write, and delete their own documents.

---

## How to Add a New Template in Under 10 Minutes

DocForge utilizes a **zero-core-change** architecture. To add a new document type:

1. Create a new folder under `templates/<your-template-slug>/`.
2. Add the 5 required files:

### File 1: `meta.ts`
```typescript
import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  id: 'shipping-manifest',
  slug: 'shipping-manifest',
  name: 'Shipping Manifest & Waybill',
  description: 'Logistics cargo breakdown, consignee details, and clearance seals.',
  category: 'business',
  tags: ['Shipping', 'Logistics', 'Waybill'],
  popular: true,
  paperSizes: ['A4', 'Letter'],
  supportsMultiPage: true,
};
```

### File 2: `schema.ts`
Define your form sections and fields with types, validation, and auto-calculations:
```typescript
import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'general',
      title: 'Manifest Details',
      fields: [
        { id: 'trackingNumber', label: 'Waybill Number', type: 'text', required: true },
        { id: 'carrier', label: 'Carrier / Vessel', type: 'text', required: true },
        { id: 'dispatchDate', label: 'Dispatch Date', type: 'date', required: true },
      ],
    },
    {
      id: 'cargo',
      title: 'Cargo Items',
      repeatable: true,
      fields: [
        { id: 'description', label: 'Package Description', type: 'text', required: true },
        { id: 'weightKg', label: 'Weight (kg)', type: 'number', required: true },
      ],
    },
  ],
};
```

### File 3: `sample-data.json`
Provide realistic sample data so that gallery thumbnails and preview render instantly:
```json
{
  "trackingNumber": "WB-2026-8910",
  "carrier": "Kenya Airways Cargo",
  "dispatchDate": "2026-10-18",
  "cargo": [
    { "description": "High-Precision Medical Sensors", "weightKg": 42.5 }
  ]
}
```

### File 4: `Template.tsx`
Create the React document component. Use CSS variables (`var(--doc-primary)`, `var(--doc-accent)`) for themes:
```tsx
import React from 'react';

export default function ShippingManifestTemplate({ data, styles }: { data: any; styles?: any }) {
  return (
    <div className="space-y-6 text-slate-800">
      <div className="border-b-2 pb-4" style={{ borderColor: 'var(--doc-primary)' }}>
        <h1 className="text-2xl font-bold tracking-tight" style={{ color: 'var(--doc-primary)' }}>
          CARGO SHIPPING MANIFEST
        </h1>
        <p className="text-xs text-slate-500">Waybill: {data.trackingNumber}</p>
      </div>

      <div className="grid grid-cols-2 gap-4 text-xs">
        <div>
          <p className="font-semibold text-slate-400 uppercase">Carrier</p>
          <p className="font-medium text-slate-900">{data.carrier}</p>
        </div>
        <div>
          <p className="font-semibold text-slate-400 uppercase">Dispatch Date</p>
          <p className="font-medium text-slate-900">{data.dispatchDate}</p>
        </div>
      </div>
    </div>
  );
}
```

### File 5: `styles.css`
Add print-specific styles or theme variant rules:
```css
@media print {
  .manifest-table {
    page-break-inside: auto;
  }
}
```

### Automatic Registry Compilation
Run `npm run predev` (or simply `npm run dev`). The discovery script automatically detects your new folder, validates it, and registers it in the gallery and editor. **No core code changes needed.**

---

## Testing & Quality Assurance

DocForge includes automated test suites covering financial arithmetic, number-to-words localization, and end-to-end headless browser PDF generation.

### Unit Tests
Tests calculations (VAT 16%, balances, discount rounding) and number-to-words conversion across KES, USD, EUR, and GBP:

```bash
npm run test:unit
```

### End-to-End & Stress Tests
Launches headless Chromium / Edge to:
- Audit Gallery and Dashboard pages for 0 console errors.
- Render and export pixel-perfect PDFs across **all 14 templates**.
- Verify 50 line items table stress test with multi-page pagination.
- Verify Unicode & Non-Latin character rendering (Chinese, Arabic, Cyrillic, Emojis).
- Verify resilience against long overflowing strings (>250 characters).

```bash
npm run test:e2e
```

---

## License

MIT License. Built for modern document generation workflows.
