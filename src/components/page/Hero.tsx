import { Button } from "@/components/ui/button"
import Link from "next/link"

export function Hero() {
  return (
    <div className="bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 text-white py-24">
      <div className="container max-w-6xl mx-auto px-4 text-center">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">AI PowerPoint Generator</h1>
        <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
          Create beautiful presentations in seconds with the power of AI. Choose a theme, describe your topic, and we&apos;ll
          generate professional slides ready to download.
        </p>
        <div className="flex justify-center gap-4">
          <Button asChild size="lg" className="bg-white text-purple-600 hover:bg-white/90">
            <Link href="#create">Get Started</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="bg-transparent border-white text-white hover:bg-white/10"
          >
            <Link href="#how-it-works">How It Works</Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
