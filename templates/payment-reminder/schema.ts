import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'letter_info',
      title: 'Reminder Particulars',
      fields: [
        { name: 'docNumber', label: 'Reference Number', type: 'text', default: 'REM-2026-0044' },
        { name: 'date', label: 'Letter Date', type: 'date', required: true, default: '2026-10-18' },
        { name: 'invoiceRef', label: 'Overdue Invoice Number', type: 'text', required: true, default: 'INV-2026-0042' },
        { name: 'invoiceDate', label: 'Original Invoice Date', type: 'date', default: '2026-09-01' },
        { name: 'amountDue', label: 'Outstanding Balance (KES)', type: 'currency', required: true, default: 149400 },
        { name: 'daysOverdue', label: 'Days Overdue', type: 'number', default: 32 },
      ],
    },
    {
      id: 'parties',
      title: 'Sender & Recipient',
      fields: [
        { name: 'sender.businessName', label: 'Your Business Name', type: 'text', required: true, default: 'Apex Digital Solutions Ltd' },
        { name: 'sender.phone', label: 'Accounts Contact Phone', type: 'phone', default: '+254 712 345 678' },
        { name: 'sender.email', label: 'Accounts Contact Email', type: 'email', default: 'billing@apexdigital.co.ke' },
        { name: 'recipient.name', label: 'Recipient Organization', type: 'text', required: true, default: 'Savannah Logistics Kenya Ltd' },
        { name: 'recipient.attention', label: 'Attention (Contact Person)', type: 'text', default: 'Mr. Patrick Mutisya (Managing Director)' },
        { name: 'recipient.address', label: 'Recipient Physical Address', type: 'textarea', default: 'Kilindini Port View Plaza, Moi Avenue, Mombasa' },
      ],
    },
    {
      id: 'body_content',
      title: 'Letter Body & Settlement Details',
      fields: [
        { name: 'subject', label: 'Subject Line', type: 'text', default: 'OVERDUE PAYMENT REMINDER: INVOICE INV-2026-0042' },
        { name: 'bodyParagraphs', label: 'Body Text', type: 'textarea', default: 'We are writing to bring to your attention that the outstanding balance of KES 149,400.00 for services rendered under Invoice INV-2026-0042 remains unpaid and is now 32 days overdue.\n\nWe value our working partnership with Savannah Logistics and kindly request you to prioritize the settlement of this account within five (5) business days.\n\nIf payment has already been initiated, please accept our thanks and forward the remittance advice or M-Pesa transaction reference to billing@apexdigital.co.ke.' },
        { name: 'paymentInstructions', label: 'Remittance Instructions', type: 'textarea', default: 'Payment may be remitted via NCBA Bank (Acc: 8492019482) or M-Pesa Paybill: 522522 (Account: 8492019482).' },
        { name: 'signatory', label: 'Signatory Name & Title', type: 'text', default: 'Charles Ndung\'u (Finance & Credit Controller)' },
      ],
    },
  ],
  computed: (data) => ({
    grandTotal: Number(data.amountDue) || 0,
  }),
};

export default schema;
