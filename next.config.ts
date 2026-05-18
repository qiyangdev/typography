import createMDX from "@next/mdx";
import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  pageExtensions: ["js", "jsx", "md", "mdx", "ts", "tsx"],
};

const withMDX = createMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: ["remark-frontmatter", "remark-gfm", "remark-math"],
    rehypePlugins: [
      "rehype-katex",
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
