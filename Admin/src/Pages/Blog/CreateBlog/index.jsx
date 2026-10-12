import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import Notify from "../../../Utils/notify";
import { PageHeader } from "../../../Components/UI";
import BlogForm from "../components/BlogForm";
import { createBlog, uploadBlogCover } from "../api/blogApi";
import { blogValidationSchema } from "../schemas/blogSchema";

/**
 * Dedicated Page: Create New Blog Post
 */
export default function CreateBlog() {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);

  const formik = useFormik({
    initialValues: {
      category: "",
      title: "",
      description: "",
      content: "",
      img: null,
    },
    validationSchema: blogValidationSchema,
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

        await createBlog(payload);
        Notify.success("مقاله با موفقیت ایجاد و منتشر شد.");
        navigate("/blog");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "خطا در ایجاد مقاله";
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

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="ایجاد مقاله جدید"
        subtitle="انتشار مقاله آموزشی با قالب و استایل‌های استاندارد"
        backTo="/blog"
      />

      <BlogForm
        formik={formik}
        isEdit={false}
        imagePreview={imagePreview}
        onImageSelect={handleImageSelect}
        isSubmitting={isSubmitting}
        submitLabel="انتشار مقاله"
        onCancel={() => navigate("/blog")}
      />
    </div>
  );
}
