import { wireApi } from 'fetchwire';

export async function uploadImageApi(file: File) {
    const formData = new FormData();
    formData.append('file', file);

    return wireApi<null>('/upload', {
        method: 'POST',
        body: formData,
    });
}

export async function deleteImageApi(path: string) {
    return wireApi<void>('/upload', {
        method: 'DELETE',
        body: JSON.stringify({ path }),
    });
}
