import { useCallback } from 'react';
import { useCanvasStore } from '../store/canvasStore';
import type { CanvasElement } from '../types/canvas';

const PROJECT_VERSION = '1.0';

export const useProjectSerialization = () => {
  const exportJSON = useCallback(() => {
    const elements = useCanvasStore.getState().elements;
    const data = {
      version: PROJECT_VERSION,
      elements,
    };
    const jsonString = JSON.stringify(data, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'canvas-project.json';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  }, []);

  const importJSON = useCallback((file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);

        if (!isValidProjectFile(parsed)) {
          throw new Error('Invalid project file format.');
        }

        useCanvasStore.setState({ elements: parsed.elements, selectedIds: [] });
        useCanvasStore.getState().pushHistory();
      } catch (error) {
        console.error('Import failed:', error);
        window.alert('Failed to import project. The file might be corrupted or invalid.');
      }
    };
    reader.onerror = () => {
      window.alert('Failed to read the file.');
    };
    reader.readAsText(file);
  }, []);

  return { exportJSON, importJSON };
};

// Type Guards for Validation
function isValidProjectFile(data: unknown): data is { version: string; elements: CanvasElement[] } {
  if (!data || typeof data !== 'object') return false;
  if (!('version' in data) || typeof data.version !== 'string') return false;
  if (!('elements' in data) || !Array.isArray(data.elements)) return false;

  return data.elements.every(isValidCanvasElement);
}

function isValidCanvasElement(element: unknown): element is CanvasElement {
  if (!element || typeof element !== 'object') return false;

  // Check BaseElement properties
  const basePropsValid =
    'id' in element && typeof element.id === 'string' &&
    'type' in element && typeof element.type === 'string' &&
    'x' in element && typeof element.x === 'number' &&
    'y' in element && typeof element.y === 'number' &&
    'rotation' in element && typeof element.rotation === 'number' &&
    'opacity' in element && typeof element.opacity === 'number' &&
    'stroke' in element && typeof element.stroke === 'string' &&
    'strokeWidth' in element && typeof element.strokeWidth === 'number' &&
    'fill' in element && typeof element.fill === 'string';

  if (!basePropsValid) return false;

  const el = element as Record<string, unknown>;

  switch (el.type) {
    case 'rectangle':
      return typeof el.width === 'number' && typeof el.height === 'number' && typeof el.cornerRadius === 'number';
    case 'circle':
      return typeof el.radius === 'number';
    case 'ellipse':
      return typeof el.radiusX === 'number' && typeof el.radiusY === 'number';
    case 'arrow':
      return Array.isArray(el.points) && el.points.every((p: unknown) => typeof p === 'number');
    case 'draw':
    case 'eraser':
      return Array.isArray(el.points) && el.points.every((p: unknown) => typeof p === 'number') && typeof el.tension === 'number';
    case 'text':
      return typeof el.text === 'string' && typeof el.fontSize === 'number' && typeof el.fontFamily === 'string' && typeof el.width === 'number' && typeof el.height === 'number';
    case 'image':
      return typeof el.src === 'string' && typeof el.width === 'number' && typeof el.height === 'number';
    default:
      return false; // Unknown type
  }
}
