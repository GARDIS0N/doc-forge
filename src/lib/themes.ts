export interface FontPairing {
  id: string;
  name: string;
  description: string;
  headingFont: string;
  bodyFont: string;
  cssClass: string;
}

export const FONT_PAIRINGS: FontPairing[] = [
  {
    id: 'modern',
    name: 'Modern Sans',
    description: 'Clean, objective, high-legibility contemporary sans-serif',
    headingFont: 'var(--font-inter), -apple-system, sans-serif',
    bodyFont: 'var(--font-inter), -apple-system, sans-serif',
    cssClass: 'font-pair-modern',
  },
  {
    id: 'editorial',
    name: 'Executive Editorial',
    description: 'Crisp sans headings paired with elegant serif body accents',
    headingFont: 'var(--font-dm-sans), sans-serif',
    bodyFont: 'Georgia, "Times New Roman", serif',
    cssClass: 'font-pair-editorial',
  },
  {
    id: 'classic',
    name: 'Classic Prestige',
    description: 'Authoritative serif titles with balanced geometric body',
    headingFont: '"Playfair Display", Georgia, serif',
    bodyFont: 'var(--font-inter), -apple-system, sans-serif',
    cssClass: 'font-pair-classic',
  },
  {
    id: 'architect',
    name: 'Architectural Monospace',
    description: 'Technical, structured layout with monospace accents',
    headingFont: 'var(--font-inter), sans-serif',
    bodyFont: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
    cssClass: 'font-pair-mono',
  },
];

export interface ColorTheme {
  id: string;
  name: string;
  primary: string;
  primaryLight: string;
  accent: string;
  border: string;
  badgeBg: string;
  badgeText: string;
}

export const COLOR_THEMES: ColorTheme[] = [
  {
    id: 'navy',
    name: 'Executive Navy',
    primary: '#0f2b48',
    primaryLight: '#f0f5fa',
    accent: '#1e4976',
    border: '#cbd5e1',
    badgeBg: '#e0f2fe',
    badgeText: '#0369a1',
  },
  {
    id: 'emerald',
    name: 'Kenyan Emerald',
    primary: '#047857',
    primaryLight: '#ecfdf5',
    accent: '#065f46',
    border: '#a7f3d0',
    badgeBg: '#d1fae5',
    badgeText: '#065f46',
  },
  {
    id: 'charcoal',
    name: 'Slate Minimal',
    primary: '#1e293b',
    primaryLight: '#f1f5f9',
    accent: '#334155',
    border: '#e2e8f0',
    badgeBg: '#e2e8f0',
    badgeText: '#0f172a',
  },
  {
    id: 'burgundy',
    name: 'Royal Burgundy',
    primary: '#831843',
    primaryLight: '#fdf2f8',
    accent: '#9d174d',
    border: '#fbcfe8',
    badgeBg: '#fce7f3',
    badgeText: '#831843',
  },
  {
    id: 'ocean',
    name: 'Pacific Blue',
    primary: '#1d4ed8',
    primaryLight: '#eff6ff',
    accent: '#2563eb',
    border: '#bfdbfe',
    badgeBg: '#dbeafe',
    badgeText: '#1e40af',
  },
  {
    id: 'amber',
    name: 'Warm Amber',
    primary: '#b45309',
    primaryLight: '#fffbeb',
    accent: '#d97706',
    border: '#fde68a',
    badgeBg: '#fef3c7',
    badgeText: '#92400e',
  },
];
