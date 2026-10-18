import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'notice_data',
      title: 'Notice & Handover Dates',
      fields: [
        { name: 'docNumber', label: 'Notice Ref #', type: 'text', default: 'NTV-2026-0089' },
        { name: 'noticeDate', label: 'Date of Notice', type: 'date', required: true, default: '2026-10-18' },
        { name: 'vacateDate', label: 'Effective Vacation & Surrender Date', type: 'date', required: true, default: '2026-11-30' },
        { name: 'inspectionDate', label: 'Scheduled Joint Inspection Date', type: 'date', default: '2026-11-28' },
      ],
    },
    {
      id: 'parties',
      title: 'Landlord & Tenant',
      fields: [
        { name: 'landlord.name', label: 'Landlord / Agent Name', type: 'text', required: true, default: 'Ambassador James Karanja Gitau' },
        { name: 'landlord.phone', label: 'Landlord Contact', type: 'phone', default: '+254 722 334 455' },
        { name: 'tenant.name', label: 'Tenant Full Name', type: 'text', required: true, default: 'Brian Kiprop Cheruiyot' },
        { name: 'propertyAddress', label: 'Premises Address', type: 'textarea', required: true, default: 'Apartment 4B, Acacia Court, Rhapta Road, Westlands, Nairobi' },
      ],
    },
    {
      id: 'notice_details',
      title: 'Notice Terms & Key Surrender Instructions',
      fields: [
        { name: 'reason', label: 'Reason for Notice', type: 'textarea', default: 'Owner repossession for scheduled extensive property renovation and personal occupancy.' },
        { name: 'handoverInstructions', label: 'Handover Instructions', type: 'textarea', default: '1. Hand over all keys and gate remotes on or before 5:00 PM on 30th November 2026.\n2. Ensure all electricity (KPLC token meter) and water utility bills are cleared to date.\n3. The refundable security deposit of KES 65,000 will be refunded within 14 days of handover.' },
      ],
    },
  ],
};

export default schema;
