import type { VariantProps } from "class-variance-authority";
import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva } from "class-variance-authority";

import { cn } from "@repo/ui";

const buttonVariants = cva(
  "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive px-4 py-2 text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background px-4 py-2 hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary px-4 py-2 text-secondary-foreground hover:bg-secondary/80",
        ghost: "px-4 py-2 hover:bg-accent hover:text-accent-foreground",
        fullGhost: "text-gray-500 hover:text-accent-foreground",
        link: "px-3 py-2 text-base font-semibold text-primary decoration-2 underline-offset-8 hover:underline",
        cta: "rounded-full bg-secondary px-5 py-1.5 text-primary hover:bg-gray-300",
      },
      size: {
        icon: "h-9 w-9",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
