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
import { useEffect, useState } from "react"

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
  const [mainPhoto, setMainPhoto] = useState<Photo | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);
  const [imageError, setImageError] = useState<boolean>(false);

  useEffect(() => {
    const loadMainPhoto = async () => {
      if (!business?.photos || business.photos.length === 0) {
        setIsImageLoading(false);
        return;
      }

      // Find main photo or use first available
      const main = business.photos.find((p) => p.mainPhoto) || business.photos[0];
      setMainPhoto(main);

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

      setImageUrl(selectedUrl);
      setIsImageLoading(false);
    };

    loadMainPhoto();
  }, [business?.id, business?.photos]);

  // Handle image load error - try fallback options
  const handleImageError = () => {
    if (!mainPhoto) {
      setImageError(true);
      return;
    }

    // Try fallback URLs in order
    const fallbackOptions = [
      mainPhoto.fallbackUrl,
      mainPhoto.url,
      mainPhoto.cdnUrls?.small,
      mainPhoto.cdnUrls?.thumbnail
    ].filter(Boolean);

    const currentIndex = fallbackOptions.findIndex(url => url === imageUrl);
    const nextUrl = fallbackOptions[currentIndex + 1];

    if (nextUrl) {
      setImageUrl(nextUrl);
      setImageError(false);
    } else {
      setImageError(true);
    }
  };

  // Get image source with comprehensive fallback logic
  const getImageSrc = (): string => {
    if (imageError || !imageUrl) {
      return '/placeholder-image.jpg';
    }
    return imageUrl;
  };

  // Format price level
  const priceLevel = React.useMemo(() => {
    return business.priceLevel ? '$'.repeat(business.priceLevel) : null;
  }, [business.priceLevel]);

  // Get today's deals
  const todayDeals = React.useMemo(() => {
    const today = new Date().getDay();
    if (business.dealInfo) {
      return business.dealInfo
        .filter(deal => deal.dayOfWeek === today)
        .sort((a, b) => a.startTime.localeCompare(b.startTime));
    }
    return [];
  }, [business.dealInfo]);

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
        <div className="relative w-full aspect-video bg-gray-100">
          {!isImageLoading && (
            <Image
              src={getImageSrc()}
              alt={`${business.name} - Photo`}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={75}
              onError={handleImageError}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
              priority={false}
            />
          )}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
            </div>
          )}
          {imageError && (
            <div className="absolute inset-0 bg-gray-100 flex items-center justify-center">
              <div className="text-gray-400 text-sm">No image available</div>
            </div>
          )}
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
          <span className="line-clamp-2">{business.address}</span>
        </div>
      </CardFooter>
    </Card>
  );
}