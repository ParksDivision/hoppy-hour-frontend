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
  // Get main photo or first available photo
  const displayPhoto = React.useMemo(() => {
    const mainPhoto = business.photos ? business.photos.find(p => p.mainPhoto) : null
    return mainPhoto?.url || '/placeholder-image.jpg'
  }, [business.photos])

  // Format price level
  const priceLevel = React.useMemo(() => {
    return business.priceLevel ? '$'.repeat(business.priceLevel) : null
  }, [business.priceLevel])

  // Get today's deals
  const todayDeals = React.useMemo(() => {
    const today = new Date().getDay()
    if (business.dealInfo) {
      return business.dealInfo
        .filter(deal => deal.dayOfWeek === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime))
    } else {
      return []
    }
  }, [business.dealInfo])

  // Format time to 12-hour format
  const formatTime = (time: string) => {
    const [hours, minutes] = time.split(':')
    const hour = parseInt(hours)
    const ampm = hour >= 12 ? 'PM' : 'AM'
    const hour12 = hour % 12 || 12
    return `${hour12}${minutes ? `:${minutes}` : ''} ${ampm}`
  }

  // Format deals for display
  const formatDeals = (deals: string[]) => {
    if (deals.length === 0) return null
    if (deals.length === 1) return deals[0]
    return deals.join(' • ')
  }

  return (
    <Card className="w-full max-w-sm mx-auto hover:shadow-lg transition-shadow duration-200 border-[#E8F3E8] hover:border-[#9DC7AC] bg-white">
      <CardHeader className="space-y-2 p-4">
        <div className="flex justify-between items-start">
          <div className="space-y-1 flex-1">
            <CardTitle className="text-lg font-bold line-clamp-2 text-[#1B365D]">
              {business.name}
            </CardTitle>
            <div className="flex items-center flex-wrap gap-2">
              {business.ratingOverall && (
                <div className="flex items-center space-x-1">
                  <Star className="w-4 h-4 fill-[#9DC7AC] text-[#9DC7AC]" />
                  <span className="text-sm font-medium text-[#2A5A45]">
                    {business.ratingOverall.toFixed(1)}
                  </span>
                </div>
              )}
              {priceLevel && (
                <div className="text-[#527C6B] text-sm font-medium">
                  {priceLevel}
                </div>
              )}
              {(business.isBar || business.isRestaurant) && (
                <div className="text-[#527C6B] text-sm">
                  {[
                    business.isBar && 'Bar',
                    business.isRestaurant && 'Restaurant'
                  ].filter(Boolean).join(' • ')}
                </div>
              )}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="relative w-full aspect-video">
          <Image
            src={displayPhoto}
            alt={business.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      </CardContent>

      <CardFooter className="flex flex-col space-y-3 p-4 bg-[#E8F3E8]/30">
        {todayDeals.length > 0 && todayDeals.map((deal) => (
          <div key={deal.id} className="w-full">
            <div className="flex items-center gap-1 text-[#1B365D] font-medium text-sm">
              <Clock className="w-4 h-4" />
              <span>
                {formatTime(deal.startTime)} - {formatTime(deal.endTime)}
              </span>
            </div>
            <div className="text-[#2A5A45] text-sm mt-1">
              {formatDeals(deal.deals)}
            </div>
          </div>
        ))}

        <div className="w-full flex items-center gap-1 text-[#527C6B] text-sm">
          <MapPin className="w-4 h-4 flex-shrink-0" />
          <span>{business.address}</span>
        </div>
      </CardFooter>
    </Card>
  )
}