import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'cover-letter',
  name: 'Executive Cover Letter',
  category: 'Career / Education',
  description: 'Polished job application cover letter with letterhead, hiring committee address, core value proposition, and professional sign-off.',
  tags: ['Cover Letter', 'Job Application', 'Career', 'Resume', 'Executive'],
  badges: ['Popular'],
  docNumberPrefix: 'CL',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Charcoal Minimal', description: 'Clean slate tones with high readability' },
    { id: 'classic', name: 'Oxford Navy', description: 'Deep navy accents, classic serif headings' },
    { id: 'bold', name: 'Emerald Executive', description: 'Emerald accent headers and modern styling' },
  ],
};

export default meta;
