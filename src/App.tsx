import { useEffect, useCallback } from 'react';
import { CanvasStage } from './components/Canvas/CanvasStage';
import { Toolbar } from './components/Toolbar/Toolbar';
import { useCanvasStore } from './store/canvasStore';

function App() {
  const {
    activeTool, setActiveTool,
    selectedIds, deleteElements,
    undo, redo,
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
        case 'g': useCanvasStore.getState().toggleGrid(); break;
      }
    },
    [activeTool, selectedIds, deleteElements, setActiveTool, undo, redo]
  );

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  return (
    <div className="app" id="app-root">
      <Toolbar />
      <CanvasStage />
    </div>
  );
}

export default App;
