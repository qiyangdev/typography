import fs from "node:fs";
import path from "node:path";
import { parseContentFile, stripMarkup } from "@/lib/content";

export interface Post {
  id: string;
  fileName: string;
  body: string;
  headings: PostHeading[];
  data: {
    title: string;
    pubDate: string;
    modDate?: string;
    categories: string[];
    description?: string;
    draft?: boolean;
    pin?: boolean;
    banner?: string;
    slug?: string;
  };
}

export interface PostHeading {
  id: string;
  level: 2 | 3;
  text: string;
}

interface GetPostsOptions {
  includeDrafts?: boolean;
}

const postsDirectory = path.join(process.cwd(), "content/posts");
export const FEATURED_POSTS_LIMIT = 3;
export const RECENT_POSTS_LIMIT = 3;

interface GetRecentPostsOptions {
  excludeIds?: Iterable<string>;
  limit?: number;
}

export function getPosts(options: GetPostsOptions = {}) {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const posts = readPostDirectory(postsDirectory).map(toPost);
  const visiblePosts = includeDrafts ? posts : posts.filter((post) => !post.data.draft);

  visiblePosts.sort((a, b) => {
    const aDate = a.data.modDate ?? a.data.pubDate;
    const bDate = b.data.modDate ?? b.data.pubDate;
    return dateValue(bDate) - dateValue(aDate);
  });

  return visiblePosts;
}

export function getPostIndexPosts() {
  return getPosts().sort((a, b) => {
    if (a.data.pin && !b.data.pin) return -1;
    if (!a.data.pin && b.data.pin) return 1;
    return 0;
  });
}

export function getFeaturedPosts(limit = FEATURED_POSTS_LIMIT) {
  return getPostIndexPosts()
    .filter((post) => post.data.pin)
    .slice(0, limit);
}

export function getRecentPosts({
  excludeIds = [],
  limit = RECENT_POSTS_LIMIT,
}: GetRecentPostsOptions = {}) {
  const excluded = new Set(excludeIds);

  return getPosts()
    .filter((post) => !excluded.has(post.id))
    .slice(0, limit);
}

export function getPost(slug: string) {
  const normalizedSlug = normalizePathSegment(slug);

  return getPosts().find((post) => normalizePathSegment(post.id) === normalizedSlug);
}

export function getAdjacentPosts(slug: string) {
  const posts = getPosts();
  const normalizedSlug = normalizePathSegment(slug);
  const index = posts.findIndex(
    (post) => normalizePathSegment(post.id) === normalizedSlug,
  );

  return {
    prev: index > 0 ? posts[index - 1] : undefined,
    next: index >= 0 ? posts[index + 1] : undefined,
  };
}

export function getCategories() {
  const map = new Map<string, Post[]>();

  for (const post of getPosts()) {
    for (const category of post.data.categories) {
      const posts = map.get(category) ?? [];
      posts.push(post);
      map.set(category, posts);
    }
  }

  return map;
}

export function getCategoryByPath(categoryPath: string) {
  const normalizedPath = normalizeCategoryPath(categoryPath);

  return Array.from(getCategories()).find(
    ([category]) => normalizeCategoryPath(getPathFromCategory(category)) === normalizedPath,
  );
}

export function getPostDescription(post: Post) {
  if (post.data.description) {
    return post.data.description;
  }

  return stripMarkup(post.body).slice(0, 400);
}

export function searchPosts(query: string) {
  const terms = normalizeSearchQuery(query);

  if (terms.length === 0) {
    return [];
  }

  return getPostIndexPosts()
    .map((post) => ({
      post,
      score: getSearchScore(post, terms),
    }))
    .filter(({ score }) => score > 0)
    .sort((a, b) => b.score - a.score)
    .map(({ post }) => post);
}

export function getPathFromCategory(category: string) {
  return slugify(category);
}

export function formatDate(date: string, format = "YYYY-MM-DD") {
  const value = new Date(date.replace(" ", "T"));
  const year = String(value.getFullYear());
  const month = String(value.getMonth() + 1).padStart(2, "0");
  const day = String(value.getDate()).padStart(2, "0");

  return format.replace("YYYY", year).replace("MM", month).replace("DD", day);
}

function readPostDirectory(directory: string) {
  return fs
    .readdirSync(directory)
    .filter((fileName) => fileName.endsWith(".mdx"))
    .map((fileName) => {
      const filePath = path.join(directory, fileName);
      return {
        fileName,
        parsed: parseContentFile(fs.readFileSync(filePath, "utf8")),
      };
    });
}

function toPost(entry: ReturnType<typeof readPostDirectory>[number]): Post {
  const { parsed, fileName } = entry;
  const fileNameWithoutExtension = path.parse(fileName).name;
  const title = asString(parsed.data.title, fileNameWithoutExtension);
  const id = asString(parsed.data.slug, slugify(fileNameWithoutExtension));

  return {
    id,
    fileName,
    body: parsed.body,
    headings: extractPostHeadings(parsed.body),
    data: {
      title,
      pubDate: asString(parsed.data.pubDate, ""),
      modDate: asOptionalString(parsed.data.modDate),
      categories: asStringArray(parsed.data.categories),
      description: asOptionalString(parsed.data.description),
      draft: asOptionalBoolean(parsed.data.draft),
      pin: asOptionalBoolean(parsed.data.pin),
      banner: asOptionalString(parsed.data.banner),
      slug: asOptionalString(parsed.data.slug),
    },
  };
}

function asString(value: unknown, fallback: string) {
  return typeof value === "string" ? value : fallback;
}

function asOptionalString(value: unknown) {
  return typeof value === "string" && value ? value : undefined;
}

function asStringArray(value: unknown) {
  return Array.isArray(value) ? value.filter((item) => typeof item === "string") : [];
}

function asOptionalBoolean(value: unknown) {
  return typeof value === "boolean" ? value : undefined;
}

function extractPostHeadings(source: string): PostHeading[] {
  const headings: PostHeading[] = [];
  const counts = new Map<string, number>();
  let inFence = false;

  for (const line of source.split("\n")) {
    if (/^\s*(```|~~~)/.test(line)) {
      inFence = !inFence;
      continue;
    }

    if (inFence) {
      continue;
    }

    const match = line.match(/^(##|###)\s+(.+)$/);

    if (!match) {
      continue;
    }

    const text = cleanHeadingText(match[2]);

    if (!text) {
      continue;
    }

    headings.push({
      id: uniqueSlug(text, counts),
      level: match[1].length as 2 | 3,
      text,
    });
  }

  return headings;
}

function cleanHeadingText(value: string) {
  return stripMarkup(value.replace(/\s+\{#[A-Za-z0-9_-]+\}\s*$/, "")).trim();
}

function uniqueSlug(value: string, counts: Map<string, number>) {
  const base = slugify(value) || "section";
  const count = counts.get(base) ?? 0;
  counts.set(base, count + 1);

  return count === 0 ? base : `${base}-${count + 1}`;
}

export function slugify(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/['"]/g, "")
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-+|-+$/g, "");
}

function normalizeCategoryPath(value: string) {
  return normalizePathSegment(value);
}

function normalizePathSegment(value: string) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function normalizeSearchQuery(query: string) {
  return query
    .trim()
    .toLowerCase()
    .split(/\s+/)
    .filter(Boolean);
}

function getSearchScore(post: Post, terms: string[]) {
  const title = post.data.title.toLowerCase();
  const categories = post.data.categories.join(" ").toLowerCase();
  const summary = getPostDescription(post).toLowerCase();
  const headings = post.headings.map((heading) => heading.text).join(" ").toLowerCase();
  const body = stripMarkup(post.body).toLowerCase();

  return terms.reduce((score, term) => {
    if (title.includes(term)) score += 8;
    if (categories.includes(term)) score += 5;
    if (summary.includes(term)) score += 4;
    if (headings.includes(term)) score += 3;
    if (body.includes(term)) score += 1;
    return score;
  }, 0);
}

function dateValue(date: string) {
  return new Date(date.replace(" ", "T")).getTime();
}
