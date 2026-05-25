"use client";

import { useState, type CSSProperties } from "react";

interface CopyButtonProps {
  value: string;
  labels: {
    copy: string;
    copied: string;
  };
  className?: string;
  style?: CSSProperties;
}

export function CopyButton({ value, labels, className, style }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);
  const buttonClassName = ["copy-button", className].filter(Boolean).join(" ");

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
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button
      type="button"
      className={buttonClassName}
      style={style}
      onClick={handleClick}
    >
      {copied ? labels.copied : labels.copy}
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
