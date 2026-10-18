import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'receipt',
  name: 'Official Payment Receipt',
  category: 'Business',
  description: 'Official acknowledgement of payment with M-Pesa transaction reference, cash/bank modes, and stamp endorsement.',
  tags: ['Receipt', 'M-Pesa', 'Payment Confirmation', 'Finance'],
  badges: ['Popular'],
  docNumberPrefix: 'REC',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Emerald Clean', description: 'Kenyan financial green with crisp typography' },
    { id: 'classic', name: 'Navy Official', description: 'Formal navy borders with traditional receipt seals' },
    { id: 'bold', name: 'Slate Minimal', description: 'Clean monochrome layout' },
  ],
};

export default meta;
