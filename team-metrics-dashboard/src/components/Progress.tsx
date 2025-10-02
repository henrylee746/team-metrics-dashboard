"use client";

import * as React from "react";

import { Progress } from "@/components/ui/progress";

export function ProgressDemo() {
  const [progress, setProgress] = React.useState(0);

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setProgress(progress + 1);
    }, 10);
    return () => clearTimeout(timer);
  }, [progress]);

  return <Progress value={progress} className="w-[40%]" />;
}
