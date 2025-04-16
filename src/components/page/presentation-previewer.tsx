"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight, Download } from "lucide-react";
import Image from "next/image";
import { useTheme } from "@/context/theme-context";
import { cn } from "@/lib/utils";
import pptxgen from "pptxgenjs";

type Slide = {
  title: string;
  content: string[];
  image_url?: string;
};

type Presentation = {
  title: string;
  slides: Slide[];
  theme: string;
};

export function PresentationPreview({
  presentation,
}: {
  presentation: Presentation;
}) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { selectedTheme } = useTheme();
  const [isGenerating, setIsGenerating] = useState(false);

  const goToNextSlide = () => {
    if (currentSlide < presentation.slides.length - 1) {
      setCurrentSlide(currentSlide + 1);
    }
  };

  const goToPrevSlide = () => {
    if (currentSlide > 0) {
      setCurrentSlide(currentSlide - 1);
    }
  };

  const slide = presentation.slides[currentSlide];

  // Extract the title by removing the "Slide Number:" prefix if it exists
  const displayTitle = slide.title.replace(/Slide \d+:\s*/, "");
  const displayTitleWithNumber = slide.title.match(/Slide \d+:\s*(.*)/)
    ? displayTitle
    : slide.title;

  const generatePPTX = async () => {
    setIsGenerating(true);
    try {
      // Create a new presentation
      const pptx = new pptxgen();

      // Set presentation properties
      pptx.title = presentation.title;

      // Get solid background color for the selected theme
      const backgroundColor = selectedTheme.hexBackground;

      // Determine text color - white for dark backgrounds, black for light
      const textColor = selectedTheme.textColor;

      // Create slides
      presentation.slides.forEach((slide) => {
        const pptxSlide = pptx.addSlide();

        // Set solid background color
        pptxSlide.background = { color: backgroundColor };

        // Add title
        pptxSlide.addText(slide.title, {
          x: 0.5,
          y: 0.5,
          w: "90%",
          h: 0.75,
          fontSize: 24,
          color: textColor,
          bold: true,
          align: "center",
          fontFace: "Arial",
        });

        // Add content as bullet points
        if (slide.content && slide.content.length > 0) {
          const contentX = 0.5;
          const contentY = 1.5;
          const contentWidth = slide.image_url ? "45%" : "90%";

          // Add all bullet points together
          const bulletPoints = slide.content
            .map((item) => `• ${item}`)
            .join("\n");

          pptxSlide.addText(bulletPoints, {
            x: contentX,
            y: contentY,
            w: contentWidth,
            h: 3,
            fontSize: 14,
            color: textColor,
            fontFace: "Arial",
            breakLine: true,
            lineSpacing: 16,
          });
        }

        // Add image if available
        if (slide.image_url) {
          const imageUrl = slide.image_url.replace(/^image:\s*/, "");

          try {
            if (imageUrl.startsWith("data:image")) {
              // For base64 images
              pptxSlide.addImage({
                data: imageUrl,
                x: "55%",
                y: 1.5,
                w: 3,
                h: 3,
              });
            } else {
              // For URL images
              pptxSlide.addImage({
                path: imageUrl,
                x: "55%",
                y: 1.5,
                w: 3,
                h: 3,
              });
            }
          } catch (imageError) {
            console.error("Error adding image:", imageError);
            // Add a placeholder text instead
            pptxSlide.addText("[Image could not be loaded]", {
              x: "55%",
              y: 2,
              w: 4,
              h: 1,
              color: textColor,
              fontSize: 12,
              align: "center",
              fontFace: "Arial",
            });
          }
        }
      });

      // Save the file
      await pptx.writeFile({
        fileName: `${presentation.title.replace(/\s+/g, "-")}.pptx`,
      });
    } catch (error) {
      console.error("Error generating PPTX:", error);
      alert("Failed to generate PowerPoint. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Header with responsive adjustments */}
      <div className="flex flex-col sm:flex-row justify-between items-center gap-2 sm:gap-0">
        <h3 className="text-xl font-bold bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
          Preview
        </h3>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={generatePPTX}
            disabled={isGenerating}
            className="w-full sm:w-auto bg-gradient-to-r from-blue-500 to-purple-600 text-white border-none hover:opacity-90 transition-opacity"
          >
            <Download className="h-4 w-4 mr-2" /> Download PPTX
          </Button>
        </div>
      </div>

      {/* Enhanced slide container with better aesthetics */}
      <div
        className={cn(
          "rounded-xl overflow-hidden shadow-lg border border-gray-200 dark:border-gray-800",
          "sm:relative sm:pt-[56.25%]", // Only apply aspect ratio on larger screens
          selectedTheme.color,
        )}
      >
        {/* Enhanced title bar */}
        <div
          className={cn(
            "sm:absolute sm:top-0 sm:left-0 sm:right-0 sm:z-10 px-4 pt-6 sm:px-8 sm:pt-10 pb-4",
            "border-b border-white/10",
            selectedTheme.textColor,
            selectedTheme.color,
          )}
        >
          <h2 className="text-lg sm:text-2xl font-bold text-center drop-shadow-md">
            {displayTitleWithNumber}
          </h2>
        </div>

        {/* Content area with centered bullet points */}
        <div
          className={cn(
            "sm:absolute sm:inset-0 sm:pt-24 px-6 pb-6 sm:px-12 sm:pb-12",
            "min-h-[400px] overflow-y-auto sm:overflow-y-auto", 
            "mt-8 flex items-center justify-center", 
            selectedTheme.textColor,
          )}
        >
          <div className="w-full flex flex-col items-center py-4"> 
            <div className="w-full flex flex-col md:flex-row justify-center gap-4"> 
              <div
                className={cn(
                  "flex-1 flex flex-col items-center justify-start", // Changed to justify-start for proper alignment
                  slide.image_url ? "md:pr-6" : "",
                )}
              >
                <ul className="list-none space-y-3 sm:space-y-4 max-w-xl mx-auto w-full"> 
                  {slide.content.map((item, i) => (
                    <li
                      key={i}
                      className="text-sm sm:text-base md:text-lg flex items-start mb-2" // Added bottom margin
                    >
                      <span className="inline-block w-5 h-5 bg-white/20 rounded-full mr-3 mt-1 flex-shrink-0"></span>
                      <span className="flex-1">
                        {item.includes("-") ? item.split("-")[1].trim() : item}
                      </span> 
                    </li>
                  ))}
                </ul>
              </div>
              {slide.image_url && (
                <div className="flex-1 flex items-center justify-center mt-4 md:mt-0"> {/* Reduced top margin on mobile */}
                  <div className="relative w-full h-48 sm:h-64 md:h-full flex items-center justify-center">
                    <div className="rounded-lg overflow-hidden p-1 bg-white/10 shadow-lg">
                      <Image
                        src={slide.image_url.replace(/^image:\s*/, "")}
                        alt="Slide Image"
                        width={400}
                        height={300}
                        className="object-contain rounded"
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile scroll indicator with nicer styling */}
      <div className="text-center text-xs text-gray-500 italic block sm:hidden py-1">
        <div className="flex items-center justify-center">
          <span className="animate-bounce inline-block h-1 w-6 bg-gray-300 rounded-full mr-1"></span>
          Scroll to view all content
        </div>
      </div>

      {/* Enhanced navigation controls */}
      <div className="flex items-center justify-between mt-4 sm:mt-6">
        <Button
          variant="outline"
          size="sm"
          onClick={goToPrevSlide}
          disabled={currentSlide === 0}
          className={cn(
            "text-xs sm:text-sm rounded-full px-4 py-2 transition-all",
            currentSlide === 0
              ? "opacity-50"
              : "hover:bg-gray-100 dark:hover:bg-gray-800",
          )}
        >
          <ChevronLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1" /> Previous
        </Button>

        <span className="text-xs sm:text-sm bg-gray-100 dark:bg-gray-800 px-3 py-1 rounded-full">
          {currentSlide + 1} of {presentation.slides.length}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={goToNextSlide}
          disabled={currentSlide === presentation.slides.length - 1}
          className={cn(
            "text-xs sm:text-sm rounded-full px-4 py-2 transition-all",
            currentSlide === presentation.slides.length - 1
              ? "opacity-50"
              : "hover:bg-gray-100 dark:hover:bg-gray-800",
          )}
        >
          Next <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4 ml-1" />
        </Button>
      </div>
    </div>
  );
}

export function PresentationPreviewer() {
  const { selectedTheme } = useTheme();

  return (
    <div className="mt-8 sm:mt-12">
      <h3 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 bg-gradient-to-r from-purple-600 to-blue-500 bg-clip-text text-transparent">
        Presentation Preview
      </h3>
      <div
        className={cn(
          "w-full aspect-video rounded-xl shadow-xl p-8 sm:p-10",
          "min-h-[200px] max-h-[60vh] sm:max-h-none overflow-y-auto sm:overflow-visible",
          "border border-white/10",
          selectedTheme.color,
          selectedTheme.textColor,
        )}
      >
        <div className="text-2xl sm:text-3xl font-bold mb-6 sm:mb-8 text-center drop-shadow-md">
          Sample Title Slide
        </div>
        <div
          className={cn(
            "p-4 sm:p-6 rounded-lg mx-auto max-w-lg text-center",
            "border border-white/20",
            selectedTheme.accent,
          )}
        >
          <p className="text-base sm:text-xl">
            This preview uses the {selectedTheme.name} theme
          </p>
          <p className="text-sm sm:text-base mt-2 opacity-80">
            Choose a theme to customize your presentation look and feel
          </p>
        </div>
      </div>

      {/* Enhanced mobile scroll indicator */}
      <div className="text-center text-xs text-gray-500 italic block sm:hidden mt-2">
        <div className="flex items-center justify-center">
          <span className="animate-bounce inline-block h-1 w-6 bg-gray-300 rounded-full mr-1"></span>
          Scroll to view all content
        </div>
      </div>
    </div>
  );
}
