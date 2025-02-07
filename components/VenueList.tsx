'use client'

import { useState, useEffect, useRef } from "react"
import { businessApi } from "@/api/services/businessApi"
import VenueCard, { type Business } from "./VenueCard"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Loader2 } from "lucide-react"

export default function VenueList() {
  const [businesses, setBusinesses] = useState<Business[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const businessesPerPage = 12;

  const loadMoreBusinesses = async () => {
    if (loading || !hasMore) return;

    try {
      setLoading(true);
      const data = await businessApi.getBusinesses(currentPage, businessesPerPage);

      if (Array.isArray(data) && data.length > 0) {
        setBusinesses(prev => [...prev, ...data]);
        setCurrentPage(prev => prev + 1);
        setHasMore(data.length === businessesPerPage);
      } else {
        setHasMore(false);
      }
    } catch (err) {
      setError('Failed to load venues');
      console.error('Error loading venues:', err);
    } finally {
      setLoading(false);
    }
  };

  // Intersection Observer for infinite scroll
  const observerTarget = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !loading) {
          loadMoreBusinesses();
        }
      },
      { threshold: 0.1 }
    );

    if (observerTarget.current) {
      observer.observe(observerTarget.current);
    }

    return () => observer.disconnect();
  }, [loading]);

  if (error) {
    return (
      <div className="w-full text-center py-4 text-red-500">
        {error}
        <button
          onClick={() => {
            setError(null);
            loadMoreBusinesses();
          }}
          className="ml-2 text-blue-500 hover:text-blue-600"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <ScrollArea className="h-[calc(100vh-12rem)] w-full px-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 py-4">
        {businesses.map((business) => (
          <div key={business.id} className="w-full">
            <VenueCard business={business} />
          </div>
        ))}
      </div>

      <div
        ref={observerTarget}
        className="w-full py-8 flex justify-center"
      >
        {loading && (
          <Loader2 className="h-6 w-6 animate-spin text-gray-500" />
        )}
        {!hasMore && businesses.length > 0 && (
          <p className="text-gray-500 text-sm">No more venues to load</p>
        )}
      </div>
    </ScrollArea>
  );
}