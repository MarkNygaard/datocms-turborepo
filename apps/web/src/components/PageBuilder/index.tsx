import React from "react";
import Accordion from "@/Blocks/Accordion";
import FilmStrip from "@/Blocks/FilmStrip";
import Hero from "@/Blocks/Hero";
import Media from "@/Blocks/Media";
import Text from "@/Blocks/Text";
import { PageBuilderRecord } from "types/datocms";

export default function PageBuilder({ pageBuilder }: PageBuilderRecord) {
  if (!pageBuilder) return null;

  return (
    <>
      {pageBuilder?.map((block) => {
        switch (block.__typename) {
          case "HeroRecord":
            return <Hero key={block.id} {...block} />;
          case "FilmStripRecord":
            return <FilmStrip key={block.id} {...block} />;
          case "AccordionRecord":
            return <Accordion key={block.id} {...block} />;
          case "MediumRecord":
            return <Media key={block.id} {...block} />;
          case "TextRecord":
            return <Text key={block.id} {...block} />;
          default:
            return null;
        }
      })}
    </>
  );
}
