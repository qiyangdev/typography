import type { PostHeading } from "@/lib/posts";

interface PostTocProps {
  headings: PostHeading[];
}

export function PostToc({ headings }: PostTocProps) {
  if (headings.length < 2) {
    return null;
  }

  return (
    <nav className="post-toc" aria-label="文章目录">
      <details>
        <summary>目录</summary>
        <div className="post-toc-list">
          <ol>
            {headings.map((heading) => (
              <li key={heading.id} data-level={heading.level}>
                <a href={`#${heading.id}`}>{heading.text}</a>
              </li>
            ))}
          </ol>
        </div>
      </details>
    </nav>
  );
}
