'use client'

import React, { useEffect, useState } from 'react'
import { cn } from "@/lib/utils"
import { Business } from '@/components/VenueCard'
import Image from 'next/image'
import { Star, Clock, MapPin, Trophy } from 'lucide-react'

interface FeatureCardProps {
  business: Business
  variant?: 'large' | 'medium'
  className?: string
}

const FeatureCard: React.FC<FeatureCardProps> = ({ 
  business, 
  variant = 'large',
  className 
}) => {
  const [imageUrl, setImageUrl] = useState<string | null>(null)
  const [imageError, setImageError] = useState<boolean>(false)

  useEffect(() => {
    if (!business?.photos || business.photos.length === 0) return

    const mainPhoto = business.photos.find((p) => p.mainPhoto) || business.photos[0]
    
    // Priority for feature cards: larger images preferred
    let selectedUrl: string | null = null

    if (mainPhoto.cdnUrls) {
      const cdnOptions = [
        mainPhoto.cdnUrls.large,
        mainPhoto.cdnUrls.original,
        mainPhoto.cdnUrls.medium,
        mainPhoto.cdnUrls.small
      ]
      selectedUrl = cdnOptions.find(url => url && url.trim() !== '') || null
    }

    if (!selectedUrl && mainPhoto.fallbackUrl) {
      selectedUrl = mainPhoto.fallbackUrl
    }

    if (!selectedUrl && mainPhoto.url) {
      selectedUrl = mainPhoto.url
    }

    setImageUrl(selectedUrl)
  }, [business?.id, business?.photos])

  const handleImageError = () => {
    setImageError(true)
  }

  const getImageSrc = (): string => {
    if (imageError || !imageUrl) {
      return '/placeholder-image.jpg'
    }
    return imageUrl
  }

  // Get today's deals
  const todayDeals = React.useMemo(() => {
    const today = new Date().getDay()
    if (business.dealInfo) {
      return business.dealInfo
        .filter(deal => deal.dayOfWeek === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
        .slice(0, 3) // Limit to top 3 deals
    }
    return []
  }, [business.dealInfo])

  const formatTime = (time: string) => {
    if (!time) return ''
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}${minutes ? `:${minutes}` : ''} ${ampm}`
  }

  const isLarge = variant === 'large'

  return (
    <div
      className={cn(
        "group relative overflow-hidden rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 ease-out",
        "bg-white border-0 ring-1 ring-gray-200 hover:ring-2 hover:ring-emerald-300",
        isLarge ? "aspect-[2/1] max-w-5xl" : "aspect-[4/3] max-w-md",
        "cursor-pointer transform hover:scale-[1.03] hover:-translate-y-2",
        className
      )}
    >
      {/* Background Image */}
      <div className="absolute inset-0">
        <Image
          src={getImageSrc()}
          alt={`${business.name} - Featured`}
          fill
          className="object-cover transition-transform duration-300 group-hover:scale-105"
          sizes={isLarge ? "100vw" : "50vw"}
          onError={handleImageError}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
      </div>

      {/* Rating Badge */}
      {business.ratingOverall && (
        <div className="absolute top-4 right-4 z-10">
          <div className="bg-[#527C6B] text-white px-3 py-1.5 rounded-full flex items-center gap-1 shadow-lg">
            <Trophy className="w-4 h-4" />
            <span className="text-sm font-bold">
              {business.ratingOverall.toFixed(1)}
            </span>
            <Star className="w-4 h-4 fill-current" />
          </div>
        </div>
      )}

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8 text-white z-10">
        {/* Business Name and Details */}
        <div className="space-y-3">
          <h3 className={cn(
            "font-bold text-white drop-shadow-lg",
            isLarge ? "text-2xl md:text-3xl" : "text-xl md:text-2xl"
          )}>
            {business.name}
          </h3>

          {/* Business Info */}
          <div className="flex flex-wrap items-center gap-4 text-sm md:text-base opacity-90">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4" />
              <span className="line-clamp-1">{business.address}</span>
            </div>
            
            {business.priceLevel && (
              <div className="text-[#9DC7AC] font-medium">
                {'$'.repeat(business.priceLevel)}
              </div>
            )}

            {(business.isBar || business.isRestaurant) && (
              <div>
                {[
                  business.isBar && 'Bar',
                  business.isRestaurant && 'Restaurant'
                ].filter(Boolean).join(' • ')}
              </div>
            )}
          </div>

          {/* Today's Deals */}
          {todayDeals.length > 0 && (
            <div className="space-y-2">
              <h4 className="font-semibold text-[#9DC7AC] flex items-center gap-2">
                <Clock className="w-4 h-4" />
Today&apos;s Deals
              </h4>
              <div className="space-y-1">
                {todayDeals.map((deal) => (
                  <div key={deal.id} className="text-sm opacity-95">
                    <span className="font-medium">
                      {formatTime(deal.startTime)} - {formatTime(deal.endTime)}:
                    </span>
                    <span className="ml-2">{deal.deals.join(' • ')}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Overlay */}
      <div className="absolute inset-0 bg-[#527C6B]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
    </div>
  )
}

export default FeatureCard