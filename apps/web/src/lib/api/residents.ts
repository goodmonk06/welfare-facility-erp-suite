import { apiClient } from '../api-client';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
}

export enum ResidentStatus {
  ACTIVE = 'active',
  DISCHARGED = 'discharged',
  DECEASED = 'deceased',
}

export interface Resident {
  id: string;
  facilityId: string;
  lastName: string;
  firstName: string;
  lastNameKana?: string;
  firstNameKana?: string;
  dateOfBirth: string;
  gender: Gender;
  careLevel?: number;
  admissionDate?: string;
  dischargeDate?: string;
  status: ResidentStatus;
  hasMedicalNeeds: boolean;
  hasAllergies: boolean;
  emergencyContact?: string;
  emergencyPhone?: string;
  createdAt: string;
  updatedAt: string;
  facility?: {
    id: string;
    name: string;
    code: string;
  };
}

export interface CreateResidentDto {
  facilityId: string;
  lastName: string;
  firstName: string;
  lastNameKana?: string;
  firstNameKana?: string;
  dateOfBirth: string;
  gender: Gender;
  careLevel?: number;
  admissionDate?: string;
  hasMedicalNeeds?: boolean;
  hasAllergies?: boolean;
  emergencyContact?: string;
  emergencyPhone?: string;
}

export const residentsApi = {
  list: (facilityId: string) =>
    apiClient.get<Resident[]>(`/residents?facilityId=${facilityId}`),
  get: (id: string) => apiClient.get<Resident>(`/residents/${id}`),
  create: (data: CreateResidentDto) => apiClient.post<Resident>('/residents', data),
  update: (id: string, data: Partial<CreateResidentDto>) =>
    apiClient.put<Resident>(`/residents/${id}`, data),
  delete: (id: string) => apiClient.delete(`/residents/${id}`),
  stats: (facilityId: string) =>
    apiClient.get<any>(`/residents/stats?facilityId=${facilityId}`),
};
