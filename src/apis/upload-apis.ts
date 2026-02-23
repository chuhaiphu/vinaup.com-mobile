import { api } from "./_base";

export async function uploadImageApi(file: File) {
  const formData = new FormData();
  formData.append("file", file);

  return api<null>("/upload", {
    method: "POST",
    body: formData,
  });
}

export async function deleteImageApi(path: string) {
  return api<null>("/upload", {
    method: "DELETE",
    body: JSON.stringify({ path }),
  });
}