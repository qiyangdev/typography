import {
  createOgImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og-image";
import { site } from "@/lib/site";

export const alt = site.title;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export default function Image() {
  return createOgImage({
    title: site.title,
    description:
      "技术、读书、生活、忽然冒出的念头，和那些暂时没有名字的片刻，都先在纸页上停一停。",
  });
}
