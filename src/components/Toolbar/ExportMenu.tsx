import React from 'react';
import type Konva from 'konva';
import { DownloadIcon } from '../Icons';
import { useExportCanvas } from '../../hooks/useExportCanvas';

interface ExportMenuProps {
  stageRef: React.RefObject<Konva.Stage>;
}

export const ExportMenu: React.FC<ExportMenuProps> = ({ stageRef }) => {
  const { exportAsPng, exportAsSvg } = useExportCanvas(stageRef);

  return (
    <div className="export-menu">
      <button className="export-btn" onClick={exportAsPng} title="Export as PNG">
        <DownloadIcon />
        <span>PNG</span>
      </button>
      <button className="export-btn" onClick={exportAsSvg} title="Export as SVG">
        <DownloadIcon />
        <span>SVG</span>
      </button>
    </div>
  );
};
