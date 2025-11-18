import { apiClient } from '../api-client';

// Types matching backend DTOs
export enum StaffPosition {
  FACILITY_MANAGER = 'facility_manager',
  CARE_MANAGER = 'care_manager',
  ADMINISTRATOR = 'administrator',
  NURSE = 'nurse',
  CARE_WORKER = 'care_worker',
  PHYSICAL_THERAPIST = 'physical_therapist',
  OCCUPATIONAL_THERAPIST = 'occupational_therapist',
  NUTRITIONIST = 'nutritionist',
  SOCIAL_WORKER = 'social_worker',
  DRIVER = 'driver',
  KITCHEN_STAFF = 'kitchen_staff',
  CLEANING_STAFF = 'cleaning_staff',
  ADMINISTRATIVE_STAFF = 'administrative_staff',
  OTHER = 'other',
}

export enum EmploymentType {
  FULL_TIME = 'full_time',
  PART_TIME = 'part_time',
  CONTRACT = 'contract',
  TEMPORARY = 'temporary',
  INTERN = 'intern',
}

export enum StaffStatus {
  ACTIVE = 'active',
  ON_LEAVE = 'on_leave',
  RESIGNED = 'resigned',
}

export interface StaffMember {
  id: string;
  facilityId: string;
  employeeNumber: string;
  lastName: string;
  firstName: string;
  lastNameKana?: string;
  firstNameKana?: string;
  email?: string;
  phone?: string;
  position: StaffPosition;
  employmentType: EmploymentType;
  hireDate: string;
  resignationDate?: string;
  status: StaffStatus;
  qualifications?: string[];
  createdAt: string;
  updatedAt: string;
  facility?: {
    id: string;
    name: string;
    code: string;
  };
  certifications?: Array<{
    id: string;
    name: string;
    expiryDate?: string;
    status: string;
  }>;
}

export interface CreateStaffDto {
  facilityId: string;
  employeeNumber: string;
  lastName: string;
  firstName: string;
  lastNameKana?: string;
  firstNameKana?: string;
  email?: string;
  phone?: string;
  position: StaffPosition;
  employmentType: EmploymentType;
  hireDate: Date | string;
  resignationDate?: Date | string;
  status?: StaffStatus;
  qualifications?: string[];
}

export interface UpdateStaffDto extends Partial<CreateStaffDto> {}

export interface StaffStatistics {
  total: number;
  active: number;
  onLeave: number;
  resigned: number;
  byPosition: Record<string, number>;
  byEmploymentType: Record<string, number>;
}

// API functions
export const staffApi = {
  list: async (facilityId: string): Promise<StaffMember[]> => {
    return apiClient.get<StaffMember[]>(`/staff?facilityId=${facilityId}`);
  },

  getById: async (id: string): Promise<StaffMember> => {
    return apiClient.get<StaffMember>(`/staff/${id}`);
  },

  create: async (data: CreateStaffDto): Promise<StaffMember> => {
    return apiClient.post<StaffMember>('/staff', data);
  },

  update: async (id: string, data: UpdateStaffDto): Promise<StaffMember> => {
    return apiClient.put<StaffMember>(`/staff/${id}`, data);
  },

  delete: async (id: string): Promise<void> => {
    return apiClient.delete(`/staff/${id}`);
  },

  getStatistics: async (facilityId: string): Promise<StaffStatistics> => {
    return apiClient.get<StaffStatistics>(`/staff/statistics?facilityId=${facilityId}`);
  },

  getOnDuty: async (facilityId: string, date: string): Promise<StaffMember[]> => {
    return apiClient.get<StaffMember[]>(`/staff/on-duty?facilityId=${facilityId}&date=${date}`);
  },
};

// Helper functions
export const getStaffDisplayName = (staff: StaffMember): string => {
  return `${staff.lastName} ${staff.firstName}`;
};

export const getPositionLabel = (position: StaffPosition): string => {
  const labels: Record<StaffPosition, string> = {
    [StaffPosition.FACILITY_MANAGER]: '施設長',
    [StaffPosition.CARE_MANAGER]: 'ケアマネージャー',
    [StaffPosition.ADMINISTRATOR]: '管理者',
    [StaffPosition.NURSE]: '看護師',
    [StaffPosition.CARE_WORKER]: '介護職員',
    [StaffPosition.PHYSICAL_THERAPIST]: '理学療法士',
    [StaffPosition.OCCUPATIONAL_THERAPIST]: '作業療法士',
    [StaffPosition.NUTRITIONIST]: '管理栄養士',
    [StaffPosition.SOCIAL_WORKER]: '生活相談員',
    [StaffPosition.DRIVER]: '運転手',
    [StaffPosition.KITCHEN_STAFF]: '調理員',
    [StaffPosition.CLEANING_STAFF]: '清掃員',
    [StaffPosition.ADMINISTRATIVE_STAFF]: '事務職員',
    [StaffPosition.OTHER]: 'その他',
  };
  return labels[position] || position;
};

export const getEmploymentTypeLabel = (type: EmploymentType): string => {
  const labels: Record<EmploymentType, string> = {
    [EmploymentType.FULL_TIME]: '正社員',
    [EmploymentType.PART_TIME]: 'パートタイム',
    [EmploymentType.CONTRACT]: '契約社員',
    [EmploymentType.TEMPORARY]: '派遣',
    [EmploymentType.INTERN]: '研修生',
  };
  return labels[type] || type;
};

export const getStatusLabel = (status: StaffStatus): string => {
  const labels: Record<StaffStatus, string> = {
    [StaffStatus.ACTIVE]: '在職',
    [StaffStatus.ON_LEAVE]: '休職中',
    [StaffStatus.RESIGNED]: '退職',
  };
  return labels[status] || status;
};

export const getStatusBadgeClass = (status: StaffStatus): string => {
  const classes: Record<StaffStatus, string> = {
    [StaffStatus.ACTIVE]: 'bg-green-100 text-green-800',
    [StaffStatus.ON_LEAVE]: 'bg-yellow-100 text-yellow-800',
    [StaffStatus.RESIGNED]: 'bg-gray-100 text-gray-800',
  };
  return classes[status] || 'bg-gray-100 text-gray-800';
};
