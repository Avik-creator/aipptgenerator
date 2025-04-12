"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"

type Slide = {
  title: string
  content: string[]
  image_url?: string
}

type Presentation = {
  title: string
  slides: Slide[]
  theme: string
}

export function PresentationPreview({ presentation }: { presentation: Presentation }) {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { selectedTheme } = useTheme()

  const goToNextSlide = () => {
    if (currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1)
    }
  }

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1)
    }
  }

  const slide = presentation.slides[currentSlide]
  
  // Extract the title by removing the "Slide Number:" prefix if it exists
  const displayTitle = slide.title.includes(": ") ? 
    slide.title.split(": ").slice(1).join(": ") : 
    slide.title

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-bold text-center">Preview</h3>

      <div className={cn(
        "relative pt-[56.25%] rounded-lg overflow-hidden shadow-md",
        selectedTheme.color
      )}>
        <div className={cn("absolute inset-0 p-8 flex flex-col", selectedTheme.textColor)}>
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center">{displayTitle}</h2>

            <div className="flex-1 flex flex-col md:flex-row">
              <div className={cn("flex-1", slide.image_url ? "md:pr-4" : "")}>
                <ul className="list-disc pl-6 space-y-2">
                  {slide.content.map((item, i) => (
                    <li key={i} className="text-lg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {slide.image_url && (
                <div className="flex-1 flex items-center justify-center mt-4 md:mt-0">
                  <div className="relative w-full h-full flex items-center justify-center">
                    <div className="relative w-full h-full max-h-48">
                      <Image
                        src={slide.image_url.replace(/^image:\s*/, "")}
                        alt="Slide Image"
                        fill
                        className="object-contain"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <Button variant="outline" size="sm" onClick={goToPrevSlide} disabled={currentSlide === 0}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Previous
        </Button>

        <span className="text-sm text-gray-500">
          Slide {currentSlide + 1} of {presentation.slides.length}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
        >
          Next <ChevronRight className="h-4 w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export function PresentationPreviewer() {
  const { selectedTheme } = useTheme()

  return (
    <div className="mt-8">
      <h3 className="text-2xl font-bold mb-4">Presentation Preview</h3>
      <div 
        className={cn(
          "w-full aspect-video rounded-lg shadow-lg p-8", 
          selectedTheme.color, 
          selectedTheme.textColor
        )}
      >
        <div className="text-2xl font-bold mb-4">Sample Title Slide</div>
        <div className={cn("p-4 rounded", selectedTheme.accent)}>
          <p className="text-lg">This preview uses the {selectedTheme.name} theme</p>
        </div>
      </div>
    </div>
  )
}
