import { PostPreview } from "@/components/post-preview";
import type { Post } from "@/lib/posts";

interface PostIndexProps {
  posts: Post[];
  title?: string;
  className?: string;
}

export function PostIndex({ posts, title, className }: PostIndexProps) {
  const sectionClassName = ["flex flex-col gap-[30px]", className]
    .filter(Boolean)
    .join(" ");

  return (
    <section className={sectionClassName}>
      {title ? <h2 className="post-title">{title}</h2> : null}
      {posts.map((post) => (
        <PostPreview key={post.id} post={post} />
      ))}
    </section>
  );
}
