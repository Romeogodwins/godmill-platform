"use client";

import { ImgHTMLAttributes, useState } from "react";

interface AdaptiveImageProps extends ImgHTMLAttributes<HTMLImageElement> {
  fallbackText?: string;
}

export default function AdaptiveImage({
  src,
  alt,
  className = "",
  fallbackText,
  ...props
}: AdaptiveImageProps) {
  const [hasError, setHasError] = useState(false);

  if (hasError) {
    return (
      <div
        className={`flex h-full w-full items-center justify-center rounded-[2rem] bg-[#0b1b34] p-6 text-center text-sm text-[#f5f0e9] ${className}`}
      >
        <div>
          <div className="mb-3 text-3xl">🖼️</div>
          <p>{fallbackText ?? alt}</p>
        </div>
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      onError={() => setHasError(true)}
      {...props}
    />
  );
}
