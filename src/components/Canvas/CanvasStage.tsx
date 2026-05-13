import React, { useRef, useCallback, useState, useEffect } from 'react';
import { Stage, Layer } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '../../store/canvasStore';
import { ElementRenderer } from './ElementRenderer';
import { TransformerOverlay } from './TransformerOverlay';
import { GridBackground } from './GridBackground';
import { TextEditor } from './TextEditor';
import { generateId } from '../../utils/idGenerator';
import { DEFAULT_TEXT_WIDTH, LINE_HEIGHT_MULTIPLIER } from '../../types/canvas';
import type {
  CanvasElement,
  DrawElement,
  EraserElement,
  RectangleElement,
  CircleElement,
  EllipseElement,
  ArrowElement,
  TextElement,
} from '../../types/canvas';

interface CanvasStageProps {
  stageRef: React.RefObject<Konva.Stage>;
}

export const CanvasStage: React.FC<CanvasStageProps> = ({ stageRef }) => {
  const isDrawing = useRef(false);
  const drawStartPos = useRef<{ x: number; y: number } | null>(null);
  const [previewElement, setPreviewElement] = useState<CanvasElement | null>(null);

  const [stageSize, setStageSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  // Text editing state
  const [editingText, setEditingText] = useState<{
    id: string;
    x: number;
    y: number;
    width: number;
    height: number;
    text: string;
    fontSize: number;
    fontFamily: string;
    fill: string;
  } | null>(null);

  const {
    elements,
    activeTool,
    selectedIds,
    strokeColor,
    fillColor,
    strokeWidth,
    fontSize,
    showGrid,
    addElement,
    updateElement,
    setSelectedIds,
    pushHistory,
    deleteElements,
  } = useCanvasStore();

  // Responsive sizing
  useEffect(() => {
    const handleResize = () => {
      setStageSize({ width: window.innerWidth, height: window.innerHeight });
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // ─── Mouse Handlers ─────────────────────────────────────────────
  const handleMouseDown = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      // If editing text, don't process canvas clicks
      if (editingText) return;

      const stage = event.target.getStage();
      if (!stage) return;
      const rawPos = stage.getPointerPosition();
      if (!rawPos) return;

      const pos = {
        x: isSnapEnabled && showGrid && activeTool !== 'draw' && activeTool !== 'eraser' ? snapToGrid(rawPos.x, gridSize) : rawPos.x,
        y: isSnapEnabled && showGrid && activeTool !== 'draw' && activeTool !== 'eraser' ? snapToGrid(rawPos.y, gridSize) : rawPos.y,
      };

      // Select tool: handle deselection when clicking empty area
      if (activeTool === 'select') {
        const targetClassName = event.target.getClassName?.() ?? '';
        const clickedOnEmpty = event.target === stage || targetClassName === 'Stage' || targetClassName === 'Layer';
        if (clickedOnEmpty) {
          setSelectedIds([]);
        }
        return;
      }

      // Text tool: create new text element on click
      if (activeTool === 'text') {
        const targetClassName = event.target.getClassName?.() ?? '';
        const clickedOnEmpty = event.target === stage || targetClassName === 'Stage' || targetClassName === 'Layer';
        if (clickedOnEmpty) {
          const id = generateId();
          const newText: TextElement = {
            id,
            type: 'text',
            x: pos.x,
            y: pos.y,
            rotation: 0,
            opacity: 1,
            stroke: 'transparent',
            strokeWidth: 0,
            fill: strokeColor,
            text: '',
            fontSize,
            fontFamily: 'Inter, sans-serif',
            width: DEFAULT_TEXT_WIDTH,
            height: fontSize * LINE_HEIGHT_MULTIPLIER,
          };
          addElement(newText);

          // Open text editor immediately
          setEditingText({
            id,
            x: pos.x,
            y: pos.y,
            width: DEFAULT_TEXT_WIDTH,
            height: fontSize * LINE_HEIGHT_MULTIPLIER,
            text: '',
            fontSize,
            fontFamily: 'Inter, sans-serif',
            fill: strokeColor,
          });
        }
        return;
      }

      isDrawing.current = true;
      drawStartPos.current = pos;

      const id = generateId();
      if (activeTool === 'draw' || activeTool === 'eraser') {
        const newLine: DrawElement | EraserElement = {
          id,
          type: activeTool,
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          stroke: activeTool === 'eraser' ? '#1a1a2e' : strokeColor,
          strokeWidth: activeTool === 'eraser' ? strokeWidth * 3 : strokeWidth,
          fill: 'transparent',
          points: [pos.x, pos.y],
          tension: 0.4,
        };
        setPreviewElement(newLine);
      } else if (activeTool === 'rectangle') {
        const newRect: RectangleElement = {
          id,
          type: 'rectangle',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          opacity: 1,
          stroke: strokeColor,
          strokeWidth,
          fill: fillColor,
          width: 0,
          height: 0,
          cornerRadius: 0,
        };
        setPreviewElement(newRect);
      } else if (activeTool === 'circle') {
        const newCircle: CircleElement = {
          id,
          type: 'circle',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          opacity: 1,
          stroke: strokeColor,
          strokeWidth,
          fill: fillColor,
          radius: 0,
        };
        setPreviewElement(newCircle);
      } else if (activeTool === 'ellipse') {
        const newEllipse: EllipseElement = {
          id,
          type: 'ellipse',
          x: pos.x,
          y: pos.y,
          rotation: 0,
          opacity: 1,
          stroke: strokeColor,
          strokeWidth,
          fill: fillColor,
          radiusX: 0,
          radiusY: 0,
        };
        setPreviewElement(newEllipse);
      } else if (activeTool === 'arrow') {
        const newArrow: ArrowElement = {
          id,
          type: 'arrow',
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          stroke: strokeColor,
          strokeWidth,
          fill: strokeColor,
          points: [pos.x, pos.y, pos.x, pos.y],
        };
        setPreviewElement(newArrow);
      }
    },
    [activeTool, strokeColor, fillColor, strokeWidth, fontSize, addElement, setSelectedIds, editingText]
  );

  const handleMouseMove = useCallback(
    (event: Konva.KonvaEventObject<MouseEvent | TouchEvent>) => {
      if (!isDrawing.current || !previewElement) return;

      const stage = event.target.getStage();
      if (!stage) return;
      const pos = stage.getPointerPosition();
      if (!pos) return;

      if ((activeTool === 'draw' || activeTool === 'eraser') && previewElement.type === activeTool) {
        const element = previewElement as DrawElement | EraserElement;
        const newPoints = [...element.points, pos.x, pos.y];
        setPreviewElement({ ...element, points: newPoints });
      } else if (activeTool === 'rectangle' && drawStartPos.current) {
        const start = drawStartPos.current;
        const width = pos.x - start.x;
        const height = pos.y - start.y;
        setPreviewElement({
          ...previewElement,
          x: width < 0 ? pos.x : start.x,
          y: height < 0 ? pos.y : start.y,
          width: Math.abs(width),
          height: Math.abs(height),
        } as RectangleElement);
      } else if (activeTool === 'circle' && drawStartPos.current) {
        const start = drawStartPos.current;
        const dx = pos.x - start.x;
        const dy = pos.y - start.y;
        const radius = Math.sqrt(dx * dx + dy * dy);
        setPreviewElement({ ...previewElement, radius } as CircleElement);
      } else if (activeTool === 'ellipse' && drawStartPos.current) {
        const start = drawStartPos.current;
        setPreviewElement({
          ...previewElement,
          radiusX: Math.abs(pos.x - start.x),
          radiusY: Math.abs(pos.y - start.y),
        } as EllipseElement);
      } else if (activeTool === 'arrow' && drawStartPos.current) {
        const start = drawStartPos.current;
        setPreviewElement({
          ...previewElement,
          points: [start.x, start.y, pos.x, pos.y],
        } as ArrowElement);
      }
    },
    [activeTool, previewElement, showGrid, isSnapEnabled, gridSize]
  );

  const handleMouseUp = useCallback(() => {
    if (isDrawing.current) {
      if (previewElement) {
        addElement(previewElement);
      }
      isDrawing.current = false;
      setPreviewElement(null);
      drawStartPos.current = null;
    }
  }, [addElement, previewElement]);

  // ─── Element Interaction ────────────────────────────────────────
  const handleElementSelect = useCallback(
    (id: string) => {
      if (activeTool === 'select') {
        setSelectedIds([id]);
      }
    },
    [activeTool, setSelectedIds]
  );

  const handleElementDragEnd = useCallback(
    (id: string, x: number, y: number) => {
      updateElement(id, { x, y });
      pushHistory();
    },
    [updateElement, pushHistory]
  );

  const handleTextDblClick = useCallback(
    (element: CanvasElement) => {
      if (element.type !== 'text') return;
      const textEl = element as TextElement;
      setEditingText({
        id: textEl.id,
        x: textEl.x,
        y: textEl.y,
        width: textEl.width,
        height: textEl.height,
        text: textEl.text,
        fontSize: textEl.fontSize,
        fontFamily: textEl.fontFamily,
        fill: textEl.fill,
      });
    },
    []
  );

  const handleTextEditDone = useCallback(
    (id: string, newText: string) => {
      if (newText.trim() === '') {
        // Remove empty text elements
        deleteElements([id]);
      } else {
        updateElement(id, { text: newText } as Partial<TextElement>);
        pushHistory();
      }
      setEditingText(null);
    },
    [updateElement, pushHistory, deleteElements]
  );

  // ─── Cursor ─────────────────────────────────────────────────────
  const getCursor = () => {
    switch (activeTool) {
      case 'select':
        return 'default';
      case 'draw':
      case 'eraser':
        return 'crosshair';
      case 'text':
        return 'text';
      default:
        return 'crosshair';
    }
  };

  return (
    <div style={{ cursor: getCursor() }} className="canvas-container">
      <Stage
        ref={stageRef}
        width={stageSize.width}
        height={stageSize.height}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onTouchStart={handleMouseDown}
        onTouchMove={handleMouseMove}
        onTouchEnd={handleMouseUp}
      >
        {/* Background grid layer */}
        <Layer listening={false} name="grid-layer">
          <GridBackground
            width={stageSize.width}
            height={stageSize.height}
            visible={showGrid}
          />
        </Layer>

        {/* Elements layer */}
        <Layer>
          <ElementRenderer
            elements={elements}
            previewElement={previewElement}
            selectedIds={selectedIds}
            activeTool={activeTool}
            isSnapEnabled={isSnapEnabled && showGrid}
            gridSize={gridSize}
            onSelect={handleElementSelect}
            onDragEnd={handleElementDragEnd}
            onTextDblClick={handleTextDblClick}
          />
          <TransformerOverlay selectedIds={selectedIds} isSnapEnabled={isSnapEnabled && showGrid} gridSize={gridSize} />
        </Layer>
      </Stage>

      {/* HTML overlay for text editing */}
      {editingText && (
        <TextEditor
          {...editingText}
          onDone={handleTextEditDone}
        />
      )}
    </div>
  );
};
