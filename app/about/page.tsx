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
          这里叫「纸上微光」。名字听起来像一盏小灯，其实只是给自己写下来的东西找个落脚处。
        </p>
        <p>
          文章不限定题材。可能是技术里的小坑，读书时折起的一角，也可能是生活里一阵风、一个念头，或者某天突然想认真说完的一件小事。
        </p>
        <p>
          我不太想把这里整理成一座陈列馆。它更像一张桌子：有些文字刚写完，还带着温度；有些想法放久了，边角会卷起来；也有些只是路过，被随手按进纸页里。
        </p>
        <p>
          如果你在这里读到什么，希望它不必显得很有用。能在某个瞬间让人停一下，就已经很好。
        </p>
      </article>
    </>
  );
}
