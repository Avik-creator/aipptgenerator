"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"

export type Theme = {
  name: string
  color: string
  accent: string
  hexBackground: string
  textColor: string
}

export const themes = [
  { 
    name: "Ocean Breeze", 
    color: "bg-gradient-to-r from-blue-500 to-cyan-400", 
    hexBackground: "#3b82f6",
    accent: "bg-gradient-to-r from-blue-600 to-cyan-500", 
    textColor: "text-white" 
  },
  { 
    name: "Twilight Aurora", 
    color: "bg-gradient-to-r from-purple-500 to-pink-400", 
    hexBackground: "#9333ea",
    accent: "bg-gradient-to-r from-purple-600 to-pink-500", 
    textColor: "text-white" 
  },
  { 
    name: "Sunset Horizon", 
    color: "bg-gradient-to-r from-orange-500 to-red-500", 
    hexBackground: "#f97316",
    accent: "bg-gradient-to-r from-orange-600 to-red-600", 
    textColor: "text-white" 
  },
  { 
    name: "Forest Depths", 
    color: "bg-gradient-to-r from-emerald-500 to-teal-400", 
    hexBackground: "#059669",
    accent: "bg-gradient-to-r from-emerald-600 to-teal-500", 
    textColor: "text-white" 
  },
  { 
    name: "Midnight Sky", 
    color: "bg-gradient-to-r from-slate-800 to-blue-900", 
    hexBackground: "#1e3a8a",
    accent: "bg-gradient-to-r from-slate-700 to-blue-800", 
    textColor: "text-white" 
  },
  { 
    name: "Golden Hour", 
    color: "bg-gradient-to-r from-amber-400 to-yellow-300",
    hexBackground: "#fbbf24", 
    accent: "bg-gradient-to-r from-amber-500 to-yellow-400", 
    textColor: "text-white" 
  },
]
type ThemeContextType = {
  selectedTheme: Theme
  setSelectedTheme: (theme: Theme) => void
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined)

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [selectedTheme, setSelectedTheme] = useState<Theme>(themes[0])

  return (
    <ThemeContext.Provider value={{ selectedTheme, setSelectedTheme }}>
      {children}
    </ThemeContext.Provider>
  )
}

export function useTheme() {
  const context = useContext(ThemeContext)
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider")
  }
  return context
}
