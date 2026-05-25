import type { CSSProperties } from "react";

interface SocialIconProps {
  name: string;
}

const socialIconConfigs: Record<
  string,
  {
    path: string;
    size: string;
  }
> = {
  github: {
    path: "/github.svg",
    size: "18px",
  },
  email: {
    path: "/mail.svg",
    size: "20px",
  },
  mail: {
    path: "/mail.svg",
    size: "20px",
  },
  rss: {
    path: "/rss.svg",
    size: "22px",
  },
  twitter: {
    path: "/x.svg",
    size: "18px",
  },
  x: {
    path: "/x.svg",
    size: "18px",
  },
};

export function SocialIcon({ name }: SocialIconProps) {
  const normalizedName = name.toLowerCase();
  const icon = socialIconConfigs[normalizedName];

  if (!icon) {
    return (
      <span aria-hidden="true">{normalizedName.slice(0, 1).toUpperCase()}</span>
    );
  }

  return (
    <span
      aria-hidden="true"
      className="block bg-current"
      style={
        {
          height: icon.size,
          mask: `url(${icon.path}) center / contain no-repeat`,
          WebkitMask: `url(${icon.path}) center / contain no-repeat`,
          width: icon.size,
        } satisfies CSSProperties
      }
    />
  );
}
