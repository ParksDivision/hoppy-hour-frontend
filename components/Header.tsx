'use client'

import React from 'react'
import { cn } from "@/lib/utils"
import Image from 'next/image'

const Header: React.FC = () => {
  return (
    <header className={cn("relative w-full bg-gradient-to-br from-slate-800 via-slate-700 to-slate-800 z-20 border-b border-gray-600/50")}>
      {/* Logo Container */}
      <div className="flex items-center justify-center px-6 py-12 md:py-16">
        <div className="relative w-80 h-20 md:w-[600px] md:h-28">
          <Image
            src="/hoppy hour wide header v2.png"
            alt="Hoppy Hour"
            fill
            className="object-contain filter drop-shadow-sm"
            priority
            sizes="(max-width: 768px) 320px, 600px"
          />
        </div>
      </div>
    </header>
  )
}

export default Header