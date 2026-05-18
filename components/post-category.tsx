import Link from "next/link";
import { getPathFromCategory } from "@/lib/posts";

interface PostCategoryProps {
  category: string;
}

export function PostCategory({ category }: PostCategoryProps) {
  return <Link href={`/categories/${getPathFromCategory(category)}`}># {category}</Link>;
}
