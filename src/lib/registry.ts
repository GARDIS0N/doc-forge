import { templateRegistry, allTemplates, RegisteredTemplate } from './registry.generated';

export { templateRegistry, allTemplates };
export type { RegisteredTemplate };

export function getTemplate(slug: string): RegisteredTemplate | undefined {
  return templateRegistry[slug];
}

export function getAllCategories(): string[] {
  const categories = new Set(allTemplates.map((t) => t.meta.category));
  return Array.from(categories);
}

export function getTemplatesByCategory(category?: string): RegisteredTemplate[] {
  if (!category || category === 'All') {
    return allTemplates;
  }
  return allTemplates.filter((t) => t.meta.category === category);
}
