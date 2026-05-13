import { useCallback } from 'react';
import type Konva from 'konva';
import { useCanvasStore } from '../store/canvasStore';
import { buildSvgDocument } from '../utils/elementToSvg';
import { EXPORT_PIXEL_RATIO } from '../types/canvas';

/**
 * The public API returned by the useExportCanvas hook.
 */
interface ExportCanvasActions {
  exportAsPng: () => void;
  exportAsSvg: () => void;
}

/**
 * Custom hook that encapsulates all canvas export logic.
 * Provides `exportAsPng` and `exportAsSvg` callbacks.
 *
 * @param stageRef - React ref to the Konva Stage (needed for PNG rasterization + dimensions)
 */
export const useExportCanvas = (stageRef: React.RefObject<Konva.Stage>): ExportCanvasActions => {
  const elements = useCanvasStore((state) => state.elements);

  /**
   * Triggers a file download in the browser.
   */
  const triggerDownload = useCallback((url: string, filename: string) => {
    const link = document.createElement('a');
    link.download = filename;
    link.href = url;
    link.click();
  }, []);

  /**
   * Hides utility layers (grid, transformer) before export and restores them after.
   * Returns a cleanup function.
   */
  const hideUtilityLayers = useCallback((stage: Konva.Stage) => {
    const gridLayer = stage.findOne('.grid-layer');
    const transformer = stage.findOne('.transformer-overlay');

    const wasGridVisible = gridLayer?.visible();
    const wasTransformerVisible = transformer?.visible();

    if (gridLayer) gridLayer.visible(false);
    if (transformer) transformer.visible(false);

    return () => {
      if (gridLayer) gridLayer.visible(!!wasGridVisible);
      if (transformer) transformer.visible(!!wasTransformerVisible);
      stage.batchDraw();
    };
  }, []);

  /**
   * Exports the canvas as a PNG file using Konva's built-in rasterization.
   */
  const exportAsPng = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const restore = hideUtilityLayers(stage);
    try {
      const dataUrl = stage.toDataURL({ pixelRatio: EXPORT_PIXEL_RATIO });
      triggerDownload(dataUrl, 'canvas-export.png');
    } finally {
      restore();
    }
  }, [stageRef, hideUtilityLayers, triggerDownload]);

  /**
   * Exports the canvas as a true vector SVG file.
   * Iterates over the element state and converts each to its native SVG equivalent.
   * Eraser elements are excluded (they rely on canvas compositing).
   */
  const exportAsSvg = useCallback(() => {
    const stage = stageRef.current;
    if (!stage) return;

    const width = stage.width();
    const height = stage.height();

    const svgContent = buildSvgDocument(elements, width, height);

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const downloadUrl = URL.createObjectURL(blob);
    triggerDownload(downloadUrl, 'canvas-export.svg');
    URL.revokeObjectURL(downloadUrl);
  }, [stageRef, elements, triggerDownload]);

  return { exportAsPng, exportAsSvg };
};
