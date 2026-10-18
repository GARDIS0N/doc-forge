import { TemplateSchema } from '@/lib/types';
import { numberToWords } from '@/lib/format';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'contract_meta',
      title: 'Contract Agreement Details',
      fields: [
        { name: 'docNumber', label: 'Agreement Ref #', type: 'text', default: 'MOU-2026-088' },
        { name: 'agreementTitle', label: 'Agreement Title', type: 'text', required: true, default: 'MEMORANDUM OF UNDERSTANDING & SERVICE LEVEL AGREEMENT' },
        { name: 'effectiveDate', label: 'Effective Date', type: 'date', required: true, default: '2026-10-18' },
        { name: 'expiryDate', label: 'Termination / Expiry Date', type: 'date', default: '2027-10-17' },
      ],
    },
    {
      id: 'parties',
      title: 'Contracting Parties',
      fields: [
        { name: 'partyA.name', label: 'Party A (Service Provider / First Party)', type: 'text', required: true, default: 'Apex Digital Solutions Ltd' },
        { name: 'partyA.representative', label: 'Party A Representative & Title', type: 'text', default: 'David Mwangi (Principal Solutions Architect)' },
        { name: 'partyA.address', label: 'Party A Physical Address', type: 'textarea', default: 'The Promenade, General Mathenge Dr, Westlands, Nairobi' },
        { name: 'partyB.name', label: 'Party B (Client / Second Party)', type: 'text', required: true, default: 'Savannah Logistics Kenya Ltd' },
        { name: 'partyB.representative', label: 'Party B Representative & Title', type: 'text', default: 'Patrick Mutisya (Managing Director)' },
        { name: 'partyB.address', label: 'Party B Physical Address', type: 'textarea', default: 'Kilindini Port View Plaza, Moi Avenue, Mombasa' },
      ],
    },
    {
      id: 'terms_obligations',
      title: 'Scope, Consideration & Covenants',
      fields: [
        { name: 'contractValue', label: 'Total Contract Value (KES)', type: 'currency', default: 1200000 },
        { name: 'purpose', label: 'Purpose & Project Scope', type: 'textarea', required: true, default: 'Development, deployment, and 24/7 cloud support of an automated real-time dispatch management system and integrated M-Pesa automated reconciliation engine.' },
        { name: 'obligations', label: 'Mutual Obligations & Milestones', type: 'textarea', default: '1. Party A shall engineer and deploy the software platform adhering to agreed SLA uptime standards (99.9%).\n2. Party B shall facilitate API access and disburse milestone settlements within 14 days of invoice issuance.\n3. Both parties commit to strict mutual non-disclosure and intellectual property protection.' },
      ],
    },
  ],
  computed: (data) => {
    const val = Number(data.contractValue) || 0;
    return {
      grandTotal: val,
      totalInWords: numberToWords(val, data.currency || 'KES'),
    };
  },
};

export default schema;
