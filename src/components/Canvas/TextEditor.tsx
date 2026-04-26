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
    // Small delay to ensure the element is rendered before focusing
    const focusTimer = setTimeout(() => {
      const textareaElement = textareaRef.current;
      if (textareaElement) {
        textareaElement.focus();
        textareaElement.value = text;
        // Move cursor to end
        textareaElement.setSelectionRange(text.length, text.length);
      }
    }, 10);

    return () => clearTimeout(focusTimer);
  }, [text]);

  const handleBlur = () => {
    const inputValue = textareaRef.current?.value ?? '';
    onDone(id, inputValue);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    // Stop propagation so canvas keyboard shortcuts don't fire
    event.stopPropagation();

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
      placeholder="Type here..."
      style={{
        position: 'absolute',
        top: y,
        left: x,
        minWidth: Math.max(width, 120),
        minHeight: fontSize * 1.6,
        fontSize,
        fontFamily,
        color: fill,
        lineHeight: 1.2,
        caretColor: fill === 'transparent' ? '#fff' : fill,
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
    />
  );
};
