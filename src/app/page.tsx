import { Hero } from "@/components/page/Hero";
import { PresentationForm } from "@/components/page/presentation-form";
import { ThemeSelector } from "@/components/page/theme-selector";


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
