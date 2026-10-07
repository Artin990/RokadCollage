import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Loading from "../../../Components/Loading";
import Notify from "../../../Utils/notify";
import { fetchBlogById } from "../api/blogApi";
import BlogFormPage from "../BlogFormPage";

/**
 * Route page for editing an existing blog article.
 */
export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [blogData, setBlogData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadBlog = async () => {
      setLoading(true);
      try {
        const response = await fetchBlogById(id);

        let data = null;
        if (response && response.data) {
          data = Array.isArray(response.data) ? response.data[0] : response.data;
        } else if (Array.isArray(response)) {
          data = response[0];
        }

        if (isMounted) {
          if (data) {
            setBlogData(data);
          } else {
            Notify.error("اطلاعات مقاله مورد نظر یافت نشد.");
            navigate("/blog");
          }
        }
      } catch (error) {
        if (isMounted) {
          Notify.error(error.message || "خطا در دریافت اطلاعات مقاله");
          navigate("/blog");
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    if (id) {
      loadBlog();
    }

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  if (loading) {
    return (
      <div dir="rtl" className="flex flex-col justify-center items-center min-h-[60vh] gap-3">
        <Loading size={12} />
        <span className="text-xs text-text-muted">در حال بارگذاری اطلاعات مقاله...</span>
      </div>
    );
  }

  if (!blogData) {
    return null;
  }

  return <BlogFormPage mode="edit" blogId={id} initialData={blogData} />;
}
