import React, { useEffect, useRef } from 'react';
import { Transformer } from 'react-konva';
import type Konva from 'konva';

interface TransformerOverlayProps {
  selectedIds: string[];
}

export const TransformerOverlay: React.FC<TransformerOverlayProps> = ({
  selectedIds,
}) => {
  const trRef = useRef<Konva.Transformer>(null);

  useEffect(() => {
    const transformer = trRef.current;
    if (!transformer) return;

    const layer = transformer.getLayer();
    if (!layer) return;

    if (selectedIds.length === 0) {
      transformer.nodes([]);
      layer.batchDraw();
      return;
    }

    // Find nodes on the same layer by their name (which is set to the element id)
    const selectedNodes: Konva.Node[] = [];
    selectedIds.forEach((id) => {
      const node = layer.findOne(`.${id}`);
      if (node) {
        selectedNodes.push(node);
      }
    });

    transformer.nodes(selectedNodes);
    layer.batchDraw();
  }, [selectedIds]);

  if (selectedIds.length === 0) return null;

  return (
    <Transformer
      ref={trRef}
      name="transformer-overlay"
      rotateEnabled={true}
      enabledAnchors={[
        'top-left',
        'top-center',
        'top-right',
        'middle-left',
        'middle-right',
        'bottom-left',
        'bottom-center',
        'bottom-right',
      ]}
      borderStroke="#7c3aed"
      borderStrokeWidth={1.5}
      anchorStroke="#7c3aed"
      anchorFill="#1a1a2e"
      anchorSize={8}
      anchorCornerRadius={2}
      padding={4}
      boundBoxFunc={(_oldBox, newBox) => {
        // Prevent scaling to zero
        if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
          return _oldBox;
        }
        return newBox;
      }}
    />
  );
};
