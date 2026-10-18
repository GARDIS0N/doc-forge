import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'tenancy-agreement',
  name: 'Residential Tenancy Agreement',
  category: 'Property / Legal',
  description: 'Comprehensive Kenyan residential tenancy agreement with Landlord, Tenant, Monthly Rent, Deposit, Maintenance covenants, and Witness signatures.',
  tags: ['Tenancy', 'Lease', 'Rent', 'Property', 'Legal Agreement'],
  badges: ['Popular'],
  docNumberPrefix: 'TA',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Legal Executive', description: 'Clean legal typography with formal covenants' },
    { id: 'classic', name: 'Traditional Parchment', description: 'Classic deed and leasehold presentation' },
    { id: 'bold', name: 'Slate Modern', description: 'High-contrast contemporary lease' },
  ],
};

export default meta;
