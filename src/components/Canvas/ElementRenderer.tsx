import React, { memo } from 'react';
import {
  Rect,
  Circle,
  Ellipse,
  Arrow,
  Line,
  Text,
} from 'react-konva';
import type Konva from 'konva';
import type {
  CanvasElement,
  ToolType,
  RectangleElement,
  CircleElement,
  EllipseElement,
  ArrowElement,
  DrawElement,
  EraserElement,
  TextElement,
  ImageElement,
} from '../../types/canvas';
import { URLImage } from './URLImage';

interface ElementRendererProps {
  elements: CanvasElement[];
  previewElement: CanvasElement | null;
  selectedIds: string[];
  activeTool: ToolType;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onTextDblClick: (element: CanvasElement) => void;
}

interface SingleElementRendererProps {
  element: CanvasElement;
  isSelected: boolean;
  isDraggable: boolean;
  onSelect: (id: string) => void;
  onDragEnd: (id: string, x: number, y: number) => void;
  onTextDblClick: (element: CanvasElement) => void;
}

const SingleElementRenderer: React.FC<SingleElementRendererProps> = memo(({
  element,
  isSelected,
  isDraggable,
  onSelect,
  onDragEnd,
  onTextDblClick,
}) => {
  const commonProps = {
    name: element.id,
    draggable: isDraggable,
    opacity: element.opacity,
    rotation: element.rotation,
    onClick: () => onSelect(element.id),
    onTap: () => onSelect(element.id),
    onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => {
      onDragEnd(element.id, event.target.x(), event.target.y());
    },
    strokeScaleEnabled: false,
    shadowForStrokeEnabled: false,
    hitStrokeWidth: isSelected ? 0 : 20,
  };

  switch (element.type) {
    case 'rectangle': {
      const rect = element as RectangleElement;
      return (
        <Rect
          {...commonProps}
          x={rect.x}
          y={rect.y}
          width={rect.width}
          height={rect.height}
          fill={rect.fill}
          stroke={rect.stroke}
          strokeWidth={rect.strokeWidth}
          cornerRadius={rect.cornerRadius}
        />
      );
    }

    case 'circle': {
      const circle = element as CircleElement;
      return (
        <Circle
          {...commonProps}
          x={circle.x}
          y={circle.y}
          radius={circle.radius}
          fill={circle.fill}
          stroke={circle.stroke}
          strokeWidth={circle.strokeWidth}
        />
      );
    }

    case 'ellipse': {
      const ellipse = element as EllipseElement;
      return (
        <Ellipse
          {...commonProps}
          x={ellipse.x}
          y={ellipse.y}
          radiusX={ellipse.radiusX}
          radiusY={ellipse.radiusY}
          fill={ellipse.fill}
          stroke={ellipse.stroke}
          strokeWidth={ellipse.strokeWidth}
        />
      );
    }

    case 'arrow': {
      const arrow = element as ArrowElement;
      return (
        <Arrow
          {...commonProps}
          x={arrow.x}
          y={arrow.y}
          points={arrow.points}
          fill={arrow.fill}
          stroke={arrow.stroke}
          strokeWidth={arrow.strokeWidth}
          pointerLength={10 + arrow.strokeWidth * 2}
          pointerWidth={10 + arrow.strokeWidth * 2}
        />
      );
    }

    case 'draw':
    case 'eraser': {
      const line = element as DrawElement | EraserElement;
      return (
        <Line
          {...commonProps}
          x={line.x}
          y={line.y}
          points={line.points}
          stroke={line.stroke}
          strokeWidth={line.strokeWidth}
          tension={line.tension}
          lineCap="round"
          lineJoin="round"
          globalCompositeOperation={
            line.type === 'eraser' ? 'destination-out' : 'source-over'
          }
        />
      );
    }

    case 'text': {
      const text = element as TextElement;
      return (
        <Text
          {...commonProps}
          x={text.x}
          y={text.y}
          text={text.text}
          fontSize={text.fontSize}
          fontFamily={text.fontFamily}
          fill={text.fill}
          width={text.width}
          onDblClick={() => onTextDblClick(element)}
          onDblTap={() => onTextDblClick(element)}
        />
      );
    }

    case 'image': {
      const imageEl = element as ImageElement;
      return (
        <URLImage
          {...commonProps}
          element={imageEl}
          onSelect={() => onSelect(element.id)}
          onDragEnd={(event: Konva.KonvaEventObject<DragEvent>) => onDragEnd(element.id, event.target.x(), event.target.y())}
        />
      );
    }

    default:
      return null;
  }
});

export const ElementRenderer: React.FC<ElementRendererProps> = ({
  elements,
  previewElement,
  selectedIds,
  activeTool,
  onSelect,
  onDragEnd,
  onTextDblClick,
}) => {
  const isDraggable = activeTool === 'select';

  return (
    <>
      {elements.map((element) => (
        <SingleElementRenderer
          key={element.id}
          element={element}
          isSelected={selectedIds.includes(element.id)}
          isDraggable={isDraggable}
          onSelect={onSelect}
          onDragEnd={onDragEnd}
          onTextDblClick={onTextDblClick}
        />
      ))}
      
      {/* Drawing preview */}
      {previewElement && (
        <SingleElementRenderer
          element={previewElement}
          isSelected={false}
          isDraggable={false}
          onSelect={() => {}}
          onDragEnd={() => {}}
          onTextDblClick={() => {}}
        />
      )}
    </>
  );
};
