import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/context/theme-context";
import { Toaster } from "@/components/ui/sonner";
import Script from 'next/script'
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "PPT CraftAI",
  description: "Generate PowerPoint presentations using AI",
  category: "Productivity",
  openGraph:{
    title: "PPT CraftAI",
    description: "Generate PowerPoint presentations using AI",
    url: "https://aipptgenerator.vercel.app",
    siteName: "PPT CraftAI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en-US",
  },
  twitter:{
    card: "summary_large_image",
    title: "PPT CraftAI",
    description: "Generate PowerPoint presentations using AI",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
      },
    ],
  },
  icons: {
    icon: "/favicon.ico",
    shortcut: "/favicon.ico",
    apple: "/apple-touch-icon.png",
  },

  


};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
          <Script
            defer
            data-domain="aipptgenerator.vercel.app"
            src="https://webtracker.avikmukherjee.tech/tracking-script.js"
          />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider>
          {children}
          
        </ThemeProvider>
        <Toaster/>
      </body>
    </html>
  );
}
