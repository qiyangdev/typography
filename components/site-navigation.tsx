import Link from "next/link";
import { translate } from "@/lib/i18n";
import { site } from "@/lib/site";
import { SocialIcon } from "@/components/social-icon";

const navLinks = [
  {
    name: "Home",
    href: "/",
  },
  {
    name: "Posts",
    href: "/posts",
  },
  {
    name: "Search",
    href: "/search",
  },
  {
    name: "Categories",
    href: "/categories",
  },
  {
    name: "About",
    href: "/about",
  },
] as const;

const socialLinks = [
  {
    name: "github",
    href: site.social.github,
  },
  {
    name: "rss",
    href: "/subscribe",
  },
  {
    name: "x",
    href: site.social.x,
  },
] as const;

export function SiteNavigation() {
  return (
    <nav className="flex flex-col gap-4 text-center font-bold">
      <ul className="flex flex-row justify-center gap-2 text-[14px] leading-5.25 lg:flex-col lg:items-start lg:text-base lg:leading-6">
        {navLinks.map((nav) => (
          <li key={nav.href}>
            <Link href={nav.href} className="inline-block">
              {translate(nav.name)}
            </Link>
          </li>
        ))}
      </ul>
      <ul className="flex flex-row justify-center gap-1 lg:justify-start">
        {socialLinks.map(({ href, name }) => (
          <li key={name} className="h-6">
            <a
              href={href}
              target={href.startsWith("http") ? "_blank" : undefined}
              rel={href.startsWith("http") ? "noreferrer" : undefined}
              title={name}
              aria-label={name}
              className="not-underline-hover inline-flex h-6 w-6 items-center justify-center align-middle"
            >
              <SocialIcon name={name} />
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
