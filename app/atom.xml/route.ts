import { getAtomFeedXml } from "@/lib/feed";

export const dynamic = "force-static";

export function GET() {
  return new Response(getAtomFeedXml(), {
    headers: {
      "Content-Type": "application/atom+xml; charset=utf-8",
    },
  });
}
