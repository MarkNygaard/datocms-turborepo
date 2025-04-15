import React from "react";
import Container from "@/Primitives/Container";
import PrimitiveText from "components/Primitives/Text";
import { TextRecord } from "types/datocms";

export default function index({ text }: TextRecord) {
  if (!text) return null;

  return (
    <Container className="max-w-7xl py-12">
      <PrimitiveText {...text} />
    </Container>
  );
}
