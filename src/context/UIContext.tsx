'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';

interface AlertState {
  title: string;
  message: string;
  onConfirm?: () => void;
  confirmText?: string;
  isConfirm?: boolean;
}

interface UIContextType {
  showAlert: (title: string, message: string) => void;
  showConfirm: (title: string, message: string, onConfirm: () => void, confirmText?: string) => void;
  hideModal: () => void;
  activeModal: AlertState | null;
}

const UIContext = createContext<UIContextType>({
  showAlert: () => {},
  showConfirm: () => {},
  hideModal: () => {},
  activeModal: null,
});

export const UIProvider = ({ children }: { children: React.ReactNode }) => {
  const [activeModal, setActiveModal] = useState<AlertState | null>(null);

  const showAlert = useCallback((title: string, message: string) => {
    setActiveModal({ title, message, isConfirm: false });
  }, []);

  const showConfirm = useCallback((title: string, message: string, onConfirm: () => void, confirmText?: string) => {
    setActiveModal({ title, message, onConfirm, confirmText, isConfirm: true });
  }, []);

  const hideModal = useCallback(() => {
    setActiveModal(null);
  }, []);

  return (
    <UIContext.Provider value={{ showAlert, showConfirm, hideModal, activeModal }}>
      {children}
    </UIContext.Provider>
  );
};

export const useUI = () => useContext(UIContext);
