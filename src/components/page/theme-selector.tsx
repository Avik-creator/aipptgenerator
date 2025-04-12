"use client"

import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { useTheme, themes } from "@/context/theme-context"

export function ThemeSelector() {
  const { selectedTheme, setSelectedTheme } = useTheme()

  return (
    <div id="create" className="py-8">
      <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Choose Your Presentation Theme</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {themes.map((theme) => (
          <Card
            key={theme.name}
            className={cn(
              "cursor-pointer p-4 transition-all hover:scale-105",
              selectedTheme.name === theme.name ? "ring-4 ring-offset-2 ring-blue-400" : "",
            )}
            onClick={() => setSelectedTheme(theme)}
          >
            <div className={cn("w-full h-24 rounded-md mb-2", theme.color)}></div>
            <div className="text-center font-medium text-sm">{theme.name}</div>
          </Card>
        ))}
      </div>
    </div>
  )
}
