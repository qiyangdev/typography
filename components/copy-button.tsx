"use client";

import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ReactNode,
} from "react";

interface CopyButtonProps {
  value: string;
  labels: {
    copy: string;
    copied: string;
  };
  className?: string;
  style?: CSSProperties;
  children?: ReactNode;
  copiedChildren?: ReactNode;
}

export function CopyButton({
  value,
  labels,
  className,
  style,
  children,
  copiedChildren,
}: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const resetTimerRef = useRef<number | null>(null);
  const buttonClassName = ["copy-button", className].filter(Boolean).join(" ");

  useEffect(() => {
    return () => {
      if (resetTimerRef.current !== null) {
        window.clearTimeout(resetTimerRef.current);
      }
    };
  }, []);

  async function handleClick() {
    let didCopy = false;

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(value);
        didCopy = true;
      } else {
        didCopy = copyWithSelection(value);
      }
    } catch {
      didCopy = copyWithSelection(value);
    }

    if (!didCopy) {
      return;
    }

    setCopied(true);

    if (resetTimerRef.current !== null) {
      window.clearTimeout(resetTimerRef.current);
    }

    resetTimerRef.current = window.setTimeout(() => {
      setCopied(false);
      resetTimerRef.current = null;
    }, 1600);
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      style={style}
      aria-label={copied ? labels.copied : labels.copy}
      title={copied ? labels.copied : labels.copy}
      data-copied={copied ? "true" : undefined}
      onClick={handleClick}
    >
      {copied
        ? (copiedChildren ?? children ?? labels.copied)
        : (children ?? labels.copy)}
    </button>
  );
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
