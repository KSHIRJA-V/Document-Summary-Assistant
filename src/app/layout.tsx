import type { Metadata } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Document Summary Assistant | Unthinkable Solutions",
  description: "Enterprise Document Intelligence & Summary Assistant with OCR, Multi-Length Smart Summaries, Readability Scoring, and Interactive Q&A.",
  icons: {
    icon: "https://www.unthinkable.co/assets/images/favicon.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.variable} ${jakarta.variable} font-sans min-h-screen bg-slate-50 dark:bg-[#0b0f17] text-slate-900 dark:text-slate-100 flex flex-col`}>
        {children}
      </body>
    </html>
  );
}
