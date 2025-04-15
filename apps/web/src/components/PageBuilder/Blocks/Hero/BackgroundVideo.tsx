"use client";

import { useEffect, useState } from "react";
import MuxPlayer from "@mux/mux-player-react";
import PrimitiveLink from "components/Primitives/Link";
import { useVideoPlayer } from "react-datocms";
import { LinkRecord, UploadVideoField } from "types/datocms";

import {
  CarouselAutoplayToggle,
  CarouselNext,
  CarouselPrevious,
} from "@repo/ui/carousel";

type BackgroundVideoProps = {
  video: UploadVideoField;
  title: string;
  subtitle: string;
  cta: LinkRecord[];
  slideCount?: number;
};

export default function BackgroundVideo({
  video,
  title,
  subtitle,
  cta,
  slideCount,
}: BackgroundVideoProps) {
  const [hasMounted, setHasMounted] = useState(false);
  const muxProps = useVideoPlayer({ data: video });

  useEffect(() => {
    setHasMounted(true);
  }, []);

  return (
    <div className="relative flex aspect-[2/3] w-full items-center justify-center overflow-hidden text-center md:aspect-[72/35] lg:aspect-auto lg:h-[700px]">
      {hasMounted && (
        <MuxPlayer
          {...(muxProps as any)}
          stream-type="on-demand"
          loop
          muted
          autoPlay
          playsInline
          className="pointer-events-none absolute inset-0 z-0"
          style={
            {
              "--controls": "none",
              "--media-object-fit": "cover",
            } as React.CSSProperties
          }
        />
      )}

      {(title || subtitle || cta) && (
        <div className="relative z-10 mt-16 px-4 text-white md:mt-24 lg:mt-24">
          {title && (
            <h1 className="py-2 text-5xl font-extrabold md:text-5xl">
              {title}
            </h1>
          )}
          {subtitle && <p className="mt-2 text-lg md:text-xl">{subtitle}</p>}
          {/* {cta && <PrimitiveLink className="mt-12 text-lg" {...cta} />} */}
          {cta && (
            <div className="mt-12 flex flex-col items-center justify-center gap-4 md:flex-row md:gap-8">
              {cta.map((singlCta, index) => {
                if (!singlCta) return null;
                return (
                  <PrimitiveLink
                    key={index}
                    className="mt-12 text-lg"
                    {...(singlCta as LinkRecord)}
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
  );
}
