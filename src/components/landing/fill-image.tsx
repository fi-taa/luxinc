import Image, { type ImageProps } from "next/image";
import { cn } from "@/lib/utils";

interface FillImageProps extends Omit<ImageProps, "fill"> {
  containerClassName?: string;
}

export function FillImage({
  containerClassName,
  className,
  alt,
  ...props
}: FillImageProps) {
  return (
    <div className={cn("relative overflow-hidden", containerClassName)}>
      <Image
        fill
        alt={alt}
        className={cn("object-cover", className)}
        {...props}
      />
    </div>
  );
}
