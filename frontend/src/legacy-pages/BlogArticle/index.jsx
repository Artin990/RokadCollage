/* ============================================================
   کالج رکاد: تک‌صفحهٔ بلاگ
   دیزاین و محتوا: دقیقاً «BlogSingle» سایت رکاد وب
   («چطور یک نوجوان را عاشق کد کنیم؟») با رنگ‌بندی کالج
   ============================================================ */
import { post, blocks, related } from "../../data/blogSingle.js";

/* رنگ‌های پالت کالج */
const AMBER_GRAD = "linear-gradient(135deg, #ffd44d 0%, var(--college) 55%, var(--college-dark) 100%)";
const toneGrad = (t) =>
  t === "teal"
    ? "linear-gradient(135deg, var(--teal) 0%, var(--teal-dark) 100%)"
    : t === "magenta"
      ? "linear-gradient(135deg, var(--accent) 0%, var(--female-dark) 100%)"
      : "linear-gradient(135deg, var(--navy) 0%, var(--navy-hover) 100%)";

const H2_COLORS = ["var(--college)", "var(--navy)", "var(--accent)"];

import { useState, useEffect } from "react";
import Link from "next/link";
import { Check } from "lucide-react";
import { getBlogBySlugOrId } from "@/services/blogService.js";

export default function BlogArticle({ slug }) {
  const [copied, setCopied] = useState(false);
  const [article, setArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      if (!slug) return;
      try {
        const data = await getBlogBySlugOrId(slug);
        setArticle(data);
      } catch (err) {
        console.error("Failed to load blog article:", err);
      } finally {
        setLoading(false);
      }
    }
    fetchArticle();
  }, [slug]);

  const scrollTo = (id) => (e) => {
    e.preventDefault();
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const copyLink = () => {
    try {
      navigator.clipboard?.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch (e) {
      /* ignore */
    }
  };

  const renderBlock = (b, i) => {
    if (b.type === "h2") {
      const n = parseInt(String(b.id || "s0").replace(/\D/g, ""), 10) || 0;
      const hc = H2_COLORS[n % 3];
      return (
        <h2 className="rbs-h2" id={b.id} key={i} style={{ color: hc }}>
          <span className="bar" style={{ background: hc }} />
          {b.text}
        </h2>
      );
    }
    if (b.type === "quote")
      return (
        <figure className="rbs-quote" key={i}>
          <span className="mark">&ldquo;</span>
          <blockquote>{b.text}</blockquote>
        </figure>
      );
    if (b.type === "info")
      return (
        <div className="rbs-info" key={i}>
          <div className="rbs-info-label">{b.label}</div>
          <div className="rbs-info-text">{b.text}</div>
        </div>
      );
    return <p className="rbs-p" key={i}>{b.text}</p>;
  };

  const displayTitle = article?.title || post.titleWords.map((w) => w.t).join(" ");
  const displayCategory = article?.category || post.tags[0] || "آموزش";
  const displayAuthorName = article?.author?.fullName || article?.author?.name || post.author.name;
  const displayAuthorRole = article?.author?.role || post.author.role;
  const displayDate = article?.createdAt ? new Date(article.createdAt).toLocaleDateString("fa-IR") : post.meta[1];
  const displayReadTime = article?.readTime ? `${article.readTime} دقیقه` : post.meta[0];

  return (
    <section className="rbs-page">
      <div className="container">
        {/* بریدکرامب */}
        <nav className="rbs-crumb" aria-label="مسیر">
          <Link href="/">خانه</Link>
          <span className="sep">/</span>
          <Link href="/blog">مجله</Link>
          <span className="sep">/</span>
          <span className="cur">{displayTitle}</span>
        </nav>

        {/* گرید اصلی: مقاله + سایدبار */}
        <div className="rbs-layout">
          {/* ══════ مقاله ══════ */}
          <article className="rbs-article">
            {/* تگ‌ها */}
            <div className="rbs-tags">
              <span className="rbs-tag filled-amber">{displayCategory}</span>
              {article?.tags?.map((t, i) => (
                <span key={i} className="rbs-tag ghost">{t}</span>
              ))}
            </div>

            {/* تیتر مقاله */}
            <h1 className="rbs-title" style={{ fontSize: "2rem", lineHeight: "1.4" }}>
              {displayTitle}
            </h1>

            {/* متا */}
            <div className="rbs-meta">
              <span className="rbs-meta-item">{displayReadTime}</span>
              <span className="rbs-meta-item">
                <span className="dot" style={{ color: "var(--accent)" }}>●</span>
                {displayDate}
              </span>
              <span className="rbs-meta-item">
                <span className="dot" style={{ color: "var(--college)" }}>●</span>
                {displayAuthorName}
              </span>
            </div>

            {/* کاور */}
            <div className="rbs-cover">
              <div className="rbs-cover-card" style={{ background: AMBER_GRAD }}>
                <span className="rbs-cover-cap">{article?.headline || post.coverCaption}</span>
              </div>
            </div>

            {/* بدنه */}
            <div className="rbs-prose">
              {article?.content ? (
                <div
                  className="article-dynamic-html"
                  dangerouslySetInnerHTML={{ __html: article.content }}
                />
              ) : (
                blocks.map(renderBlock)
              )}
            </div>

            {/* نویسنده پایین مقاله */}
            <div className="rbs-author">
              <span className="avatar">{post.author.initials}</span>
              <div className="info">
                <strong>{post.author.name}</strong>
                <div className="role">{post.author.role}</div>
                <p>{post.author.bio}</p>
              </div>
            </div>

            {/* مطالب مرتبط */}
            <section className="rbs-related">
              <h2 className="rbs-related-head">
                <span className="bar" />
                مطالب مرتبط
              </h2>
              <div className="rbs-rp-grid">
                {related.map((r, i) => (
                  <a className="rbs-rp" href="#blog-index" key={i}>
                    <div className="thumb" style={{ background: toneGrad(r.tone) }} />
                    <div className="body">
                      <span className="tag">{r.tag}</span>
                      <h3>{r.title}</h3>
                    </div>
                  </a>
                ))}
              </div>
            </section>
          </article>

          {/* ══════ سایدبار (sticky) ══════ */}
          <aside className="rbs-side">
            {/* نویسنده */}
            <div className="rbs-side-card rbs-side-author">
              <div className="row">
                <span className="avatar">{post.author.initials}</span>
                <div>
                  <strong>{post.author.name}</strong>
                  <div className="role">{post.author.role}</div>
                </div>
              </div>
              <p>{post.author.bio}</p>
            </div>

            {/* فهرست مطالب */}
            <div className="rbs-side-card">
              <div className="head">فهرست مطالب</div>
              <ul className="rbs-toc">
                {post.toc.map((t, i) => (
                  <li key={i}>
                    <a href={`#${t.id}`} onClick={scrollTo(t.id)}>
                      <span className="num">{t.num}</span>
                      {t.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>

            {/* اشتراک‌گذاری */}
            <div className="rbs-side-card">
              <div className="head">این مطلب رو به اشتراک بذار!</div>
              <div className="rbs-share-btns">
                {post.share.map((s, i) => (
                  <button
                    className={`rbs-sbtn${s === "کپی لینک" && copied ? " copied" : ""}`}
                    type="button"
                    key={i}
                    onClick={s === "کپی لینک" ? copyLink : undefined}
                    style={s === "کپی لینک" && copied ? { background: "var(--teal)", color: "#fff", borderColor: "var(--ink)" } : {}}
                  >
                    {s === "کپی لینک" && copied ? (
                      <span style={{ display: "inline-flex", alignItems: "center", gap: 4 }}>
                        <Check size={12} strokeWidth={3} />
                        <span>کپی شد</span>
                      </span>
                    ) : (
                      s
                    )}
                  </button>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
    </section>
  );
}