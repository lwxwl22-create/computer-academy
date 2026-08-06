"use client";

import { useEffect, useRef, useState } from "react";
import mermaid from "mermaid";

let inited = false;

export function MermaidBlock({ chart, caption }: { chart: string; caption?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!inited) {
      mermaid.initialize({
        startOnLoad: false,
        theme: "neutral",
        securityLevel: "loose",
        fontFamily: "inherit",
      });
      inited = true;
    }
    if (!ref.current) return;
    mermaid
      .render(`mmd-${Math.random().toString(36).slice(2)}`, chart)
      .then(({ svg }) => {
        if (ref.current) ref.current.innerHTML = svg;
        setError(false);
      })
      .catch(() => setError(true));
  }, [chart]);

  return (
    <figure className="my-5 overflow-x-auto rounded-xl border bg-background p-4">
      <div ref={ref} className="flex justify-center [&_svg]:max-w-full" />
      {error && <p className="text-center text-xs text-destructive">流程图渲染失败，请检查语法。</p>}
      {caption && <figcaption className="mt-2 text-center text-xs text-muted-foreground">{caption}</figcaption>}
    </figure>
  );
}
