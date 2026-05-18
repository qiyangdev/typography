import Link from "next/link";
import { formatDate, getPosts, Post } from "@/lib/posts";

interface ArchiveItem {
  title: string;
  href: string;
  date: string;
}

export default function ArchivePage() {
  const yearMap = getYearMap(getPosts({ archive: true }));

  return (
    <div className="flex flex-col gap-4">
      {yearMap.map(([year, posts]) => (
        <section key={year}>
          <h2 className="post-title">{year}</h2>
          <ul className="flex list-disc flex-col gap-4 py-3 pl-6">
            {posts.map(({ title, href, date }) => (
              <li key={href}>
                <h3 className="post-title">
                  <Link href={href}>{title}</Link>
                </h3>
                <time>{date}</time>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function getYearMap(posts: Post[]) {
  const result = new Map<number, ArchiveItem[]>();

  for (const post of posts) {
    const year = new Date(post.data.pubDate.replace(" ", "T")).getFullYear();
    const yearPosts = result.get(year) ?? [];
    yearPosts.push({
      title: post.data.title,
      href: `/posts/${post.id}`,
      date: formatDate(post.data.pubDate, "MM-DD"),
    });
    result.set(year, yearPosts);
  }

  return Array.from(result.entries());
}
