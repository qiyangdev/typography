import Link from "next/link";
import { Post, formatDate } from "@/lib/posts";
import { translate } from "@/lib/i18n";
import { PostCategory } from "@/components/post-category";

interface PostMetaProps {
  post: Post;
  linkedTitle?: boolean;
}

export function PostMeta({ post, linkedTitle = true }: PostMetaProps) {
  return (
    <header className="flex flex-col gap-2">
      <h1 className="post-title">
        {linkedTitle ? (
          <Link className="not-prose" href={`/posts/${post.id}`}>
            {post.data.title}
          </Link>
        ) : (
          <span className="not-prose">{post.data.title}</span>
        )}
      </h1>
      <div className="text-[14px] leading-[24.5px]">
        {post.data.modDate ? (
          <>
            <span>{translate("updated_at")}</span>
            {" "}
            <time dateTime={post.data.modDate}>{formatDate(post.data.modDate)}</time>
            {" "}
          </>
        ) : null}
        <span>{translate("posted_at")}</span>
        {" "}
        <time dateTime={post.data.pubDate}>{formatDate(post.data.pubDate)}</time>
        {" "}
        {post.data.categories.map((category) => (
          <PostCategory key={category} category={category} />
        ))}
      </div>
    </header>
  );
}
