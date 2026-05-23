"use client";

import { MouseEvent, ReactNode } from "react";

const previousUrlStorageKey = "typography:previous-url";
const targetUrlStorageKey = "typography:target-url";

interface BackLinkProps {
  children: ReactNode;
  fallbackHref?: string;
}

export function BackLink({ children, fallbackHref = "/" }: BackLinkProps) {
  function handleClick(event: MouseEvent<HTMLAnchorElement>) {
    if (event.button !== 0 || hasModifierKey(event)) {
      return;
    }

    const canReturnToSameOrigin = canReturnToPreviousPage();

    event.preventDefault();
    document.dispatchEvent(
      new CustomEvent("page-transition:navigate", {
        detail: canReturnToSameOrigin
          ? { type: "back" }
          : { type: "push", href: fallbackHref },
      }),
    );
  }

  return (
    <a href={fallbackHref} data-no-transition="true" onClick={handleClick}>
      {children}
    </a>
  );
}

function hasModifierKey(event: MouseEvent<HTMLAnchorElement>) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function canReturnToPreviousPage() {
  if (window.history.length <= 1) {
    return false;
  }

  try {
    const previousUrl = window.sessionStorage.getItem(previousUrlStorageKey);
    const targetUrl = window.sessionStorage.getItem(targetUrlStorageKey);

    if (
      previousUrl &&
      targetUrl === window.location.href &&
      new URL(previousUrl).origin === window.location.origin
    ) {
      return true;
    }
  } catch {
    // Fall through to the referrer check.
  }

  const referrer = document.referrer ? new URL(document.referrer) : null;
  return referrer?.origin === window.location.origin;
}
