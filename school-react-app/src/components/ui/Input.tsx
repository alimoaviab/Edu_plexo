import { useEffect, useRef, type InputHTMLAttributes, type ReactNode } from "react";

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: ReactNode;
  rightIcon?: ReactNode;
}

export function Input({
  label,
  error,
  helperText,
  leftIcon,
  rightIcon,
  id,
  name,
  className = "",
  onChange,
  ...props
}: InputProps) {
  const fallbackName = name || (label ? label.toLowerCase().replace(/[^a-z0-9]/g, "_").replace(/^_+|_+$/g, "") : undefined);
  const inputId = id || fallbackName;
  const inputName = name || fallbackName;
  const helperId = helperText ? `${inputId}-helper` : undefined;
  const errorId = error ? `${inputId}-error` : undefined;
  const describedBy = [helperId, errorId].filter(Boolean).join(" ") || undefined;

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = inputRef.current;
    if (!el || !onChange) return;

    const handleNativeEvent = (e: Event) => {
      onChange(e as unknown as React.ChangeEvent<HTMLInputElement>);
    };

    el.addEventListener("input", handleNativeEvent);
    el.addEventListener("change", handleNativeEvent);
    return () => {
      el.removeEventListener("input", handleNativeEvent);
      el.removeEventListener("change", handleNativeEvent);
    };
  }, [onChange]);

  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="text-[11px] font-bold text-text-muted normal-case mb-1 px-1"
        >
          {label}
          {props.required && (
            <span className="text-error ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      <div className="relative flex items-center">
        {leftIcon && (
          <div className="absolute left-3.5 flex items-center justify-center text-text-muted pointer-events-none">
            {leftIcon}
          </div>
        )}
        <input
          ref={inputRef}
          id={inputId}
          name={inputName}
          onChange={onChange}
          {...props}
          aria-describedby={describedBy}
          aria-invalid={!!error}
          className={`w-full h-11 ${leftIcon ? "pl-10" : "px-3.5"} ${rightIcon ? "pr-10" : ""} text-[13px] font-medium text-text-primary bg-surface border rounded-xl outline-none transition-all placeholder:text-text-muted/60 disabled:opacity-50 disabled:bg-surface-muted ${
            error
              ? "border-error focus:border-error focus:ring-4 focus:ring-error/10"
              : "border-border focus:border-primary focus:ring-4 focus:ring-primary/10"
          } ${className}`}
        />
        {rightIcon && (
          <div className="absolute right-3.5 flex items-center justify-center">
            {rightIcon}
          </div>
        )}
      </div>
      {helperText && !error && (
        <span id={helperId} className="text-[10px] font-medium text-text-muted mt-0.5 px-1">
          {helperText}
        </span>
      )}
      {error && (
        <span id={errorId} className="text-[10px] font-bold text-error mt-0.5 px-1" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
