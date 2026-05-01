import { useEffect, useCallback } from 'react';
import { CanvasStage } from './components/Canvas/CanvasStage';
import { Toolbar } from './components/Toolbar/Toolbar';
import { useCanvasStore } from './store/canvasStore';
import { generateId } from './utils/idGenerator';
import { IMAGE_DEFAULT_OFFSET } from './types/canvas';
import type { ImageElement } from './types/canvas';

function App() {
  const {
    activeTool, setActiveTool,
    selectedIds, deleteElements,
    undo, redo,
    toggleGrid, addElement,
  } = useCanvasStore();

  // ─── Keyboard Shortcuts ─────────────────────────────────────────
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Don't capture when typing in text input
      const target = event.target as HTMLElement;
      if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;

      const isMetaKey = event.metaKey || event.ctrlKey;

      // Undo
      if (isMetaKey && event.key === 'z' && !event.shiftKey) {
        event.preventDefault();
        undo();
        return;
      }

      // Redo
      if (isMetaKey && (event.key === 'y' || (event.key === 'z' && event.shiftKey))) {
        event.preventDefault();
        redo();
        return;
      }

      // Delete
      if ((event.key === 'Delete' || event.key === 'Backspace') && selectedIds.length > 0) {
        event.preventDefault();
        deleteElements(selectedIds);
        return;
      }

      // Tool shortcuts
      switch (event.key.toLowerCase()) {
        case 'v': setActiveTool('select'); break;
        case 'd': setActiveTool('draw'); break;
        case 'r': setActiveTool('rectangle'); break;
        case 'c': setActiveTool('circle'); break;
        case 'o': setActiveTool('ellipse'); break;
        case 'a': if (!isMetaKey) setActiveTool('arrow'); break;
        case 't': setActiveTool('text'); break;
        case 'e': setActiveTool('eraser'); break;
        case 'g': toggleGrid(); break;
      }
    },
    [activeTool, selectedIds, deleteElements, setActiveTool, undo, redo, toggleGrid]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // ─── Paste Handler ──────────────────────────────────────────────
  const handlePaste = useCallback((event: ClipboardEvent) => {
    // Don't capture when typing in text input
    const target = event.target as HTMLElement;
    if (target.tagName === 'TEXTAREA' || target.tagName === 'INPUT') return;

    const items = event.clipboardData?.items;
    if (!items) return;

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.type.indexOf('image') !== -1) {
        const file = item.getAsFile();
        if (!file) continue;

        const reader = new FileReader();
        reader.onload = (e) => {
          const result = e.target?.result;
          if (typeof result !== 'string') return;
          const dataUrl = result;
          const id = generateId();
          const newImage: ImageElement = {
            id,
            type: 'image',
            src: dataUrl,
            x: window.innerWidth / 2 - IMAGE_DEFAULT_OFFSET,
            y: window.innerHeight / 2 - IMAGE_DEFAULT_OFFSET,
            width: 0,
            height: 0,
            rotation: 0,
            opacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            fill: 'transparent',
          };
          addElement(newImage);
        };
        reader.readAsDataURL(file);
        break; // Only handle the first image
      }
    }
  }, [addElement]);

  useEffect(() => {
    window.addEventListener('paste', handlePaste);
    return () => window.removeEventListener('paste', handlePaste);
  }, [handlePaste]);

  return (
    <div className="app" id="app-root">
      <Toolbar />
      <CanvasStage />
    </div>
  );
}

export default App;
