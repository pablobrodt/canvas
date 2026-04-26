import React, { useCallback } from 'react';
import { useCanvasStore } from '../../store/canvasStore';
import { DownloadIcon } from '../Icons';

export const ExportMenu: React.FC = () => {
  const stageRef = useCanvasStore((state) => state.stageRef);

  const exportAs = useCallback((format: 'png' | 'svg') => {
    if (!stageRef) return;

    // Use Konva's built-in toDataURL which composites ALL layers
    const dataUrl = stageRef.toDataURL({ pixelRatio: 2 });

    if (format === 'png') {
      const link = document.createElement('a');
      link.download = 'canvas-export.png';
      link.href = dataUrl;
      link.click();
    } else if (format === 'svg') {
      const canvasWidth = stageRef.width();
      const canvasHeight = stageRef.height();

      const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
     width="${canvasWidth}" height="${canvasHeight}" viewBox="0 0 ${canvasWidth} ${canvasHeight}">
  <image width="${canvasWidth}" height="${canvasHeight}" xlink:href="${dataUrl}"/>
</svg>`;

      const blob = new Blob([svgContent], { type: 'image/svg+xml' });
      const downloadUrl = URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.download = 'canvas-export.svg';
      link.href = downloadUrl;
      link.click();
      URL.revokeObjectURL(downloadUrl);
    }
  }, [stageRef]);

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
