import type { Metadata } from "next";
import { Suspense } from "react";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { ThemeKeyboardShortcut } from "@/components/theme-keyboard-shortcut";
import { SiteTitle } from "@/components/site-title";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale } from "@/lib/i18n";
import { site } from "@/lib/site";
import "katex/dist/katex.min.css";
import "./globals.css";

const defaultTheme = "system";

export const metadata: Metadata = {
  metadataBase: new URL(site.website),
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.description,
  icons: {
    icon: "/favicon.ico",
  },
  alternates: {
    types: {
      "application/rss+xml": "/atom.xml",
    },
  },
  openGraph: {
    title: site.title,
    description: site.description,
    url: site.website,
    type: "website",
    images: [
      {
        url: "/opengraph-image",
        width: 1200,
        height: 630,
        alt: site.title,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: site.social.twitterHandle,
    site: site.social.twitterHandle,
    title: site.title,
    description: site.description,
    images: [
      {
        url: "/twitter-image",
        alt: site.title,
      },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang={defaultLocale}
      className="animation-prepared h-full antialiased"
      suppressHydrationWarning
    >
      <body className="mx-auto h-screen min-w-97.5 max-w-300 px-7.5 py-7.5 lg:grid lg:grid-cols-[3fr_1fr] lg:grid-rows-[1fr_9rem] lg:gap-x-6 lg:px-20 lg:py-0">
        <ThemeProvider
          attribute="class"
          defaultTheme={defaultTheme}
          enableSystem
          storageKey="typography-theme"
        >
          <ThemeKeyboardShortcut />
          <Suspense fallback={null}>
            <PageTransition />
          </Suspense>
          <header className="transition-swup-header m-7.5 flex flex-col gap-2.5 lg:col-[2/3] lg:row-[1/2] lg:mx-0 lg:mb-4 lg:mt-20 lg:items-start lg:justify-between">
            <SiteTitle />
            <SiteNavigation />
          </header>
          <main className="transition-swup-main scrollbar-hide overflow-y-scroll outline-none lg:col-[1/2] lg:row-[1/3] lg:py-20">
            {children}
          </main>
          <footer className="transition-swup-footer py-7.5 lg:col-[2/3] lg:row-[2/3]">
            <SiteFooter />
          </footer>
        </ThemeProvider>
      </body>
    </html>
  );
}
