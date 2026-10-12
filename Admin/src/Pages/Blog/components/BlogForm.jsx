import React, { useState } from "react";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import DesktopWindowsOutlinedIcon from "@mui/icons-material/DesktopWindowsOutlined";
import PhoneIphoneOutlinedIcon from "@mui/icons-material/PhoneIphoneOutlined";

import { Button, Card, Tabs, SegmentedControl } from "../../../Components/UI";
import BlogBasicInfoSection from "./BlogBasicInfoSection";
import BlogCoverField from "./BlogCoverField";
import BlogContentEditor from "./BlogContentEditor";
import ClientBlogArticleView from "./ClientBlogArticleView";

/**
 * Reusable Blog Form Component
 * Used across CreateBlog and UpdateBlog pages.
 * Supports switching between form editing and live client article preview
 * with responsive desktop / mobile device simulation.
 */
export default function BlogForm({
  formik,
  isEdit = false,
  imagePreview = null,
  onImageSelect,
  isSubmitting = false,
  submitLabel = isEdit ? "ذخیره تغییرات" : "انتشار مقاله",
  onCancel,
}) {
  const [activeTab, setActiveTab] = useState("form"); // 'form' | 'preview'
  const [viewportMode, setViewportMode] = useState(() =>
    typeof window !== "undefined" && window.innerWidth < 768 ? "mobile" : "desktop"
  );

  return (
    <div className="flex flex-col gap-6 max-w-5xl mx-auto">
      {/* Top Tab Switcher */}
      <Card className="p-3 sm:p-4 shadow-xs">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          <Tabs
            tabs={[
              {
                id: "form",
                key: "form",
                label: "فرم و ویرایش مقاله",
                icon: <EditOutlinedIcon fontSize="small" />,
              },
              {
                id: "preview",
                key: "preview",
                label: "پیش‌نمایش صفحه کلاینت",
                icon: <VisibilityOutlinedIcon fontSize="small" />,
              },
            ]}
            activeTab={activeTab}
            onChange={setActiveTab}
          />

          {/* Device switcher in preview mode */}
          {activeTab === "preview" && (
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
          )}
        </div>
      </Card>

      {/* Tab 1: Form & HTML Editor */}
      <div className={activeTab === "form" ? "block" : "hidden"}>
        <Card className="p-4 sm:p-6 md:p-8 shadow-xs">
          <form onSubmit={formik.handleSubmit} className="flex flex-col gap-6">
            {/* Metadata Section */}
            <BlogBasicInfoSection formik={formik} />

            {/* Cover image upload */}
            <div className="pt-2 border-t border-border/80">
              <BlogCoverField
                imagePreview={imagePreview}
                onImageSelect={onImageSelect}
                error={formik.touched.img && formik.errors.img}
              />
            </div>

            {/* HTML Code Editor */}
            <div className="pt-4 border-t border-border/80 flex flex-col gap-3">
              <div>
                <h4 className="font-bold text-secondary text-sm md:text-base">
                  محتوای کامل مقاله (کد HTML)
                </h4>
                <p className="text-xs text-text-muted mt-0.5">
                  کد HTML مقاله را وارد یا پیست کنید. برای مشاهده چیدمان، به تب «پیش‌نمایش صفحه کلاینت» بروید.
                </p>
              </div>

              <BlogContentEditor
                value={formik.values.content}
                onChange={(val) => formik.setFieldValue("content", val)}
                error={formik.touched.content && formik.errors.content}
              />
            </div>

            {/* Form Actions */}
            <div className="flex items-center justify-end pt-5 border-t border-border/80 gap-3">
              {onCancel && (
                <Button
                  type="button"
                  variant="secondary"
                  size="md"
                  onClick={onCancel}
                  disabled={isSubmitting}
                >
                  انصراف
                </Button>
              )}

              <Button
                type="submit"
                variant="primary"
                size="md"
                loading={isSubmitting}
              >
                {submitLabel}
              </Button>
            </div>
          </form>
        </Card>
      </div>

      {/* Tab 2: Live Client Presentation Preview */}
      {activeTab === "preview" && (
        <div className="flex flex-col gap-6 animate-fadeIn">
          {/* Top Actions Floating/Sticky Bar in Preview */}
          <div className="bg-surface p-4 rounded-2xl border border-border shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-secondary">
                پیش‌نمایش زنده صفحه کلاینت:
              </span>
              <span className="text-xs text-text-muted">
                {viewportMode === "desktop"
                  ? "نمایش دسکتاپ (عرض کامل)"
                  : "نمایش موبایل (شبیه‌ساز گوشی)"}
              </span>
            </div>

            <div className="flex items-center gap-3 w-full sm:w-auto justify-end">
              <Button
                type="button"
                variant="secondary"
                size="sm"
                icon={<EditOutlinedIcon fontSize="small" />}
                onClick={() => setActiveTab("form")}
              >
                ادامه ویرایش فرم
              </Button>

              <Button
                type="button"
                variant="primary"
                size="sm"
                loading={isSubmitting}
                onClick={formik.handleSubmit}
              >
                {submitLabel}
              </Button>
            </div>
          </div>

          {/* Renders exact Client Article View */}
          <ClientBlogArticleView
            title={formik.values.title}
            category={formik.values.category}
            description={formik.values.description}
            content={formik.values.content}
            img={imagePreview || formik.values.img}
            createdAt={new Date()}
            viewportMode={viewportMode}
            onViewportChange={setViewportMode}
            isLiveDraft={true}
          />
        </div>
      )}
    </div>
  );
}
