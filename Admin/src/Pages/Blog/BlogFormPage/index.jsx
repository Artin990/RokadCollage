import React, { useState } from "react";
import { useFormik } from "formik";
import { useNavigate } from "react-router-dom";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Notify from "../../../Utils/notify";
import { getImageUrl } from "../../../Utils/getImageUrl";
import { Button, PageHeader, Card } from "../../../Components/UI";
import BlogBasicInfoSection from "../components/BlogBasicInfoSection";
import BlogCoverField from "../components/BlogCoverField";
import BlogContentEditor from "../components/BlogContentEditor";
import useBlogPreview from "../hooks/useBlogPreview";
import {
  blogValidationSchema,
  blogUpdateSchema,
} from "../schemas/blogSchema";
import {
  createBlog,
  updateBlog,
  uploadBlogCover,
} from "../api/blogApi";

/**
 * Orchestrator form page for creating or editing blog articles.
 */
export default function BlogFormPage({
  mode = "create",
  initialData = null,
  blogId = null,
}) {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isEdit = mode === "edit";

  const [imagePreview, setImagePreview] = useState(() => {
    return initialData?.img ? getImageUrl(initialData.img) : null;
  });

  const previewHook = useBlogPreview();
  const { lastPreviewedContent } = previewHook;

  const formik = useFormik({
    enableReinitialize: true,
    initialValues: {
      category: initialData?.category || "",
      title: initialData?.title || "",
      description: initialData?.description || "",
      content: initialData?.content || "",
      img: initialData?.img || null,
    },
    validationSchema: isEdit ? blogUpdateSchema : blogValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        let finalImageName = values.img;

        // Upload file if new image was picked
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

        if (isEdit) {
          await updateBlog(blogId, payload);
          Notify.success("تغییرات مقاله با موفقیت ذخیره شد.");
        } else {
          await createBlog(payload);
          Notify.success("مقاله با موفقیت ایجاد و منتشر شد.");
        }

        navigate("/blog");
      } catch (error) {
        const errorMsg =
          error.response?.data?.message ||
          error.message ||
          "خطا در ثبت مقاله";
        Notify.error(errorMsg);
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  const handleImageSelect = (file) => {
    formik.setFieldValue("img", file);
    setImagePreview(URL.createObjectURL(file));
  };

  const currentContent = formik.values.content || "";
  const isContentUnpreviewed =
    currentContent.trim().length > 0 &&
    currentContent.trim() !== (lastPreviewedContent || "").trim();

  return (
    <div dir="rtl" className="p-6 md:p-8 w-full bg-background min-h-screen">
      <PageHeader
        title={isEdit ? "ویرایش مقاله بلاگ" : "افزودن بلاگ جدید"}
        subtitle={
          isEdit
            ? "ویرایش مشخصات، محتوای HTML و پیش‌نمایش زنده پیش از ذخیره"
            : "نگارش و انتشار مقاله جدید به همراه ویرایشگر HTML و پیش‌نمایش امن"
        }
        backTo="/blog"
      />

      <Card className="p-6 md:p-8 max-w-5xl mx-auto shadow-xs">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
          {/* Metadata Section */}
          <BlogBasicInfoSection formik={formik} />

          {/* Cover Image Upload */}
          <div className="pt-2 border-t border-border/80">
            <BlogCoverField
              imagePreview={imagePreview}
              onImageSelect={handleImageSelect}
              error={formik.touched.img && formik.errors.img}
            />
          </div>

          {/* HTML Content & Sandboxed Preview Tabs */}
          <div className="pt-2 border-t border-border/80">
            <label className="text-xs md:text-sm font-semibold text-text-primary block mb-3">
              محتوای مقاله (ویرایشگر کد HTML و پیش‌نمایش) *
            </label>
            <BlogContentEditor
              value={formik.values.content}
              onChange={(val) => formik.setFieldValue("content", val)}
              error={formik.touched.content && formik.errors.content}
              previewHook={previewHook}
              previewMetadata={{
                title: formik.values.title,
                category: formik.values.category,
                description: formik.values.description,
                imagePreview,
              }}
            />
          </div>

          {/* Action Bar */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 border-t border-border/80">
            <div>
              {isContentUnpreviewed && (
                <div className="flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-3 py-1.5 rounded-lg border border-amber-200/80">
                  <InfoOutlinedIcon style={{ fontSize: 16 }} />
                  <span>پیش‌نمایش این نسخه از محتوا را ندیده‌اید.</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="outline"
                size="md"
                onClick={() => navigate("/blog")}
                disabled={isSubmitting}
              >
                انصراف
              </Button>

              <Button
                type="submit"
                variant="primary"
                size="md"
                isLoading={isSubmitting}
              >
                {isEdit ? "ذخیره تغییرات" : "انتشار مقاله"}
              </Button>
            </div>
          </div>
        </form>
      </Card>
    </div>
  );
}
