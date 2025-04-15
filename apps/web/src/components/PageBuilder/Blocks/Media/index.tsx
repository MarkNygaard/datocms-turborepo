import React from "react";
import PrimitiveImage from "components/Primitives/Media/image";
import PrimitiveVideo from "components/Primitives/Media/video";
import { MediumRecord } from "types/datocms";

export default function Media({ medium }: MediumRecord) {
  if (medium?.media?.responsiveImage)
    return <PrimitiveImage responsiveImage={medium.media.responsiveImage} />;

  if (medium?.media?.video)
    return <PrimitiveVideo video={medium.media.video} />;
}
