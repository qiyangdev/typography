import { MermaidRuntime } from "@/components/mermaid-runtime";
import type { Post } from "@/lib/posts";
import type { MDXContent } from "mdx/types";

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

  return (
    <>
      <Content />
      <MermaidRuntime />
    </>
  );
}
