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

  // CDN URLs (generated client-side for better performance)
  cdnUrls?: {
    original?: string
    thumbnail?: string
    small?: string
    medium?: string
    large?: string
  }
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

// CDN URL generation function
const generateCDNUrl = (s3Key: string | null | undefined): string | null => {
  if (!s3Key) return null;

  const cdnBaseUrl = process.env.NEXT_PUBLIC_CLOUDFLARE_CDN_BASE_URL;
  if (!cdnBaseUrl) {
    console.warn('NEXT_PUBLIC_CLOUDFLARE_CDN_BASE_URL not configured');
    return null;
  }

  // Remove any leading slashes from s3Key and construct CDN URL
  const cleanKey = s3Key.replace(/^\/+/, '');
  return `${cdnBaseUrl}/${cleanKey}`;
};

// Fallback to API URL generation (only used when CDN fails)
const generateAPIUrl = async (s3Key: string): Promise<string | null> => {
  try {
    const response = await fetch(`/api/images/${encodeURIComponent(s3Key)}/url`);
    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.status}`);
    }
    const data = await response.json();
    return data.url;
  } catch (error) {
    console.error('Error fetching signed URL:', error);
    return null;
  }
};

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

      // Try to get CDN URL for medium variant first, then fallback to other variants
      const variants = ['s3KeyMedium', 's3KeySmall', 's3KeyLarge', 's3Key'] as const;
      let url: string | null = null;

      for (const variant of variants) {
        const s3Key = main[variant];
        if (s3Key) {
          url = generateCDNUrl(s3Key);
          if (url) {
            break;
          }
        }
      }

      // If CDN URL generation failed, try API fallback (only for the first variant)
      if (!url && main.s3KeyMedium) {
        console.warn('CDN URL generation failed, falling back to API');
        url = await generateAPIUrl(main.s3KeyMedium);
      }

      // Final fallback to external URL if it exists
      if (!url && main.url) {
        url = main.url;
      }

      setImageUrl(url);
      setIsImageLoading(false);
    };

    loadMainPhoto();
  }, [business?.id, business?.photos]);

  // Handle image load error
  const handleImageError = () => {
    setImageError(true);
    // Try fallback to API URL if CDN fails
    if (mainPhoto?.s3KeyMedium) {
      generateAPIUrl(mainPhoto.s3KeyMedium).then(fallbackUrl => {
        if (fallbackUrl && fallbackUrl !== imageUrl) {
          setImageUrl(fallbackUrl);
          setImageError(false);
        }
      });
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
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const hour12 = hour % 12 || 12;
    return `${hour12}${minutes ? `:${minutes}` : ''} ${ampm}`;
  };

  // Format deals for display
  const formatDeals = (deals: string[]) => {
    if (deals.length === 0) return null;
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
              alt={business.name}
              fill
              className="object-cover"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              quality={75}
              onError={handleImageError}
              placeholder="blur"
              blurDataURL="data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAABAAEDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAUEAEAAAAAAAAAAAAAAAAAAAAA/8QAFQEBAQAAAAAAAAAAAAAAAAAAAAX/xAAUEQEAAAAAAAAAAAAAAAAAAAAA/9oADAMBAAIRAxEAPwCdABmX/9k="
            />
          )}
          {isImageLoading && (
            <div className="absolute inset-0 bg-gray-200 animate-pulse flex items-center justify-center">
              <div className="text-gray-400 text-sm">Loading...</div>
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
          <span>{business.address}</span>
        </div>
      </CardFooter>
    </Card>
  );
}