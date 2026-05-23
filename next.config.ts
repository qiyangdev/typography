import createMDX from "@next/mdx";
import type { NextConfig } from "next";
import path from "node:path";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      "remark-frontmatter",
      path.join(process.cwd(), "lib/remark-cjk-soft-breaks.mjs"),
      "remark-gfm",
      "remark-math",
    ],
    rehypePlugins: [
      "rehype-katex",
      path.join(process.cwd(), "lib/rehype-heading-ids.mjs"),
      path.join(process.cwd(), "lib/rehype-mermaid.mjs"),
      [
        "@shikijs/rehype",
        {
          themes: {
            light: "github-light",
            dark: "github-dark",
          },
          defaultColor: false,
          addLanguageClass: true,
        },
      ],
    ],
  },
});

export default withMDX(nextConfig);
