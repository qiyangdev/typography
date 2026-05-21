import fs from "node:fs";
import path from "node:path";
import { parseContentFile, stripMarkup } from "@/lib/content";

export interface Post {
  id: string;
  fileName: string;
  body: string;
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

interface GetPostsOptions {
  archive?: boolean;
  includeDrafts?: boolean;
}

const postsDirectory = path.join(process.cwd(), "content/posts");
export const POSTS_PER_PAGE = 5;

export function getPosts(options: GetPostsOptions = {}) {
  const includeDrafts = options.includeDrafts ?? process.env.NODE_ENV !== "production";
  const posts = readPostDirectory(postsDirectory).map(toPost);
  const visiblePosts = includeDrafts ? posts : posts.filter((post) => !post.data.draft);

  visiblePosts.sort((a, b) => {
    const aDate = options.archive
      ? a.data.pubDate
      : (a.data.modDate ?? a.data.pubDate);
    const bDate = options.archive
      ? b.data.pubDate
      : (b.data.modDate ?? b.data.pubDate);
    return dateValue(bDate) - dateValue(aDate);
  });

  return visiblePosts;
}

export function getHomePosts() {
  return getPosts().sort((a, b) => {
    if (a.data.pin && !b.data.pin) return -1;
    if (!a.data.pin && b.data.pin) return 1;
    return 0;
  });
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

export function paginatePosts(posts: Post[], page: number) {
  const lastPage = Math.max(1, Math.ceil(posts.length / POSTS_PER_PAGE));
  const start = (page - 1) * POSTS_PER_PAGE;

  return {
    posts: posts.slice(start, start + POSTS_PER_PAGE),
    currentPage: page,
    lastPage,
    prevUrl: page > 1 ? getPageUrl(page - 1) : undefined,
    nextUrl: page < lastPage ? getPageUrl(page + 1) : undefined,
  };
}

export function getPageUrl(page: number) {
  return page <= 1 ? "/" : `/${page}`;
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

function slugify(value: string) {
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

function dateValue(date: string) {
  return new Date(date.replace(" ", "T")).getTime();
}
