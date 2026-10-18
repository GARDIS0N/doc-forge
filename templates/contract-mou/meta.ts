import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'contract-mou',
  name: 'Service Contract & MOU',
  category: 'Other',
  description: 'Memorandum of Understanding & Service Level Agreement outlining commercial scope, mutual obligations, confidentiality, and signatures.',
  tags: ['Contract', 'MOU', 'Agreement', 'Legal', 'Commercial Agreement'],
  badges: ['Popular', 'New'],
  docNumberPrefix: 'MOU',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Executive Navy', description: 'Clean legal covenants with prominent party clauses' },
    { id: 'classic', name: 'Legal Minimal', description: 'Classic deed presentation with formal seals' },
    { id: 'bold', name: 'Slate Enterprise', description: 'Contemporary commercial contract layout' },
  ],
};

export default meta;
