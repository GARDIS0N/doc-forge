import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'notice-to-vacate',
  name: 'Notice to Vacate Premises',
  category: 'Property / Legal',
  description: 'Formal legal notice from landlord or tenant to terminate tenancy, specifying surrender date, final inspection, and deposit refund terms.',
  tags: ['Notice to Vacate', 'Eviction', 'Tenancy', 'Landlord', 'Legal Notice'],
  badges: ['New'],
  docNumberPrefix: 'NTV',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Legal Minimal', description: 'Clean statutory legal notice formatting' },
    { id: 'classic', name: 'Navy Formal', description: 'Traditional formal notice' },
    { id: 'bold', name: 'Amber Notice', description: 'Firm notice with clear deadline callouts' },
  ],
};

export default meta;
