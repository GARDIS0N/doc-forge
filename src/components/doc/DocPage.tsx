'use client';

import React from 'react';
import { PaperSize } from '@/lib/types';
import { COLOR_THEMES, FONT_PAIRINGS } from '@/lib/themes';

interface DocPageProps {
  children: React.ReactNode;
  paperSize?: PaperSize;
  marginSize?: 'compact' | 'normal' | 'spacious';
  density?: 'compact' | 'comfortable';
  colorTheme?: string;
  fontPair?: string;
  className?: string;
}

export const DocPage: React.FC<DocPageProps> = ({
  children,
  paperSize = 'A4',
  marginSize = 'normal',
  density = 'comfortable',
  colorTheme,
  fontPair,
  className = '',
}) => {
  // Padding based on margin size
  const marginClasses = {
    compact: 'p-8 sm:p-10',
    normal: 'p-10 sm:p-14',
    spacious: 'p-12 sm:p-16',
  }[marginSize];

  const isA4 = paperSize === 'A4';

  const themeObj = colorTheme ? COLOR_THEMES.find((t) => t.id === colorTheme) : undefined;
  const fontObj = fontPair ? FONT_PAIRINGS.find((f) => f.id === fontPair) : undefined;

  const dynamicStyles: React.CSSProperties = {
    width: isA4 ? '210mm' : '8.5in',
    minHeight: isA4 ? '297mm' : '11in',
    boxSizing: 'border-box',
    backgroundColor: '#ffffff',
  };

  if (themeObj) {
    (dynamicStyles as any)['--inv-primary'] = themeObj.primary;
    (dynamicStyles as any)['--inv-accent'] = themeObj.accent;
    (dynamicStyles as any)['--inv-border'] = themeObj.border;
    (dynamicStyles as any)['--cv-primary'] = themeObj.primary;
    (dynamicStyles as any)['--cv-accent'] = themeObj.accent;
    (dynamicStyles as any)['--cv-border'] = themeObj.border;
  }

  if (fontObj) {
    (dynamicStyles as any)['fontFamily'] = fontObj.bodyFont;
  }

  return (
    <div
      className={`doc-paper-sheet bg-white text-slate-900 shadow-2xl rounded-xs mx-auto transition-all duration-200 border border-slate-200/60 print:border-none print:shadow-none print:p-0 print:m-0 print:w-full ${marginClasses} ${className}`}
      style={dynamicStyles}
      data-paper={paperSize}
      data-density={density}
      data-theme={colorTheme}
      data-font={fontPair}
    >
      {children}
    </div>
  );
};

export default DocPage;
