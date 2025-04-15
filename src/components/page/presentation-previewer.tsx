"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, FileType } from "lucide-react"
import Image from "next/image"
import { useTheme } from "@/context/theme-context"
import { cn } from "@/lib/utils"
import pptxgen from "pptxgenjs"

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
  const [isGenerating, setIsGenerating] = useState(false)

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
  const displayTitle = slide.title.replace(/Slide \d+:\s*/, "")
  const displayTitleWithNumber = slide.title.match(/Slide \d+:\s*(.*)/)
    ? displayTitle
    : slide.title

    

  const generatePPTX = async () => {
    setIsGenerating(true)
    try {
      // Create a new presentation
      const pptx = new pptxgen()
      
      // Set presentation properties
      pptx.title = presentation.title
      
      // Get solid background color for the selected theme
      const backgroundColor = selectedTheme.color
      
      // Determine text color - white for dark backgrounds, black for light
      const textColor = selectedTheme.name === "Golden Hour" ? "#000000" : "#FFFFFF"
      
      // Create slides
      presentation.slides.forEach((slide) => {
        const pptxSlide = pptx.addSlide()
        
        // Set solid background color
        pptxSlide.background = { color: backgroundColor }
        
        // Add title
        pptxSlide.addText(slide.title, { 
          x: 0.5, 
          y: 0.5, 
          w: '90%', 
          h: 0.75, 
          fontSize: 24, 
          color: textColor,
          bold: true,
          align: 'center',
          fontFace: 'Arial'
        })
        
        // Add content as bullet points
        if (slide.content && slide.content.length > 0) {
          const contentX = 0.5
          const contentY = 1.5
          const contentWidth = slide.image_url ? '45%' : '90%'
          
          // Add all bullet points together
          const bulletPoints = slide.content.map(item => `• ${item}`).join('\n')
          
          pptxSlide.addText(bulletPoints, {
            x: contentX,
            y: contentY,
            w: contentWidth,
            h: 3, 
            fontSize: 14,
            color: textColor,
            fontFace: 'Arial',
            breakLine: true,
            lineSpacing: 16
          })
        }
        
        // Add image if available
        if (slide.image_url) {
          const imageUrl = slide.image_url.replace(/^image:\s*/, "")
          
          try {
            if (imageUrl.startsWith('data:image')) {
              // For base64 images
              pptxSlide.addImage({ 
                data: imageUrl,
                x: '55%', 
                y: 1.5, 
                w: 3.5, 
                h: 3.5
              })
            } else {
              // For URL images
              pptxSlide.addImage({ 
                path: imageUrl,
                x: '55%', 
                y: 1.5, 
                w: 3.5, 
                h: 3.5
              })
            }
          } catch (imageError) {
            console.error("Error adding image:", imageError)
            // Add a placeholder text instead
            pptxSlide.addText("[Image could not be loaded]", {
              x: '55%',
              y: 2,
              w: 4,
              h: 1,
              color: textColor,
              fontSize: 12,
              align: 'center',
              fontFace: 'Arial'
            })
          }
        }
      })
      
      // Save the file
      await pptx.writeFile({ fileName: `${presentation.title.replace(/\s+/g, '-')}.pptx` })
    } catch (error) {
      console.error("Error generating PPTX:", error)
      alert("Failed to generate PowerPoint. Please try again.")
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="space-y-4">
      {/* Header with responsive adjustments */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h3 className="text-xl font-bold">Preview</h3>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generatePPTX} 
            disabled={isGenerating}
            className="w-full sm:w-auto"
          >
            <FileType className="h-4 w-4 mr-1" /> PPTX
          </Button>
        </div>
      </div>

      {/* Mobile-friendly slide container: fixed aspect-ratio on desktop, scrollable on mobile */}
      <div className={cn(
        "rounded-lg overflow-hidden shadow-md",
        "sm:relative sm:pt-[56.25%]", // Only apply aspect ratio on larger screens
        selectedTheme.color
      )}>
        {/* Fixed title bar that won't scroll with content */}
        <div className={cn(
          "sm:absolute sm:top-0 sm:left-0 sm:right-0 sm:z-10 px-4 pt-4 sm:px-8 sm:pt-8 pb-2",
          selectedTheme.textColor,
          selectedTheme.color
        )}>
          <h2 className="text-xl sm:text-2xl font-bold text-center">{displayTitleWithNumber}</h2>
        </div>
        
        {/* Content area that can scroll independently */}
        <div className={cn(
          "sm:absolute sm:inset-0 sm:pt-16 px-4 pb-4 sm:px-8 sm:pb-8", // Added top padding to make room for title
          "min-h-[300px] max-h-[80vh] sm:max-h-none overflow-y-auto",
          "mt-2", // Space between title and content
          selectedTheme.textColor
        )}>
          <div className="flex-1 flex flex-col">
            <div className="flex-1 flex flex-col md:flex-row pt-4"> {/* Added top padding for separation */}
              <div className={cn("flex-1", slide.image_url ? "md:pr-4" : "")}>
                <ul className="list-disc pl-4 sm:pl-6 space-y-1 sm:space-y-2">
                  {slide.content.map((item, i) => (
                    <li key={i} className="text-sm sm:text-base md:text-lg">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>

              {slide.image_url && (
                <div className="flex-1 flex items-center justify-center mt-4 md:mt-0">
                  <div className="relative w-full h-36 sm:h-48 md:h-full flex items-center justify-center">
                    <Image
                      src={slide.image_url.replace(/^image:\s*/, "")}
                      alt="Slide Image"
                      fill
                      className="object-contain"
                    />
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile scroll indicator */}
      <div className="text-center text-xs text-gray-500 italic block sm:hidden">
        Scroll to see more content
      </div>

      {/* Navigation buttons with responsive spacing */}
      <div className="flex items-center justify-between mt-2 sm:mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={goToPrevSlide} 
          disabled={currentSlide === 0}
          className="text-xs sm:text-sm"
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Prev
        </Button>

        <span className="text-xs sm:text-sm text-gray-500">
          {currentSlide + 1}/{presentation.slides.length}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className="text-xs sm:text-sm"
        >
          Next <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </Button>
      </div>
    </div>
  )
}

export function PresentationPreviewer() {
  const { selectedTheme } = useTheme()

  return (
    <div className="mt-4 sm:mt-8">
      <h3 className="text-xl sm:text-2xl font-bold mb-2 sm:mb-4">Presentation Preview</h3>
      <div 
        className={cn(
          "w-full aspect-video rounded-lg shadow-lg p-4 sm:p-8", 
          "min-h-[200px] max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-visible",
          selectedTheme.color, 
          selectedTheme.textColor
        )}
      >
        <div className="text-lg sm:text-2xl font-bold mb-2 sm:mb-4">Sample Title Slide</div>
        <div className={cn("p-2 sm:p-4 rounded", selectedTheme.accent)}>
          <p className="text-sm sm:text-lg">This preview uses the {selectedTheme.name} theme</p>
        </div>
      </div>
      
      {/* Mobile scroll indicator */}
      <div className="text-center text-xs text-gray-500 italic block sm:hidden mt-1">
        Scroll to see more content
      </div>
    </div>
  )
}