import api from "@/api/axios.base";

export async function uploadImage({
  resourceType,
  resourceId,
  assetType,
  file,
  index,
  onProgress,
}) {
  const payload = new FormData();
  payload.append("resourceId", resourceId);
  payload.append("assetType", assetType);
  if (index !== undefined && index !== null) payload.append("index", String(index));
  payload.append("file", file);

  const response = await api.post(`/uploads/${resourceType}`, payload, {
    headers: { "Content-Type": "multipart/form-data" },
    onUploadProgress: (progressEvent) => {
      if (progressEvent.total) {
        onProgress?.(Math.round((progressEvent.loaded * 100) / progressEvent.total));
      }
    },
  });
  return response.data.data;
}

export async function deleteImage({ resourceType, resourceId, assetType, index }) {
  const response = await api.delete("/uploads", {
    data: {
      resourceType,
      resourceId,
      assetType,
      ...(index === undefined || index === null ? {} : { index }),
    },
  });
  return response.data.data;
}

export function getImageUploadErrorMessage(error, t) {
  const status = error?.response?.status;
  if (status === 401) return t("Your session has expired. Sign in again.");
  if (status === 403) return t("Administrator access is required to upload images.");
  if (status === 413) return t("Image must be 5 MB or smaller.");
  if (status === 409) return t("This image is still referenced by another record and cannot be deleted.");
  if (status === 503) return t("Image uploads are not configured. Contact the administrator.");
  if (status >= 500) return t("Image storage is unavailable. Please try again.");
  return t(error?.response?.data?.message || "Unable to upload this image.");
}
