import React, { useState, useEffect } from "react";
import { useFormik } from "formik";
import Notify from "../../Utils/notify";
import { Button, PageHeader, Card, LoadingState } from "../../Components/UI";
import BasicMetaSection from "./components/BasicMetaSection";
import OpenGraphSection from "./components/OpenGraphSection";
import TwitterCardSection from "./components/TwitterCardSection";
import { seoSchema } from "./schemas/seoSchema";
import { fetchSeo, updateSeo } from "./api/seoApi";

export default function SeoSettings() {
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [initialValues, setInitialValues] = useState({
    title: "",
    description: "",
    keywords: "",
    robots: "index, follow",
    canonicalUrl: "",
    ogTitle: "",
    ogDescription: "",
    ogImage: "",
    ogType: "website",
    twitterCard: "summary_large_image",
    twitterTitle: "",
    twitterDescription: "",
    twitterImage: "",
  });

  useEffect(() => {
    const loadSeo = async () => {
      setLoading(true);
      try {
        const response = await fetchSeo();
        const data = response?.data || response;

        if (data) {
          setInitialValues({
            title: data.title || "",
            description: data.description || "",
            keywords: Array.isArray(data.keywords)
              ? data.keywords.join(", ")
              : data.keywords || "",
            robots: data.robots || "index, follow",
            canonicalUrl: data.canonicalUrl || "",
            ogTitle: data.ogTitle || "",
            ogDescription: data.ogDescription || "",
            ogImage: data.ogImage || "",
            ogType: data.ogType || "website",
            twitterCard: data.twitterCard || "summary_large_image",
            twitterTitle: data.twitterTitle || "",
            twitterDescription: data.twitterDescription || "",
            twitterImage: data.twitterImage || "",
          });
        }
      } catch (error) {
        Notify.error(error.message || "خطا در دریافت اطلاعات سئو");
      } finally {
        setLoading(false);
      }
    };

    loadSeo();
  }, []);

  const formik = useFormik({
    enableReinitialize: true,
    initialValues,
    validationSchema: seoSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      try {
        const payload = {
          ...values,
          keywords: values.keywords
            ? values.keywords.split(",").map((k) => k.trim()).filter(Boolean)
            : [],
        };

        const response = await updateSeo(payload);

        if (response && response.success !== false) {
          Notify.success("تنظیمات سئو با موفقیت به‌روزرسانی شد.");
        } else {
          Notify.error(response?.message || "خطا در به‌روزرسانی تنظیمات سئو");
        }
      } catch (error) {
        Notify.error(error.message || "خطا در برقراری ارتباط با سرور");
      } finally {
        setIsSubmitting(false);
      }
    },
  });

  if (loading) {
    return (
      <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col justify-center">
        <LoadingState text="در حال دریافت تنظیمات سئو..." minHeight="min-h-[440px]" />
      </div>
    );
  }

  return (
    <div dir="rtl" className="p-3.5 sm:p-5 md:p-6 lg:p-8 pb-4 sm:pb-6 lg:pb-8 w-full bg-background min-h-full flex flex-col">
      <PageHeader
        title="تنظیمات سئو (SEO)"
        subtitle="مدیریت متاتگ‌های عمومی وب‌سایت، تنظیمات شبکه‌های اجتماعی Open Graph و کارت‌های توییتر"
      />

      <Card className="p-4 sm:p-6 md:p-8 max-w-5xl mx-auto shadow-xs">
        <form onSubmit={formik.handleSubmit} className="flex flex-col gap-8">
          <BasicMetaSection formik={formik} />
          <OpenGraphSection formik={formik} />
          <TwitterCardSection formik={formik} />

          <div className="flex justify-end pt-5 border-t border-border/80">
            <Button
              type="submit"
              variant="primary"
              size="md"
              loading={isSubmitting}
            >
              ذخیره تنظیمات سئو
            </Button>
          </div>
        </form>
      </Card>
    </div>
  );
}
