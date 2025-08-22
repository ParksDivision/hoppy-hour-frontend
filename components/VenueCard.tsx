import * as React from "react"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import Image from "next/image"
import { Star, Clock, MapPin } from "lucide-react"

type Photo = {
  id: string
  businessId: string
  sourceId: string
  source: string
  width?: number | null
  height?: number | null
  url?: string | null
  mainPhoto: boolean

  // S3 storage keys for different variants
  s3Key?: string | null
  s3KeyThumbnail?: string | null
  s3KeySmall?: string | null
  s3KeyMedium?: string | null
  s3KeyLarge?: string | null

  // CDN URLs (generated server-side)
  cdnUrls?: {
    original?: string | null
    thumbnail?: string | null
    small?: string | null
    medium?: string | null
    large?: string | null
  }

  // Fallback URL
  fallbackUrl?: string | null
}

type DealInfo = {
  id: string
  businessId: string
  dayOfWeek: number
  startTime: string
  endTime: string
  deals: string[]
}

export type Business = {
  id: string
  name: string
  latitude: number
  longitude: number
  address: string
  phoneNumber?: string | null
  priceLevel?: number | null
  isBar?: boolean | null
  isRestaurant?: boolean | null
  url?: string | null
  ratingOverall?: number | null
  ratingYelp?: number | null
  ratingGoogle?: number | null
  operatingHours?: string | null
  photos: Photo[]
  dealInfo: DealInfo[]
}

type Props = {
  business: Business
}

export default function VenueCard({ business }: Props) {
  // Get image URL using React 19 patterns - no state needed
  const getImageSrc = (): string => {
    if (!business?.photos || business.photos.length === 0) {
      return '/placeholder-image.jpg';
    }

    // Find main photo or use first available
    const main = business.photos.find((p) => p.mainPhoto) || business.photos[0];

    // Priority order for image URLs (CDN first, then fallbacks)
    let selectedUrl: string | null = null;

    // 1. Try CDN URLs (medium -> small -> thumbnail -> large -> original)
    if (main.cdnUrls) {
      const cdnOptions = [
        main.cdnUrls.medium,
        main.cdnUrls.small,
        main.cdnUrls.thumbnail,
        main.cdnUrls.large,
        main.cdnUrls.original
      ];

      selectedUrl = cdnOptions.find(url => url && url.trim() !== '') || null;
    }

    // 2. Fallback to external URL if CDN not available
    if (!selectedUrl && main.fallbackUrl) {
      selectedUrl = main.fallbackUrl;
    }

    // 3. Final fallback to direct S3 URL construction
    if (!selectedUrl && main.s3KeyMedium && process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_BASE_URL) {
      const cleanKey = main.s3KeyMedium.replace(/^\/+/, '');
      selectedUrl = `${process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_BASE_URL}/${cleanKey}`;
    }

    // 4. Last resort - use original URL
    if (!selectedUrl && main.url) {
      selectedUrl = main.url;
    }

    return selectedUrl || '/placeholder-image.jpg';
  };

  // Format price level - simple computation, no memoization needed
  const priceLevel = business.priceLevel ? '$'.repeat(business.priceLevel) : null;

  // Get today's deals - simple filter, no memoization needed
  const todayDeals = (() => {
    const today = new Date().getDay();
    if (business.dealInfo) {
      return business.dealInfo
        .filter(deal => deal.dayOfWeek === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return [];
  })();

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    if (!time) return '';
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${minutes ? `:${minutes}` : ''} ${ampm}`;
  };

  // Format deals for display
  const formatDeals = (deals: string[]) => {
    if (!deals || deals.length === 0) return null;
    if (deals.length === 1) return deals[0];
    return deals.join(' • ');
  };

  return (
    <div className="w-full max-w-sm mx-auto group cursor-pointer p-2">
      <Card className="w-full h-full overflow-hidden bg-slate-700 shadow-lg group-hover:shadow-2xl transition-all duration-300 ease-out group-hover:scale-105 transform-gpu origin-center rounded-3xl border border-slate-600">
      {/* Elegant gradient border */}
      <div className="absolute -inset-0.5 bg-gradient-to-br from-emerald-200 via-teal-200 to-emerald-300 rounded-3xl opacity-0 group-hover:opacity-100 blur-sm transition-opacity duration-300"></div>
      
      {/* Main content container */}
      <div className="relative bg-slate-700 rounded-3xl overflow-hidden">
        
        {/* Image section */}
        <CardContent className="p-0 relative">
          <div className="relative w-full aspect-[3/2] overflow-hidden">
            <Image
              src={getImageSrc()}
              alt={`${business.name} - Photo`}
              fill
              className="object-cover transition-transform duration-300 ease-out"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={90}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              priority={false}
            />
            
            {/* Elegant overlay */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent group-hover:from-black/40 transition-colors duration-300"></div>
            
            {/* Floating content overlay */}
            <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
              <div className="space-y-3">
                <CardTitle className="text-2xl font-bold text-white drop-shadow-xl leading-tight">
                  {business.name}
                </CardTitle>
                <div className="flex items-center flex-wrap gap-2">
                  {business.ratingOverall && (
                    <div className="flex items-center space-x-1.5 bg-white/95 backdrop-blur-sm px-3 py-2 rounded-full shadow-lg">
                      <Star className="w-4 h-4 fill-amber-500 text-amber-500" />
                      <span className="text-sm font-bold text-gray-900">
                        {business.ratingOverall.toFixed(1)}
                      </span>
                    </div>
                  )}
                  {priceLevel && (
                    <div className="bg-emerald-500 text-white text-sm font-bold px-3 py-2 rounded-full shadow-lg">
                      {priceLevel}
                    </div>
                  )}
                  {(business.isBar || business.isRestaurant) && (
                    <div className="text-gray-700 text-sm bg-white/90 backdrop-blur-sm px-3 py-2 rounded-full font-semibold shadow-lg">
                      {[
                        business.isBar && 'Bar',
                        business.isRestaurant && 'Restaurant'
                      ].filter(Boolean).join(' • ')}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </CardContent>

        {/* Footer content */}
        <CardFooter className="flex flex-col space-y-4 p-6 bg-gradient-to-b from-slate-700 to-slate-800/50">
          {todayDeals.length > 0 && todayDeals.map((deal) => (
            <div key={deal.id} className="w-full bg-gradient-to-r from-emerald-900/30 to-teal-900/30 rounded-2xl p-4 border border-emerald-700/50 shadow-sm hover:shadow-md hover:border-emerald-500/70 transition-all duration-300 group/deal">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm mb-2">
                <Clock className="w-4 h-4 text-emerald-400" />
                <span>
                  {formatTime(deal.startTime)} - {formatTime(deal.endTime)}
                </span>
              </div>
              <div className="text-gray-200 text-sm font-semibold leading-relaxed">
                {formatDeals(deal.deals)}
              </div>
            </div>
          ))}

          <div className="w-full flex items-start gap-3 text-gray-300 text-sm bg-slate-600/80 rounded-2xl p-4 border border-gray-500/50 hover:bg-slate-500/60 transition-all duration-300">
            <MapPin className="w-4 h-4 flex-shrink-0 text-gray-400 mt-0.5" />
            <span className="leading-relaxed">{business.address}</span>
          </div>
        </CardFooter>
        
        {/* Elegant bottom accent */}
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-transparent via-emerald-400/50 to-transparent rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
      </div>
      </Card>
    </div>
  );
}