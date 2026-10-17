"use client";

import BlogArticle from "@/legacy-pages/BlogArticle/index.jsx";

export default function BlogArticleClient({ slug, initialArticle }) {
  return <BlogArticle slug={slug} initialArticle={initialArticle} />;
}
