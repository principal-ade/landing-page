"use client";

import React from 'react';

interface EditModeContextValue {
  isEditMode: boolean;
}

const EditModeContext = React.createContext<EditModeContextValue>({ isEditMode: false });

export const useEditMode = () => React.useContext(EditModeContext);

export const EditModeProvider: React.FC<{ children: React.ReactNode; canEdit?: boolean }> = ({ children, canEdit = false }) => {
  const [isEditMode, setIsEditMode] = React.useState(() => {
    if (!canEdit || typeof window === 'undefined') return false;
    return localStorage.getItem('edit-mode') === 'true';
  });

  const toggle = () => {
    setIsEditMode((prev) => {
      const next = !prev;
      localStorage.setItem('edit-mode', String(next));
      return next;
    });
  };

  return (
    <EditModeContext.Provider value={{ isEditMode: canEdit ? isEditMode : false }}>
      {children}
      {canEdit && (
        <button
          onClick={toggle}
          style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            zIndex: 9999,
            background: isEditMode ? '#FF6E00' : 'rgba(15,25,40,0.85)',
            color: '#fff',
            border: isEditMode ? 'none' : '1px solid rgba(255,255,255,0.15)',
            borderRadius: '8px',
            padding: '10px 18px',
            fontSize: '13px',
            fontWeight: '600',
            cursor: 'pointer',
            fontFamily: 'Inter, sans-serif',
            backdropFilter: 'blur(8px)',
            boxShadow: '0 4px 16px rgba(0,0,0,0.4)',
            transition: 'all 0.2s ease',
            letterSpacing: '0.01em',
          }}
        >
          {isEditMode ? '✓ editing' : 'edit text'}
        </button>
      )}
    </EditModeContext.Provider>
  );
};
