import { PostIndex } from "@/components/post-index";
import { getHomePosts, POSTS_PER_PAGE } from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  const posts = getHomePosts();
  const lastPage = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));

  return Array.from({ length: Math.max(0, lastPage - 1) }, (_, index) => ({
    page: String(index + 2),
  }));
}

export default async function PaginatedHomePage({
  params,
}: {
  params: Promise<{ page: string }>;
}) {
  const { page } = await params;

  return <PostIndex pageNumber={Number(page)} />;
}
