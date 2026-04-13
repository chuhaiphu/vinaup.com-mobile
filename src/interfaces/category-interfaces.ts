import { UserResponse } from "./user-interfaces";

export interface CategoryResponse {
  id: string;
  description: string;
  createdBy: UserResponse | null;
  isDefault: boolean;
}

export interface UpdateCategoryRequest {
  description: string;
  isDefault?: boolean;
}
