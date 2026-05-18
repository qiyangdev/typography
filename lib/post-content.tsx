import type { Post } from "@/lib/posts";
import type { MDXContent } from "mdx/types";
import { createElement } from "react";

interface PostContentProps {
  post: Pick<Post, "fileName">;
}

interface PostContentModule {
  default: MDXContent;
}

export async function PostContent({ post }: PostContentProps) {
  const { default: Content } = (await import(
    `@/content/posts/${post.fileName}`
  )) as PostContentModule;

  return createElement(Content);
}
