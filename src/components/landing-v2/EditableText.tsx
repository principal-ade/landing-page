"use client";

import React from 'react';
import { useEditMode } from './EditModeProvider';
import siteContent from '../../content/site-content.json';

interface EditableTextProps {
  contentKey: string;
  value: string;
}

type SizeContent = Record<string, number | null>;

async function saveToContent(path: string, value: string | number | null) {
  try {
    await fetch('/api/update-content', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ path, value }),
    });
  } catch (e) {
    console.error('Failed to save:', e);
  }
}

export const EditableText: React.FC<EditableTextProps> = ({ contentKey, value }) => {
  const { isEditMode } = useEditMode();
  const textRef = React.useRef<HTMLSpanElement>(null);
  const hoverTimer = React.useRef<ReturnType<typeof setTimeout> | null>(null);
  const [hovered, setHovered] = React.useState(false);

  const sizes = (siteContent as unknown as { sizes: SizeContent }).sizes ?? {};
  const [localSize, setLocalSize] = React.useState<number | null>(sizes[contentKey] ?? null);
  const [sizeInputValue, setSizeInputValue] = React.useState<string>(
    String(sizes[contentKey] ?? '')
  );

  // Read computed font size from DOM after mount
  React.useEffect(() => {
    if (isEditMode && textRef.current && !localSize) {
      const fs = window.getComputedStyle(textRef.current).fontSize;
      const rounded = Math.round(parseFloat(fs));
      setSizeInputValue(String(rounded));
    }
  }, [isEditMode, localSize]);

  // Sync from JSON on key change
  React.useEffect(() => {
    const stored = (siteContent as unknown as { sizes: SizeContent }).sizes[contentKey] ?? null;
    setLocalSize(stored);
    setSizeInputValue(String(stored ?? ''));
  }, [contentKey]);

  React.useLayoutEffect(() => {
    if (isEditMode && textRef.current && textRef.current.innerText !== value) {
      textRef.current.innerText = value;
    }
  }, [value, isEditMode]);

  const handleMouseEnter = () => {
    if (hoverTimer.current) clearTimeout(hoverTimer.current);
    setHovered(true);
  };

  const handleMouseLeave = () => {
    hoverTimer.current = setTimeout(() => setHovered(false), 1800);
  };

  const handleTextBlur = async () => {
    if (!textRef.current) return;
    const newValue = textRef.current.innerText.trim();
    if (newValue !== value) await saveToContent(contentKey, newValue);
  };

  const handleSizeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    setSizeInputValue(raw);
    const num = raw === '' ? null : Number(raw);
    if (num === null || num > 0) setLocalSize(num);
  };

  const handleSizeBlur = async (e: React.FocusEvent<HTMLInputElement>) => {
    const raw = e.currentTarget.value;
    const newSize = raw === '' ? null : Number(raw);
    await saveToContent(`sizes.${contentKey}`, newSize);
  };

  const sizeOverride = sizes[contentKey] ?? null;

  if (!isEditMode && !sizeOverride) return <>{value}</>;
  if (!isEditMode) return <span style={{ fontSize: `${sizeOverride}px` }}>{value}</span>;

  return (
    <span
      style={{ position: 'relative', display: 'inline', fontSize: localSize ? `${localSize}px` : undefined }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <span
        ref={textRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={handleTextBlur}
        style={{
          outline: '1.5px dashed rgba(255,110,0,0.65)',
          outlineOffset: '3px',
          borderRadius: '2px',
          cursor: 'text',
          whiteSpace: 'pre-wrap',
        }}
      >
        {value}
      </span>

      {hovered && (
        <span
          style={{
            position: 'absolute',
            top: '-26px',
            left: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '3px',
            background: 'rgba(10,18,32,0.92)',
            border: '1px solid rgba(255,110,0,0.45)',
            borderRadius: '4px',
            padding: '2px 7px',
            zIndex: 9999,
            pointerEvents: 'all',
            whiteSpace: 'nowrap',
          }}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          <input
            type="number"
            value={sizeInputValue}
            onChange={handleSizeChange}
            onBlur={handleSizeBlur}
            style={{
              width: '44px',
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#FF6E00',
              fontSize: '11px',
              fontFamily: 'monospace',
              textAlign: 'right',
            }}
          />
          <span style={{ color: 'rgba(255,255,255,0.35)', fontSize: '10px', fontFamily: 'monospace' }}>px</span>
        </span>
      )}
    </span>
  );
};
