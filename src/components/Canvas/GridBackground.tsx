import React from 'react';
import { Line, Rect } from 'react-konva';

interface GridBackgroundProps {
  width: number;
  height: number;
  visible: boolean;
  gridSize?: number;
}

export const GridBackground: React.FC<GridBackgroundProps> = ({
  width,
  height,
  visible,
  gridSize = 40,
}) => {
  if (!visible) return null;

  const lines: React.ReactNode[] = [];

  for (let posX = 0; posX <= width; posX += gridSize) {
    lines.push(
      <Line key={`v-${posX}`} points={[posX, 0, posX, height]} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
    );
  }

  for (let posY = 0; posY <= height; posY += gridSize) {
    lines.push(
      <Line key={`h-${posY}`} points={[0, posY, width, posY]} stroke="rgba(255,255,255,0.04)" strokeWidth={1} />
    );
  }

  const dots: React.ReactNode[] = [];
  for (let posX = 0; posX <= width; posX += gridSize) {
    for (let posY = 0; posY <= height; posY += gridSize) {
      dots.push(
        <Rect key={`d-${posX}-${posY}`} x={posX - 1} y={posY - 1} width={2} height={2} fill="rgba(255,255,255,0.08)" />
      );
    }
  }

  return <>{lines}{dots}</>;
};
