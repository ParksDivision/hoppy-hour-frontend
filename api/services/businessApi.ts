// api/services/businessApi.ts
import { apiClient } from '../client';
import type { Business } from '@/components/VenueCard';

export const businessApi = {
  // Get all businesses with optional pagination
  getBusinesses: async (page?: number, limit?: number) => {
    const response = await apiClient.get<Business[]>('/business', {
      params: { page, limit }
    });
    return response.data;
  },

  // Get a single business by ID
  getBusinessById: async (id: string) => {
    const response = await apiClient.get<Business>(`/business/${id}`);
    return response.data;
  },

  // Get businesses by location (for future use)
  getBusinessesByLocation: async (lat: number, lng: number, radius?: number) => {
    const response = await apiClient.get<Business[]>('/business', {
      params: { lat, lng, radius }
    });
    return response.data;
  },
};