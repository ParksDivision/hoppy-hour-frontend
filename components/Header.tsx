'use client'

import React from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'

const Header: React.FC = () => {
  return (
    <header
      className={cn(
        "bg-white",
        "sticky top-0 z-50",
        // "w-full shadow-md"
      )}
    >
      {/* Main Header Content */}
      <div className="container mx-auto">
        <div className="h-24 md:h-32 flex items-center justify-center px-0">
          {/* Logo Container - Extended width and offset left */}
          <div className="relative w-80 h-20 md:w-[600px] md:h-28 -ml-4 md:-ml-8">
            <Image
              src="/hoppy hour wide header v2.png"
              alt="Hoppy Hour Icon"
              fill
              className="object-contain object-center"
              priority
              sizes="(max-width: 768px) 320px, 600px"
            />
          </div>
        </div>
      </div>
      {/* 
      Decorative bottom border
      <div className="h-1 bg-gradient-to-r from-[#9DC7AC] via-[#527C6B] to-[#E8F3E8] opacity-50" /> */}
    </header>
  )
}

export default Header