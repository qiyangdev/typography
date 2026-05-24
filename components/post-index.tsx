import { PostPreview } from "@/components/post-preview";
import type { Post } from "@/lib/posts";

interface PostIndexProps {
  posts: Post[];
  title?: string;
}

export function PostIndex({ posts, title }: PostIndexProps) {
  return (
    <section className="flex flex-col gap-[30px]">
      {title ? <h2 className="post-title">{title}</h2> : null}
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </section>
  );
}
