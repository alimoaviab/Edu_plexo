import { useEffect, useState, useRef, type ReactNode } from "react";
import { createPortal } from "react-dom";

interface DrawerProps {
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  /** Width of the drawer. Defaults to "max-w-md" */
  width?: string;
  /** Side to slide from. Defaults to "right" */
  side?: "right" | "left";
  /** Z-index class. Defaults to "z-[99999]" */
  zIndex?: string;
  /** Whether clicking the backdrop closes the drawer */
  closeOnBackdrop?: boolean;
}

/**
 * Reusable Drawer component with smooth slide-in/out animation.
 * Rendered via React Portal to document.body to ensure proper stacking.
 */
export function Drawer({
  isOpen,
  onClose,
  children,
  width = "max-w-md",
  side = "right",
  zIndex = "z-[99999]",
  closeOnBackdrop = true,
}: DrawerProps) {
  const [mounted, setMounted] = useState(false);
  const [visible, setVisible] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    if (isOpen) {
      setMounted(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setVisible(true);
        });
      });
    } else {
      setVisible(false);
      timeoutRef.current = setTimeout(() => setMounted(false), 350);
    }

    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, [isOpen]);

  // Lock body scroll
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  // Escape key
  useEffect(() => {
    if (!isOpen) return;
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handleEscape);
    return () => document.removeEventListener("keydown", handleEscape);
  }, [isOpen, onClose]);

  if (!mounted) return null;

  const translateClass =
    side === "right"
      ? visible
        ? "translate-x-0"
        : "translate-x-full"
      : visible
      ? "translate-x-0"
      : "-translate-x-full";

  const positionClass = side === "right" ? "right-0" : "left-0";

  const content = (
    <div className={`fixed inset-0 ${zIndex} pointer-events-none`}>
      {/* Backdrop */}
      <div
        className={`pointer-events-auto fixed inset-0 bg-slate-900/50 backdrop-blur-[2px] transition-opacity duration-300 ease-out ${
          visible ? "opacity-100" : "opacity-0"
        }`}
        onClick={closeOnBackdrop ? onClose : undefined}
        aria-hidden="true"
      />

      {/* Drawer panel */}
      <aside
        className={`pointer-events-auto fixed inset-y-0 ${positionClass} flex h-full w-full ${width} flex-col bg-white shadow-[-20px_0_60px_-12px_rgba(0,0,0,0.25)] transition-transform duration-350 ease-[cubic-bezier(0.32,0.72,0,1)] ${translateClass}`}
        role="dialog"
        aria-modal="true"
      >
        {children}
      </aside>
    </div>
  );

  return createPortal(content, document.body);
}
