/**
 * Unified Persian labels and vocabulary dictionary for RokadCollage Admin.
 * Enforces consistency across all headers, toolbars, buttons, and state indicators.
 */
export const VOCAB = {
  // Actions
  add: "افزودن",
  edit: "ویرایش",
  delete: "حذف",
  refresh: "تازه‌سازی",
  search: "جستجو...",
  save: "ذخیره تغییرات",
  cancel: "انصراف",
  close: "بستن",
  back: "بازگشت",
  publish: "انتشار مقاله",
  submit: "ثبت اطلاعات",
  confirm: "تأیید",
  retry: "تلاش مجدد",

  // States
  loading: "در حال بارگذاری اطلاعات...",
  empty: "موردی برای نمایش یافت نشد.",
  error: "خطا در برقراری ارتباط با سرور",
  noResults: "نتیجه‌ای برای جستجوی شما یافت نشد.",

  // Confirmations
  deleteConfirmTitle: "آیا از حذف این مورد اطمینان دارید؟",
  deleteConfirmDesc: "این عملیات غیرقابل بازگشت است.",
  deleteButtonLabel: "بله، حذف کن",
};

export const LABELS = {
  // Uppercase constants
  ADD: VOCAB.add,
  EDIT: VOCAB.edit,
  DELETE: VOCAB.delete,
  REFRESH: VOCAB.refresh,
  SEARCH: VOCAB.search,
  SAVE: VOCAB.save,
  CANCEL: VOCAB.cancel,
  CLOSE: VOCAB.close,
  BACK: VOCAB.back,
  PUBLISH: VOCAB.publish,
  SUBMIT: VOCAB.submit,
  CONFIRM: VOCAB.confirm,
  RETRY: VOCAB.retry,

  // Lowercase aliases for convenience
  ...VOCAB,
};

export default VOCAB;
