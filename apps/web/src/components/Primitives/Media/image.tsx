import { SRCImage } from "react-datocms";
import { ResponsiveImage } from "types/datocms";

interface ImageProps {
  responsiveImage: ResponsiveImage;
  imgClassName?: string;
  pictureClassName?: string;
}

export default function PrimitiveImage({
  responsiveImage,
  imgClassName,
  pictureClassName,
}: ImageProps) {
  if (!responsiveImage) return null;

  return (
    <SRCImage
      data={responsiveImage}
      imgClassName={imgClassName}
      pictureClassName={pictureClassName}
    />
  );
}
