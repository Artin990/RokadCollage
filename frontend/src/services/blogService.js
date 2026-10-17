export const MOCK_STATIC_BLOGS = [
  {
    "_id": "b-1",
    "id": 1,
    "slug": "freelance-future",
    "title": "از یک هنرجوی صفر تا اولین قرارداد فریلنسری",
    "category": "مسیر شغلی",
    "description": "روایت‌های واقعی از هنرجویانی که در کمتر از یک سال، درآمد ماهانه‌شان را از صفر به ارقام بالا رساندند.",
    "headline": "راهنمای کاربردی رسیدن به اولین درآمد ارزی و ریالی در حوزه دیجیتال",
    "author": {
      "name": "کیارش رضایی",
      "fullName": "کیارش رضایی",
      "role": "مدیر محصول"
    },
    "createdAt": "2025-07-31T10:00:00Z",
    "readTime": "۸ دقیقه",
    "tags": [
      "فریلنسری",
      "کاریابی",
      "کالج رکاد"
    ],
    "content": "<p>یکی از دغدغه‌های همیشگی علاقه‌مندان به یادگیری برنامه‌نویسی و طراحی این است که بعد از پایان آموزش، چگونه اولین مشتری یا موقعیت شغلی واقعی خود را پیدا کنند؟</p><h2>۱. ساختن پورتفولیو واقعی به جای مدرک‌گرایی</h2><p>کارفرمایان حوزه فناوری به گواهی‌نامه نگاه نمی‌کنند؛ آن‌ها نمونه‌کارهای فعال، لینک‌های گیت‌هاب و طرح‌های تعاملی شما را ارزیابی می‌کنند. در طول دوره‌های پروژه‌محور کالج رکاد، روی حداقل ۳ پروژه واقعی و بازارپسند کار می‌کنید تا رزومه شما از روز اول پربار باشد.</p><h2>۲. حضور موثر در پلتفرم‌های تخصصی</h2><p>پروفایل لینکدین منظم، انتشار تجربیات یادگیری، و مشارکت در کامیونیتی‌های تخصصی شانس دیده شدن شما توسط مدیران فنی و منابع انسانی را به طرز چشمگیری افزایش می‌دهد.</p>"
  },
  {
    "_id": "b-2",
    "id": 2,
    "slug": "javascript-first",
    "title": "چرا JavaScript هنوز اولویت اول تازه‌واردهاست؟",
    "category": "فرانت‌اند",
    "description": "مقایسه بازار کار و طول یادگیری بین جاوااسکریپت، پایتون و PHP در ایران با داده‌های واقعی استخدام.",
    "headline": "تحلیل دقیق زبان‌های برتر برنامه‌نویسی برای شروع مسیر شغلی در ایران و جهان",
    "author": {
      "name": "مریم صالحی",
      "fullName": "مریم صالحی",
      "role": "معمار ارشد نرم‌افزار"
    },
    "createdAt": "2025-07-23T10:00:00Z",
    "readTime": "۱۲ دقیقه",
    "tags": [
      "جاوااسکریپت",
      "فرانت‌اند",
      "برنامه‌نویسی"
    ],
    "content": "<p>جاوااسکریپت تنها زبان برنامه نویسی وب است که به صورت مستقیم در همه مرورگرها اجرا میشود.</p>"
  },
  {
    "_id": "b-3",
    "id": 3,
    "slug": "logo-mistakes",
    "title": "هفت اشتباه رایج در طراحی لوگو که برند شما را می‌کشد",
    "category": "گرافیک",
    "description": "راهنمایی برای طراحان تازه‌کار و صاحبان کسب‌وکار: چه وقت لوگو کار نمی‌کند و چطور آن را تشخیص دهیم.",
    "headline": "اصول خلق هویت بصری ماندگار به همراه تحلیل اشتباهات ویرانگر در دیزاین",
    "author": {
      "name": "ایمان کریمی",
      "fullName": "ایمان کریمی",
      "role": "طراح ارشد گرافیک"
    },
    "createdAt": "2025-07-16T10:00:00Z",
    "readTime": "۶ دقیقه",
    "tags": [
      "طراحی",
      "هویت بصری",
      "دیزاین"
    ],
    "content": "<p>طراحی یک لوگوی ماندگار فراتر از کشیدن یک نماد جذاب است.</p>"
  },
  {
    "_id": "b-4",
    "id": 4,
    "slug": "mba-value",
    "title": "آیا MBA برای نسل جوان ایران ارزش سرمایه‌گذاری دارد؟",
    "category": "کسب‌وکار",
    "description": "یک نگاه صادقانه به بازگشت سرمایه MBA در بازار کار امروز ایران، بر اساس گفتگو با فارغ‌التحصیلان رکاد.",
    "headline": "بررسی فرصت‌های ارتقای شغلی و مدیریت استارتاپ‌ها با مهارت‌های تحلیلی MBA",
    "author": {
      "name": "نگار موسوی",
      "fullName": "نگار موسوی",
      "role": "مشاور استراتژی"
    },
    "createdAt": "2025-07-09T10:00:00Z",
    "readTime": "۱۰ دقیقه",
    "tags": [
      "کسب و کار",
      "مدیریت",
      "استارتاپ"
    ],
    "content": "<p>بازار امروز نیاز به مدیرانی دارد که درک کاملی از فناوری و داده داشته باشند.</p>"
  }
];

import { apiRequest } from "@/lib/api";

/**
 * دریافت لیست مقالات وبلاگ (صفحه‌بندی، دسته‌بندی و جستجو)
 */
export async function getBlogs(params = {}) {
  const query = new URLSearchParams();
  if (params.page) query.append("page", params.page);
  if (params.limit) query.append("limit", params.limit);
  if (params.category && params.category !== "all") query.append("category", params.category);
  if (params.search) {
    query.append("search", params.search);
    query.append("q", params.search);
  }
  if (params.sort) query.append("sort", params.sort);

  const qs = query.toString();
  const endpoint = `/blogs${qs ? `?${qs}` : ""}`;
  const res = await apiRequest(endpoint);
  const list = res?.data || res;
  return (Array.isArray(list) && list.length > 0) ? list : MOCK_STATIC_BLOGS;
}

/**
 * دریافت یک مقاله بر اساس شناسه یا اسلاگ
 */
export async function getBlogById(id) {
  const res = await apiRequest(`/blogs/${id}`);
  return res?.data || res;
}

/**
 * دریافت مقاله با اسلاگ یا شناسه با جستجو در مقالات
 */
export async function getBlogBySlugOrId(identifier) {
  if (!identifier) return MOCK_STATIC_BLOGS.find(b => b.slug === slugOrId || b._id === slugOrId || String(b.id) === String(slugOrId)) || MOCK_STATIC_BLOGS[0];
  // If it's a valid 24-character MongoDB ObjectId, fetch directly
  if (/^[0-9a-fA-F]{24}$/.test(identifier)) {
    const direct = await getBlogById(identifier).catch(() => null);
    if (direct) return direct;
  }

  // Otherwise search in blog collection
  const all = await getBlogs({ limit: 50 }).catch(() => []);
  const list = Array.isArray(all) ? all : all.data || [];
  const clean = String(identifier).trim().toLowerCase();
  const match = list.find(
    (b) =>
      b.slug === clean ||
      b.id === clean ||
      b._id === clean ||
      (b.title && b.title.toLowerCase().includes(clean))
  );

  if (match) {
    const full = await getBlogById(match._id || match.id).catch(() => null);
    return full || match;
  }

  // If not found in top 50, query backend with search keyword
  try {
    const searchRes = await getBlogs({ search: identifier, limit: 5 });
    const sList = Array.isArray(searchRes) ? searchRes : searchRes.data || [];
    if (sList.length > 0) {
      const full = await getBlogById(sList[0]._id || sList[0].id).catch(() => null);
      return full || sList[0];
    }
  } catch (e) {
    // Ignore fallback failure
  }

  return null;
}
