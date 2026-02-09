import {
  CategoryResponse,
  UpdateCategoryRequest,
} from '@/interfaces/category-interfaces';
import { api } from './_base';

export async function getCategoriesOfCurrentUserApi() {
  return api<CategoryResponse[]>('/category', {
    method: 'GET',
  });
}

export async function updateCategoryApi(id: string, data: UpdateCategoryRequest) {
  return api<CategoryResponse>(`/category/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  });
}
