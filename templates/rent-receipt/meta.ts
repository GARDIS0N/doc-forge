import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'rent-receipt',
  name: 'House Rent Receipt',
  category: 'Property / Legal',
  description: 'Landlord and estate agency rental acknowledgement receipt with house number, rental month, and M-Pesa transaction reference.',
  tags: ['Rent Receipt', 'Landlord', 'Property', 'Apartment', 'Tenancy'],
  badges: ['Popular'],
  docNumberPrefix: 'RR',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Estate Navy', description: 'Clean landlord & estate management receipt' },
    { id: 'classic', name: 'Emerald Trust', description: 'Warm emerald tones with clear rent period ledger' },
    { id: 'bold', name: 'Slate Corporate', description: 'Monochrome property agency receipt' },
  ],
};

export default meta;
