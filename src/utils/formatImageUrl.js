const GOOGLE_DRIVE_FILE_REGEX = /\/file\/d\/([a-zA-Z0-9_-]+)/;
const GOOGLE_DRIVE_SHORT_REGEX = /\/d\/([a-zA-Z0-9_-]+)/;
const GOOGLE_DRIVE_OPEN_REGEX = /[?&]id=([a-zA-Z0-9_-]+)/;

export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='18'>No Image</text></svg>";

export function formatImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  if (!url.includes("drive.google.com")) return url;
  if (url.includes("/uc?")) return url;

  const fileMatch = url.match(GOOGLE_DRIVE_FILE_REGEX);
  const shortMatch = url.match(GOOGLE_DRIVE_SHORT_REGEX);
  const openMatch = url.match(GOOGLE_DRIVE_OPEN_REGEX);
  const fileId = fileMatch?.[1] || shortMatch?.[1] || openMatch?.[1];

  if (!fileId) return url;
  return `https://drive.google.com/uc?export=view&id=${fileId}`;
}

export function getProductImageUrl(product) {
  if (!product) return FALLBACK_IMAGE;
  const cover = formatImageUrl(product?.imageCover);
  const firstImage = formatImageUrl(product?.images?.[0]);
  return cover || firstImage || FALLBACK_IMAGE;
}
