"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { MouseEvent, useEffect, useRef } from "react";

const transitionDuration = 500;
const previousUrlStorageKey = "typography:previous-url";
const targetUrlStorageKey = "typography:target-url";

type PageTransitionNavigateDetail =
  | { type: "back" }
  | { type: "push"; href: string };

export function PageTransition() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const router = useRouter();
  const routeKey = `${pathname}?${searchParams.toString()}`;
  const pendingTransition = useRef(false);
  const fallbackTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    function removeInitialAnimation() {
      document.documentElement.classList.remove("animation-prepared");
    }

    document.addEventListener("animationend", removeInitialAnimation, false);
    const timer = window.setTimeout(removeInitialAnimation, 1100);

    return () => {
      document.removeEventListener("animationend", removeInitialAnimation, false);
      window.clearTimeout(timer);
    };
  }, []);

  useEffect(() => {
    function handleTransitionNavigation(event: Event) {
      const { detail } = event as CustomEvent<PageTransitionNavigateDetail>;

      if (detail.type === "back") {
        startTransition(() => router.back());
        return;
      }

      recordReturnTarget(detail.href);
      startTransition(() => router.push(detail.href));
    }

    function handleClick(event: globalThis.MouseEvent) {
      if (event.defaultPrevented || event.button !== 0 || hasModifierKey(event)) {
        return;
      }

      const target = event.target;
      if (!(target instanceof Element)) {
        return;
      }

      const anchor = target.closest("a");
      if (!anchor || !shouldAnimateLink(anchor)) {
        return;
      }

      const url = new URL(anchor.href);
      const current = new URL(window.location.href);

      if (url.pathname === current.pathname && url.search === current.search) {
        return;
      }

      event.preventDefault();
      const href = `${url.pathname}${url.search}${url.hash}`;
      recordReturnTarget(href);
      startTransition(() => router.push(href));
    }

    function startTransition(navigate: () => void) {
      if (pendingTransition.current) {
        return;
      }

      pendingTransition.current = true;
      document.documentElement.classList.add("is-animating", "is-leaving");

      fallbackTimer.current = window.setTimeout(() => {
        const main = document.querySelector<HTMLElement>(".transition-swup-main");
        if (main) {
          main.style.transitionDuration = "0s";
        }
        document.documentElement.classList.remove("is-leaving");
        main?.getBoundingClientRect();
        navigate();
      }, transitionDuration);
    }

    document.addEventListener("page-transition:navigate", handleTransitionNavigation);
    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener(
        "page-transition:navigate",
        handleTransitionNavigation,
      );
      document.removeEventListener("click", handleClick, true);
      if (fallbackTimer.current) {
        window.clearTimeout(fallbackTimer.current);
      }
    };
  }, [router]);

  useEffect(() => {
    if (!pendingTransition.current) {
      return;
    }

    if (fallbackTimer.current) {
      window.clearTimeout(fallbackTimer.current);
    }

    const root = document.documentElement;
    const main = document.querySelector<HTMLElement>(".transition-swup-main");
    root.classList.remove("is-leaving");

    requestAnimationFrame(() => {
      if (main) {
        main.style.transitionDuration = "";
        main.getBoundingClientRect();
      }

      requestAnimationFrame(() => {
        root.classList.remove("is-animating");
        pendingTransition.current = false;
      });
    });
  }, [routeKey]);

  return null;
}

function hasModifierKey(event: MouseEvent | globalThis.MouseEvent) {
  return event.metaKey || event.ctrlKey || event.shiftKey || event.altKey;
}

function shouldAnimateLink(anchor: HTMLAnchorElement) {
  if (
    anchor.target ||
    anchor.download ||
    anchor.dataset.noTransition === "true" ||
    anchor.getAttribute("href")?.startsWith("#")
  ) {
    return false;
  }

  const url = new URL(anchor.href);
  return url.origin === window.location.origin;
}

function recordReturnTarget(href: string) {
  try {
    const targetUrl = new URL(href, window.location.href);
    window.sessionStorage.setItem(previousUrlStorageKey, window.location.href);
    window.sessionStorage.setItem(targetUrlStorageKey, targetUrl.href);
  } catch {
    // sessionStorage can be unavailable in restricted browser contexts.
  }
}
