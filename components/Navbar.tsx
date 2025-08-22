'use client'

import React from 'react'
import { cn } from "@/lib/utils"

const Navbar: React.FC = () => {
  return (
    <nav className="sticky top-0 z-40 bg-slate-800/90 backdrop-blur-md border-b border-gray-600/60 shadow-sm relative">
      <div className="max-w-4xl mx-auto px-6 py-4">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <button
            className={cn(
              "flex-1 sm:flex-none px-8 py-3 rounded-xl text-white font-semibold",
              "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700",
              "shadow-lg hover:shadow-xl transition-all duration-300 ease-out",
              "transform hover:scale-105 hover:-translate-y-0.5",
              "min-w-[160px] text-center text-sm tracking-wide",
              "focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
            )}
          >
            Find Deals
          </button>
          <button
            className={cn(
              "flex-1 sm:flex-none px-8 py-3 rounded-xl font-semibold",
              "bg-slate-700 border-2 border-gray-500 text-gray-200",
              "hover:border-emerald-400 hover:text-emerald-400 hover:bg-emerald-900/20",
              "shadow-md hover:shadow-lg transition-all duration-300 ease-out",
              "transform hover:scale-105 hover:-translate-y-0.5",
              "min-w-[160px] text-center text-sm tracking-wide",
              "focus:outline-none focus:ring-4 focus:ring-emerald-500/30"
            )}
          >
            Sign Up
          </button>
        </div>
      </div>
    </nav>
  )
}

export default Navbar