import { useCallback } from 'react';
import type Konva from 'konva';
import { useCanvasStore } from '../store/canvasStore';
import { EXPORT_PIXEL_RATIO, type CanvasElement } from '../types/canvas';

export const useExportCanvas = (stageRef: React.RefObject<Konva.Stage | null>) => {
  const exportAs = useCallback((format: 'png' | 'svg') => {
    const stage = stageRef.current;
    if (!stage) return;

    if (format === 'png') {
      exportPNG(stage);
    } else if (format === 'svg') {
      exportSVG(stage);
    }
  }, [stageRef]);

  return { exportAs };
};

function exportPNG(stage: Konva.Stage) {
  const gridLayer = stage.findOne('.grid-layer');
  const transformer = stage.findOne('.transformer-overlay');
  
  const wasGridVisible = gridLayer?.visible();
  const wasTransformerVisible = transformer?.visible();

  if (gridLayer) gridLayer.visible(false);
  if (transformer) transformer.visible(false);

  try {
    const dataUrl = stage.toDataURL({ pixelRatio: EXPORT_PIXEL_RATIO });
    const link = document.createElement('a');
    link.download = 'canvas-export.png';
    link.href = dataUrl;
    link.click();
  } finally {
    if (gridLayer) gridLayer.visible(!!wasGridVisible);
    if (transformer) transformer.visible(!!wasTransformerVisible);
    stage.batchDraw();
  }
}

function exportSVG(stage: Konva.Stage) {
  const elements = useCanvasStore.getState().elements;
  const width = stage.width();
  const height = stage.height();

  const svgElements = elements.map(generateSVGElement).join('\n  ');

  const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${width}" height="${height}" viewBox="0 0 ${width} ${height}">
  ${svgElements}
</svg>`;

  const blob = new Blob([svgContent], { type: 'image/svg+xml' });
  const downloadUrl = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = 'canvas-export.svg';
  link.href = downloadUrl;
  link.click();
  URL.revokeObjectURL(downloadUrl);
}

function generateSVGElement(element: CanvasElement): string {
  const transforms = [];
  if (element.x || element.y) transforms.push(`translate(${element.x}, ${element.y})`);
  if (element.rotation) transforms.push(`rotate(${element.rotation})`);
  const transformAttr = transforms.length ? `transform="${transforms.join(' ')}"` : '';

  const opacityAttr = element.opacity !== 1 ? `opacity="${element.opacity}"` : '';

  const getStrokeAttrs = () => {
    if (!element.stroke || element.stroke === 'transparent') return '';
    return `stroke="${element.stroke}" stroke-width="${element.strokeWidth}"`;
  };

  const getFillAttr = () => {
    return element.fill && element.fill !== 'transparent' ? `fill="${element.fill}"` : 'fill="none"';
  };

  switch (element.type) {
    case 'rectangle': {
      const rx = element.cornerRadius ? `rx="${element.cornerRadius}"` : '';
      return `<rect x="0" y="0" width="${element.width}" height="${element.height}" ${rx} ${getFillAttr()} ${getStrokeAttrs()} ${opacityAttr} ${transformAttr} />`;
    }
    case 'circle': {
      return `<circle cx="0" cy="0" r="${element.radius}" ${getFillAttr()} ${getStrokeAttrs()} ${opacityAttr} ${transformAttr} />`;
    }
    case 'ellipse': {
      return `<ellipse cx="0" cy="0" rx="${element.radiusX}" ry="${element.radiusY}" ${getFillAttr()} ${getStrokeAttrs()} ${opacityAttr} ${transformAttr} />`;
    }
    case 'draw':
    case 'eraser': {
      const pathData = generatePathData(element.points);
      return `<path d="${pathData}" fill="none" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" stroke-linecap="round" stroke-linejoin="round" ${opacityAttr} ${transformAttr} />`;
    }
    case 'arrow': {
      const pathData = generatePathData(element.points);
      let headElement = '';
      if (element.points.length >= 4) {
        const pLen = element.points.length;
        const x1 = element.points[pLen - 4];
        const y1 = element.points[pLen - 3];
        const x2 = element.points[pLen - 2];
        const y2 = element.points[pLen - 1];
        const angle = Math.atan2(y2 - y1, x2 - x1);
        const pointerLength = 10 + element.strokeWidth * 2;
        const pointerWidth = 10 + element.strokeWidth * 2;
        
        const pt1x = x2 - pointerLength * Math.cos(angle) + (pointerWidth / 2) * Math.sin(angle);
        const pt1y = y2 - pointerLength * Math.sin(angle) - (pointerWidth / 2) * Math.cos(angle);
        const pt2x = x2 - pointerLength * Math.cos(angle) - (pointerWidth / 2) * Math.sin(angle);
        const pt2y = y2 - pointerLength * Math.sin(angle) + (pointerWidth / 2) * Math.cos(angle);
        
        headElement = `<polygon points="${x2},${y2} ${pt1x},${pt1y} ${pt2x},${pt2y}" fill="${element.stroke}" stroke="none" />`;
      }
      return `<g ${opacityAttr} ${transformAttr}>
        <path d="${pathData}" fill="none" stroke="${element.stroke}" stroke-width="${element.strokeWidth}" />
        ${headElement}
      </g>`;
    }
    case 'text': {
      const escapedText = escapeXml(element.text);
      const lines = escapedText.split('\n');
      const lineHeight = element.fontSize * 1.2;
      const tspanElements = lines.map((line, index) => 
        `<tspan x="0" y="${index * lineHeight}">${line}</tspan>`
      ).join('');
      
      return `<text font-family="${element.fontFamily}" font-size="${element.fontSize}" dominant-baseline="hanging" ${getFillAttr()} ${opacityAttr} ${transformAttr}>
        ${tspanElements}
      </text>`;
    }
    case 'image': {
      return `<image x="0" y="0" width="${element.width}" height="${element.height}" href="${element.src}" ${opacityAttr} ${transformAttr} />`;
    }
    default:
      return '';
  }
}

function generatePathData(points: number[]): string {
  if (!points || points.length < 2) return '';
  const d = [];
  for (let i = 0; i < points.length; i += 2) {
    d.push(`${i === 0 ? 'M' : 'L'} ${points[i]} ${points[i + 1]}`);
  }
  return d.join(' ');
}

function escapeXml(unsafe: string): string {
  return unsafe.replace(/[<>&'"]/g, function (c) {
    switch (c) {
      case '<': return '&lt;';
      case '>': return '&gt;';
      case '&': return '&amp;';
      case "'": return '&apos;';
      case '"': return '&quot;';
      default: return c;
    }
  });
}
