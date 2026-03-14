import {
  UpdateSignatureUrlRequest,
  SignatureResponse,
} from '@/interfaces/signature-interfaces';
import { wireApi } from 'fetchwire';

export async function updateSignatureUrlApi(
  id: string,
  data: UpdateSignatureUrlRequest
) {
  return wireApi<SignatureResponse>(`/signature/${id}/url`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function signSignatureApi(id: string) {
  return wireApi<SignatureResponse>(`/signature/${id}/sign`, {
    method: 'POST',
  });
}

export async function getSignaturesByDocumentIdApi(documentId: string) {
  return wireApi<SignatureResponse[]>(`/signature/document/${documentId}`, {
    method: 'GET',
  });
}

export async function getSignatureByIdApi(id: string) {
  return wireApi<SignatureResponse>(`/signature/${id}`, {
    method: 'GET',
  });
}
