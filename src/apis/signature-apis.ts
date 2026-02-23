import { UpdateSignatureUrlRequest, SignatureResponse } from "@/interfaces/signature-interfaces";
import { api } from "./_base";

export async function updateSignatureUrlApi(id: string, data: UpdateSignatureUrlRequest) {
  return api<SignatureResponse>(`/signature/${id}/url`, {
    method: 'PATCH',
    body: JSON.stringify(data),
  });
}

export async function signSignatureApi(id: string) {
  return api<SignatureResponse>(`/signature/${id}/sign`, {
    method: 'POST',
  });
}

export async function getSignaturesByDocumentIdApi(documentId: string) {
  return api<SignatureResponse[]>(`/signature/document/${documentId}`, {
    method: 'GET',
  });
}

export async function getSignatureByIdApi(id: string) {
  return api<SignatureResponse>(`/signature/${id}`, {
    method: 'GET',
  });
}
