"use client";

import { Image } from "react-datocms";
import { ResponsiveImage } from "types/datocms";

interface ImageProps {
  responsiveImage: ResponsiveImage;
}

export default function BackgroundImage({ responsiveImage }: ImageProps) {
  if (!responsiveImage) return null;

  return (
    <div className="absolute inset-0 z-0">
      <Image
        data={responsiveImage}
        pictureClassName="pointer-events-none"
        layout="fill"
        objectFit="cover"
        objectPosition="center"
        priority
      />
    </div>
  );
}
