import React from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { ToolButton } from './ToolButton';
import { ColorPicker } from './ColorPicker';
import { StrokeWidthPicker } from './StrokeWidthPicker';
import { ExportMenu } from './ExportMenu';
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

export const Toolbar: React.FC = () => {
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
      <div className="toolbar-logo">
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

      {/* Colors */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Stroke</span>
        <ColorPicker
          selectedColor={strokeColor}
          onSelect={setStrokeColor}
        />
        <span className="toolbar-section-label" style={{ marginTop: 8 }}>Fill</span>
        <ColorPicker
          selectedColor={fillColor}
          onSelect={setFillColor}
          includeTransparent
        />
      </div>

      <div className="toolbar-divider" />

      {/* Stroke width */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Width</span>
        <StrokeWidthPicker
          selectedWidth={strokeWidth}
          onSelect={setStrokeWidth}
        />
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

      <div className="toolbar-divider" />

      {/* Export */}
      <div className="toolbar-section">
        <span className="toolbar-section-label">Export</span>
        <ExportMenu />
      </div>

      {/* Clear All - at the bottom */}
      <div className="toolbar-spacer" />
      <button className="toolbar-clear-btn" onClick={clearAll} title="Clear All">
        Clear All
      </button>
    </div>
  );
};
