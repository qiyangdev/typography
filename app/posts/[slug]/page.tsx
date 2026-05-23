import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { BackLink } from "@/components/back-link";
import { PostPagination } from "@/components/pagination";
import { PostMeta } from "@/components/post-meta";
import { PostToc } from "@/components/post-toc";
import { PostContent } from "@/lib/post-content";
import { translate } from "@/lib/i18n";
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
        <div className="mb-3 text-[14px] leading-[24.5px]">
          <BackLink>{translate("back")}</BackLink>
        </div>
        <PostMeta post={post} linkedTitle={false} />
        <PostToc headings={post.headings} />
        <div>
          <PostContent post={post} />
        </div>
      </article>
      <PostPagination slug={slug} />
    </>
  );
}
