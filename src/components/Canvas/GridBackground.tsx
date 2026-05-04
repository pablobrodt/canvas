import React, { useMemo } from 'react';
import { Rect } from 'react-konva';

interface GridBackgroundProps {
  width: number;
  height: number;
  visible: boolean;
  gridSize?: number;
}

const GRID_LINE_COLOR = 'rgba(255, 255, 255, 0.04)';
const GRID_DOT_COLOR = 'rgba(255, 255, 255, 0.08)';

export const GridBackground: React.FC<GridBackgroundProps> = ({
  width,
  height,
  visible,
  gridSize = 40,
}) => {
  const patternCanvas = useMemo(() => {
    const canvas = document.createElement('canvas');
    canvas.width = gridSize;
    canvas.height = gridSize;
    const ctx = canvas.getContext('2d');

    if (ctx) {
      // Draw grid lines
      ctx.strokeStyle = GRID_LINE_COLOR;
      ctx.lineWidth = 1;
      ctx.beginPath();

      // Vertical line
      ctx.moveTo(0, 0);
      ctx.lineTo(0, gridSize);

      // Horizontal line
      ctx.moveTo(0, 0);
      ctx.lineTo(gridSize, 0);
      ctx.stroke();

      // Draw dot at intersection (split into corners to form a 2x2 dot when tiled)
      ctx.fillStyle = GRID_DOT_COLOR;
      ctx.fillRect(0, 0, 1, 1);
      ctx.fillRect(gridSize - 1, 0, 1, 1);
      ctx.fillRect(0, gridSize - 1, 1, 1);
      ctx.fillRect(gridSize - 1, gridSize - 1, 1, 1);
    }
    return canvas;
  }, [gridSize]);

  if (!visible) return null;

  return (
    <Rect
      x={0}
      y={0}
      width={width}
      height={height}
      fillPatternImage={patternCanvas as unknown as HTMLImageElement}
      fillPatternRepeat="repeat"
      listening={false}
    />
  );
};
