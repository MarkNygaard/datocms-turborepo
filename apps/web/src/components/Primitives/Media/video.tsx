import React from "react";
import { VideoPlayer } from "react-datocms";

export default function PrimitiveVideo({ video }: any) {
  return <VideoPlayer data={video} />;
}
