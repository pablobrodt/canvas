import React from 'react';
import { COLOR_PALETTE } from '../../types/canvas';

interface ColorPickerProps {
  selectedColor: string;
  onSelect: (color: string) => void;
  includeTransparent?: boolean;
}

export const ColorPicker: React.FC<ColorPickerProps> = ({
  selectedColor, onSelect, includeTransparent,
}) => {
  const colors = includeTransparent
    ? ['transparent', ...COLOR_PALETTE]
    : [...COLOR_PALETTE];

  return (
    <div className="color-picker">
      {colors.map((color) => (
        <button
          key={color}
          className={`color-swatch ${selectedColor === color ? 'color-swatch--active' : ''} ${color === 'transparent' ? 'color-swatch--transparent' : ''}`}
          style={{ backgroundColor: color === 'transparent' ? undefined : color }}
          onClick={() => onSelect(color)}
          title={color === 'transparent' ? 'No fill' : color}
        />
      ))}
    </div>
  );
};
