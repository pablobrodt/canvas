import React, { useRef, useEffect } from 'react';

interface TextEditorProps {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  fontSize: number;
  fontFamily: string;
  fill: string;
  onDone: (id: string, text: string) => void;
}

export const TextEditor: React.FC<TextEditorProps> = ({
  id, x, y, width, text, fontSize, fontFamily, fill, onDone,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    const textareaElement = textareaRef.current;
    if (textareaElement) {
      textareaElement.focus();
      textareaElement.value = text;
      textareaElement.select();
    }
  }, [text]);

  const handleBlur = () => {
    const inputValue = textareaRef.current?.value ?? '';
    onDone(id, inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Escape') {
      onDone(id, textareaRef.current?.value ?? '');
    }
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      onDone(id, textareaRef.current?.value ?? '');
    }
  };

  return (
    <textarea
      ref={textareaRef}
      className="canvas-text-editor"
      style={{
        position: 'absolute',
        top: y,
        left: x,
        minWidth: Math.max(width, 100),
        fontSize,
        fontFamily,
        color: fill,
        lineHeight: 1.2,
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};
