import { DocumentType, SignatureRole } from "@/constants/signature-contants";
import { UserResponse } from "./user-interfaces";
import { OrganizationResponse } from "./organization-interfaces";

export interface UpdateSignatureUrlRequest {
  url: string;
}

export interface SignatureResponse {
  id: string;
  url?: string | null;
  signatureRole: SignatureRole;
  documentId: string;
  documentType: DocumentType;
  isSigned: boolean;
  
  // Target user to sign
  targetUserId?: string | null;
  targetUser?: UserResponse | null;
  targetName?: string | null;
  
  // Actual signer information after signing
  signedByUserId?: string | null;
  signedByUser?: UserResponse | null;
  signedByName?: string | null;
  signedAt?: Date | null;
  
  // Organization relation
  organizationId?: string | null;
  organization?: OrganizationResponse | null;
  
  updatedAt: Date;
}
