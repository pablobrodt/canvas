import React from 'react';
import { STROKE_WIDTHS } from '../../types/canvas';

interface StrokeWidthPickerProps {
  selectedWidth: number;
  onSelect: (width: number) => void;
}

export const StrokeWidthPicker: React.FC<StrokeWidthPickerProps> = ({
  selectedWidth, onSelect,
}) => {
  return (
    <div className="stroke-picker">
      {STROKE_WIDTHS.map((widthValue) => (
        <button
          key={widthValue}
          className={`stroke-option ${selectedWidth === widthValue ? 'stroke-option--active' : ''}`}
          onClick={() => onSelect(widthValue)}
          title={`${widthValue}px`}
        >
          <span
            className="stroke-preview"
            style={{ height: Math.max(widthValue, 2), width: '100%', borderRadius: widthValue / 2 }}
          />
        </button>

      ))}
    </div>
  );
};
