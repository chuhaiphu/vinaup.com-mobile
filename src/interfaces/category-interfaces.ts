import { UserResponse } from "./user-interfaces";

export interface CategoryResponse {
  id: string;
  description: string;
  createdBy: UserResponse;
  isDefault: boolean;
}

export interface UpdateCategoryRequest {
  description: string;
  isDefault?: boolean;
}
