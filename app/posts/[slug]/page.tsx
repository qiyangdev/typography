import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { PostPagination } from "@/components/pagination";
import { PostMeta } from "@/components/post-meta";
import { PostContent } from "@/lib/post-content";
import { getPost, getPosts } from "@/lib/posts";

export const dynamicParams = false;

const siteDescription =
  "这里安放一些写下来的东西：技术、读书、生活、忽然冒出的念头，和那些暂时没有名字的片刻。文章不拘题材，像纸页接住风，也接住日常。";

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

  const description = post.data.description || siteDescription;

  return {
    title: post.data.title,
    description,
    openGraph: {
      title: post.data.title,
      description,
      type: "article",
      images: [post.data.banner ?? "/placeholder.png"],
    },
    twitter: {
      title: post.data.title,
      description,
      images: [post.data.banner ?? "/placeholder.png"],
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
        <div>
          <PostContent post={post} />
        </div>
      </article>
      <PostPagination slug={slug} />
    </>
  );
}
