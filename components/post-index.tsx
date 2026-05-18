import { notFound } from "next/navigation";
import { Pagination } from "@/components/pagination";
import { PostPreview } from "@/components/post-preview";
import { getHomePosts, paginatePosts } from "@/lib/posts";

interface PostIndexProps {
  pageNumber: number;
}

export function PostIndex({ pageNumber }: PostIndexProps) {
  const posts = getHomePosts();
  const pagination = paginatePosts(posts, pageNumber);

  if (!Number.isInteger(pageNumber) || pageNumber < 1 || pageNumber > pagination.lastPage) {
    notFound();
  }

  return (
    <>
      <section className="flex flex-col gap-[30px]">
        {pagination.posts.map((post) => (
          <PostPreview key={post.id} post={post} />
        ))}
      </section>
      <Pagination
        currentPage={pagination.currentPage}
        totalPage={pagination.lastPage}
        prevUrl={pagination.prevUrl}
        nextUrl={pagination.nextUrl}
      />
    </>
  );
}
