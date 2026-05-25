"use client";

import { useState } from "react";

interface CopyButtonProps {
  value: string;
  labels: {
    copy: string;
    copied: string;
  };
}

export function CopyButton({ value, labels }: CopyButtonProps) {
  const [copied, setCopied] = useState(false);

  async function handleClick() {
    try {
      await navigator.clipboard.writeText(value);
    } catch {
      copyWithSelection(value);
    }

    setCopied(true);
    window.setTimeout(() => setCopied(false), 1600);
  }

  return (
    <button type="button" className="copy-button" onClick={handleClick}>
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
  document.execCommand("copy");
  textarea.remove();
}
