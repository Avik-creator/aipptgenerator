"use client"

import React, { createContext, useState, useContext, ReactNode } from "react"

export type Theme = {
  name: string
  color: string
  accent: string
  textColor: string
}

export const themes = [
  { 
    name: "Office Blue", 
    color: "bg-gradient-to-r from-blue-600 to-blue-500", 
    accent: "bg-gradient-to-r from-blue-700 to-blue-600", 
    textColor: "text-white" 
  },
  { 
    name: "Corporate Gray", 
    color: "bg-gradient-to-r from-gray-600 to-gray-500", 
    accent: "bg-gradient-to-r from-gray-700 to-gray-600", 
    textColor: "text-white" 
  },
  { 
    name: "Executive Red", 
    color: "bg-gradient-to-r from-red-600 to-red-500", 
    accent: "bg-gradient-to-r from-red-700 to-red-600", 
    textColor: "text-white" 
  },
  { 
    name: "Retrospect Green", 
    color: "bg-gradient-to-r from-green-600 to-green-500", 
    accent: "bg-gradient-to-r from-green-700 to-green-600", 
    textColor: "text-white" 
  },
  { 
    name: "Modern Black", 
    color: "bg-gradient-to-r from-slate-900 to-slate-800", 
    accent: "bg-gradient-to-r from-slate-800 to-slate-700", 
    textColor: "text-white" 
  },
  { 
    name: "Aspect Gold", 
    color: "bg-gradient-to-r from-amber-500 to-amber-400", 
    accent: "bg-gradient-to-r from-amber-600 to-amber-500", 
    textColor: "text-gray-900" 
  },
  { 
    name: "Clarity Purple", 
    color: "bg-gradient-to-r from-purple-600 to-purple-500", 
    accent: "bg-gradient-to-r from-purple-700 to-purple-600", 
    textColor: "text-white" 
  },
  { 
    name: "Wisp Teal", 
    color: "bg-gradient-to-r from-teal-600 to-teal-500", 
    accent: "bg-gradient-to-r from-teal-700 to-teal-600", 
    textColor: "text-white" 
  },
  { 
    name: "Organic Orange", 
    color: "bg-gradient-to-r from-orange-500 to-orange-400", 
    accent: "bg-gradient-to-r from-orange-600 to-orange-500", 
    textColor: "text-white" 
  },
  { 
    name: "Ocean Blue", 
    color: "bg-gradient-to-r from-cyan-600 to-cyan-500", 
    accent: "bg-gradient-to-r from-cyan-700 to-cyan-600", 
    textColor: "text-white" 
  },
  { 
    name: "Royal Indigo", 
    color: "bg-gradient-to-r from-indigo-600 to-indigo-500", 
    accent: "bg-gradient-to-r from-indigo-700 to-indigo-600", 
    textColor: "text-white" 
  },
  { 
    name: "Forest Green", 
    color: "bg-gradient-to-r from-emerald-600 to-emerald-500", 
    accent: "bg-gradient-to-r from-emerald-700 to-emerald-600", 
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
