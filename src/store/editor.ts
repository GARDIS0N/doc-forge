import { create } from 'zustand';
import { StyleSettings, PaperSize, Density, CurrencyCode } from '@/lib/types';

interface EditorState {
  slug: string;
  data: Record<string, any>;
  styles: StyleSettings;
  zoom: number; // 0.5 to 1.5
  isExportingPdf: boolean;
  docId?: string;
  saveStatus: 'saved' | 'saving' | 'unsaved';
  history: Record<string, any>[];
  historyIndex: number;

  // Actions
  initDoc: (slug: string, initialData: Record<string, any>, initialStyles?: Partial<StyleSettings>, docId?: string) => void;
  setDocId: (id: string) => void;
  setSaveStatus: (status: 'saved' | 'saving' | 'unsaved') => void;
  updateField: (path: string, value: any) => void;
  updateData: (newData: Record<string, any>) => void;
  updateStyle: <K extends keyof StyleSettings>(key: K, value: StyleSettings[K]) => void;
  setZoom: (zoom: number) => void;
  setIsExportingPdf: (val: boolean) => void;
  resetToSample: (sampleData: Record<string, any>) => void;
  undo: () => void;
  redo: () => void;
}

const defaultStyles: StyleSettings = {
  variant: 'modern',
  density: 'comfortable',
  paperSize: 'A4',
  marginSize: 'normal',
  currency: 'KES',
};

// Helper to set nested object value by path e.g. "sender.businessName" or "items[0].qty"
function setNestedValue(obj: any, path: string, value: any): any {
  const clone = JSON.parse(JSON.stringify(obj || {}));
  const keys = path.replace(/\[(\d+)\]/g, '.$1').split('.');
  let current = clone;

  for (let i = 0; i < keys.length - 1; i++) {
    const key = keys[i];
    if (!(key in current) || typeof current[key] !== 'object' || current[key] === null) {
      current[key] = isNaN(Number(keys[i + 1])) ? {} : [];
    }
    current = current[key];
  }

  current[keys[keys.length - 1]] = value;
  return clone;
}

export const useEditorStore = create<EditorState>((set, get) => ({
  slug: '',
  data: {},
  styles: defaultStyles,
  zoom: 1.0,
  isExportingPdf: false,
  docId: undefined,
  saveStatus: 'saved',
  history: [],
  historyIndex: -1,

  initDoc: (slug, initialData, initialStyles, docId) => {
    const styles = { ...defaultStyles, ...(initialStyles || {}) };
    set({
      slug,
      data: initialData,
      styles,
      zoom: 1.0,
      docId: docId || undefined,
      saveStatus: 'saved',
      history: [JSON.parse(JSON.stringify(initialData))],
      historyIndex: 0,
    });
  },

  setDocId: (docId) => set({ docId }),
  setSaveStatus: (saveStatus) => set({ saveStatus }),

  updateField: (path, value) => {
    const state = get();
    const updated = setNestedValue(state.data, path, value);
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(updated)));

    set({
      data: updated,
      saveStatus: 'unsaved',
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateData: (newData) => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    newHistory.push(JSON.parse(JSON.stringify(newData)));

    set({
      data: newData,
      saveStatus: 'unsaved',
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  updateStyle: (key, value) => {
    set((state) => ({
      saveStatus: 'unsaved',
      styles: {
        ...state.styles,
        [key]: value,
      },
    }));
  },

  setZoom: (zoom) => set({ zoom }),
  setIsExportingPdf: (val) => set({ isExportingPdf: val }),

  resetToSample: (sampleData) => {
    set({
      data: JSON.parse(JSON.stringify(sampleData)),
      history: [JSON.parse(JSON.stringify(sampleData))],
      historyIndex: 0,
    });
  },

  undo: () => {
    const { historyIndex, history } = get();
    if (historyIndex > 0) {
      const prevIndex = historyIndex - 1;
      set({
        historyIndex: prevIndex,
        data: JSON.parse(JSON.stringify(history[prevIndex])),
      });
    }
  },

  redo: () => {
    const { historyIndex, history } = get();
    if (historyIndex < history.length - 1) {
      const nextIndex = historyIndex + 1;
      set({
        historyIndex: nextIndex,
        data: JSON.parse(JSON.stringify(history[nextIndex])),
      });
    }
  },
}));
