import React from 'react';
import type Konva from 'konva';
import { useCanvasStore } from '../../store/canvasStore';
import { ToolButton } from './ToolButton';
import { PopoverButton } from './PopoverButton';
import { ColorPicker } from './ColorPicker';
import { StrokeWidthPicker } from './StrokeWidthPicker';
import { ExportMenu } from './ExportMenu';
import { ImageMenu } from './ImageMenu';
import type { ToolType } from '../../types/canvas';
import {
  MousePointerIcon,
  PencilIcon,
  SquareIcon,
  CircleIcon,
  OvalIcon,
  ArrowRightIcon,
  TypeIcon,
  EraserIcon,
  UndoIcon,
  RedoIcon,
  TrashIcon,
  GridIcon,
} from '../Icons';
import { version } from '../../../package.json';

const APP_VERSION = `v${version}`;

const TOOLS: { type: ToolType; label: string; icon: React.ReactNode; shortcut: string }[] = [
  { type: 'select', label: 'Select', icon: <MousePointerIcon />, shortcut: 'V' },
  { type: 'draw', label: 'Draw', icon: <PencilIcon />, shortcut: 'D' },
  { type: 'rectangle', label: 'Rectangle', icon: <SquareIcon />, shortcut: 'R' },
  { type: 'circle', label: 'Circle', icon: <CircleIcon />, shortcut: 'C' },
  { type: 'ellipse', label: 'Ellipse', icon: <OvalIcon />, shortcut: 'O' },
  { type: 'arrow', label: 'Arrow', icon: <ArrowRightIcon />, shortcut: 'A' },
  { type: 'text', label: 'Text', icon: <TypeIcon />, shortcut: 'T' },
  { type: 'eraser', label: 'Eraser', icon: <EraserIcon />, shortcut: 'E' },
];

interface ToolbarProps {
  stageRef: React.RefObject<Konva.Stage>;
}

export const Toolbar: React.FC<ToolbarProps> = ({ stageRef }) => {
  const {
    activeTool, setActiveTool,
    strokeColor, setStrokeColor,
    fillColor, setFillColor,
    strokeWidth, setStrokeWidth,
    selectedIds, deleteElements,
    showGrid, toggleGrid,
    undo, redo,
    historyIndex, history,
    clearAll,
  } = useCanvasStore();

  return (
    <div className="toolbar" id="main-toolbar">
      {/* Logo */}
      <div className="toolbar-logo" title={APP_VERSION}>
        <span className="toolbar-logo-icon">◆</span>
        <span className="toolbar-logo-text">Canvas</span>
      </div>

      <div className="toolbar-divider" />

      {/* Tools */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Tools</span>
        <div className="toolbar-grid">
          {TOOLS.map((tool) => (
            <ToolButton
              key={tool.type}
              icon={tool.icon}
              label={tool.label}
              shortcut={tool.shortcut}
              isActive={activeTool === tool.type}
              onClick={() => setActiveTool(tool.type)}
            />
          ))}
        </div>
      </div>

      <div className="toolbar-divider" />

      {/* Image Insertion */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Image</span>
        <ImageMenu />
      </div>

      <div className="toolbar-divider" />

      {/* Stroke Color */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Stroke</span>
        <PopoverButton
          id="tool-stroke"
          label="Stroke"
          preview={
            <span
              className="color-preview-swatch"
              style={{ backgroundColor: strokeColor }}
            />
          }
        >
          <ColorPicker selectedColor={strokeColor} onSelect={setStrokeColor} />
        </PopoverButton>
      </div>

      {/* Fill Color */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Fill</span>
        <PopoverButton
          id="tool-fill"
          label="Fill"
          preview={
            <span
              className={`color-preview-swatch ${fillColor === 'transparent' ? 'color-preview-swatch--transparent' : ''}`}
              style={{ backgroundColor: fillColor === 'transparent' ? undefined : fillColor }}
            />
          }
        >
          <ColorPicker selectedColor={fillColor} onSelect={setFillColor} includeTransparent />
        </PopoverButton>
      </div>

      {/* Stroke Width */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Width</span>
        <PopoverButton
          id="tool-width"
          label="Width"
          preview={
            <span className="width-preview">
              <span
                className="width-preview-bar"
                style={{ height: Math.max(strokeWidth, 2) }}
              />
            </span>
          }
        >
          <StrokeWidthPicker selectedWidth={strokeWidth} onSelect={setStrokeWidth} />
        </PopoverButton>
      </div>

      <div className="toolbar-divider" />

      {/* Actions */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Actions</span>
        <div className="toolbar-actions">
          <ToolButton
            icon={<UndoIcon />}
            label="Undo"
            shortcut="⌘Z"
            isActive={false}
            disabled={historyIndex <= 0}
            onClick={undo}
          />
          <ToolButton
            icon={<RedoIcon />}
            label="Redo"
            shortcut="⌘⇧Z"
            isActive={false}
            disabled={historyIndex >= history.length - 1}
            onClick={redo}
          />
          <ToolButton
            icon={<TrashIcon />}
            label="Delete"
            shortcut="Del"
            isActive={false}
            disabled={selectedIds.length === 0}
            onClick={() => deleteElements(selectedIds)}
          />
          <ToolButton
            icon={<GridIcon />}
            label="Grid"
            shortcut="G"
            isActive={showGrid}
            onClick={toggleGrid}
          />
        </div>
      </div>

      {showGrid && (
        <>
          <div className="toolbar-divider" />
          <div className="toolbar-section">
            <span className="toolbar-section-label">Grid</span>
            <div className="toolbar-actions" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#c8c8c8' }}>
                <input 
                  type="checkbox" 
                  checked={isSnapEnabled} 
                  onChange={toggleSnap} 
                  style={{ accentColor: '#7c3aed' }}
                />
                Snap to Grid
              </label>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', color: '#c8c8c8' }}>
                Size:
                <input
                  type="number"
                  min={5}
                  max={100}
                  value={gridSize}
                  onChange={(e) => setGridSize(Number(e.target.value))}
                  style={{ 
                    width: '50px', 
                    background: '#1a1a2e', 
                    border: '1px solid #505050', 
                    color: '#fff', 
                    borderRadius: '4px',
                    padding: '2px 4px'
                  }}
                />
                px
              </div>
            </div>
          </div>
        </>
      )}

      <div className="toolbar-divider" />

      {/* Export */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Export</span>
        <ExportMenu stageRef={stageRef} />
      </div>

      {/* Clear All - at the bottom */}
      <div className="toolbar-spacer" />
      <button className="toolbar-clear-btn" onClick={clearAll} title="Clear All">
        Clear All
      </button>
    </div>
  );
};
