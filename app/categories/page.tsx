import Link from "next/link";
import { translate } from "@/lib/i18n";
import { getCategories, getPathFromCategory } from "@/lib/posts";

export default function CategoriesPage() {
  const categories = Array.from(getCategories()).map(([category, posts]) => ({
    title: category,
    href: `/categories/${getPathFromCategory(category)}`,
    size: translate("categories_count", posts.length),
  }));

  return (
    <section>
      <h2 className="post-title">{translate("Categories")}</h2>
      <ul className="flex list-disc flex-col gap-4 py-3 pl-6">
        {categories.map(({ title, href, size }) => (
          <li key={href}>
            <h3 className="post-title">
              <Link href={href}># {title}</Link>
            </h3>
            <p>{size}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
