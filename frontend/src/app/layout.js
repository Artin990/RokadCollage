import "./globals.css";
import { iransans } from "./fonts.js";
import HashRouterListener from "@/components/HashRouterListener.jsx";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://college.rokadschool.ir";

export const metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "کالج رکاد | آکادمی تخصصی برنامه‌نویسی و طراحی",
    template: "%s | کالج رکاد",
  },
  description: "دوره‌های حضوری و آنلاین با تمرکز بر ورود به بازار کار و پشتیبانی منتورها",
  icons: {
    icon: [
      { url: "/favicon.svg", type: "image/svg+xml" },
      { url: "/favicon-32x32.png", sizes: "32x32", type: "image/png" },
      { url: "/favicon-16x16.png", sizes: "16x16", type: "image/png" },
    ],
    shortcut: "/favicon.ico",
    apple: [
      { url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" },
    ],
  },
  openGraph: {
    type: "website",
    locale: "fa_IR",
    url: siteUrl,
    siteName: "کالج رکاد",
    title: "کالج رکاد | آکادمی تخصصی برنامه‌نویسی و طراحی",
    description: "دوره‌های حضوری و آنلاین با تمرکز بر ورود به بازار کار و پشتیبانی منتورها",
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        type: "image/png",
        alt: "لوگو و معرفی کالج رکاد",
      },
      {
        url: `${siteUrl}/og-logo.png`,
        width: 600,
        height: 600,
        type: "image/png",
        alt: "لوگو کالج رکاد",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "کالج رکاد | آکادمی تخصصی برنامه‌نویسی و طراحی",
    description: "دوره‌های حضوری و آنلاین با تمرکز بر ورود به بازار کار و پشتیبانی منتورها",
    images: [`${siteUrl}/og-image.png`],
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="fa" dir="rtl" className={iransans.variable}>
      <head>
        <meta property="og:image" content={`${siteUrl}/og-image.png`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        <meta property="og:image:type" content="image/png" />
        <meta name="twitter:image" content={`${siteUrl}/og-image.png`} />
        <link rel="image_src" href={`${siteUrl}/og-image.png`} />
      </head>
      <body className={`antialiased bg-[#fdfbf7] text-[#292827] font-sans selection:bg-[#f8a41d]/20 selection:text-[#21295a]`}>
        <HashRouterListener />
        {children}
      </body>
    </html>
  );
}
