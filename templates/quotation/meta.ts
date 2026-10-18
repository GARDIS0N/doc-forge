import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'quotation',
  name: 'Formal Price Quotation',
  category: 'Business',
  description: 'Commercial quotation with validity window, itemized scope, optional VAT 16%, and client acceptance sign-off block.',
  tags: ['Quotation', 'Estimate', 'Proposal', 'Commercial'],
  badges: ['Popular'],
  docNumberPrefix: 'QUO',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Pacific Blue', description: 'Contemporary corporate blue with clean grid' },
    { id: 'classic', name: 'Navy Executive', description: 'Traditional formal quotation style' },
    { id: 'bold', name: 'Charcoal Minimal', description: 'Monochrome minimalist presentation' },
  ],
};

export default meta;
