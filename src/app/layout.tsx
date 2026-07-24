import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Providers from "@/components/Providers";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "Icon Multimedia - ระบบแจ้งซ่อม",
  description: "ระบบจัดการงานซ่อม PC, Notebook, Printer สำหรับร้าน Icon Multimedia",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="th" className={inter.variable}>
      <body className="antialiased min-h-screen gradient-bg">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
