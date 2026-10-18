import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'payment-reminder',
  name: 'Payment Reminder Letter',
  category: 'Business',
  description: 'Formal overdue payment reminder citing invoice number, overdue days, outstanding balance, and settlement bank/M-Pesa details.',
  tags: ['Reminder', 'Overdue', 'Debt', 'Billing', 'Letter'],
  badges: ['Popular'],
  docNumberPrefix: 'REM',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Executive Navy', description: 'Formal executive tone with clear invoice callouts' },
    { id: 'classic', name: 'Amber Notice', description: 'Subtle urgency with amber warning badges' },
    { id: 'bold', name: 'Slate Legal', description: 'Firm legal typography' },
  ],
};

export default meta;
