import type { Metadata } from "next";
import "./globals.css";
import { Toaster } from "react-hot-toast";
import { AuthProvider } from "@/src/contexts/AuthContext";
import AppHeader from "../components/layout/Header";


export const metadata: Metadata = {
  title: "E-Commerce",
  description: "E-Commerce Frontend",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AuthProvider>
          <AppHeader />
          <main className="mx-auto max-w-5xl px-4 py-8">{children}</main>
          <Toaster position="top-right" />
        </AuthProvider>
      </body>
    </html>
  );
}
