import Hero from "@/components/page/Hero";
import { PresentationForm } from "@/components/page/presentation-form";
import { ThemeSelector } from "@/components/page/theme-selector";
import { Metadata } from "next";

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


export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-pink-50 to-blue-50">
      <Hero />
      <div className="container max-w-6xl mx-auto px-4 py-12">
        <div className="space-y-8">
          <ThemeSelector />
          <PresentationForm />
        </div>
      </div>
    </main>
  );
}
