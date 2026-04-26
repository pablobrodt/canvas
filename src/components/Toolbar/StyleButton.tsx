import React, { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';

interface PopoverButtonProps {
  id: string;
  label: string;
  preview: React.ReactNode;
  children: React.ReactNode;
}

export const PopoverButton: React.FC<PopoverButtonProps> = ({
  id,
  label,
  preview,
  children,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 });
  const panelRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);

  // Calculate panel position relative to the button
  const updatePosition = useCallback(() => {
    if (buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPanelPos({
        top: rect.top + rect.height / 2,
        left: rect.right + 12,
      });
    }
  }, []);

  // Close panel when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isOpen &&
        panelRef.current &&
        buttonRef.current &&
        !panelRef.current.contains(event.target as Node) &&
        !buttonRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen]);

  const handleToggle = () => {
    if (!isOpen) {
      updatePosition();
    }
    setIsOpen(!isOpen);
  };

  return (
    <div className="popover-wrapper">
      <button
        ref={buttonRef}
        className={`tool-btn popover-trigger ${isOpen ? 'tool-btn--active' : ''}`}
        onClick={handleToggle}
        title={label}
        id={id}
      >
        {preview}
        <span className="tool-btn-tooltip">{label}</span>
      </button>

      {isOpen && createPortal(
        <div
          ref={panelRef}
          className="popover-panel"
          style={{
            position: 'fixed',
            top: panelPos.top,
            left: panelPos.left,
            transform: 'translateY(-50%)',
          }}
        >
          <span className="popover-panel-label">{label}</span>
          <div onClick={() => setIsOpen(false)}>
            {children}
          </div>
        </div>,
        document.body
      )}
    </div>
  );
};
