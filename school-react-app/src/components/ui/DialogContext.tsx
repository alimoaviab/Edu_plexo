import React, { createContext, useContext, useState, ReactNode, useCallback } from 'react';
import { Modal } from './Modal';
import { Input } from './Input';
import { Button } from './Button';

interface DialogOptions {
  title: string;
  message: string;
  defaultValue?: string;
}

interface DialogContextValue {
  confirm: (title: string, message: string) => Promise<boolean>;
  prompt: (title: string, message: string, defaultValue?: string) => Promise<string | null>;
}

const DialogContext = createContext<DialogContextValue | undefined>(undefined);

export function useDialog() {
  const context = useContext(DialogContext);
  if (!context) {
    throw new Error('useDialog must be used within a DialogProvider');
  }
  return context;
}

export function DialogProvider({ children }: { children: ReactNode }) {
  const [isOpen, setIsOpen] = useState(false);
  const [type, setType] = useState<'confirm' | 'prompt'>('confirm');
  const [options, setOptions] = useState<DialogOptions>({ title: '', message: '' });
  const [inputValue, setInputValue] = useState('');
  
  const [resolveFn, setResolveFn] = useState<{ resolve: (value: any) => void } | null>(null);

  const confirm = useCallback((title: string, message: string) => {
    return new Promise<boolean>((resolve) => {
      setOptions({ title, message });
      setType('confirm');
      setResolveFn({ resolve });
      setIsOpen(true);
    });
  }, []);

  const prompt = useCallback((title: string, message: string, defaultValue = '') => {
    return new Promise<string | null>((resolve) => {
      setOptions({ title, message, defaultValue });
      setInputValue(defaultValue);
      setType('prompt');
      setResolveFn({ resolve });
      setIsOpen(true);
    });
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    if (resolveFn) {
      resolveFn.resolve(type === 'confirm' ? false : null);
      setResolveFn(null);
    }
  };

  const handleConfirm = () => {
    setIsOpen(false);
    if (resolveFn) {
      resolveFn.resolve(type === 'confirm' ? true : inputValue.trim());
      setResolveFn(null);
    }
  };

  return (
    <DialogContext.Provider value={{ confirm, prompt }}>
      {children}
      <Modal
        isOpen={isOpen}
        onClose={handleClose}
        title={options.title}
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="primary" onClick={handleConfirm}>
              {type === 'confirm' ? 'Confirm' : 'Save'}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <p className="text-slate-700">{options.message}</p>
          {type === 'prompt' && (
            <Input
              autoFocus
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleConfirm();
              }}
            />
          )}
        </div>
      </Modal>
    </DialogContext.Provider>
  );
}
