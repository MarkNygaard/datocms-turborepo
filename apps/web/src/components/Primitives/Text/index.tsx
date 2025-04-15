import type { StructuredText } from "datocms-structured-text-utils";
import React from "react";
import Media from "components/PageBuilder/Blocks/Media";
import { StructuredText as DatoText } from "react-datocms";
import { MediumRecord, PrimitiveTextRecord } from "types/datocms";

export default function PrimitiveText({ text }: PrimitiveTextRecord) {
  if (!text) return null;

  return (
    <div className="prose">
      <DatoText
        data={text as unknown as StructuredText}
        renderBlock={({ record }) => {
          switch (record.__typename) {
            case "MediaRecord": {
              return <Media {...(record as MediumRecord)} />;
            }
            default:
              return null;
          }
        }}
      />
    </div>
  );
}
