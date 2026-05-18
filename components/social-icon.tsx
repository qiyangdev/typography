import type { CSSProperties } from "react";

interface SocialIconProps {
  name: string;
}

const socialIconPaths: Record<string, string> = {
  github: "/github.svg",
  rss: "/rss.svg",
  twitter: "/x.svg",
  x: "/x.svg",
};

export function SocialIcon({ name }: SocialIconProps) {
  const normalizedName = name.toLowerCase();
  const iconPath = socialIconPaths[normalizedName];

  if (!iconPath) {
    return <span aria-hidden="true">{normalizedName.slice(0, 1).toUpperCase()}</span>;
  }

  return (
    <span
      aria-hidden="true"
      className="block h-4 w-4 bg-current"
      style={
        {
          mask: `url(${iconPath}) center / contain no-repeat`,
          WebkitMask: `url(${iconPath}) center / contain no-repeat`,
        } satisfies CSSProperties
      }
    />
  );
}
