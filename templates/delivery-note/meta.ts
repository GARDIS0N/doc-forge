import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'delivery-note',
  name: 'Delivery & Dispatch Note',
  category: 'Business',
  description: 'Proof of dispatch and delivery with dispatch vehicle, package count, driver details, and recipient sign-off acknowledging goods received in good condition.',
  tags: ['Delivery', 'Dispatch', 'Logistics', 'Warehouse', 'Proof of Delivery'],
  badges: ['New'],
  docNumberPrefix: 'DN',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Emerald Logistics', description: 'Clean dispatch styling with recipient checklist' },
    { id: 'classic', name: 'Navy Formal', description: 'Traditional transport & courier receipt' },
    { id: 'bold', name: 'Slate Industrial', description: 'High contrast warehouse delivery note' },
  ],
};

export default meta;
