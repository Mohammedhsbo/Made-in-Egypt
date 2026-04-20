export const FALLBACK_IMAGE =
  "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='400' height='400'><rect width='100%25' height='100%25' fill='%23f3f4f6'/><text x='50%25' y='50%25' dominant-baseline='middle' text-anchor='middle' fill='%239ca3af' font-family='Arial' font-size='18'>No Image</text></svg>";

export function formatImageUrl(url) {
  if (!url || typeof url !== "string") return "";
  
  // If it's already a direct link or not a Google Drive link, return as is
  if (!url.includes("drive.google.com") && !url.includes("google.com/open?id=")) {
    return url;
  }

  // Handle various Google Drive URL formats by extracting the ID
  // IDs are alphanumeric strings usually around 33 chars, but can vary. 
  // This regex looks for the most common ID pattern in Drive URLs.
  const idMatch = url.match(/[-\w]{25,}/);
  const fileId = idMatch?.[0];

  if (!fileId) return url;
  
  // Using 'lh3.googleusercontent.com' is the most reliable way to display 
  // Google Drive images as it is designed for direct hotlinking.
  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export function getProductImageUrl(product) {
  if (!product) return FALLBACK_IMAGE;
  const cover = formatImageUrl(product?.imageCover);
  const firstImage = formatImageUrl(product?.images?.[0]);
  return cover || firstImage || FALLBACK_IMAGE;
}
