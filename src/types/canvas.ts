
// ─── Tool Types ───────────────────────────────────────────────────
export type ToolType =
  | 'select'
  | 'draw'
  | 'eraser'
  | 'rectangle'
  | 'circle'
  | 'ellipse'
  | 'arrow'
  | 'text'
  | 'image';

// ─── Element Types ────────────────────────────────────────────────
interface BaseElement {
  id: string;
  type: ToolType;
  x: number;
  y: number;
  rotation: number;
  opacity: number;
  stroke: string;
  strokeWidth: number;
  fill: string;
}

export interface RectangleElement extends BaseElement {
  type: 'rectangle';
  width: number;
  height: number;
  cornerRadius: number;
}

export interface CircleElement extends BaseElement {
  type: 'circle';
  radius: number;
}

export interface EllipseElement extends BaseElement {
  type: 'ellipse';
  radiusX: number;
  radiusY: number;
}

export interface ArrowElement extends BaseElement {
  type: 'arrow';
  points: number[];
}

export interface DrawElement extends BaseElement {
  type: 'draw';
  points: number[];
  tension: number;
}

export interface EraserElement extends BaseElement {
  type: 'eraser';
  points: number[];
  tension: number;
}

export interface TextElement extends BaseElement {
  type: 'text';
  text: string;
  fontSize: number;
  fontFamily: string;
  width: number;
  height: number;
}

export interface ImageElement extends BaseElement {
  type: 'image';
  src: string;
  width: number;
  height: number;
}

export type CanvasElement =
  | RectangleElement
  | CircleElement
  | EllipseElement
  | ArrowElement
  | DrawElement
  | EraserElement
  | TextElement
  | ImageElement;

// ─── Store Types ──────────────────────────────────────────────────
export interface CanvasState {
  elements: CanvasElement[];
  selectedIds: string[];
  activeTool: ToolType;
  strokeColor: string;
  fillColor: string;
  strokeWidth: number;
  fontSize: number;
  showGrid: boolean;

  // History
  history: CanvasElement[][];
  historyIndex: number;
}

export interface CanvasActions {
  // Element CRUD
  addElement: (element: CanvasElement) => void;
  updateElement: (id: string, changes: Partial<CanvasElement>) => void;
  deleteElements: (ids: string[]) => void;
  clearAll: () => void;

  // Selection
  setSelectedIds: (ids: string[]) => void;

  // Tool & style
  setActiveTool: (tool: ToolType) => void;
  setStrokeColor: (color: string) => void;
  setFillColor: (color: string) => void;
  setStrokeWidth: (width: number) => void;
  setFontSize: (size: number) => void;

  // Grid
  toggleGrid: () => void;
  toggleSnap: () => void;
  setGridSize: (size: number) => void;

  // History
  undo: () => void;
  redo: () => void;
  pushHistory: () => void;
}

export type CanvasStore = CanvasState & CanvasActions;

// ─── Constants ────────────────────────────────────────────────────
export const COLOR_PALETTE = [
  '#FFFFFF',
  '#C8C8C8',
  '#505050',
  '#1A1A2E',
  '#E74C3C',
  '#E67E22',
  '#F1C40F',
  '#2ECC71',
  '#1ABC9C',
  '#3498DB',
  '#9B59B6',
  '#E91E8A',
] as const;

export const STROKE_WIDTHS = [1, 2, 4, 6, 10] as const;

export const FONT_SIZES = [14, 18, 24, 32, 48, 64] as const;

export const MAX_HISTORY = 50;
export const EXPORT_PIXEL_RATIO = 2;

export const IMAGE_DEFAULT_OFFSET = 100;
export const DEFAULT_TEXT_WIDTH = 200;
export const LINE_HEIGHT_MULTIPLIER = 1.5;
