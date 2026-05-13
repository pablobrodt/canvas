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
function isValidProjectFile(data: any): data is { version: string; elements: CanvasElement[] } {
  if (!data || typeof data !== 'object') return false;
  if (!('version' in data) || typeof data.version !== 'string') return false;
  if (!('elements' in data) || !Array.isArray(data.elements)) return false;

  return data.elements.every(isValidCanvasElement);
}

function isValidCanvasElement(element: any): element is CanvasElement {
  if (!element || typeof element !== 'object') return false;

  // Check BaseElement properties
  const basePropsValid =
    typeof element.id === 'string' &&
    typeof element.type === 'string' &&
    typeof element.x === 'number' &&
    typeof element.y === 'number' &&
    typeof element.rotation === 'number' &&
    typeof element.opacity === 'number' &&
    typeof element.stroke === 'string' &&
    typeof element.strokeWidth === 'number' &&
    typeof element.fill === 'string';

  if (!basePropsValid) return false;

  switch (element.type) {
    case 'rectangle':
      return typeof element.width === 'number' && typeof element.height === 'number' && typeof element.cornerRadius === 'number';
    case 'circle':
      return typeof element.radius === 'number';
    case 'ellipse':
      return typeof element.radiusX === 'number' && typeof element.radiusY === 'number';
    case 'arrow':
      return Array.isArray(element.points) && element.points.every((p: any) => typeof p === 'number');
    case 'draw':
    case 'eraser':
      return Array.isArray(element.points) && element.points.every((p: any) => typeof p === 'number') && typeof element.tension === 'number';
    case 'text':
      return typeof element.text === 'string' && typeof element.fontSize === 'number' && typeof element.fontFamily === 'string' && typeof element.width === 'number' && typeof element.height === 'number';
    case 'image':
      return typeof element.src === 'string' && typeof element.width === 'number' && typeof element.height === 'number';
    default:
      return false; // Unknown type
  }
}
