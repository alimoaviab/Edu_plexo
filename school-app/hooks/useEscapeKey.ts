import { useEffect } from "react";

export function useEscapeKey(callback: () => void, isEnabled: boolean = true) {
  useEffect(() => {
    if (!isEnabled) return;
    
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        callback();
      }
    };
    
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [callback, isEnabled]);
}
