'use client'

import React, { useState, useEffect } from 'react'
import { cn } from "@/lib/utils"
import VenueCard, { Business } from '@/components/VenueCard'
import { ChevronLeft, ChevronRight } from 'lucide-react'

interface DealCarouselProps {
  title: string
  businesses: Business[]
  className?: string
}

const DealCarousel: React.FC<DealCarouselProps> = ({ 
  title, 
  businesses, 
  className 
}) => {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)

  // Auto-scroll functionality
  useEffect(() => {
    if (!isAutoPlaying || businesses.length <= 3) return
    
    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const maxIndex = Math.max(0, businesses.length - 3)
        return prev >= maxIndex ? 0 : prev + 1
      })
    }, 5000)

    return () => clearInterval(interval)
  }, [isAutoPlaying, businesses.length])

  const nextSlide = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(prev => {
      // On mobile, navigate through individual cards
      if (window.innerWidth < 768) {
        return prev >= businesses.length - 1 ? 0 : prev + 1
      }
      // On desktop, navigate through individual positions but limit to valid range
      const maxIndex = Math.max(0, businesses.length - 3)
      return prev >= maxIndex ? 0 : prev + 1
    })
  }

  const prevSlide = () => {
    setIsAutoPlaying(false)
    setCurrentIndex(prev => {
      // On mobile, navigate through individual cards
      if (window.innerWidth < 768) {
        return prev <= 0 ? businesses.length - 1 : prev - 1
      }
      // On desktop, navigate through individual positions but limit to valid range
      const maxIndex = Math.max(0, businesses.length - 3)
      return prev <= 0 ? maxIndex : prev - 1
    })
  }

  const canNavigate = businesses.length > 3
  const maxDesktopIndex = Math.max(0, businesses.length - 3)
  const totalSlides = maxDesktopIndex + 1

  return (
    <section className={cn("px-6 py-2", className)}>
      <div className="max-w-7xl mx-auto">
        {/* Section Title */}
        <div className="text-center mb-10">
          <h2 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-white to-gray-200 bg-clip-text text-transparent mb-4">
            {title}
          </h2>
          <div className="w-32 h-1.5 bg-gradient-to-r from-emerald-400 via-teal-500 to-emerald-600 mx-auto rounded-full shadow-lg" />
          <p className="text-gray-300 mt-4 text-lg font-medium">Discover amazing deals happening right now in Austin</p>
        </div>

        {/* Carousel Container */}
        <div className="relative">
          {/* Navigation Buttons */}
          {canNavigate && (
            <>
              <button
                onClick={prevSlide}
                className={cn(
                  "absolute left-0 top-1/2 -translate-y-1/2 z-10",
                  "bg-white/90 hover:bg-white shadow-lg rounded-full",
                  "p-3 transition-all duration-200 hover:scale-110",
                  "border border-[#E8F3E8] hover:border-[#9DC7AC]",
                  "-ml-2 md:-ml-6"
                )}
                aria-label="Previous deals"
              >
                <ChevronLeft className="w-5 h-5 text-[#527C6B]" />
              </button>
              
              <button
                onClick={nextSlide}
                className={cn(
                  "absolute right-0 top-1/2 -translate-y-1/2 z-10",
                  "bg-white/90 hover:bg-white shadow-lg rounded-full",
                  "p-3 transition-all duration-200 hover:scale-110",
                  "border border-[#E8F3E8] hover:border-[#9DC7AC]",
                  "-mr-2 md:-mr-6"
                )}
                aria-label="Next deals"
              >
                <ChevronRight className="w-5 h-5 text-[#527C6B]" />
              </button>
            </>
          )}

          {/* Cards Container */}
          <div className="overflow-hidden">
            {/* Desktop/Tablet View - Show 3 cards */}
            <div className="hidden md:block">
              <div 
                className="flex gap-3 transition-transform duration-500 ease-out"
                style={{ 
                  transform: `translateX(-${currentIndex * (100 / 3)}%)`,
                  width: `${(businesses.length / 3) * 100}%`
                }}
              >
                {businesses.map((business) => (
                  <div 
                    key={business.id} 
                    className="flex-shrink-0"
                    style={{ width: `${100 / businesses.length}%` }}
                  >
                    <VenueCard business={business} />
                  </div>
                ))}
              </div>
            </div>

            {/* Mobile View - Show 1 card */}
            <div className="md:hidden">
              <div className="flex justify-center px-4">
                <VenueCard business={businesses[currentIndex]} />
              </div>
            </div>
          </div>

          {/* Dots Indicator */}
          {canNavigate && (
            <div className="flex justify-center mt-6 space-x-2">
              {/* Desktop: show dots for sets of 3 */}
              <div className="hidden md:flex space-x-2">
                {Array.from({ length: totalSlides }).map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex(index)
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      currentIndex === index
                        ? "bg-[#527C6B] scale-110"
                        : "bg-[#E8F3E8] hover:bg-[#9DC7AC]"
                    )}
                    aria-label={`Go to slide ${index + 1}`}
                  />
                ))}
              </div>
              
              {/* Mobile: show dots for individual cards */}
              <div className="md:hidden flex space-x-2">
                {businesses.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => {
                      setIsAutoPlaying(false)
                      setCurrentIndex(index)
                    }}
                    className={cn(
                      "w-3 h-3 rounded-full transition-all duration-200",
                      currentIndex === index
                        ? "bg-[#527C6B] scale-110"
                        : "bg-[#E8F3E8] hover:bg-[#9DC7AC]"
                    )}
                    aria-label={`Go to card ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  )
}

export default DealCarousel