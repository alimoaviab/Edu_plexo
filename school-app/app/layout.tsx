import "./globals.css";
import { ToastProvider } from "../components/ui/ToastProvider";
import { NetworkStatus } from "../components/ui/NetworkStatus";
import { NextAuthProvider } from "../components/NextAuthProvider";

export const metadata = {
  title: "EduManage - AI-Powered School Management System",
  description: "Enterprise-grade school ERP platform trusted by 10,000+ schools worldwide. Automate operations, engage parents, and empower educators with real-time intelligence."
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning>
        <NextAuthProvider>
          {children}
          <ToastProvider />
          <NetworkStatus />
        </NextAuthProvider>
      </body>
    </html>
  );
}
