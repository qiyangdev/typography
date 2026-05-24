import type { Metadata } from "next";
import { PostIndex } from "@/components/post-index";
import { translate } from "@/lib/i18n";
import { getPostIndexPosts } from "@/lib/posts";

export const metadata: Metadata = {
  title: translate("Posts"),
};

export default function PostsPage() {
  return <PostIndex posts={getPostIndexPosts()} title={translate("Posts")} />;
}
