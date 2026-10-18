import { TemplateSchema } from '@/lib/types';
import { numberToWords } from '@/lib/format';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'receipt_meta',
      title: 'Rent Receipt Details',
      fields: [
        { name: 'docNumber', label: 'Receipt #', type: 'text', default: 'RR-2026-1048' },
        { name: 'date', label: 'Date Issued', type: 'date', required: true, default: '2026-10-18' },
        { name: 'monthPaidFor', label: 'Rent Period / Month Paid For', type: 'text', required: true, default: 'October 2026' },
        { name: 'mpesaCode', label: 'M-Pesa / Bank Reference Code', type: 'text', default: 'QL9012HK9A' },
      ],
    },
    {
      id: 'property_info',
      title: 'Property & Tenant Details',
      fields: [
        { name: 'landlord.name', label: 'Landlord / Property Manager', type: 'text', required: true, default: 'Ambassador James Karanja Gitau' },
        { name: 'landlord.phone', label: 'Landlord Phone', type: 'phone', default: '+254 722 334 455' },
        { name: 'tenant.name', label: 'Tenant Full Name', type: 'text', required: true, default: 'Brian Kiprop Cheruiyot' },
        { name: 'propertyAddress', label: 'Premises / Apartment & House #', type: 'text', required: true, default: 'Apt 4B, Acacia Court, Rhapta Rd, Westlands' },
      ],
    },
    {
      id: 'breakdown',
      title: 'Amount & Charges Breakdown',
      fields: [
        { name: 'rentAmount', label: 'Monthly Rent Amount (KES)', type: 'currency', required: true, default: 65000 },
        { name: 'serviceCharge', label: 'Service Charge / Water (KES)', type: 'currency', default: 5000 },
        { name: 'balanceCarriedForward', label: 'Arrears / Balance Remaining (KES)', type: 'currency', default: 0 },
      ],
    },
  ],
  computed: (data) => {
    const rent = Number(data.rentAmount) || 0;
    const sc = Number(data.serviceCharge) || 0;
    const total = rent + sc;
    return {
      grandTotal: total,
      totalInWords: numberToWords(total, data.currency || 'KES'),
    };
  },
};

export default schema;
