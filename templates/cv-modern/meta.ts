import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'cv-modern',
  name: 'Modern Executive CV / Resume',
  category: 'Career / Education',
  description: 'Contemporary two-column resume featuring structured work experience, technical competencies, education, and career achievements.',
  tags: ['CV', 'Resume', 'Tech', 'Career', 'Executive'],
  badges: ['Popular', 'New'],
  docNumberPrefix: 'CV',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Charcoal Minimal', description: 'Clean slate tones with high readability' },
    { id: 'classic', name: 'Oxford Navy', description: 'Deep navy accents, classic serif headings' },
    { id: 'bold', name: 'Teal Contemporary', description: 'Modern deep teal highlights and crisp timeline borders' },
  ],
};

export default meta;
