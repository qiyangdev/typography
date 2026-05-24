import { PostIndex } from "@/components/post-index";
import { translate } from "@/lib/i18n";
import { getFeaturedPosts, getRecentPosts } from "@/lib/posts";

export default function HomePage() {
  const featuredPosts = getFeaturedPosts();
  const recentPosts = getRecentPosts({
    excludeIds: featuredPosts.map((post) => post.id),
  });

  return (
    <div className="flex flex-col gap-12">
      {featuredPosts.length > 0 ? (
        <PostIndex posts={featuredPosts} title={translate("featured_posts")} />
      ) : null}
      <PostIndex posts={recentPosts} title={translate("recent_posts")} />
    </div>
  );
}
