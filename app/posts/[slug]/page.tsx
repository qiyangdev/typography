import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPagination } from "@/components/pagination";
import { PostMeta } from "@/components/post-meta";
import { PostToc } from "@/components/post-toc";
import { PostContent } from "@/lib/post-content";
import { getPost, getPosts } from "@/lib/posts";
import { site } from "@/lib/site";

export const dynamicParams = false;

export function generateStaticParams() {
  return getPosts().map((post) => ({
    slug: post.id,
  }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    return {};
  }

  const description = post.data.description || site.description;
  const encodedSlug = encodeURIComponent(post.id);
  const ogImage = `/posts/${encodedSlug}/opengraph-image`;
  const twitterImage = `/posts/${encodedSlug}/twitter-image`;

  return {
    title: post.data.title,
    description,
    openGraph: {
      title: post.data.title,
      description,
      type: "article",
      images: [
        {
          url: post.data.banner ?? ogImage,
          width: 1200,
          height: 630,
          alt: post.data.title,
        },
      ],
    },
    twitter: {
      title: post.data.title,
      description,
      images: [
        {
          url: post.data.banner ?? twitterImage,
          alt: post.data.title,
        },
      ],
    },
  };
}

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getPost(slug);

  if (!post) {
    notFound();
  }

  return (
    <>
      <article className="prose">
        <PostMeta post={post} />
        <PostToc headings={post.headings} />
        <div>
          <PostContent post={post} />
        </div>
      </article>
      <PostPagination slug={slug} />
    </>
  );
}
