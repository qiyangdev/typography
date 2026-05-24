import { translate } from "@/lib/i18n";
import { formatDate } from "@/lib/posts";

const title = "关于";
const pubDate = "2026-05-18";

export default function AboutPage() {
  return (
    <>
      <header className="mb-4 flex flex-col gap-2">
        <h1 className="post-title">
          <span className="not-prose">{title}</span>
        </h1>
        <div className="text-sm">
          <span>{translate("posted_at")}</span>{" "}
          <time dateTime={pubDate}>{formatDate(pubDate)}</time>
        </div>
      </header>
      <article className="prose">
        <p>
          「纸上微光」是我的个人写作空间，用来记录技术、阅读和生活里的片段。
        </p>
        <p>
          内容不设固定题材，也不追求完整；只是把一些值得留下的想法按时间放在这里。
        </p>
      </article>
    </>
  );
}
