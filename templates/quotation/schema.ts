import { TemplateSchema } from '@/lib/types';
import { calculateInvoice } from '@/lib/calc';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'quote_info',
      title: 'Quotation Details',
      fields: [
        { name: 'docNumber', label: 'Quote Number', type: 'text', required: true, default: 'QUO-2026-0158' },
        { name: 'date', label: 'Quotation Date', type: 'date', required: true, default: '2026-10-18' },
        { name: 'validUntil', label: 'Valid Until Date', type: 'date', required: true, default: '2026-11-18' },
        { name: 'preparedBy', label: 'Prepared By (Account Executive)', type: 'text', default: 'Kevin Omondi (Commercial Director)' },
      ],
    },
    {
      id: 'parties',
      title: 'Issuer & Prospective Client',
      fields: [
        { name: 'sender.businessName', label: 'Company Name', type: 'text', required: true, default: 'Apex Digital Solutions Ltd' },
        { name: 'sender.email', label: 'Email', type: 'email', default: 'sales@apexdigital.co.ke' },
        { name: 'sender.phone', label: 'Phone', type: 'phone', default: '+254 712 345 678' },
        { name: 'client.name', label: 'Quoted To (Client)', type: 'text', required: true, default: 'Rift Valley Agribusiness Hub Ltd' },
        { name: 'client.contactPerson', label: 'Contact Person', type: 'text', default: 'Dr. Samuel Kiptoo (Operations Head)' },
        { name: 'client.email', label: 'Client Email', type: 'email', default: 'procurement@riftvalleyagri.com' },
      ],
    },
    {
      id: 'items_section',
      title: 'Products / Services Scope',
      fields: [
        {
          name: 'items',
          label: 'Quotation Line Items',
          type: 'repeater',
          addLabel: '+ Add Quoted Item',
          fields: [
            { name: 'description', label: 'Description & Scope', type: 'text', required: true },
            { name: 'qty', label: 'Quantity', type: 'number', default: 1 },
            { name: 'unitPrice', label: 'Unit Price', type: 'currency', default: 0 },
          ],
        },
      ],
    },
    {
      id: 'tax_terms',
      title: 'Taxation & Acceptance Terms',
      fields: [
        { name: 'applyVat', label: 'Apply VAT (16%)', type: 'switch', default: true },
        { name: 'terms', label: 'Terms & Conditions', type: 'textarea', default: '1. Prices remain valid for 30 calendar days.\n2. 50% mobilization advance upon contract signing; balance on delivery.\n3. Delivery timeframe: 4 weeks from LPO issuance.' },
      ],
    },
  ],
  computed: (data) => calculateInvoice({
    items: data.items,
    applyVat: data.applyVat,
    vatRate: 16,
    currency: data.currency,
  }),
};

export default schema;
