import { Suspense } from "react";
import BlogArticleClient from "./BlogArticleClient";
import { getBlogBySlugOrId } from "@/services/blogService";
import SkeletonBlogArticle from "@/legacy-pages/BlogArticle/components/SkeletonBlogArticle";

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  const article = await getBlogBySlugOrId(decodedSlug).catch(() => null);

  if (!article) {
    return {
      title: "مقاله تخصصی | وبلاگ کالج رکاد",
    };
  }

  const title = `${article.title || "مقاله آموزشی"} | وبلاگ کالج رکاد`;
  const description =
    article.excerpt ||
    article.summary ||
    article.description ||
    "مقالات تخصصی برنامه‌نویسی، طراحی و کسب‌وکار در وبلاگ کالج رکاد";

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      images: article.coverImage || article.img ? [article.coverImage || article.img] : ["/assets/StatCard/blue.png"],
    },
  };
}

export default async function SingleArticleRoute({ params }) {
  const { slug } = await params;
  const decodedSlug = decodeURIComponent(slug || "");
  const article = await getBlogBySlugOrId(decodedSlug).catch(() => null);

  const articleSchema = article
    ? {
        "@context": "https://schema.org",
        "@type": "Article",
        headline: article.title,
        description: article.excerpt || article.summary || article.description || "",
        image: article.coverImage || article.img || "https://rokad.ir/assets/StatCard/blue.png",
        datePublished: article.createdAt || new Date().toISOString(),
        dateModified: article.updatedAt || article.createdAt || new Date().toISOString(),
        author: {
          "@type": "Person",
          name: article.author?.name || article.author || "تحریریه کالج رکاد",
        },
        publisher: {
          "@type": "Organization",
          name: "کالج رکاد",
          logo: {
            "@type": "ImageObject",
            url: "https://rokad.ir/assets/logo.png",
          },
        },
      }
    : null;

  return (
    <>
      {articleSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
        />
      )}
      <Suspense fallback={<SkeletonBlogArticle />}>
        <BlogArticleClient slug={decodedSlug} initialArticle={article} />
      </Suspense>
    </>
  );
}
