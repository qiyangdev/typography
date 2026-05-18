# Typography for Next.js

A typography-focused blog built with Next.js and Tailwind CSS.

## Run

```bash
bun run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Content

MDX posts live in `content/posts`. The about page is written directly in
`app/about/page.tsx`.

Supported frontmatter:

```md
---
title: title
pubDate: 2021-08-01
categories: ["Articles"]
description: "description"
slug: example-post
draft: false
pin: false
---
```

Production builds hide posts marked `draft: true`.

Categories are collected from post frontmatter automatically.

## Internationalization

Change `defaultLocale` in `lib/i18n.ts` to switch languages.

Supported locales: `zh-cn`, `en-us`, `zh-tw`, `ja-jp`, `it-it`.

## Routes

- `/` and `/:page` for paginated posts
- `/posts/:slug` for posts
- `/archive` for the year archive
- `/categories` and `/categories/:category`
- `/about`
- `/atom.xml`

## Build

```bash
bun run build
```
