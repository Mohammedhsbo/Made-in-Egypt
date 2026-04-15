import { useState } from "react";
import { FALLBACK_IMAGE, formatImageUrl } from "@/utils/formatImageUrl";

export default function SafeImage({ src, alt, className, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(
    formatImageUrl(src) || FALLBACK_IMAGE
  );

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      onError={() => setCurrentSrc(FALLBACK_IMAGE)}
      {...props}
    />
  );
}
