import { useState } from "react";
import { FALLBACK_IMAGE, formatImageUrl } from "@/utils/formatImageUrl";

export default function SafeImage({ src, alt, className, ...props }) {
  const [failedImage, setFailedImage] = useState(null);
  const currentSrc = failedImage?.src === src
    ? FALLBACK_IMAGE
    : formatImageUrl(src) || FALLBACK_IMAGE;

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setFailedImage({ src })}
      {...props}
    />
  );
}
