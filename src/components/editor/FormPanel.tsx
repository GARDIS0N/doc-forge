'use client';

import React, { useMemo } from 'react';
import { useEditorStore } from '@/store/editor';
import { TemplateSchema, FieldDefinition, SectionDefinition } from '@/lib/types';
import { validateDocument } from '@/lib/schema-validator';
import {
  Plus,
  Trash2,
  HelpCircle,
  ChevronUp,
  ChevronDown,
  Copy,
  AlertCircle,
  Calculator,
} from 'lucide-react';
import { formatCurrency } from '@/lib/format';

interface FormPanelProps {
  schema: TemplateSchema;
}

// Helper to get nested field value
function getNestedValue(obj: any, path: string): any {
  if (!obj) return '';
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = obj;
  for (const key of keys) {
    if (current === null || current === undefined) return '';
    current = current[key];
  }
  return current !== undefined ? current : '';
}

export const FormPanel: React.FC<FormPanelProps> = ({ schema }) => {
  const { data, updateField, styles } = useEditorStore();

  // Validate document data using Zod engine
  const { errors } = useMemo(() => {
    return validateDocument(schema, data);
  }, [schema, data]);

  // Compute calculated summary values if schema defines a computed function
  const computedValues = useMemo(() => {
    if (schema.computed) {
      try {
        return schema.computed(data);
      } catch (e) {
        console.warn('Calculation error:', e);
        return null;
      }
    }
    return null;
  }, [schema, data]);

  const isFieldVisible = (field: FieldDefinition): boolean => {
    if (!field.showIf) return true;
    const { field: targetField, equals } = field.showIf;
    const targetVal = getNestedValue(data, targetField);
    return targetVal === equals;
  };

  const renderField = (field: FieldDefinition, basePath?: string) => {
    const fullPath = basePath ? `${basePath}.${field.name}` : field.name;
    const value = getNestedValue(data, fullPath);
    const fieldError = errors[fullPath];

    if (!isFieldVisible(field)) return null;

    if (field.type === 'repeater') {
      const items = Array.isArray(value) ? value : [];

      const handleAddItem = () => {
        const newItem: Record<string, any> = {};
        field.fields?.forEach((subField) => {
          newItem[subField.name] = subField.default ?? '';
        });
        updateField(fullPath, [...items, newItem]);
      };

      const handleRemoveItem = (index: number) => {
        const updated = items.filter((_, idx) => idx !== index);
        updateField(fullPath, updated);
      };

      const handleMoveUp = (index: number) => {
        if (index === 0) return;
        const updated = [...items];
        const temp = updated[index - 1];
        updated[index - 1] = updated[index];
        updated[index] = temp;
        updateField(fullPath, updated);
      };

      const handleMoveDown = (index: number) => {
        if (index === items.length - 1) return;
        const updated = [...items];
        const temp = updated[index + 1];
        updated[index + 1] = updated[index];
        updated[index] = temp;
        updateField(fullPath, updated);
      };

      const handleDuplicate = (index: number) => {
        const duplicate = JSON.parse(JSON.stringify(items[index]));
        const updated = [...items];
        updated.splice(index + 1, 0, duplicate);
        updateField(fullPath, updated);
      };

      return (
        <div key={fullPath} className="space-y-3 pt-2">
          <div className="flex justify-between items-center">
            <div>
              <label className="text-xs font-bold uppercase tracking-wider text-slate-700 dark:text-zinc-300">
                {field.label}
              </label>
              <span className="text-[11px] text-slate-400 font-mono ml-2">
                ({items.length} {items.length === 1 ? 'entry' : 'entries'})
              </span>
            </div>
            <button
              type="button"
              onClick={handleAddItem}
              className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 hover:text-blue-700 dark:text-blue-400 p-1 hover:bg-blue-50 dark:hover:bg-zinc-800 rounded transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>{field.addLabel || 'Add Item'}</span>
            </button>
          </div>

          {fieldError && (
            <p className="text-[11px] text-red-500 flex items-center gap-1 font-medium">
              <AlertCircle className="w-3.5 h-3.5" />
              <span>{fieldError}</span>
            </p>
          )}

          <div className="space-y-3">
            {items.map((_, idx) => (
              <div
                key={idx}
                className="p-3.5 rounded-lg border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-3 relative group"
              >
                <div className="flex justify-between items-center pb-2 border-b border-slate-100 dark:border-zinc-800">
                  <div className="flex items-center gap-2">
                    <span className="text-[11px] font-bold font-mono text-slate-400">
                      #{idx + 1}
                    </span>
                    <div className="flex items-center gap-0.5">
                      <button
                        type="button"
                        disabled={idx === 0}
                        onClick={() => handleMoveUp(idx)}
                        title="Move Up"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                      >
                        <ChevronUp className="w-3 h-3" />
                      </button>
                      <button
                        type="button"
                        disabled={idx === items.length - 1}
                        onClick={() => handleMoveDown(idx)}
                        title="Move Down"
                        className="p-1 text-slate-400 hover:text-slate-700 disabled:opacity-20 transition-colors"
                      >
                        <ChevronDown className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => handleDuplicate(idx)}
                      title="Duplicate"
                      className="p-1 text-slate-400 hover:text-blue-600 transition-colors"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveItem(idx)}
                      title="Remove item"
                      className="p-1 text-slate-400 hover:text-red-500 transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-1 gap-2.5">
                  {field.fields?.map((subField) =>
                    renderField(subField, `${fullPath}[${idx}]`)
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (field.type === 'switch') {
      return (
        <div key={fullPath} className="flex items-center justify-between py-1.5">
          <div>
            <label className="text-xs font-medium text-slate-700 dark:text-zinc-300">
              {field.label}
            </label>
            {field.help && (
              <p className="text-[11px] text-slate-400">{field.help}</p>
            )}
          </div>
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(e) => updateField(fullPath, e.target.checked)}
            className="w-4 h-4 text-blue-600 rounded border-slate-300 focus:ring-blue-500 cursor-pointer"
          />
        </div>
      );
    }

    if (field.type === 'select') {
      return (
        <div key={fullPath} className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </span>
          </label>
          <select
            value={value}
            onChange={(e) => updateField(fullPath, e.target.value)}
            className={`w-full text-xs px-3 py-2 bg-white dark:bg-zinc-900 border rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
              fieldError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-zinc-700'
            }`}
          >
            {field.options?.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
          {fieldError && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{fieldError}</span>
            </p>
          )}
        </div>
      );
    }

    if (field.type === 'textarea') {
      return (
        <div key={fullPath} className="space-y-1">
          <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between">
            <span className="flex items-center gap-1">
              {field.label}
              {field.required && <span className="text-red-500">*</span>}
            </span>
            {field.help && (
              <span className="text-[11px] text-slate-400" title={field.help}>
                <HelpCircle className="w-3 h-3 inline" />
              </span>
            )}
          </label>
          <textarea
            rows={3}
            value={value}
            placeholder={field.placeholder}
            onChange={(e) => updateField(fullPath, e.target.value)}
            className={`w-full text-xs px-3 py-2 bg-white dark:bg-zinc-900 border rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all resize-y ${
              fieldError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-zinc-700'
            }`}
          />
          {fieldError && (
            <p className="text-[11px] text-red-500 flex items-center gap-1">
              <AlertCircle className="w-3 h-3" />
              <span>{fieldError}</span>
            </p>
          )}
        </div>
      );
    }

    return (
      <div key={fullPath} className="space-y-1">
        <label className="text-xs font-medium text-slate-700 dark:text-zinc-300 flex items-center justify-between">
          <span className="flex items-center gap-1">
            {field.label}
            {field.required && <span className="text-red-500">*</span>}
          </span>
          {field.help && (
            <span className="text-[11px] text-slate-400" title={field.help}>
              <HelpCircle className="w-3 h-3 inline" />
            </span>
          )}
        </label>
        <input
          type={field.type === 'currency' || field.type === 'number' ? 'number' : field.type}
          value={value}
          min={field.min}
          max={field.max}
          placeholder={field.placeholder}
          onChange={(e) => {
            const val =
              field.type === 'number' || field.type === 'currency'
                ? e.target.value === ''
                  ? ''
                  : Number(e.target.value)
                : e.target.value;
            updateField(fullPath, val);
          }}
          className={`w-full text-xs px-3 py-2 bg-white dark:bg-zinc-900 border rounded-lg text-slate-900 dark:text-zinc-100 focus:outline-hidden focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all ${
            fieldError ? 'border-red-400 focus:border-red-500' : 'border-slate-200 dark:border-zinc-700'
          }`}
        />
        {fieldError && (
          <p className="text-[11px] text-red-500 flex items-center gap-1">
            <AlertCircle className="w-3 h-3" />
            <span>{fieldError}</span>
          </p>
        )}
      </div>
    );
  };

  return (
    <div className="h-full overflow-y-auto p-6 space-y-6 bg-slate-50/60 dark:bg-zinc-900/40">
      {/* Live Calculated Summary Pill (if financial template) */}
      {computedValues && typeof computedValues.grandTotal === 'number' && (
        <div className="p-4 rounded-xl border border-blue-200 dark:border-blue-900/50 bg-blue-50/50 dark:bg-blue-950/20 shadow-2xs">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Calculator className="w-4 h-4 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-bold text-slate-900 dark:text-zinc-100">
                Live Calculation
              </span>
            </div>
            <span className="text-sm font-bold font-mono text-blue-700 dark:text-blue-300">
              {formatCurrency(computedValues.grandTotal, data.currency || styles.currency || 'KES')}
            </span>
          </div>

          <div className="grid grid-cols-3 gap-2 mt-2 pt-2 border-t border-blue-200/60 dark:border-blue-800/40 text-[11px] text-slate-600 dark:text-zinc-400">
            <div>
              <span>Subtotal: </span>
              <strong className="text-slate-900 dark:text-zinc-200">
                {formatCurrency(computedValues.subtotal, data.currency || styles.currency || 'KES')}
              </strong>
            </div>
            {computedValues.vatAmount > 0 && (
              <div>
                <span>VAT (16%): </span>
                <strong className="text-slate-900 dark:text-zinc-200">
                  {formatCurrency(computedValues.vatAmount, data.currency || styles.currency || 'KES')}
                </strong>
              </div>
            )}
            <div>
              <span>Balance: </span>
              <strong className="text-indigo-600 dark:text-indigo-400">
                {formatCurrency(computedValues.balanceDue, data.currency || styles.currency || 'KES')}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Dynamic Sections */}
      {schema.sections.map((section: SectionDefinition) => (
        <div
          key={section.id}
          className="p-5 rounded-xl border border-slate-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-2xs space-y-4"
        >
          <div>
            <h2 className="text-sm font-bold text-slate-900 dark:text-zinc-100">
              {section.title}
            </h2>
            {section.description && (
              <p className="text-xs text-slate-500 dark:text-zinc-400 mt-0.5">
                {section.description}
              </p>
            )}
          </div>

          <div className="space-y-3">
            {section.fields.map((field) => renderField(field))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default FormPanel;
