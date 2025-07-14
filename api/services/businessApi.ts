import { apiClient } from '../client';
import type { Business } from '@/components/VenueCard';

// API Response Types
interface BusinessResponse {
  businesses: Business[];
  count: number;
  totalCount?: number;
  page?: number;
  totalPages?: number;
  hasMore?: boolean;
  filters?: {
    withPhotosOnly: boolean;
    limit: number;
    offset: number;
  };
}

interface SearchResponse {
  results: Business[];
  count: number;
  searchCriteria: {
    latitude: number;
    longitude: number;
    radiusKm: number;
    withDealsOnly?: boolean;
  };
}

export const businessApi = {
  // Get all businesses with pagination and filtering
  getBusinesses: async (
    page: number = 1, 
    limit: number = 50,
    options?: {
      withPhotosOnly?: boolean;
      withDealsOnly?: boolean;
    }
  ): Promise<Business[]> => {
    try {
      const params: any = { 
        page, 
        limit,
        withPhotosOnly: options?.withPhotosOnly || false
      };

      const response = await apiClient.get<BusinessResponse>('/business', { params });
      return response.data.businesses || [];
    } catch (error) {
      console.error('Error fetching businesses:', error);
      // Return empty array on error to prevent frontend crashes
      return [];
    }
  },

  // Get paginated businesses with full response metadata
  getBusinessesPaginated: async (
    page: number = 1, 
    limit: number = 50,
    options?: {
      withPhotosOnly?: boolean;
      withDealsOnly?: boolean;
    }
  ): Promise<BusinessResponse> => {
    try {
      const params: any = { 
        page, 
        limit,
        withPhotosOnly: options?.withPhotosOnly || false
      };

      const response = await apiClient.get<BusinessResponse>('/business', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching businesses (paginated):', error);
      return {
        businesses: [],
        count: 0,
        totalCount: 0,
        page: 1,
        totalPages: 0,
        hasMore: false
      };
    }
  },

  // Get a single business by ID
  getBusinessById: async (id: string): Promise<Business | null> => {
    try {
      const response = await apiClient.get<Business>(`/business/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching business ${id}:`, error);
      return null;
    }
  },

  // Get businesses with active deals
  getBusinessesWithDeals: async (limit: number = 50, offset: number = 0): Promise<Business[]> => {
    try {
      const response = await apiClient.get<BusinessResponse>('/business/with-deals', {
        params: { limit, offset }
      });
      return response.data.businesses || [];
    } catch (error) {
      console.error('Error fetching businesses with deals:', error);
      return [];
    }
  },

  // Search businesses by location
  searchByLocation: async (
    lat: number,
    lng: number,
    radius: number = 1,
    options?: {
      withDealsOnly?: boolean;
      limit?: number;
    }
  ): Promise<Business[]> => {
    try {
      const params: any = {
        lat,
        lng,
        radius,
        withDealsOnly: options?.withDealsOnly || false,
        limit: options?.limit || 50
      };

      const response = await apiClient.get<SearchResponse>('/business/search/location', { params });
      return response.data.results || [];
    } catch (error) {
      console.error('Error searching businesses by location:', error);
      return [];
    }
  },

  // Search businesses by category
  searchByCategory: async (
    category: string,
    options?: {
      isBar?: boolean;
      isRestaurant?: boolean;
      withDealsOnly?: boolean;
    }
  ): Promise<Business[]> => {
    try {
      const params: any = {
        isBar: options?.isBar,
        isRestaurant: options?.isRestaurant,
        withDealsOnly: options?.withDealsOnly || false
      };

      const response = await apiClient.get<{ results: Business[] }>(`/business/search/category/${category}`, { params });
      return response.data.results || [];
    } catch (error) {
      console.error(`Error searching businesses by category ${category}:`, error);
      return [];
    }
  },

  // Get business photos
  getBusinessPhotos: async (businessId: string) => {
    try {
      const response = await apiClient.get(`/business/${businessId}/photos`);
      return response.data;
    } catch (error) {
      console.error(`Error fetching photos for business ${businessId}:`, error);
      return [];
    }
  },

  // Get business statistics
  getBusinessStats: async () => {
    try {
      const response = await apiClient.get('/business/admin/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching business stats:', error);
      return null;
    }
  },

  // Get deal statistics
  getDealStats: async () => {
    try {
      const response = await apiClient.get('/business/stats/deals');
      return response.data;
    } catch (error) {
      console.error('Error fetching deal stats:', error);
      return null;
    }
  },

  // Health check
  healthCheck: async () => {
    try {
      const response = await apiClient.get('/health');
      return response.data;
    } catch (error) {
      console.error('Health check failed:', error);
      return null;
    }
  },

  // Get S3 cost report (admin)
  getCostReport: async () => {
    try {
      const response = await apiClient.get('/s3/cost-report');
      return response.data;
    } catch (error) {
      console.error('Error fetching cost report:', error);
      return null;
    }
  }
};