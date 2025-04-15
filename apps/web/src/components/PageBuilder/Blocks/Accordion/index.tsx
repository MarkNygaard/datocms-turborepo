import React from "react";
import Container from "@/Primitives/Container";
import PrimitiveText from "@/Primitives/Text";
import { AccordionRecord, PrimitiveTextRecord } from "types/datocms";

import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  Accordion as UIAccordion,
} from "@repo/ui/accordion";

export default function Accordion({ accordionPanel }: AccordionRecord) {
  if (!accordionPanel || accordionPanel.length === 0) return null;

  return (
    <Container className="max-w-7xl py-12">
      <UIAccordion type="single" collapsible>
        {accordionPanel.map((item) => (
          <AccordionItem key={item.id} value={item.id}>
            <AccordionTrigger>{item.label}</AccordionTrigger>
            <AccordionContent>
              <PrimitiveText {...(item.text as PrimitiveTextRecord)} />
            </AccordionContent>
          </AccordionItem>
        ))}
      </UIAccordion>
    </Container>
  );
}
