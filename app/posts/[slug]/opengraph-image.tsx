import { notFound } from "next/navigation";
import {
  createOgImage,
  ogImageContentType,
  ogImageSize,
} from "@/lib/og-image";
import { formatDate, getPost, getPostDescription, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const alt = `${site.title}文章分享图`;
export const size = ogImageSize;
export const contentType = ogImageContentType;

export function generateStaticParams() {
  return getPosts({ includeDrafts: false }).map((post) => ({
    slug: post.id,
  }));
}

export default async function Image({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return createOgImage({
    title: post.data.title,
    description: getPostDescription(post),
    eyebrow: [formatDate(post.data.pubDate), ...post.data.categories].join(" / "),
  });
}
