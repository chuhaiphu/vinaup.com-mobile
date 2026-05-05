import {
    CategoryResponse,
    UpdateCategoryRequest,
} from '@/interfaces/category-interfaces';
import { wireApi } from 'fetchwire';

export async function getCategoriesOfCurrentUserApi() {
    return wireApi<CategoryResponse[]>('/category', {
        method: 'GET',
    });
}

export async function updateCategoryApi(id: string, data: UpdateCategoryRequest) {
    return wireApi<CategoryResponse>(`/category/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
    });
}
