import React from "react";

import { cn } from "@repo/ui";

type ContainerProps = {
  children: React.ReactNode;
  className?: string;
};

export default function Container({ children, className }: ContainerProps) {
  if (!children) return null;

  return (
    <div className={cn("mx-auto w-full max-w-10xl px-6 lg:px-12", className)}>
      {children}
    </div>
  );
}
