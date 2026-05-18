"use client";

import { usePathname, useRouter } from "next/navigation";
import { MouseEvent, useEffect, useRef } from "react";

const transitionDuration = 500;

export function PageTransition() {
  const pathname = usePathname();
  const router = useRouter();
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
      startTransition(() => router.push(`${url.pathname}${url.search}${url.hash}`));
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

    document.addEventListener("click", handleClick, true);

    return () => {
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
  }, [pathname]);

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
