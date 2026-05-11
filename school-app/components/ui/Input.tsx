"use client";

import { InputHTMLAttributes } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
}

export function Input({ label, error, helperText, leftIcon, id, className = "", ...props }: InputProps) {
  const inputId = id ?? props.name;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={inputId} className="text-[11px] font-black text-slate-500 uppercase tracking-widest mb-1 px-1">
          {label}
          {props.required && <span className="text-red-500 ml-1" aria-hidden="true">*</span>}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center justify-center text-slate-400 pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          id={inputId}
          {...props}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={`w-full ${leftIcon ? "pl-11" : "px-3"} py-1.5 text-sm bg-surface border rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-primary/20 ${
            error ? "border-error focus:border-error focus:ring-error/20" : "border-border focus:border-primary"
          } ${className}`}
        />
      </div>
      {helperText && !error && (
        <span id={helperId} className="text-xs text-gray-500 mt-1">{helperText}</span>
      )}
      {error && <span id={errorId} className="text-xs text-error mt-1">{error}</span>}
    </div>
  );
}
