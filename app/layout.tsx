import type { Metadata } from "next";
import { PageTransition } from "@/components/page-transition";
import { SiteFooter } from "@/components/site-footer";
import { SiteNavigation } from "@/components/site-navigation";
import { SiteTitle } from "@/components/site-title";
import { ThemeProvider } from "@/components/theme-provider";
import { defaultLocale } from "@/lib/i18n";
import "katex/dist/katex.min.css";
import "./globals.css";

const site = {
  title: "纸上微光",
  description:
    "这里安放一些写下来的东西：技术、读书、生活、忽然冒出的念头，和那些暂时没有名字的片刻。文章不拘题材，像纸页接住风，也接住日常。",
  website: "https://blog.qiyang.dev/",
};

const twitterHandle = "@qiyangdev";
const defaultTheme = "system";

export const metadata: Metadata = {
  metadataBase: new URL(site.website),
  title: {
    default: site.title,
    template: `%s | ${site.title}`,
  },
  description: site.description,
  icons: {
    icon: "/favicon.svg",
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
    images: ["/placeholder.png"],
  },
  twitter: {
    card: "summary_large_image",
    creator: twitterHandle,
    site: twitterHandle,
    title: site.title,
    description: site.description,
    images: ["/placeholder.png"],
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
          <PageTransition />
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
