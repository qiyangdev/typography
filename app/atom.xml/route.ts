import { getPostDescription, getPosts } from "@/lib/posts";

export const dynamic = "force-static";

const site = {
  title: "纸上微光",
  description:
    "这里安放一些写下来的东西：技术、读书、生活、忽然冒出的念头，和那些暂时没有名字的片刻。文章不拘题材，像纸页接住风，也接住日常。",
  website: "https://qiyang.dev/",
};

export function GET() {
  const posts = getPosts({ includeDrafts: false });
  const updated = posts[0]?.data.modDate ?? posts[0]?.data.pubDate ?? new Date().toISOString();
  const siteUrl = site.website.replace(/\/$/, "");
  const xml = `<?xml version="1.0" encoding="utf-8"?>
<feed xmlns="http://www.w3.org/2005/Atom">
  <title>${escapeXml(site.title)}</title>
  <subtitle>${escapeXml(site.description)}</subtitle>
  <id>${siteUrl}/</id>
  <link href="${siteUrl}/" />
  <link rel="self" href="${siteUrl}/atom.xml" />
  <updated>${toAtomDate(updated)}</updated>
  ${posts
    .map((post) => {
      const href = `${siteUrl}/posts/${post.id}`;
      return `<entry>
    <title>${escapeXml(post.data.title)}</title>
    <id>${href}</id>
    <link href="${href}" />
    <updated>${toAtomDate(post.data.modDate ?? post.data.pubDate)}</updated>
    <published>${toAtomDate(post.data.pubDate)}</published>
    <summary>${escapeXml(getPostDescription(post))}</summary>
  </entry>`;
    })
    .join("\n  ")}
</feed>`;

  return new Response(xml, {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}

function toAtomDate(date: string) {
  return new Date(date.replace(" ", "T")).toISOString();
}

function escapeXml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}
