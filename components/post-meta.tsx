import Link from "next/link";
import { Post, formatDate } from "@/lib/posts";
import { translate } from "@/lib/i18n";
import { PostCategory } from "@/components/post-category";

interface PostMetaProps {
  post: Post;
  linkedTitle?: boolean;
}

export function PostMeta({ post, linkedTitle = true }: PostMetaProps) {
  const date = post.data.modDate ?? post.data.pubDate;
  const label = post.data.modDate ? "updated_at" : "posted_at";

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
        <span>{translate(label)}</span>
        {" "}
        <time dateTime={date}>{formatDate(date)}</time>
        {" "}
        {post.data.categories.map((category) => (
          <PostCategory key={category} category={category} />
        ))}
      </div>
    </header>
  );
}
