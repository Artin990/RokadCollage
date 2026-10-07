/**
 * Helper to upload course icon if it's a File and format shared course fields.
 */
export async function prepareSharedCoursePayload(values, axiosInstance, isUpdate = false) {
  let finalIcon = values.icon;

  if (values.icon instanceof File) {
    const formData = new FormData();
    formData.append("file", values.icon);

    const uploadData = await axiosInstance.post("upload", formData);
    if (!uploadData || !uploadData.success) {
      throw new Error(uploadData?.message || "آپلود فایل آیکون با خطا مواجه شد");
    }
    finalIcon = uploadData.data;
  }

  const hasTimedDiscount =
    values.timedDiscount && Number(values.timedDiscount.percentage) > 0;

  const timedDiscountPayload = hasTimedDiscount
    ? {
        percentage: Number(values.timedDiscount.percentage),
        startDate: values.timedDiscount.startDate || null,
        endDate: values.timedDiscount.endDate || null,
      }
    : isUpdate
    ? {
        percentage: 0,
        startDate: null,
        endDate: null,
      }
    : undefined;

  const discountCodesPayload = Array.isArray(values.discountCodes)
    ? values.discountCodes
        .filter((d) => d.code && d.code.trim())
        .map((d) => ({
          ...(isUpdate && d._id ? { _id: d._id } : {}),
          code: d.code.trim().toUpperCase(),
          title: d.title?.trim() || "",
          percentage: Number(d.percentage) || 0,
          startDate: d.startDate || null,
          endDate: d.endDate || null,
          isActive: d.isActive !== false,
        }))
    : [];

  const teachersPayload = Array.isArray(values.teachers)
    ? values.teachers
        .map((t) => (typeof t === "object" ? t._id : t))
        .filter(Boolean)
    : [];

  const tagsPayload = Array.isArray(values.tags)
    ? values.tags
        .map((t) => (typeof t === "string" ? t.trim() : ""))
        .filter(Boolean)
    : [];

  const sprintsPayload = Array.isArray(values.sprints)
    ? values.sprints
        .filter((s) => s.title?.trim() && s.description?.trim())
        .map((s) => ({
          title: s.title.trim(),
          description: s.description.trim(),
        }))
    : [];

  const payload = {
    category: values.category,
    title: values.title?.trim() || "",
    duration: values.duration?.trim() || "",
    price: values.price !== "" && values.price != null ? Number(values.price) : 0,
    description: values.description?.trim() || "",
    tags: tagsPayload,
    icon: typeof finalIcon === "string" ? finalIcon.trim() : finalIcon,
    teachers: teachersPayload,
    discountCodes: discountCodesPayload,
    sprints: sprintsPayload,
  };

  if (timedDiscountPayload !== undefined) {
    payload.timedDiscount = timedDiscountPayload;
  }

  return payload;
}
