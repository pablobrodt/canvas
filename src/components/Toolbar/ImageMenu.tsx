import React, { useRef, useState } from 'react';
import { PopoverButton } from './PopoverButton';
import { ImageIcon } from '../Icons';
import { useCanvasStore } from '../../store/canvasStore';
import { generateId } from '../../utils/idGenerator';
import type { ImageElement } from '../../types/canvas';
import { ImageUrlModal } from './ImageUrlModal';

export const ImageMenu: React.FC = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUrlModalOpen, setIsUrlModalOpen] = useState(false);
  const addElement = useCanvasStore((state) => state.addElement);
  
  // A ref to store the setOpen function of PopoverButton if we need to force close it
  // But PopoverButton currently doesn't expose its state via ref.
  // We can just rely on clicking outside or closing it naturally,
  // or we can simulate a click on document body to close popovers.
  const closePopover = () => {
    document.dispatchEvent(new MouseEvent('mousedown'));
  };

  const insertImage = (src: string) => {
    const id = generateId();
    const newImage: ImageElement = {
      id,
      type: 'image',
      src,
      x: window.innerWidth / 2 - 100, // Approximate center before we know actual dimensions
      y: window.innerHeight / 2 - 100,
      width: 0, // Will be set on load by URLImage
      height: 0,
      rotation: 0,
      opacity: 1,
      stroke: 'transparent',
      strokeWidth: 0,
      fill: 'transparent',
    };
    addElement(newImage);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      insertImage(dataUrl);
      closePopover();
    };
    reader.readAsDataURL(file);

    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleUrlConfirm = (url: string) => {
    insertImage(url);
    setIsUrlModalOpen(false);
  };

  const openUrlModal = () => {
    setIsUrlModalOpen(true);
    closePopover();
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  return (
    <>
      <PopoverButton
        id="tool-image"
        label="Image"
        preview={<ImageIcon />}
      >
        <div className="image-menu-options">
          <button className="image-menu-btn" onClick={triggerFileUpload}>
            Upload from computer
          </button>
          <button className="image-menu-btn" onClick={openUrlModal}>
            Insert from URL
          </button>
        </div>
      </PopoverButton>

      <input
        type="file"
        ref={fileInputRef}
        accept="image/*"
        style={{ display: 'none' }}
        onChange={handleFileUpload}
      />

      <ImageUrlModal
        isOpen={isUrlModalOpen}
        onClose={() => setIsUrlModalOpen(false)}
        onConfirm={handleUrlConfirm}
      />
    </>
  );
};
