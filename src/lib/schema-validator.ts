import { z } from 'zod';
import { TemplateSchema, FieldDefinition } from './types';

// Helper to get nested value by path
function getNestedValue(obj: any, path: string): any {
  if (!obj) return undefined;
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return undefined;
    current = current[key];
  }
  return current;
}

export interface ValidationErrorMap {
  [path: string]: string;
}

export function validateDocument(
  schema: TemplateSchema,
  data: Record<string, any>
): { isValid: boolean; errors: ValidationErrorMap } {
  const errors: ValidationErrorMap = {};

  const validateField = (field: FieldDefinition, basePath?: string) => {
    const fullPath = basePath ? `${basePath}.${field.name}` : field.name;

    // Check showIf condition
    if (field.showIf) {
      const condVal = getNestedValue(data, field.showIf.field);
      if (condVal !== field.showIf.equals) {
        return; // Skip hidden field
      }
    }

    const value = getNestedValue(data, fullPath);

    // Repeater validation
    if (field.type === 'repeater') {
      const items = Array.isArray(value) ? value : [];
      if (field.required && items.length === 0) {
        errors[fullPath] = `Please add at least one ${field.label.toLowerCase()}`;
      }

      items.forEach((_, index) => {
        field.fields?.forEach((subField) => {
          validateField(subField, `${fullPath}[${index}]`);
        });
      });
      return;
    }

    // Required check
    if (field.required) {
      if (value === undefined || value === null || (typeof value === 'string' && value.trim() === '')) {
        errors[fullPath] = `${field.label} is required`;
        return;
      }
    }

    // Specific type checks if value is present
    if (value !== undefined && value !== null && value !== '') {
      if (field.type === 'email') {
        const emailSchema = z.string().email('Please enter a valid email address');
        const res = emailSchema.safeParse(value);
        if (!res.success) {
          errors[fullPath] = 'Please enter a valid email address';
        }
      }

      if (field.type === 'number' || field.type === 'currency') {
        const numVal = Number(value);
        if (isNaN(numVal)) {
          errors[fullPath] = 'Must be a valid number';
        } else {
          if (field.min !== undefined && numVal < field.min) {
            errors[fullPath] = `Must be at least ${field.min}`;
          }
          if (field.max !== undefined && numVal > field.max) {
            errors[fullPath] = `Cannot exceed ${field.max}`;
          }
        }
      }
    }
  };

  schema.sections.forEach((section) => {
    section.fields.forEach((field) => validateField(field));
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}
