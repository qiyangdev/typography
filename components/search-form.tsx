"use client";

import { FormEvent } from "react";
import { useRouter } from "next/navigation";

interface SearchFormProps {
  query: string;
  labels: {
    search: string;
    placeholder: string;
  };
}

export function SearchForm({ query, labels }: SearchFormProps) {
  const router = useRouter();

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const nextQuery = String(formData.get("q") ?? "").trim();
    const href = nextQuery ? `/search?q=${encodeURIComponent(nextQuery)}` : "/search";

    router.push(href);
  }

  return (
    <form
      action="/search"
      role="search"
      className="search-form"
      onSubmit={handleSubmit}
    >
      <label htmlFor="site-search" className="sr-only">
        {labels.search}
      </label>
      <input
        id="site-search"
        name="q"
        type="search"
        defaultValue={query}
        placeholder={labels.placeholder}
        className="search-input"
      />
      <button type="submit" className="search-button">
        {labels.search}
      </button>
    </form>
  );
}
