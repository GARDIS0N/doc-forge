import { TemplateSchema } from '@/lib/types';
import { calculateInvoice } from '@/lib/calc';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'doc_info',
      title: 'Invoice Details',
      description: 'Document identification and dates',
      fields: [
        {
          name: 'docNumber',
          label: 'Invoice Number',
          type: 'text',
          required: true,
          default: 'INV-2026-0042',
          placeholder: 'e.g. INV-2026-0042',
        },
        {
          name: 'issueDate',
          label: 'Issue Date',
          type: 'date',
          required: true,
          default: '2026-10-17',
        },
        {
          name: 'dueDate',
          label: 'Due Date',
          type: 'date',
          required: true,
          default: '2026-11-01',
        },
        {
          name: 'currency',
          label: 'Currency',
          type: 'select',
          default: 'KES',
          options: [
            { label: 'KES - Kenyan Shillings', value: 'KES' },
            { label: 'USD - US Dollars', value: 'USD' },
            { label: 'EUR - Euros', value: 'EUR' },
            { label: 'GBP - British Pounds', value: 'GBP' },
          ],
        },
      ],
    },
    {
      id: 'sender_info',
      title: 'Your Business Details (Seller)',
      description: 'Information appearing on your invoice header',
      fields: [
        {
          name: 'sender.businessName',
          label: 'Business Name',
          type: 'text',
          required: true,
          default: 'Apex Digital Solutions Ltd',
        },
        {
          name: 'sender.tagline',
          label: 'Tagline / Slogan',
          type: 'text',
          default: 'Enterprise Software & Cloud Architecture',
        },
        {
          name: 'sender.email',
          label: 'Email Address',
          type: 'email',
          required: true,
          default: 'billing@apexdigital.co.ke',
        },
        {
          name: 'sender.phone',
          label: 'Phone Number',
          type: 'phone',
          default: '+254 712 345 678',
        },
        {
          name: 'sender.address',
          label: 'Physical Address',
          type: 'textarea',
          default: 'Suite 4B, The Promenade, General Mathenge Drive, Westlands, Nairobi, Kenya',
        },
        {
          name: 'sender.kraPin',
          label: 'KRA PIN',
          type: 'text',
          default: 'P051234567Z',
          placeholder: 'e.g. P051234567Z',
        },
      ],
    },
    {
      id: 'client_info',
      title: 'Billed To (Client)',
      description: 'Recipient information',
      fields: [
        {
          name: 'client.name',
          label: 'Client / Company Name',
          type: 'text',
          required: true,
          default: 'Savannah Logistics Kenya Ltd',
        },
        {
          name: 'client.contactPerson',
          label: 'Attention / Contact Person',
          type: 'text',
          default: 'Ms. Faith Wangari (Finance Director)',
        },
        {
          name: 'client.email',
          label: 'Client Email',
          type: 'email',
          default: 'finance@savannahlogistics.co.ke',
        },
        {
          name: 'client.address',
          label: 'Client Address',
          type: 'textarea',
          default: 'Kilindini Port View Plaza, 3rd Floor, Mombasa, Kenya',
        },
        {
          name: 'client.kraPin',
          label: 'Client KRA PIN',
          type: 'text',
          default: 'P059876543A',
        },
      ],
    },
    {
      id: 'items_section',
      title: 'Line Items',
      description: 'Add billable products or services',
      fields: [
        {
          name: 'items',
          label: 'Items',
          type: 'repeater',
          addLabel: '+ Add Line Item',
          default: [
            {
              description: 'Next.js Web Portal Development & API Integrations',
              qty: 1,
              unitPrice: 150000,
            },
            {
              description: 'Cloud Infrastructure Setup & CI/CD Pipeline (AWS & Supabase)',
              qty: 1,
              unitPrice: 65000,
            },
            {
              description: 'Annual Maintenance & 24/7 Production SLA (Q4 2026)',
              qty: 3,
              unitPrice: 20000,
            },
          ],
          fields: [
            {
              name: 'description',
              label: 'Description',
              type: 'text',
              required: true,
              placeholder: 'Item or service description',
            },
            {
              name: 'qty',
              label: 'Qty / Hours',
              type: 'number',
              default: 1,
              min: 0.1,
            },
            {
              name: 'unitPrice',
              label: 'Unit Price',
              type: 'currency',
              default: 0,
              min: 0,
            },
          ],
        },
      ],
    },
    {
      id: 'tax_payment',
      title: 'Taxes & Totals',
      description: 'VAT and payment deductions',
      fields: [
        {
          name: 'applyVat',
          label: 'Apply VAT (16% Kenya)',
          type: 'switch',
          default: true,
        },
        {
          name: 'vatRate',
          label: 'VAT Rate (%)',
          type: 'number',
          default: 16,
          showIf: { field: 'applyVat', equals: true },
        },
        {
          name: 'amountPaid',
          label: 'Amount Already Paid',
          type: 'currency',
          default: 100000,
        },
      ],
    },
    {
      id: 'payment_methods',
      title: 'Payment Details',
      description: 'Bank account and M-Pesa details for payment settlement',
      fields: [
        {
          name: 'payment.bankName',
          label: 'Bank Name',
          type: 'text',
          default: 'NCBA Bank Kenya PLC',
        },
        {
          name: 'payment.accountName',
          label: 'Account Name',
          type: 'text',
          default: 'Apex Digital Solutions Ltd',
        },
        {
          name: 'payment.accountNumber',
          label: 'Account Number',
          type: 'text',
          default: '8492019482',
        },
        {
          name: 'payment.branch',
          label: 'Branch',
          type: 'text',
          default: 'Westlands Branch (Code: 07000)',
        },
        {
          name: 'payment.mpesaPaybill',
          label: 'M-Pesa Paybill / Till Number',
          type: 'text',
          default: '522522 (Acc: 8492019482)',
        },
      ],
    },
    {
      id: 'notes_section',
      title: 'Notes & Terms',
      description: 'Standard payment terms and footer note',
      fields: [
        {
          name: 'terms',
          label: 'Payment Terms',
          type: 'textarea',
          default: 'Payment is due within 14 days of invoice date. Late payments may attract a 2% monthly finance fee.',
        },
        {
          name: 'footerNote',
          label: 'Footer Note',
          type: 'text',
          default: 'Thank you for your business. For any inquiries, please contact accounts@apexdigital.co.ke',
        },
      ],
    },
  ],
  computed: (data) => {
    return calculateInvoice({
      items: data.items,
      applyVat: data.applyVat,
      vatRate: data.vatRate,
      amountPaid: data.amountPaid,
      currency: data.currency,
    });
  },
};

export default schema;
