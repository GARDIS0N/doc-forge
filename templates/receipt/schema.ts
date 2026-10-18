import { TemplateSchema } from '@/lib/types';
import { numberToWords } from '@/lib/format';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'receipt_details',
      title: 'Receipt Details',
      fields: [
        { name: 'docNumber', label: 'Receipt Number', type: 'text', required: true, default: 'REC-2026-0819' },
        { name: 'date', label: 'Receipt Date', type: 'date', required: true, default: '2026-10-18' },
        {
          name: 'paymentMethod',
          label: 'Payment Method',
          type: 'select',
          default: 'M-Pesa',
          options: [
            { label: 'M-Pesa Mobile Money', value: 'M-Pesa' },
            { label: 'Bank Electronic Transfer (EFT / RTGS)', value: 'Bank Transfer' },
            { label: 'Pesalink Instant Interbank', value: 'Pesalink' },
            { label: 'Cash / Cheque', value: 'Cash' },
          ],
        },
        { name: 'mpesaReference', label: 'M-Pesa / Bank Transaction Reference Code', type: 'text', default: 'QKH8912PZ4', placeholder: 'e.g. QKH8912PZ4' },
      ],
    },
    {
      id: 'parties',
      title: 'Received From & Issuer',
      fields: [
        { name: 'sender.businessName', label: 'Issuing Organization', type: 'text', required: true, default: 'Apex Digital Solutions Ltd' },
        { name: 'sender.kraPin', label: 'Issuer KRA PIN', type: 'text', default: 'P051234567Z' },
        { name: 'receivedFrom.name', label: 'Received From (Customer / Client)', type: 'text', required: true, default: 'Savannah Logistics Kenya Ltd' },
        { name: 'receivedFrom.contact', label: 'Contact Person / Phone', type: 'text', default: 'Faith Wangari (+254 712 999 888)' },
      ],
    },
    {
      id: 'payment_breakdown',
      title: 'Payment Particulars',
      fields: [
        { name: 'amountPaid', label: 'Amount Received (KES)', type: 'currency', required: true, default: 215000 },
        { name: 'forPaymentOf', label: 'Being Payment For (Purpose)', type: 'textarea', required: true, default: 'Full settlement for Q4 Enterprise Web Portal Deployment and Cloud Infrastructure configuration as per Invoice INV-2026-0042.' },
        { name: 'balanceRemaining', label: 'Remaining Balance (if any)', type: 'currency', default: 0 },
        { name: 'receivedBy', label: 'Received & Authorized By', type: 'text', default: 'Mercy Achieng (Chief Accountant)' },
      ],
    },
  ],
  computed: (data) => {
    const amt = Number(data.amountPaid) || 0;
    return {
      grandTotal: amt,
      totalInWords: numberToWords(amt, data.currency || 'KES'),
    };
  },
};

export default schema;
