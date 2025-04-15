import React from "react";
import PrimitiveLink from "components/Primitives/Link";
import { FileField, LinkRecord, SlideRecord } from "types/datocms";

import {
  CarouselAutoplayToggle,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/carousel";

import BackgroundImage from "./BackgroundImage";
import BackgroundVideo from "./BackgroundVideo";

type SlideProps = {
  content: SlideRecord;
  media: FileField;
  slideCount?: number;
};

export function Slide({ content, media, slideCount }: SlideProps) {
  return (
    <div className="relative">
      {media?.responsiveImage && (
        <div className="relative flex aspect-[2/3] w-full items-center justify-center overflow-hidden text-center md:aspect-[72/35] lg:aspect-auto lg:h-[700px]">
          <div className="absolute inset-0 z-0">
            <BackgroundImage responsiveImage={media.responsiveImage} />
          </div>

          {(content.title || content.subtitle || content.cta) && (
            <div className="absolute z-10 mt-16 px-4 text-white md:mt-24 lg:mt-24">
              {content.title && (
                <h1 className="py-2 text-5xl font-extrabold md:text-5xl">
                  {content.title}
                </h1>
              )}
              {content.subtitle && (
                <p className="mt-2 text-lg md:text-xl">{content.subtitle}</p>
              )}
              {content.cta && (
                <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
                  {content.cta.map((cta, index) => {
                    if (!cta) return null;
                    return (
                      <PrimitiveLink
                        key={index}
                        className="text-lg"
                        {...(cta as LinkRecord)}
                      />
                    );
                  })}
                </div>
              )}
            </div>
          )}

          {slideCount && slideCount > 1 && (
            <div className="absolute bottom-8 right-12 z-20 flex">
              <CarouselAutoplayToggle className="bg-white/80 text-black hover:bg-white" />
              <CarouselPrevious className="bg-white/80 text-black hover:bg-white" />
              <CarouselNext className="bg-white/80 text-black hover:bg-white" />
            </div>
          )}
        </div>
      )}
      {media?.video && (
        <BackgroundVideo
          video={media.video}
          title={content.title || ""}
          subtitle={content.subtitle || ""}
          cta={content.cta as LinkRecord[]}
          slideCount={slideCount || 0}
        />
      )}
    </div>
  );
}
