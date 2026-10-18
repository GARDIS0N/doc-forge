import { TemplateMeta } from '@/lib/types';

export const meta: TemplateMeta = {
  slug: 'meeting-minutes',
  name: 'Corporate Meeting Minutes',
  category: 'Other',
  description: 'Structured formal meeting minutes with attendees list, apologies, agenda items, resolutions, and an action items tracker table.',
  tags: ['Meeting Minutes', 'Board Meeting', 'Governance', 'Corporate', 'Action Items'],
  badges: ['Popular'],
  docNumberPrefix: 'MIN',
  paper: 'A4',
  variants: [
    { id: 'modern', name: 'Executive Slate', description: 'Clean corporate layout with structured action matrix' },
    { id: 'classic', name: 'Board Navy', description: 'Formal board meeting minute presentation' },
    { id: 'bold', name: 'Emerald Trust', description: 'Emerald accent headers and crisp typography' },
  ],
};

export default meta;
