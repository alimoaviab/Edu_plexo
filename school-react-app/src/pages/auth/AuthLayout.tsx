import { Outlet } from "react-router-dom";
import { ThemeToggle } from "@/components/ui/ThemeToggle";

export function AuthLayout() {
  return (
    <div className="min-h-screen bg-background text-text-primary relative">
      <div className="absolute top-4 right-4 z-50">
        <ThemeToggle />
      </div>
      <Outlet />
    </div>
  );
}
