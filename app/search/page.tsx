import type { Metadata } from "next";
import { PostIndex } from "@/components/post-index";
import { SearchForm } from "@/components/search-form";
import { translate } from "@/lib/i18n";
import { searchPosts } from "@/lib/posts";

interface SearchPageProps {
  searchParams: Promise<{
    q?: string | string[];
  }>;
}

export const metadata: Metadata = {
  title: translate("Search"),
};

export default async function SearchPage({ searchParams }: SearchPageProps) {
  const { q } = await searchParams;
  const query = normalizeQueryValue(q);
  const posts = query ? searchPosts(query) : [];

  return (
    <section className="flex flex-col gap-8">
      <h2 className="post-title">{translate("Search")}</h2>
      <SearchForm
        query={query}
        labels={{
          search: translate("Search"),
          placeholder: translate("search_placeholder"),
        }}
      />
      {query ? (
        posts.length > 0 ? (
          <PostIndex
            posts={posts}
            title={translate("search_results_count", posts.length)}
          />
        ) : (
          <p>{translate("no_search_results")}</p>
        )
      ) : null}
    </section>
  );
}

function normalizeQueryValue(value: string | string[] | undefined) {
  return (Array.isArray(value) ? (value[0] ?? "") : (value ?? "")).trim();
}
