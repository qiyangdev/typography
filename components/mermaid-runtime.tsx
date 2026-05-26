"use client";

import {
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  ChevronUp,
  Copy,
  MoveHorizontal,
  RefreshCw,
  X,
  ZoomIn,
  ZoomOut,
  type LucideIcon,
} from "lucide-react";
import type { RenderOptions } from "beautiful-mermaid";
import { useEffect } from "react";
import { createRoot, type Root } from "react-dom/client";

const selector = ".mermaid-chart[data-mermaid-source]";
const minScale = 0.5;
const maxScale = 4;
const zoomStep = 0.2;
const panStep = 72;
const previewCloseAnimationMs = 180;

interface DiagramTransform {
  x: number;
  y: number;
  scale: number;
}

const viewerIcons = {
  check: Check,
  preview: MoveHorizontal,
  copy: Copy,
  close: X,
  up: ChevronUp,
  down: ChevronDown,
  left: ChevronLeft,
  right: ChevronRight,
  zoomIn: ZoomIn,
  zoomOut: ZoomOut,
  reset: RefreshCw,
} satisfies Record<string, LucideIcon>;

type ViewerIcon = keyof typeof viewerIcons;

interface EnhanceMermaidViewerOptions {
  showToolbar?: boolean;
}

const iconRootsByChart = new WeakMap<HTMLElement, Root[]>();
const copyResetTimers = new WeakMap<HTMLButtonElement, number>();

const renderOptions: RenderOptions = {
  bg: "var(--site-background)",
  fg: "var(--site-primary)",
  line: "color-mix(in srgb, var(--site-primary), transparent 50%)",
  accent: "var(--site-primary)",
  muted: "color-mix(in srgb, var(--site-primary), transparent 42%)",
  surface: "color-mix(in srgb, var(--site-background), var(--site-primary) 4%)",
  border: "color-mix(in srgb, var(--site-primary), transparent 72%)",
  font: "Source Sans Pro",
  padding: 32,
  transparent: true,
};

export function MermaidRuntime() {
  useEffect(() => {
    let cancelled = false;

    async function renderMermaid() {
      const nodes = Array.from(
        document.querySelectorAll<HTMLElement>(selector),
      );

      if (nodes.length === 0) {
        return;
      }

      const { renderMermaidSVG } = await import("beautiful-mermaid");

      if (cancelled) {
        return;
      }

      for (const node of nodes) {
        const source = node.dataset.mermaidSource;

        if (!source) {
          continue;
        }

        clearIconRoots(node);
        node.classList.remove("mermaid");
        node.removeAttribute("data-mermaid-ready");
        node.removeAttribute("data-mermaid-interacted");
        node.removeAttribute("data-mermaid-error");
        node.removeAttribute("data-mermaid-renderer");
        node.removeAttribute("data-processed");
        node.textContent = "";

        try {
          const svg = removeExternalFontImports(
            renderMermaidSVG(source, renderOptions),
          );

          if (cancelled) {
            return;
          }

          node.innerHTML = svg;
          node.dataset.mermaidRenderer = "beautiful-mermaid";
          enhanceMermaidViewer(node);
        } catch {
          node.textContent = "Unable to render Mermaid diagram.";
          node.dataset.mermaidError = "true";
        }
      }
    }

    renderMermaid();

    return () => {
      cancelled = true;
    };
  }, []);

  return null;
}

function enhanceMermaidViewer(
  chart: HTMLElement,
  { showToolbar = true }: EnhanceMermaidViewerOptions = {},
) {
  const svg = chart.querySelector("svg");
  const source = chart.dataset.mermaidSource;

  if (!svg || !source) {
    return;
  }

  const diagramSource = source;
  const renderedSvg = svg;
  const viewer = document.createElement("div");
  const canvas = document.createElement("div");
  const toolbar = showToolbar ? document.createElement("div") : null;
  const controls = document.createElement("div");
  const iconRoots: Root[] = [];
  let transform: DiagramTransform = { x: 0, y: 0, scale: 1 };

  chart.classList.remove("mermaid");
  chart.removeAttribute("role");
  chart.removeAttribute("aria-label");
  chart.dataset.mermaidReady = "true";

  viewer.className = "mermaid-viewer";
  viewer.tabIndex = 0;
  viewer.setAttribute("role", "group");
  viewer.setAttribute("aria-label", "Interactive Mermaid diagram viewer");

  canvas.className = "mermaid-viewer-canvas";

  while (chart.firstChild) {
    canvas.append(chart.firstChild);
  }

  if (toolbar) {
    toolbar.className = "mermaid-viewer-toolbar";
  }

  controls.className = "mermaid-viewer-controls";

  function renderTransform() {
    canvas.style.transform = `translate3d(${transform.x}px, ${transform.y}px, 0) scale(${transform.scale})`;

    if (transform.x === 0 && transform.y === 0 && transform.scale === 1) {
      chart.removeAttribute("data-mermaid-interacted");
    } else {
      chart.dataset.mermaidInteracted = "true";
    }
  }

  function setTransform(nextTransform: DiagramTransform) {
    transform = {
      x: Math.round(nextTransform.x),
      y: Math.round(nextTransform.y),
      scale: clamp(roundScale(nextTransform.scale), minScale, maxScale),
    };
    renderTransform();
  }

  function resetTransform() {
    setTransform({ x: 0, y: 0, scale: 1 });
  }

  function pan(dx: number, dy: number) {
    setTransform({
      ...transform,
      x: transform.x + dx,
      y: transform.y + dy,
    });
  }

  function zoom(delta: number) {
    setTransform({
      ...transform,
      scale: transform.scale + delta,
    });
  }

  function openPreview() {
    openPreviewDialog(diagramSource, renderedSvg.outerHTML);
  }

  if (toolbar) {
    toolbar.append(
      createIconButton({
        className: "mermaid-viewer-button",
        icon: "preview",
        label: "Open diagram preview",
        iconRoots,
        onClick: openPreview,
      }),
      createIconButton({
        className: "mermaid-viewer-button",
        icon: "copy",
        label: "Copy Mermaid source",
        iconRoots,
        onClick: (button, setIcon) =>
          copySource(button, diagramSource, setIcon),
      }),
    );
  }

  controls.append(
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-up",
      icon: "up",
      label: "Pan up",
      iconRoots,
      onClick: () => pan(0, panStep),
    }),
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-zoom-in",
      icon: "zoomIn",
      label: "Zoom in",
      iconRoots,
      onClick: () => zoom(zoomStep),
    }),
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-left",
      icon: "left",
      label: "Pan left",
      iconRoots,
      onClick: () => pan(panStep, 0),
    }),
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-reset",
      icon: "reset",
      label: "Reset view",
      iconRoots,
      onClick: resetTransform,
    }),
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-right",
      icon: "right",
      label: "Pan right",
      iconRoots,
      onClick: () => pan(-panStep, 0),
    }),
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-down",
      icon: "down",
      label: "Pan down",
      iconRoots,
      onClick: () => pan(0, -panStep),
    }),
    createIconButton({
      className: "mermaid-viewer-button mermaid-viewer-button-zoom-out",
      icon: "zoomOut",
      label: "Zoom out",
      iconRoots,
      onClick: () => zoom(-zoomStep),
    }),
  );

  if (toolbar) {
    viewer.append(canvas, toolbar, controls);
  } else {
    viewer.append(canvas, controls);
  }

  chart.replaceChildren(viewer);
  iconRootsByChart.set(chart, iconRoots);
  renderTransform();

  viewer.addEventListener("keydown", (event) => {
    if (event.key === "ArrowUp") {
      event.preventDefault();
      pan(0, panStep);
    } else if (event.key === "ArrowDown") {
      event.preventDefault();
      pan(0, -panStep);
    } else if (event.key === "ArrowLeft") {
      event.preventDefault();
      pan(panStep, 0);
    } else if (event.key === "ArrowRight") {
      event.preventDefault();
      pan(-panStep, 0);
    } else if (event.key === "+" || event.key === "=") {
      event.preventDefault();
      zoom(zoomStep);
    } else if (event.key === "-" || event.key === "_") {
      event.preventDefault();
      zoom(-zoomStep);
    } else if (event.key === "0" || event.key === "Escape") {
      event.preventDefault();
      resetTransform();
    }
  });
}

function openPreviewDialog(source: string, svgMarkup: string) {
  const dialog = document.createElement("dialog");
  const panel = document.createElement("div");
  const previewChart = document.createElement("div");
  const dialogIconRoots: Root[] = [];
  let isClosing = false;
  let closeTimer: number | null = null;

  dialog.className = "mermaid-preview-dialog";
  dialog.setAttribute("aria-label", "Mermaid diagram preview");
  dialog.dataset.state = "open";

  panel.className = "mermaid-preview-panel";

  previewChart.className = "mermaid-chart mermaid-preview-chart";
  previewChart.dataset.mermaidSource = source;
  previewChart.dataset.mermaidRenderer = "beautiful-mermaid";
  previewChart.innerHTML = svgMarkup;

  const closeButton = createIconButton({
    className: "mermaid-viewer-button mermaid-preview-close",
    icon: "close",
    label: "Close preview",
    iconRoots: dialogIconRoots,
    onClick: closePreview,
  });

  function closePreview() {
    if (isClosing) {
      return;
    }

    isClosing = true;

    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      dialog.close();
      return;
    }

    dialog.dataset.state = "closing";
    closeTimer = window.setTimeout(() => dialog.close(), previewCloseAnimationMs);
  }

  panel.append(closeButton, previewChart);
  dialog.append(panel);
  document.body.append(dialog);
  enhanceMermaidViewer(previewChart, { showToolbar: false });

  dialog.addEventListener("click", (event) => {
    if (event.target === dialog) {
      closePreview();
    }
  });

  dialog.addEventListener("cancel", (event) => {
    event.preventDefault();
    closePreview();
  });

  dialog.addEventListener(
    "close",
    () => {
      if (closeTimer !== null) {
        window.clearTimeout(closeTimer);
      }

      clearIconRoots(previewChart);

      for (const root of dialogIconRoots) {
        root.unmount();
      }

      dialog.remove();
    },
    { once: true },
  );

  dialog.showModal();
  previewChart.querySelector<HTMLElement>(".mermaid-viewer")?.focus();
}

function createIconButton({
  className,
  icon,
  label,
  iconRoots,
  onClick,
}: {
  className: string;
  icon: ViewerIcon;
  label: string;
  iconRoots: Root[];
  onClick: (
    button: HTMLButtonElement,
    setIcon: (icon: ViewerIcon) => void,
  ) => void;
}) {
  const button = document.createElement("button");
  const iconMount = document.createElement("span");
  const iconRoot = createRoot(iconMount);

  function setIcon(nextIcon: ViewerIcon) {
    const Icon = viewerIcons[nextIcon];

    iconRoot.render(<Icon aria-hidden="true" focusable="false" />);
  }

  button.className = className;
  button.type = "button";
  button.setAttribute("aria-label", label);
  button.title = label;
  iconMount.className = "mermaid-viewer-icon";
  setIcon(icon);
  iconRoots.push(iconRoot);
  button.append(iconMount);
  button.addEventListener("click", () => onClick(button, setIcon));

  return button;
}

async function copySource(
  button: HTMLButtonElement,
  source: string,
  setIcon: (icon: ViewerIcon) => void,
) {
  try {
    const didCopy = await writeClipboardText(source);

    if (!didCopy) {
      throw new Error("Unable to copy Mermaid source.");
    }

    button.dataset.copied = "true";
    button.setAttribute("aria-label", "Copied Mermaid source");
    button.title = "Copied Mermaid source";
    setIcon("check");

    clearCopyResetTimer(button);

    copyResetTimers.set(
      button,
      window.setTimeout(() => {
        copyResetTimers.delete(button);
        button.removeAttribute("data-copied");
        button.setAttribute("aria-label", "Copy Mermaid source");
        button.title = "Copy Mermaid source";
        if (button.isConnected) {
          setIcon("copy");
        }
      }, 1600),
    );
  } catch {
    button.dataset.copyFailed = "true";

    window.setTimeout(() => {
      button.removeAttribute("data-copy-failed");
    }, 1600);
  }
}

function clearCopyResetTimer(button: HTMLButtonElement) {
  const resetTimer = copyResetTimers.get(button);

  if (resetTimer === undefined) {
    return;
  }

  window.clearTimeout(resetTimer);
  copyResetTimers.delete(button);
}

async function writeClipboardText(value: string) {
  try {
    if (navigator.clipboard?.writeText) {
      await navigator.clipboard.writeText(value);
      return true;
    }

    return copyWithSelection(value);
  } catch {
    return copyWithSelection(value);
  }
}

function copyWithSelection(value: string) {
  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "");
  textarea.style.position = "fixed";
  textarea.style.top = "0";
  textarea.style.left = "-9999px";
  document.body.append(textarea);
  textarea.select();
  const didCopy = document.execCommand("copy");
  textarea.remove();
  return didCopy;
}

function clearIconRoots(chart: HTMLElement) {
  const roots = iconRootsByChart.get(chart);

  if (!roots) {
    return;
  }

  for (const root of roots) {
    root.unmount();
  }

  iconRootsByChart.delete(chart);
}

function removeExternalFontImports(svg: string) {
  return svg.replace(
    /\s*@import url\('https:\/\/fonts\.googleapis\.com\/css2\?[^']+'\);/g,
    "",
  );
}

function clamp(value: number, min: number, max: number) {
  return Math.min(Math.max(value, min), max);
}

function roundScale(value: number) {
  return Math.round(value * 100) / 100;
}
