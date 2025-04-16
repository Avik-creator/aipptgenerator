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
    name: "Corporate Slate", 
    color: "bg-gradient-to-r from-gray-800 to-gray-600", 
    hexBackground: "#2d3748",
    accent: "bg-gradient-to-r from-gray-700 to-gray-500", 
    textColor: "text-white" 
  },
  { 
    name: "Modern Business", 
    color: "bg-gradient-to-r from-indigo-600 to-blue-500", 
    hexBackground: "#3b82f6",
    accent: "bg-gradient-to-r from-indigo-700 to-blue-600", 
    textColor: "text-white" 
  },
  { 
    name: "Elegant Rose", 
    color: "bg-gradient-to-r from-pink-500 to-pink-400", 
    hexBackground: "#ec4899",
    accent: "bg-gradient-to-r from-pink-600 to-pink-500", 
    textColor: "text-white" 
  },
  { 
    name: "Business Green", 
    color: "bg-gradient-to-r from-green-600 to-teal-500", 
    hexBackground: "#16a34a",
    accent: "bg-gradient-to-r from-green-700 to-teal-600", 
    textColor: "text-white" 
  },
  { 
    name: "Techno Blue", 
    color: "bg-gradient-to-r from-blue-500 to-cyan-400", 
    hexBackground: "#3b82f6",
    accent: "bg-gradient-to-r from-blue-600 to-cyan-500", 
    textColor: "text-white" 
  },
  { 
    name: "Classy Gold", 
    color: "bg-gradient-to-r from-yellow-400 to-amber-300", 
    hexBackground: "#fbbf24",
    accent: "bg-gradient-to-r from-yellow-500 to-amber-400", 
    textColor: "text-white" 
  },
  { 
    name: "Sophisticated Purple", 
    color: "bg-gradient-to-r from-purple-600 to-indigo-500", 
    hexBackground: "#6b21a8",
    accent: "bg-gradient-to-r from-purple-700 to-indigo-600", 
    textColor: "text-white" 
  },
  { 
    name: "Steel Gray", 
    color: "bg-gradient-to-r from-slate-700 to-slate-600", 
    hexBackground: "#4b5563",
    accent: "bg-gradient-to-r from-slate-800 to-slate-700", 
    textColor: "text-white" 
  },
  { 
    name: "Fresh Mint", 
    color: "bg-gradient-to-r from-teal-400 to-emerald-300", 
    hexBackground: "#2dd4bf",
    accent: "bg-gradient-to-r from-teal-500 to-emerald-400", 
    textColor: "text-white" 
  },
  { 
    name: "Sunset Orange", 
    color: "bg-gradient-to-r from-orange-500 to-red-400", 
    hexBackground: "#f97316",
    accent: "bg-gradient-to-r from-orange-600 to-red-500", 
    textColor: "text-white" 
  },
  { 
    name: "Midnight Navy", 
    color: "bg-gradient-to-r from-blue-900 to-slate-800", 
    hexBackground: "#1e3a8a",
    accent: "bg-gradient-to-r from-blue-950 to-slate-900", 
    textColor: "text-white" 
  },
  { 
    name: "Natural Earth", 
    color: "bg-gradient-to-r from-amber-700 to-yellow-600", 
    hexBackground: "#b45309",
    accent: "bg-gradient-to-r from-amber-800 to-yellow-700", 
    textColor: "text-white" 
  }
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
