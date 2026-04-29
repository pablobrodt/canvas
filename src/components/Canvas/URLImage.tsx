import React, { useState, useEffect, useRef } from 'react';
import { Image as KonvaImage } from 'react-konva';
import type Konva from 'konva';
import { useCanvasStore } from '../../store/canvasStore';
import type { ImageElement } from '../../types/canvas';

interface URLImageProps extends Konva.ImageConfig {
  element: ImageElement;
  onSelect: () => void;
  onDragEnd: (event: Konva.KonvaEventObject<DragEvent>) => void;
}

export const URLImage = React.forwardRef<Konva.Image, URLImageProps>(
  ({ element, onSelect, onDragEnd, ...commonProps }, ref) => {
    const [imageObj, setImageObj] = useState<HTMLImageElement | null>(null);
    const updateElement = useCanvasStore((state) => state.updateElement);
    const initializedRef = useRef(false);

    useEffect(() => {
      let isMounted = true;
      const img = new window.Image();
      img.src = element.src;
      
      // To avoid cross-origin issues with standard URLs
      if (element.src.startsWith('http')) {
        img.crossOrigin = 'Anonymous';
      }

      img.onload = () => {
        if (!isMounted) return;
        setImageObj(img);
        
        // If element dimensions are 0 (first load), set them to image's natural dimensions
        if (!initializedRef.current && (element.width === 0 || element.height === 0)) {
          initializedRef.current = true;
          // Scale down if image is too large (max 800px width/height for default insert)
          let newWidth = img.naturalWidth;
          let newHeight = img.naturalHeight;
          const maxDim = 800;
          
          if (newWidth > maxDim || newHeight > maxDim) {
            const ratio = Math.min(maxDim / newWidth, maxDim / newHeight);
            newWidth = newWidth * ratio;
            newHeight = newHeight * ratio;
          }

          updateElement(element.id, {
            width: newWidth,
            height: newHeight,
          });
        }
      };

      return () => {
        isMounted = false;
      };
    }, [element.src, element.id, element.width, element.height, updateElement]);

    if (!imageObj) return null;

    return (
      <KonvaImage
        {...commonProps}
        ref={ref}
        x={element.x}
        y={element.y}
        width={element.width || imageObj.naturalWidth}
        height={element.height || imageObj.naturalHeight}
        image={imageObj}
        onClick={onSelect}
        onTap={onSelect}
        onDragEnd={onDragEnd}
      />
    );
  }
);
URLImage.displayName = 'URLImage';
