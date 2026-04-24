import React, { useCallback } from 'react';
import { DownloadIcon } from '../Icons';

export const ExportMenu: React.FC = () => {
  const exportAs = useCallback((format: 'png' | 'svg') => {
    const stage = document.querySelector('.konvajs-content canvas') as HTMLCanvasElement;
    if (!stage) return;

    if (format === 'png') {
      const dataUrl = stage.toDataURL('image/png');
      const link = document.createElement('a');
      link.download = 'canvas-export.png';
      link.href = dataUrl;
      link.click();
    } else if (format === 'svg') {
      // For SVG, we serialize the canvas content to an SVG format
      const canvas = stage;
      const canvasWidth = canvas.width;
      const canvasHeight = canvas.height;
      const dataUrl = canvas.toDataURL('image/png');

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <image width="${canvasWidth}" height="${canvasHeight}" xlink:href="${dataUrl}"/>
</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'canvas-export.svg';
      link.href = url;
      link.click();
      URL.revokeObjectURL(url);
    }
  }, []);

  return (
    <div className="export-menu">
      <button className="export-btn" onClick={() => exportAs('png')} title="Export as PNG">
        <DownloadIcon />
        <span>PNG</span>
      </button>
      <button className="export-btn" onClick={() => exportAs('svg')} title="Export as SVG">
        <DownloadIcon />
        <span>SVG</span>
      </button>
    </div>
  );
};
