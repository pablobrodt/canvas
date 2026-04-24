import React from 'react';

interface ToolButtonProps {
  icon: React.ReactNode;
  label: string;
  shortcut: string;
  isActive: boolean;
  disabled?: boolean;
  onClick: () => void;
}

export const ToolButton: React.FC<ToolButtonProps> = ({
  icon, label, shortcut, isActive, disabled, onClick,
}) => {
  return (
    <button
      className={`tool-btn ${isActive ? 'tool-btn--active' : ''}`}
      onClick={onClick}
      disabled={disabled}
      title={`${label} (${shortcut})`}
      id={`tool-${label.toLowerCase()}`}
    >
      <span className="tool-btn-icon">{icon}</span>
      <span className="tool-btn-tooltip">
        {label}
        <span className="tool-btn-shortcut">{shortcut}</span>
      </span>
    </button>
  );
};
