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
  // Extract the title by removed the "Slide <Number>:" prefix if it exists

  const displayTitle = slide.title.replace(/Slide \d+:\s*/, "")
  const displayTitleWithNumber = slide.title.match(/Slide \d+:\s*(.*)/)
    ? displayTitle
    : slide.title


  // Helper to convert tailwind gradient to a solid color
  const getSolidBackgroundColor = (themeColor: string) => {
    // Map theme gradients to simple solid colors for PowerPoint
    if (themeColor.includes("from-blue-500")) {
      return "#3B82F6" // Blue
    } else if (themeColor.includes("from-purple-500")) {
      return "#A855F7" // Purple
    } else if (themeColor.includes("from-orange-500")) {
      return "#F97316" // Orange
    } else if (themeColor.includes("from-emerald-500")) {
      return "#10B981" // Emerald
    } else if (themeColor.includes("from-slate-800")) {
      return "#1E293B" // Slate
    } else if (themeColor.includes("from-amber-400")) {
      return "#F59E0B" // Amber
    }
    // Default fallback
    return "#4F46E5" // Indigo
  }

  const generatePPTX = async () => {
    setIsGenerating(true)
    try {
      // Create a new presentation
      const pptx = new pptxgen()
      
      // Set presentation properties
      pptx.title = presentation.title
      
      // Get solid background color for the selected theme
      const backgroundColor = getSolidBackgroundColor(selectedTheme.color)
      
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
                w: 4, 
                h: 3
              })
            } else {
              // For URL images
              pptxSlide.addImage({ 
                path: imageUrl,
                x: '55%', 
                y: 1.5, 
                w: 4, 
                h: 3
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
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold">Preview</h3>
        <div className="flex gap-2">
          {/* <Button 
            variant="outline" 
            size="sm" 
            onClick={generatePDF} 
            disabled={isGenerating}
          >
            <Download className="h-4 w-4 mr-1" /> PDF
          </Button> */}
          <Button 
            variant="outline" 
            size="sm" 
            onClick={generatePPTX} 
            disabled={isGenerating}
          >
            <FileType className="h-4 w-4 mr-1" /> PPTX
          </Button>
        </div>
      </div>
      <h3 className="text-xl font-bold text-center">Preview</h3>

      <div className={cn(
        "relative pt-[56.25%] rounded-lg overflow-hidden shadow-md",
        selectedTheme.color
      )}>
        <div className={cn("absolute inset-0 p-8 flex flex-col", selectedTheme.textColor)}>
          <div className="flex-1 flex flex-col">
            <h2 className="text-2xl font-bold mb-6 text-center">{displayTitleWithNumber}</h2>

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