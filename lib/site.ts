export const site = {
  title: "页隙札记",
  subtitle: "技术阅读与日常",
  description:
    "这里安放一些写下来的东西：技术、读书、生活、忽然冒出的念头，和那些暂时没有名字的片刻。文章不拘题材，像纸页接住风，也接住日常。",
  website: "https://blog.qiyang.dev/",
  repository: "https://github.com/qiyangdev/typography",
  author: {
    name: "Qiyang(启阳)",
    website: "https://qiyang.dev/",
  },
  social: {
    github: "https://github.com/qiyangdev",
    x: "https://x.com/qiyangdev",
    email: "mailto:wangqiyangx@gmail.com",
    twitterHandle: "@qiyangdev",
  },
} as const;

export function getSiteUrl(pathname = "/") {
  return new URL(pathname, site.website).toString();
}

export function getSiteHost() {
  return new URL(site.website).host;
}
