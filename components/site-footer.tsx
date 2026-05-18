import type { ReactNode } from "react";

const footer = {
  site: {
    title: "纸上微光",
    website: "https://qiyang.dev/",
  },
  work: {
    prefix: "白天在",
    organization: {
      name: "小米",
      href: "https://www.mi.com/",
    },
    suffix: "写软件，也在日常里捡词句",
  },
  build: {
    prefix: "这个小站由",
    suffix: "搭起，留给文字慢慢发光",
    separator: "和",
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
        © {year} <FooterLink href={footer.site.website}>{footer.site.title}</FooterLink>
      </p>
      <p className={lineClassName}>
        {footer.work.prefix}
        <FooterLink href={footer.work.organization.href}>
          {footer.work.organization.name}
        </FooterLink>
        {footer.work.suffix}
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
