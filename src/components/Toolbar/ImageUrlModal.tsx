import React, { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';

interface ImageUrlModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (url: string) => void;
}

export const ImageUrlModal: React.FC<ImageUrlModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
}) => {
  const [url, setUrl] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setUrl('');
      setTimeout(() => {
        inputRef.current?.focus();
      }, 50);
    }
  }, [isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (url.trim()) {
      onConfirm(url.trim());
      onClose();
    }
  };

  if (!isOpen) return null;

  return createPortal(
    <div className="url-modal-overlay">
      <div className="url-modal-container">
        <h3 className="url-modal-title">Insert Image from URL</h3>
        <form onSubmit={handleSubmit} className="url-modal-form">
          <input
            ref={inputRef}
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/image.png"
            className="url-modal-input"
            required
          />
          <div className="url-modal-actions">
            <button
              type="button"
              className="url-modal-btn url-modal-btn--cancel"
              onClick={onClose}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="url-modal-btn url-modal-btn--confirm"
            >
              Confirm
            </button>
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};
