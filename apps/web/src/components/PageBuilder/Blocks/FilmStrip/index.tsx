import React from "react";
import Container from "@/Primitives/Container";
import { FilmStripRecord } from "types/datocms";

import Card from "./Card";

export default function FilmStrip({ cards }: FilmStripRecord) {
  if (!cards || cards.length === 0) return null;

  return (
    <Container className="flex gap-4 overflow-x-auto py-12 lg:justify-center">
      {cards.map((card) => (
        <Card key={card.id} card={card} />
      ))}
    </Container>
  );
}
