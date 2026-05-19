import type { ReactNode } from "react";
import { site } from "@/lib/site";

const footer = {
  build: {
    prefix: "由",
    suffix: "构建",
    separator: "与",
    stack: [
      {
        name: "Next.js",
        href: "https://nextjs.org/",
      },
      {
        name: "Tailwind CSS",
        href: "https://tailwindcss.com/",
      },
    ],
  },
} as const;

function FooterLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noreferrer">
      {children}
    </a>
  );
}

export function SiteFooter() {
  const year = new Date().getFullYear();
  const lineClassName = "text-xs font-bold leading-5";

  return (
    <div className="flex flex-col gap-2">
      <p className={lineClassName}>
        © {year}{" "}
        <FooterLink href={site.author.website}>{site.author.name}</FooterLink>
      </p>
      <p className={lineClassName}>
        {footer.build.prefix}{" "}
        {footer.build.stack.map((item, index) => (
          <span key={item.href}>
            {index > 0 ? ` ${footer.build.separator} ` : null}
            <FooterLink href={item.href}>{item.name}</FooterLink>
          </span>
        ))}{" "}
        {footer.build.suffix}
      </p>
    </div>
  );
}
