import { Post, getPostDescription } from "@/lib/posts";
import { PostMeta } from "@/components/post-meta";

interface PostPreviewProps {
  post: Post;
}

export function PostPreview({ post }: PostPreviewProps) {
  return (
    <article className="prose">
      <PostMeta post={post} />
      <p className="line-clamp-4">{getPostDescription(post)}</p>
    </article>
  );
}
