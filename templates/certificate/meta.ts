import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'certificate',
  name: 'Certificate of Achievement',
  category: 'Career / Education',
  description: 'Formal award certificate with ornamental certificate border, recipient dedication, issuing authority seal, and date stamp.',
  tags: ['Certificate', 'Award', 'Achievement', 'Education', 'Diploma'],
  badges: ['Popular', 'New'],
  docNumberPrefix: 'CERT',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Royal Gold', description: 'Classic gold border with academic prestige' },
    { id: 'classic', name: 'Navy Scholastic', description: 'Navy ornamental borders with formal calligraphy' },
    { id: 'bold', name: 'Emerald Honor', description: 'Kenyan emerald green certificate styling' },
  ],
};

export default meta;
