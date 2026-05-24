import Link from "next/link";
import { translate } from "@/lib/i18n";
import { getAdjacentPosts } from "@/lib/posts";

interface PostPaginationProps {
  slug: string;
}

export function PostPagination({ slug }: PostPaginationProps) {
  const { prev, next } = getAdjacentPosts(slug);

  return (
    <footer className="mt-5">
      <PaginationLinks
        left={
          prev
            ? {
                title: `${translate("prev_post")}: ${prev.data.title}`,
                url: `/posts/${prev.id}`,
              }
            : undefined
        }
        right={
          next
            ? {
                title: `${translate("next_post")}: ${next.data.title}`,
                url: `/posts/${next.id}`,
              }
            : undefined
        }
      />
    </footer>
  );
}

function PaginationLinks({
  left,
  right,
}: {
  left?: { title: string; url: string };
  right?: { title: string; url: string };
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {left && (
        <Link title={left.title} href={left.url}>
          <ChevronDoubleLeft />
          {left.title}
        </Link>
      )}
      {right && (
        <Link title={right.title} href={right.url}>
          {" "}
          {right.title}
          {" "}
          <ChevronDoubleRight />
        </Link>
      )}
    </div>
  );
}

function ChevronDoubleLeft() {
  return (
    <span className="inline-block h-4 w-4 align-middle">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M18.41 16.59 13.82 12l4.59-4.59L17 6l-6 6 6 6 1.41-1.41ZM11.41 16.59 6.82 12l4.59-4.59L10 6l-6 6 6 6 1.41-1.41Z"
        />
      </svg>
    </span>
  );
}

function ChevronDoubleRight() {
  return (
    <span className="inline-block h-4 w-4 align-middle">
      <svg viewBox="0 0 24 24" aria-hidden="true">
        <path
          fill="currentColor"
          d="M5.59 7.41 10.18 12l-4.59 4.59L7 18l6-6-6-6-1.41 1.41ZM12.59 7.41 17.18 12l-4.59 4.59L14 18l6-6-6-6-1.41 1.41Z"
        />
      </svg>
    </span>
  );
}
