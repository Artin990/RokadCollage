import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import EditIcon from "@mui/icons-material/Edit";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";

import Notify from "../../../Utils/notify";
import { Button, Card, PageHeader, SegmentedControl, LoadingState } from "../../../Components/UI";
import { fetchBlogById } from "../api/blogApi";
import ClientBlogArticleView from "../components/ClientBlogArticleView";

/**
 * SingleBlog
 * Dedicated Page: Single Blog Article View (Client-Fidelity Presentation)
 * Displays the exact page a client/student sees on the client frontend.
 * Provides desktop and mobile device toggles for responsive validation.
 */
export default function SingleBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
  );

  useEffect(() => {
    let isMounted = true;
    const loadBlog = async () => {
      setLoading(true);
      try {
        const response = await fetchBlogById(id);
        const data = response?.data || response;

        if (isMounted) {
          if (data) {
            const resolvedBlog = Array.isArray(data) ? data[0] : data;
            setBlog(resolvedBlog);
          } else {
            Notify.error("مقاله مورد نظر یافت نشد.");
          }
        }
      } catch (error) {
        if (isMounted) {
          Notify.error(error.message || "خطا در دریافت اطلاعات مقاله وبلاگ");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (id) loadBlog();

    return () => {
      isMounted = false;
    };
  }, [id]);

  if (loading) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="مشاهده مقاله"
          subtitle="در حال دریافت محتوای مقاله..."
          backTo="/blog"
        />
        <LoadingState text="در حال دریافت اطلاعات و متن مقاله..." minHeight="min-h-[440px]" />
      </div>
    );
  }

  if (!blog) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="مقاله یافت نشد"
          backTo="/blog"
        />
        <div className="p-12 text-center text-text-muted bg-surface rounded-2xl border border-dashed border-border mt-4">
          اطلاعات مقاله یافت نشد یا ممکن است این مقاله حذف شده باشد.
          <div className="mt-4">
            <Button variant="secondary" size="sm" onClick={() => navigate("/blog")}>
              بازگشت به مقالات
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      {/* Admin Top Header Toolbar */}
      <PageHeader
        title={blog.title}
        subtitle="پیش‌نمایش خوانش مقاله وبلاگ"
        backTo="/blog"
        action={
          <div className="flex items-center gap-3">
            {/* Viewport switch: Desktop vs Mobile */}
            <SegmentedControl
              options={[
                {
                  id: "desktop",
                  label: "نسخه دسکتاپ",
                  icon: <DesktopWindowsOutlinedIcon style={{ fontSize: 16 }} />,
                },
                {
                  id: "mobile",
                  label: "نسخه موبایل",
                  icon: <PhoneIphoneOutlinedIcon style={{ fontSize: 16 }} />,
                },
              ]}
              value={viewportMode}
              onChange={setViewportMode}
            />

            {/* Quick edit button */}
            <Button
              variant="primary"
              size="md"
              icon={<EditIcon fontSize="small" />}
              onClick={() => navigate(`/blog/update/${blog._id}`)}
            >
              ویرایش مقاله
            </Button>
          </div>
        }
      />

      {/* Main Client Presentation Container */}
      <div className="mt-6">
        <ClientBlogArticleView
          blog={blog}
          viewportMode={viewportMode}
          onViewportChange={setViewportMode}
        />
      </div>
    </div>
  );
}
