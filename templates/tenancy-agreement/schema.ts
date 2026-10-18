import { TemplateSchema } from '@/lib/types';
import { numberToWords } from '@/lib/format';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'property_details',
      title: 'Premises & Lease Term',
      fields: [
        { name: 'docNumber', label: 'Agreement Reference #', type: 'text', default: 'TA-2026-012' },
        { name: 'agreementDate', label: 'Date of Execution', type: 'date', required: true, default: '2026-10-18' },
        { name: 'propertyAddress', label: 'Demised Premises (Full Address & Unit #)', type: 'textarea', required: true, default: 'Apartment 4B, Acacia Court, Rhapta Road, Westlands, Nairobi, LR No. 1870/IV/42' },
        { name: 'commencementDate', label: 'Lease Commencement Date', type: 'date', required: true, default: '2026-11-01' },
        { name: 'leaseTerm', label: 'Duration / Period', type: 'text', default: 'One (1) Year Renewable' },
      ],
    },
    {
      id: 'parties',
      title: 'Landlord & Tenant Particulars',
      fields: [
        { name: 'landlord.name', label: 'Landlord Full Legal Name', type: 'text', required: true, default: 'Ambassador James Karanja Gitau' },
        { name: 'landlord.idNumber', label: 'Landlord ID / Passport #', type: 'text', default: 'ID: 10482914' },
        { name: 'landlord.phone', label: 'Landlord Phone', type: 'phone', default: '+254 722 334 455' },
        { name: 'tenant.name', label: 'Tenant Full Legal Name', type: 'text', required: true, default: 'Brian Kiprop Cheruiyot' },
        { name: 'tenant.idNumber', label: 'Tenant ID / Passport #', type: 'text', required: true, default: 'ID: 29481923' },
        { name: 'tenant.phone', label: 'Tenant Phone', type: 'phone', default: '+254 718 200 300' },
        { name: 'tenant.email', label: 'Tenant Email', type: 'email', default: 'brian.cheruiyot@gmail.com' },
      ],
    },
    {
      id: 'financial_terms',
      title: 'Rent, Deposit & Utilities',
      fields: [
        { name: 'monthlyRent', label: 'Monthly Rent (KES)', type: 'currency', required: true, default: 65000 },
        { name: 'securityDeposit', label: 'Refundable Security Deposit (KES)', type: 'currency', required: true, default: 65000 },
        { name: 'waterElectricityDeposit', label: 'Utility Deposit (Water/Power) (KES)', type: 'currency', default: 10000 },
        { name: 'rentDueDay', label: 'Rent Due Day of Each Month', type: 'text', default: 'On or before the 5th day of every calendar month' },
        { name: 'mpesaAccount', label: 'Rent Payment Mode / M-Pesa / Bank', type: 'text', default: 'M-Pesa Paybill 247247 (Acc: 0722334455)' },
        { name: 'noticePeriod', label: 'Notice to Vacate Period', type: 'text', default: 'One (1) full calendar month in writing' },
      ],
    },
  ],
  computed: (data) => {
    const rent = Number(data.monthlyRent) || 0;
    return {
      grandTotal: rent,
      totalInWords: numberToWords(rent, data.currency || 'KES'),
    };
  },
};

export default schema;
