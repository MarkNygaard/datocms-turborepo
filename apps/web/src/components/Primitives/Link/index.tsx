import React from "react";
import Link from "next/link";
import { LinkRecord } from "types/datocms";

import { Button } from "@repo/ui/button";

type PrimitiveLinkProps = LinkRecord & {
  className?: string;
};

export default function PrimitiveLink({
  label,
  variant,
  internalLink,
  externalLink,
  className,
}: PrimitiveLinkProps) {
  const href = internalLink?.slug ? `/${internalLink.slug}` : externalLink;

  return (
    <Button
      variant={
        variant as
          | "link"
          | "default"
          | "destructive"
          | "outline"
          | "secondary"
          | "ghost"
          | "fullGhost"
          | "cta"
          | undefined
      }
      className={className}
      asChild
    >
      <Link
        href={href || "/"}
        target={externalLink ? "_blank" : undefined}
        rel={externalLink ? "noopener noreferrer" : undefined}
      >
        {label || internalLink?.title}
      </Link>
    </Button>
  );
}
