import type { Metadata } from "next";
import { CopyButton } from "@/components/copy-button";
import { XmlCode } from "@/components/xml-code";
import { getAtomFeedXml } from "@/lib/feed";
import { translate } from "@/lib/i18n";
import { getSiteUrl } from "@/lib/site";

export const metadata: Metadata = {
  title: translate("Subscribe"),
};

export default function SubscribePage() {
  const atomUrl = getSiteUrl("/atom.xml");
  const atomXml = getAtomFeedXml();

  return (
    <section className="flex flex-col gap-8">
      <header className="flex flex-col gap-4">
        <h1 className="post-title">{translate("Subscribe")}</h1>
        <p>{translate("subscription_intro")}</p>
      </header>

      <section className="subscribe-links" aria-labelledby="subscribe-links-title">
        <h2 id="subscribe-links-title" className="post-title">
          {translate("subscription_links")}
        </h2>
        <div className="subscribe-link-row">
          <div className="subscribe-link-body">
            <a href="/atom.xml">{atomUrl}</a>
          </div>
          <CopyButton
            value={atomUrl}
            labels={{
              copy: translate("copy"),
              copied: translate("copied"),
            }}
          />
        </div>
      </section>

      <section className="flex flex-col gap-4" aria-labelledby="feed-content-title">
        <h2 id="feed-content-title" className="post-title">
          {translate("feed_content")}
        </h2>
        <pre className="subscribe-feed-content">
          <code>
            <XmlCode value={atomXml} />
          </code>
        </pre>
      </section>
    </section>
  );
}
