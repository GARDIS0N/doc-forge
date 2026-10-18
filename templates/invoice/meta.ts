import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'invoice',
  name: 'Standard Business Invoice',
  category: 'Business',
  description: 'Clean, professional tax invoice with Kenyan VAT (16%), M-Pesa / Bank payment details, KRA PIN, and itemized line calculations.',
  tags: ['Invoice', 'Tax', 'VAT 16%', 'Billing', 'M-Pesa'],
  badges: ['Popular'],
  docNumberPrefix: 'INV',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Modern Minimal', description: 'Clean slate grey with subtle borders and clear typography' },
    { id: 'classic', name: 'Executive Navy', description: 'Deep navy accents, classic serif headers, corporate feel' },
    { id: 'bold', name: 'Emerald Emerald', description: 'Vibrant Kenyan emerald green accents with bold contrast' },
  ],
};

export default meta;
