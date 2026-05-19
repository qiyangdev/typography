import Link from "next/link";
import { site } from "@/lib/site";

export function SiteTitle() {
  return (
    <hgroup className="flex cursor-pointer flex-col gap-2.5 text-center transition duration-700 ease-in-out lg:items-start lg:border-l-2 lg:border-primary lg:text-left lg:[writing-mode:vertical-rl]">
      <Link
        href="/"
        className="site-title-link not-underline-hover transition duration-800 ease-in-out"
      >
        <h3 className="font-header text-[20px] font-extrabold leading-7.5">
          {site.subtitle}
        </h3>
        <h1 className="font-header text-[32px] font-extrabold leading-12">
          {site.title}
        </h1>
      </Link>
    </hgroup>
  );
}
