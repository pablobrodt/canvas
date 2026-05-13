import React from 'react';
import type Konva from 'konva';
import { DownloadIcon } from '../Icons';
import { useExportCanvas } from '../../hooks/useExportCanvas';

interface ExportMenuProps {
  stageRef: React.RefObject<Konva.Stage | null>;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ stageRef }) => {
  const { exportAs } = useExportCanvas(stageRef);

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
