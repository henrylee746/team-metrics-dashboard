// components/ui/Typography.tsx
import * as React from "react";
import { cn } from "@/lib/utils";

export const H1 = ({ className, ...props }) => (
  <h1
    className={cn(
      "scroll-m-20 text-xl font-extrabold tracking-tight text-balance",
      className
    )}
    {...props}
  />
);

export const P = ({ className, ...props }) => (
  <p
    className={cn(
      "text-muted-foreground text-md leading-7 [&:not(:first-child)]:mt-6",
      className
    )}
    {...props}
  />
);
