import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { AuthProvider } from "@/context/auth-context";
import { APP_NAME } from "@/lib/config";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: APP_NAME,
  description: `${APP_NAME} - Document tracking and approval system`,
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full bg-gray-50">
      <body className={`h-full ${inter.className}`}>
        <AuthProvider>{children}</AuthProvider>
      </body>
    </html>
  );
}
