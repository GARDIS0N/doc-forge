import { TemplateSchema } from '@/lib/types';

export const schema: TemplateSchema = {
  sections: [
    {
      id: 'cert_details',
      title: 'Award Particulars',
      fields: [
        { name: 'docNumber', label: 'Certificate ID #', type: 'text', default: 'CERT-2026-092' },
        { name: 'certificateTitle', label: 'Certificate Title', type: 'text', required: true, default: 'CERTIFICATE OF ACHIEVEMENT' },
        { name: 'presentedToText', label: 'Presentation Lead', type: 'text', default: 'This prestigious certificate is proudly presented to' },
        { name: 'recipientName', label: 'Recipient Full Name', type: 'text', required: true, default: 'David Kimani Mwangi' },
        { name: 'reasonText', label: 'Achievement Reason / Citation', type: 'textarea', required: true, default: 'For outstanding technical leadership and exemplary contributions in developing the 2026 National Cloud Infrastructure & Distributed Payment Architecture.' },
        { name: 'issuerName', label: 'Issuing Organization', type: 'text', required: true, default: 'East African Institute of Software Architects' },
        { name: 'date', label: 'Conferment Date', type: 'date', default: '2026-10-18' },
        { name: 'authority1', label: 'Primary Signatory (President / Director)', type: 'text', default: 'Prof. Peter N. Waweru (President)' },
        { name: 'authority2', label: 'Secondary Signatory (Registrar / Dean)', type: 'text', default: 'Dr. Amina Hassan (Academic Dean)' },
      ],
    },
  ],
};

export default schema;
