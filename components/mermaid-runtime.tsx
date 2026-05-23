"use client";

import { useTheme } from "next-themes";
import { useEffect } from "react";

const selector = ".mermaid-chart[data-mermaid-source]";

export function MermaidRuntime() {
  const { resolvedTheme } = useTheme();

  useEffect(() => {
    let cancelled = false;

    async function renderMermaid() {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );

      if (nodes.length === 0) {
        return;
      }

      const { default: mermaid } = await import("mermaid");

      if (cancelled) {
        return;
      }

      const isDark = document.documentElement.classList.contains("dark");

      mermaid.initialize({
        startOnLoad: false,
        theme: isDark ? "dark" : "default",
        securityLevel: "strict",
        fontFamily:
          "Source Sans Pro, Roboto, Helvetica, Helvetica Neue, sans-serif",
      });

      for (const node of nodes) {
        const source = node.dataset.mermaidSource;

        if (!source) {
          continue;
        }

        node.classList.add("mermaid");
        node.removeAttribute("data-processed");
        node.textContent = source;
      }

      try {
        await mermaid.run({ nodes });
      } catch {
        for (const node of nodes) {
          node.classList.remove("mermaid");
          node.textContent = "Unable to render Mermaid diagram.";
          node.dataset.mermaidError = "true";
        }
      }
    }

    renderMermaid();

    return () => {
      cancelled = true;
    };
  }, [resolvedTheme]);

  return null;
}
