import { useEffect, useState } from "react";
import { FALLBACK_IMAGE, formatImageUrl } from "@/utils/formatImageUrl";

export default function SafeImage({ src, alt, className, ...props }) {
  const [currentSrc, setCurrentSrc] = useState(
    formatImageUrl(src) || FALLBACK_IMAGE
  );

  useEffect(() => {
    setCurrentSrc(formatImageUrl(src) || FALLBACK_IMAGE);
  }, [src]);

  return (
    <img
      src={currentSrc}
      alt={alt}
      className={className}
      referrerPolicy="no-referrer"
      onError={() => setCurrentSrc(FALLBACK_IMAGE)}
      {...props}
    />
  );
}
