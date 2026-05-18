import Link from "next/link";
import { notFound } from "next/navigation";
import {
  formatDate,
  getCategories,
  getCategoryByPath,
  getPathFromCategory,
} from "@/lib/posts";

export const dynamicParams = false;

export function generateStaticParams() {
  return Array.from(getCategories()).map(([category]) => ({
    category: getPathFromCategory(category),
  }));
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const categoryEntry = getCategoryByPath(category);

  if (!categoryEntry) {
    notFound();
  }

  const [name, posts] = categoryEntry;

  return (
    <section>
      <h2 className="post-title"># {name}</h2>
      <ul className="flex list-disc flex-col gap-4 py-3 pl-6">
        {posts.map((post) => (
          <li key={post.id}>
            <h3 className="post-title">
              <Link href={`/posts/${post.id}`}>{post.data.title}</Link>
            </h3>
            <time>{formatDate(post.data.pubDate)}</time>
          </li>
        ))}
      </ul>
    </section>
  );
}
