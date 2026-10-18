import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'purchase-order',
  name: 'Commercial Purchase Order (LPO)',
  category: 'Business',
  description: 'Official procurement purchase order with vendor details, delivery address, itemized goods, and authorizing signatures.',
  tags: ['Purchase Order', 'LPO', 'Procurement', 'Order'],
  badges: ['Popular'],
  docNumberPrefix: 'PO',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Navy Procurement', description: 'Executive navy headers and clean item ledger' },
    { id: 'classic', name: 'Corporate Gold', description: 'Classic corporate procurement layout' },
    { id: 'bold', name: 'Slate Industrial', description: 'Heavy borders and industrial clarity' },
  ],
};

export default meta;
