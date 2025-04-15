import React from "react";
import PrimitiveLink from "components/Primitives/Link";
import PrimitiveImage from "components/Primitives/Media/image";
import { CardRecord, LinkRecord } from "types/datocms";

type CardProps = {
  card: CardRecord;
};

export default function Card({ card }: CardProps) {
  return (
    <>
      {card?.media?.media?.responsiveImage && (
        <div className="relative w-full min-w-[300px] md:min-w-[600px] lg:min-w-[300px]">
          <PrimitiveImage responsiveImage={card.media.media.responsiveImage} />
          <div className="absolute bottom-12 left-6 z-10 px-4 text-white">
            <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
              <PrimitiveLink
                className="text-base"
                {...(card.cta as LinkRecord)}
              />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
