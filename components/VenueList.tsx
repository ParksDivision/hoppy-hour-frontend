'use client'

import { useState, useEffect, useRef } from "react"
import { businessApi } from "@/api/services/businessApi"
import VenueCard, { type Business } from "./VenueCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2, AlertCircle, RefreshCw } from "lucide-react"
import { Button } from "@/components/ui/button"

export default function VenueList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState(0);
  const businessesPerPage = 12;

  // Filter states
  const [withPhotosOnly, setWithPhotosOnly] = useState(false);

  const loadMoreBusinesses = async (isInitial: boolean = false) => {
    if (loading || (!hasMore && !isInitial)) return;

    try {
      setLoading(true);
      setError(null);

      const pageToFetch = isInitial ? 1 : currentPage;

      console.log(`Fetching businesses - Page: ${pageToFetch}, Limit: ${businessesPerPage}`);

      const response = await businessApi.getBusinessesPaginated(
        pageToFetch,
        businessesPerPage,
        { withPhotosOnly }
      );

      console.log('API Response:', response);

      if (response.businesses && Array.isArray(response.businesses)) {
        if (isInitial) {
          setBusinesses(response.businesses);
          setCurrentPage(2); // Next page to fetch
        } else {
          setBusinesses(prev => [...prev, ...response.businesses]);
          setCurrentPage(prev => prev + 1);
        }

        setTotalCount(response.totalCount || response.count);
        setHasMore(response.hasMore || (response.businesses.length === businessesPerPage));

        console.log(`Loaded ${response.businesses.length} businesses. Total: ${businesses.length + response.businesses.length}`);
      } else {
        console.warn('Invalid response structure:', response);
        setHasMore(false);
        if (isInitial) {
          setError('No businesses found');
        }
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load venues';
      setError(errorMessage);
      console.error('Error loading venues:', err);
    } finally {
      setLoading(false);
      if (isInitial) {
        setInitialLoading(false);
      }
    }
  };

  // Initial load
  useEffect(() => {
    console.log('VenueList: Initial load triggered');
    loadMoreBusinesses(true);
  }, [withPhotosOnly]); // Reload when filter changes

  // Intersection Observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading && hasMore && !initialLoading) {
          console.log('Intersection detected - loading more businesses');
          loadMoreBusinesses(false);
        }
      },
      {
        threshold: 0.1,
        rootMargin: '100px' // Load before user reaches the bottom
      }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading, hasMore, initialLoading]);

  // Retry function
  const handleRetry = () => {
    setBusinesses([]);
    setCurrentPage(1);
    setError(null);
    setHasMore(true);
    loadMoreBusinesses(true);
  };

  // Filter toggle
  const togglePhotosFilter = () => {
    setWithPhotosOnly(!withPhotosOnly);
    setBusinesses([]);
    setCurrentPage(1);
    setHasMore(true);
  };

  // Loading state for initial load
  if (initialLoading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <Loader2 className="h-8 w-8 animate-spin text-[#9DC7AC]" />
        <p className="text-[#527C6B] text-lg">Loading venues...</p>
      </div>
    );
  }

  // Error state
  if (error && businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <AlertCircle className="h-12 w-12 text-red-500" />
        <p className="text-red-600 text-lg font-medium">Oops! Something went wrong</p>
        <p className="text-gray-600 text-center max-w-md">
          {error}
        </p>
        <Button
          onClick={handleRetry}
          className="bg-[#9DC7AC] hover:bg-[#527C6B] text-white"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Try Again
        </Button>
      </div>
    );
  }

  // No results state
  if (!businesses || businesses.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] space-y-4">
        <div className="text-6xl">🍺</div>
        <p className="text-[#527C6B] text-lg font-medium">No venues found</p>
        <p className="text-gray-600 text-center max-w-md">
          {withPhotosOnly ?
            "No venues with photos found. Try removing the photo filter." :
            "We couldn't find any venues. Please try again later."
          }
        </p>
        {withPhotosOnly && (
          <Button
            onClick={togglePhotosFilter}
            variant="outline"
            className="border-[#9DC7AC] text-[#2A5A45] hover:bg-[#E8F3E8]"
          >
            Show All Venues
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Filter Controls */}
      <div className="flex items-center justify-between px-4 py-2 bg-white rounded-lg shadow-sm border border-[#E8F3E8]">
        <div className="flex items-center space-x-4">
          <span className="text-sm font-medium text-[#2A5A45]">
            Showing {businesses.length} of {totalCount} venues
          </span>

          <label className="flex items-center space-x-2 cursor-pointer">
            <input
              type="checkbox"
              checked={withPhotosOnly}
              onChange={togglePhotosFilter}
              className="rounded border-[#9DC7AC] text-[#9DC7AC] focus:ring-[#9DC7AC]"
            />
            <span className="text-sm text-[#527C6B]">Photos only</span>
          </label>
        </div>

        {error && (
          <Button
            onClick={handleRetry}
            variant="outline"
            size="sm"
            className="border-red-300 text-red-600 hover:bg-red-50"
          >
            <RefreshCw className="h-3 w-3 mr-1" />
            Retry
          </Button>
        )}
      </div>

      {/* Business Grid */}
      <ScrollArea className="h-[calc(100vh-16rem)] w-full px-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
          {businesses.map((business) => (
            <div key={business.id} className="w-full">
              <VenueCard business={business} />
            </div>
          ))}
        </div>

        {/* Loading Indicator / End Message */}
        <div
          ref={observerTarget}
          className="w-full py-8 flex justify-center"
        >
          {loading && (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin text-[#9DC7AC]" />
              <span className="text-[#527C6B]">Loading more venues...</span>
            </div>
          )}

          {!hasMore && businesses.length > 0 && (
            <div className="text-center">
              <p className="text-[#527C6B] text-sm font-medium">
                🎉 You&apos;ve seen them all!
              </p>
              <p className="text-gray-500 text-xs mt-1">
                Total: {businesses.length} venues
              </p>
            </div>
          )}

          {error && businesses.length > 0 && (
            <div className="text-center">
              <p className="text-red-600 text-sm">Failed to load more venues</p>
              <Button
                onClick={() => loadMoreBusinesses(false)}
                variant="outline"
                size="sm"
                className="mt-2 border-red-300 text-red-600 hover:bg-red-50"
              >
                Try Again
              </Button>
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}