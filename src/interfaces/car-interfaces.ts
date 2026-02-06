import { OrganizationResponse } from './organization-interfaces';
import { OrganizationMemberResponse } from './organization-member-interfaces';
import { UserResponse } from './user-interfaces';
import { CarAssignmentStatus, CarStatus } from '@/constants/car-constants';

// Car Response
export interface CarResponse {
  id: string;
  name: string | null;
  plateNumber: string | null;
  manufacturer: string | null;
  model: string | null;
  seatCount: number | null;
  status: CarStatus;
  description: string | null;
  featureImageUrl: string | null;
  videoUrl: string | null;
  videoThumbnailUrl: string | null;
  additionalImageUrls: string[];
  createdAt: Date;
  updatedAt: Date;
  createdBy: UserResponse;
  organization: OrganizationResponse;
  carAssignments?: CarAssignmentResponse[];
}

// Car Assignment Response
export interface CarAssignmentResponse {
  id: string;
  carId: string;
  car: CarResponse;
  organizationMemberId: string;
  organizationMember: OrganizationMemberResponse;
  startTime: Date;
  endTime: Date | null;
  status: CarAssignmentStatus;
  note: string | null;
  createdAt: Date;
  updatedAt: Date;
}

// Car Request
export interface CreateCarRequest {
  name?: string;
  plateNumber?: string;
  manufacturer?: string;
  model?: string;
  seatCount?: number;
  status?: CarStatus;
  description?: string;
  featureImageUrl?: string | null;
  videoUrl?: string | null;
  videoThumbnailUrl?: string | null;
  additionalImageUrls?: string[];
  organizationId: string;
}

export type UpdateCarRequest = Partial<Omit<CreateCarRequest, 'organizationId'>>;

// Car Assignment Request
export interface CreateCarAssignmentRequest {
  carId: string;
  organizationMemberId: string;
  startTime?: Date;
  endTime?: Date;
  note?: string;
}

export type UpdateCarAssignmentRequest = Partial<Omit<CreateCarAssignmentRequest, 'carId' | 'organizationMemberId'>> & {
  status?: CarAssignmentStatus;
};
