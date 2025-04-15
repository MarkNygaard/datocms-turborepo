import React from "react";
import { FileField, HeroRecord } from "types/datocms";

import { Carousel, CarouselContent, CarouselItem } from "@repo/ui/carousel";

import { Slide } from "./Slide";

export default function Hero({ slideContent }: HeroRecord) {
  if (!slideContent || slideContent.length === 0) return null;

  if (slideContent?.length === 1) {
    const content = slideContent[0];
    if (!content) return null;

    const media = content.media?.media;

    return (
      <Slide
        content={content}
        media={media as FileField}
        slideCount={slideContent.length}
      />
    );
  }

  return (
    <Carousel autoplay delay={6000} opts={{ loop: true }}>
      <CarouselContent>
        {slideContent.map((content, index) => {
          const media = content.media?.media;

          return (
            <CarouselItem key={index}>
              <Slide
                content={content}
                media={media as FileField}
                slideCount={slideContent.length}
              />
            </CarouselItem>
          );
        })}
      </CarouselContent>
    </Carousel>
  );
}
