import { Feed } from "feed";
import { getPostDescription, getPosts } from "@/lib/posts";
import { getSiteUrl, site } from "@/lib/site";

export function getAtomFeedXml() {
  return createFeed().atom1();
}

function createFeed() {
  const posts = getPosts({ includeDrafts: false });
  const updated = posts[0]?.data.modDate ?? posts[0]?.data.pubDate;
  const feed = new Feed({
    title: site.title,
    description: site.description,
    id: getSiteUrl(),
    link: getSiteUrl(),
    language: "zh-CN",
    favicon: getSiteUrl("/favicon.ico"),
    copyright: `© ${new Date().getFullYear()} ${site.author.name}`,
    updated: updated ? toDate(updated) : new Date(),
    generator: "Next.js + feed",
    feedLinks: {
      atom: getSiteUrl("/atom.xml"),
    },
    author: {
      name: site.author.name,
      link: site.author.website,
    },
  });

  for (const post of posts) {
    const href = getSiteUrl(`/posts/${encodeURIComponent(post.id)}`);

    feed.addItem({
      title: post.data.title,
      id: href,
      link: href,
      description: getPostDescription(post),
      date: toDate(post.data.modDate ?? post.data.pubDate),
      published: toDate(post.data.pubDate),
      category: post.data.categories.map((category) => ({
        name: category,
        term: category,
      })),
    });
  }

  return feed;
}

function toDate(date: string) {
  return new Date(date.replace(" ", "T"));
}
