import { ImageStatus } from "@prisma/client";

export interface AdminStats {
  totalUsers: number;
  totalGroups: number;
  totalImages: number;
  totalLabelers: number;
  unlabeledImages: number;
  labeledImages: number;
  reviewedImages: number;
}

// Clean DTOs for User
export interface UserDTO {
  id: string;
  name: string;
  email: string;
}

// Clean DTOs for Image (minimal version for lists)
export interface ImageSummaryDTO {
  id: string;
  status: ImageStatus;
}

// Full Image DTO
export interface ImageDTO {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  status: ImageStatus;
  groupId: string;
  uploadedAt: Date;
  uploadedBy: string;
}

// Group Member DTO (flattened from join table)
export interface GroupMemberDTO {
  id: string;
  name: string;
  email: string;
  joinedAt: Date;
}

// Group DTO for list view (with counts and summaries)
export interface GroupListItemDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  memberCount: number;
  imageCount: number;
  members: GroupMemberDTO[];
  images: ImageSummaryDTO[];
}

// Group DTO for detail view (with full data)
export interface GroupDetailDTO {
  id: string;
  name: string;
  description: string | null;
  createdAt: Date;
  members: GroupMemberDTO[];
  images: ImageDTO[];
}
