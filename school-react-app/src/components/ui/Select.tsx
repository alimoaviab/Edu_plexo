import { AppIcon } from "shared/ui/AppIcon";
/**
 * Custom Premium Select Primitive — unified to the Eduplexo design system.
 *
 * Default visual contract:
 *   - Trigger: Glassmorphic background, premium border, rotating chevron.
 *   - List: Floating card with backdrop-blur, smooth transitions, custom option highlight.
 *   - Accessibility: Role properties, click-outside listener, full backward compatibility.
 *
 * Portal rendering:
 *   The dropdown list is rendered via React Portal to document.body, ensuring
 *   it is never clipped by parent overflow or z-index stacking contexts.
 *   Position is calculated dynamically using getBoundingClientRect() and
 *   automatically flips upward when there is insufficient space below.
 */

import { useState, useRef, useEffect, useCallback, type SelectHTMLAttributes } from "react";
import { createPortal } from "react-dom";

export interface SelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, "onChange"> {
  label?: string;
  error?: string;
  options: { label: string; value: string | number }[];
  onChange?: (e: { target: { name?: string; value: any } }) => void;
  placeholder?: string;
  searchable?: boolean;
}

export function Select({
  label,
  error,
  options,
  id,
  className = "",
  value,
  onChange,
  placeholder,
  ...props
}: SelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const selectId = id ?? props.name;
  const containerRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [dropdownStyle, setDropdownStyle] = useState<React.CSSProperties>({});
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isOpen) {
      setSearchQuery("");
    }
  }, [isOpen]);

  // Find the active option label
  const selectedOption = options.find((o) => o.value === value) || options[0];

  // Calculate dropdown position relative to viewport
  const updatePosition = useCallback(() => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const viewportHeight = window.innerHeight;
    const dropdownMaxHeight = 240; // max-h-60 = 15rem = 240px
    const spaceBelow = viewportHeight - rect.bottom;
    const spaceAbove = rect.top;
    const openUpward = spaceBelow < dropdownMaxHeight && spaceAbove > spaceBelow;

    const style: React.CSSProperties = {
      position: "fixed",
      left: rect.left,
      width: rect.width,
      zIndex: 99999,
    };

    if (openUpward) {
      style.bottom = viewportHeight - rect.top + 6;
    } else {
      style.top = rect.bottom + 6;
    }

    setDropdownStyle(style);
  }, []);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;
      if (
        containerRef.current &&
        !containerRef.current.contains(target) &&
        listRef.current &&
        !listRef.current.contains(target)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // Recalculate position on open, scroll, and resize
  useEffect(() => {
    if (!isOpen) return;
    updatePosition();

    const handleScrollOrResize = () => {
      updatePosition();
    };

    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);
    return () => {
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [isOpen, updatePosition]);

  const handleSelect = (val: any) => {
    if (onChange) {
      onChange({
        target: {
          name: props.name,
          value: val,
        },
      });
    }
    setIsOpen(false);
  };

  const filteredOptions = props.searchable 
    ? options.filter(o => o.label.toLowerCase().includes(searchQuery.toLowerCase()))
    : options;

  const dropdownList = isOpen ? (
    <div
      ref={listRef}
      style={dropdownStyle}
      className="bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-[0_20px_40px_rgba(0,0,0,0.08)] overflow-hidden py-1 max-h-80 flex flex-col animate-in fade-in slide-in-from-top-2 duration-150"
    >
      {props.searchable && (
        <div className="p-2 border-b border-slate-100 sticky top-0 bg-white/95 backdrop-blur-md z-10 shrink-0">
          <div className="relative">
            <AppIcon name="Search" size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              autoFocus
              type="text"
              placeholder="Search..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full h-8 pl-8 pr-3 text-[12px] bg-slate-50 border border-slate-200 rounded-lg focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              onClick={e => e.stopPropagation()}
            />
          </div>
        </div>
      )}
      <div className="overflow-y-auto max-h-60 flex-1">
        {filteredOptions.length === 0 ? (
            <div className="px-4 py-3 text-[13px] text-slate-500 text-center font-medium">No results found</div>
        ) : (
            filteredOptions.map((option) => {
              const isSelected = option.value === value;
              return (
                <div
                  key={option.value}
                  role="option"
                  aria-selected={isSelected}
                  onClick={() => handleSelect(option.value)}
                  className={`flex items-center justify-between px-4 py-2.5 text-[13px] font-bold cursor-pointer transition-all ${
                    isSelected
                      ? "text-blue-600 bg-blue-50/50 font-extrabold"
                      : "text-slate-600 hover:text-blue-600 hover:bg-slate-50/80"
                  }`}
                >
                  <span className="truncate">{option.label}</span>
                  {isSelected && (
                    <AppIcon name="Check" size={16} className="text-blue-600" />
                  )}
                </div>
              );
            })
        )}
      </div>
    </div>
  ) : null;

  return (
    <div className="flex flex-col gap-1 w-full relative" ref={containerRef}>
      {label && (
        <label
          htmlFor={selectId}
          className="text-[11px] font-bold text-slate-500 normal-case mb-1 px-1"
        >
          {label}
          {props.required && (
            <span className="text-rose-500 ml-0.5" aria-hidden="true">
              *
            </span>
          )}
        </label>
      )}
      
      <div className="relative">
        <button
          ref={triggerRef}
          id={selectId}
          type="button"
          onClick={() => !props.disabled && setIsOpen(!isOpen)}
          aria-haspopup="listbox"
          aria-expanded={isOpen}
          aria-invalid={!!error}
          disabled={props.disabled}
          className={`w-full h-11 px-4 pr-10 text-[13px] font-bold text-slate-700 bg-slate-50/50 hover:bg-slate-100/50 border rounded-xl outline-none transition-all flex items-center justify-between cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 text-left ${
            isOpen
              ? "border-blue-600 ring-4 ring-blue-600/5 bg-white shadow-sm"
              : error
              ? "border-rose-400 focus:border-rose-500 focus:ring-4 focus:ring-rose-500/10"
              : "border-slate-200 hover:border-slate-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-600/5"
          } ${className}`}
        >
          <span className="truncate">
            {selectedOption ? selectedOption.label : placeholder || "Select..."}
          </span>
          <AppIcon name="KeyboardArrowDown" size={18} className={` text-[18px] text-slate-400 transition-transform duration-200 ${isOpen ? "rotate-180 text-blue-600" : ""} `} />
        </button>

        {/* Portal-rendered dropdown — never clipped by parent overflow */}
        {createPortal(dropdownList, document.body)}
      </div>

      {error && (
        <span className="text-[10px] font-bold text-rose-600 mt-0.5 px-1" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
