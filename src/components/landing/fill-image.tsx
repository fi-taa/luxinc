"use client";

import Image, { type ImageProps } from "next/image";
import { useEffect, useState } from "react";
import { getLocalPublicImageFallback, resolveStorageImageUrl } from "@/lib/supabase/storage-url";
import { cn } from "@/lib/utils";

interface FillImageProps extends Omit<ImageProps, "fill" | "src" | "onError"> {
  containerClassName?: string;
  src: string;
}

export function FillImage({
  containerClassName,
  className,
  alt,
  src,
  ...props
}: FillImageProps) {
  const resolved =
    resolveStorageImageUrl(src) ??
    getLocalPublicImageFallback(src) ??
    "/images/a1.png";
  const fallback = getLocalPublicImageFallback(resolved);
  const [currentSrc, setCurrentSrc] = useState(resolved);

  useEffect(() => {
    setCurrentSrc(
      resolveStorageImageUrl(src) ??
        getLocalPublicImageFallback(src) ??
        "/images/a1.png",
    );
  }, [src]);

  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        fill
        alt={alt}
        src={currentSrc}
        className={cn("object-cover", className)}
        onError={() => {
          if (fallback && currentSrc !== fallback) {
            setCurrentSrc(fallback);
          }
        }}
        {...props}
      />
    </div>
  );
}
