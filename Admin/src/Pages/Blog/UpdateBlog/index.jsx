import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import { useNavigate, useParams } from "react-router-dom";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { PageHeader, LoadingState, FormSkeleton } from "../../../Components/UI";
import BlogForm from "../components/BlogForm";
import { fetchBlogById, updateBlog, uploadBlogCover } from "../api/blogApi";
import { blogUpdateSchema } from "../schemas/blogSchema";

/**
 * Dedicated Page: Update / Edit Existing Blog Post
 */
export default function UpdateBlog() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const [initialValues, setInitialValues] = useState({
    category: "",
    title: "",
    description: "",
    content: "",
    img: null,
  });

  useEffect(() => {
    let isMounted = true;
    const loadBlog = async () => {
      setLoading(true);
      try {
        const response = await fetchBlogById(id);
        const data = response?.data || response;

        if (isMounted && data) {
          const blog = Array.isArray(data) ? data[0] : data;
          setInitialValues({
            category: blog.category || "",
            title: blog.title || "",
            description: blog.description || "",
            content: blog.content || "",
            img: blog.img || null,
          });

          if (blog.img) {
            setImagePreview(getImageUrl(blog.img));
          }
        }
      } catch (err) {
        Notify.error(err.message || "خطا در دریافت اطلاعات مقاله");
        navigate("/blog");
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    loadBlog();
    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: blogUpdateSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        if (values.img instanceof File) {
          finalImageName = await uploadBlogCover(values.img);
        }

        const payload = {
          category: values.category,
          title: values.title.trim(),
          description: values.description.trim(),
          content: values.content,
          img: finalImageName,
        };

        await updateBlog(id, payload);
        Notify.success("تغییرات مقاله با موفقیت ذخیره شد.");
        navigate("/blog");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "خطا در به‌روزرسانی مقاله";
        Notify.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageSelect = (file) => {
    formik.setFieldValue("img", file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  if (loading) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
        <PageHeader
          title="ویرایش مقاله"
          subtitle="در حال بارگذاری اطلاعات مقاله..."
          backTo="/blog"
        />
        <FormSkeleton />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="ویرایش مقاله"
        subtitle="ویرایش اطلاعات، کدهای HTML و کاور مقاله منتشرشده"
        backTo="/blog"
      />

      <BlogForm
        formik={formik}
        isEdit={true}
        imagePreview={imagePreview}
        onImageSelect={handleImageSelect}
        isSubmitting={isSubmitting}
        submitLabel="ذخیره تغییرات"
        onCancel={() => navigate("/blog")}
      />
    </div>
  );
}
