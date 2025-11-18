import { apiClient } from '../api-client';

export interface Facility {
  id: string;
  name: string;
  code: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  licenseNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateFacilityDto {
  name: string;
  code: string;
  type: string;
  address?: string;
  phone?: string;
  email?: string;
  capacity?: number;
  licenseNumber?: string;
}

export const facilitiesApi = {
  list: () => apiClient.get<Facility[]>('/facilities'),
  get: (id: string) => apiClient.get<Facility>(`/facilities/${id}`),
  create: (data: CreateFacilityDto) => apiClient.post<Facility>('/facilities', data),
  update: (id: string, data: Partial<CreateFacilityDto>) =>
    apiClient.put<Facility>(`/facilities/${id}`, data),
  delete: (id: string) => apiClient.delete(`/facilities/${id}`),
};
