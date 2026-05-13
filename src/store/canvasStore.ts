import { create } from 'zustand';
import type { CanvasStore, CanvasElement } from '../types/canvas';
import { MAX_HISTORY } from '../types/canvas';

export const useCanvasStore = create<CanvasStore>((set, get) => ({
  // ─── State ──────────────────────────────────────────────────────
  elements: [],
  selectedIds: [],
  activeTool: 'select',
  strokeColor: '#FFFFFF',
  fillColor: 'transparent',
  strokeWidth: 2,
  fontSize: 24,
  showGrid: false,

  // History
  history: [[]],
  historyIndex: 0,

  // ─── Element CRUD ───────────────────────────────────────────────
  addElement: (element: CanvasElement) => {
    const state = get();
    const newElements = [...state.elements, element];
    set({ elements: newElements });
    get().pushHistory();
  },

  updateElement: (id: string, changes: Partial<CanvasElement>) => {
    set((state) => ({
      elements: state.elements.map((element) =>
        element.id === id ? ({ ...element, ...changes } as CanvasElement) : element
      ),
    }));
  },

  deleteElements: (ids: string[]) => {
    const state = get();
    const idSet = new Set(ids);
    const newElements = state.elements.filter((element) => !idSet.has(element.id));
    set({
      elements: newElements,
      selectedIds: state.selectedIds.filter((id) => !idSet.has(id)),
    });
    get().pushHistory();
  },

  clearAll: () => {
    set({ elements: [], selectedIds: [] });
    get().pushHistory();
  },

  // ─── Selection ──────────────────────────────────────────────────
  setSelectedIds: (ids: string[]) => set({ selectedIds: ids }),

  // ─── Tool & Style ──────────────────────────────────────────────
  setActiveTool: (tool) => set({ activeTool: tool, selectedIds: [] }),
  setStrokeColor: (color) => set({ strokeColor: color }),
  setFillColor: (color) => set({ fillColor: color }),
  setStrokeWidth: (width) => set({ strokeWidth: width }),
  setFontSize: (size) => set({ fontSize: size }),

  // ─── Grid ──────────────────────────────────────────────────────
  toggleGrid: () => set((state) => ({ showGrid: !state.showGrid })),
  toggleSnap: () => set((state) => ({ isSnapEnabled: !state.isSnapEnabled })),
  setGridSize: (size) => set({ gridSize: size }),

  // ─── History ────────────────────────────────────────────────────
  pushHistory: () => {
    const state = get();
    const newHistory = state.history.slice(0, state.historyIndex + 1);
    const snapshot = structuredClone(state.elements);
    newHistory.push(snapshot);

    // Trim history if too long
    if (newHistory.length > MAX_HISTORY) {
      newHistory.shift();
    }

    set({
      history: newHistory,
      historyIndex: newHistory.length - 1,
    });
  },

  undo: () => {
    const state = get();
    if (state.historyIndex > 0) {
      const newIndex = state.historyIndex - 1;
      const snapshot = structuredClone(state.history[newIndex]);
      set({
        elements: snapshot,
        historyIndex: newIndex,
        selectedIds: [],
      });
    }
  },

  redo: () => {
    const state = get();
    if (state.historyIndex < state.history.length - 1) {
      const newIndex = state.historyIndex + 1;
      const snapshot = structuredClone(state.history[newIndex]);
      set({
        elements: snapshot,
        historyIndex: newIndex,
        selectedIds: [],
      });
    }
  },
}));
