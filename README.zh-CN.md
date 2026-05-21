# Typography for Next.js

[English](./README.md)

[![使用 Vercel 部署](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fqiyangdev%2Ftypography)

一个使用 Next.js 和 Tailwind CSS 构建的个人文章站。它偏重排版、阅读节奏和安静的
发布流程，用来安放技术笔记、读书摘记、日常片段，以及其他值得留下的文字。

本项目基于
[sumimakito/hexo-theme-typography](https://github.com/sumimakito/hexo-theme-typography)
进行 Next.js + Tailwind CSS 复刻。它保留了原主题的纵向标题、纸页网格背景、克制的
链接动效和页面切换气质，同时将内容与渲染流程替换为本地 MDX 和 Next.js App
Router。

## 预览

![首页预览](./docs/images/homepage.png)

## 功能

- App Router 路由：文章列表、分页、文章详情、归档、分类、关于页和 Atom Feed。
- 本地 MDX 内容：文章放在 `content/posts`，支持 frontmatter、GFM、LaTeX 和代码
  块。
- 代码高亮：使用 Shiki，并跟随浅色/深色主题切换。
- 数学公式：使用 `remark-math` 与 `rehype-katex` 渲染 LaTeX。
- 主题切换：使用 `next-themes`，默认跟随系统主题。
- 动态分类：直接从文章 frontmatter 收集分类，不需要额外维护映射表。
- 中文 slug：文章路径可以使用中文，URL 编码后也能正常匹配。
- 轻量页面切换动画，贴近原主题的浏览感受。

## Run

```bash
bun run dev
```

打开 [http://localhost:3000](http://localhost:3000)。

## Content

文章放在 `content/posts`，文件格式为 `.mdx`。关于页直接写在
`app/about/page.tsx`，不再从 Markdown 文件加载。

frontmatter 示例：

```mdx
---
title: Hello, World
pubDate: 2026-05-18
categories: ["Examples"]
description: "A first note for this site."
slug: hello-world
draft: false
pin: false
---
```

字段说明：

- `title`：文章标题。
- `pubDate`：发布日期。
- `modDate`：可选，更新日期；存在时文章元信息显示“更新于”。
- `categories`：分类数组，分类页会自动生成。
- `description`：可选，列表页和元信息描述；缺省时从正文截取。
- `slug`：可选，文章路径覆盖值；不写时会从 MDX 文件名生成。
- `draft`：可选，生产环境会隐藏 `draft: true` 的文章。
- `pin`：可选，置顶文章会在首页靠前显示。
- `banner`：可选，用于 Open Graph / Twitter 图片。

## Internationalization

文案字典在 `lib/i18n.ts`。当前默认语言是 `zh-cn`，可通过修改 `defaultLocale` 切
换。

已内置语言：`zh-cn`、`en-us`、`zh-tw`、`ja-jp`、`it-it`。

## Routes

- `/`：首页文章列表
- `/:page`：分页文章列表
- `/posts/:slug`：文章详情
- `/archive`：按年份归档
- `/categories`：分类列表
- `/categories/:category`：分类文章列表
- `/about`
- `/atom.xml`

## Structure

```text
app/                 App Router 页面和路由处理
components/          站点标题、导航、分页、文章元信息等组件
content/posts/       MDX 文章
lib/                 内容读取、文章索引、i18n 和动态 MDX 渲染
public/              社交图标和文章占位图
```

## Build

```bash
bun run build
```

## Lint

```bash
bun run lint
```
