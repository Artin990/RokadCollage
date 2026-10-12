import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";

const MySwal = withReactContent(Swal);

/**
 * Modern, theme-aware confirmation dialog powered by SweetAlert2.
 * Supports both positional parameters and options object.
 */
export const confirm = async (
  titleOrOptions = "آیا اطمینان دارید؟",
  text = "این عملیات غیرقابل بازگشت است.",
  confirmText = "بله، انجام شود",
  icon = "warning",
  confirmColor = "#ef4444"
) => {
  let title = titleOrOptions;
  let cancelText = "انصراف";
  let isDestructive = true;

  if (typeof titleOrOptions === "object" && titleOrOptions !== null) {
    title = titleOrOptions.title || "آیا اطمینان دارید؟";
    text = titleOrOptions.text || "این عملیات غیرقابل بازگشت است.";
    confirmText = titleOrOptions.confirmText || "بله، انجام شود";
    cancelText = titleOrOptions.cancelText || "انصراف";
    icon = titleOrOptions.icon || "warning";
    confirmColor = titleOrOptions.confirmColor || (titleOrOptions.isDestructive !== false ? "#ef4444" : "#f8a41d");
    isDestructive = titleOrOptions.isDestructive !== false;
  }

  const result = await MySwal.fire({
    title: `<h3 class="font-black text-secondary text-sm sm:text-base md:text-lg mt-0.5 font-sans leading-snug">${title}</h3>`,
    html: text ? `<p class="text-text-secondary font-medium text-xs sm:text-sm mt-1 sm:mt-1.5 leading-relaxed font-sans px-1">${text}</p>` : "",
    icon: icon,
    iconColor: confirmColor,
    showCancelButton: true,
    confirmButtonColor: confirmColor,
    cancelButtonColor: "var(--color-bg-light, #f1f5f9)",
    confirmButtonText: `<span class="font-extrabold font-sans text-xs sm:text-sm text-white">${confirmText}</span>`,
    cancelButtonText: `<span class="font-bold font-sans text-xs sm:text-sm text-text-primary">${cancelText}</span>`,
    reverseButtons: true,
    focusCancel: true,
    buttonsStyling: false,
    width: "min(88vw, 24rem)",
    customClass: {
      popup: "!rounded-2xl sm:!rounded-3xl !p-3.5 sm:!p-6 !shadow-2xl !border !border-border !bg-surface font-sans !w-auto",
      icon: "!my-1",
      actions: "!gap-2 sm:!gap-3 !w-full !flex !items-center !justify-center !mt-3.5 sm:!mt-5 !m-0",
      confirmButton:
        `!flex-1 !font-bold !rounded-xl !px-3 sm:!px-5 !py-2 sm:!py-2.5 !shadow-sm !transition-all !outline-none !cursor-pointer font-sans text-xs sm:text-sm ${
          isDestructive ? "!bg-error hover:!bg-error-hover text-white" : "!bg-primary hover:!bg-primary-hover !text-on-primary"
        }`,
      cancelButton:
        "!flex-1 !font-bold !rounded-xl !px-3 sm:!px-5 !py-2 sm:!py-2.5 !border !border-border !bg-bg-light hover:!bg-surface-hover !transition-all !outline-none !cursor-pointer font-sans text-xs sm:text-sm text-text-primary",
    },
    showClass: {
      popup: "swal2-show animate-in fade-in zoom-in-95 duration-150",
    },
    hideClass: {
      popup: "swal2-hide animate-out fade-out zoom-out-95 duration-150",
    },
  });

  return Boolean(result.isConfirmed);
};

/**
 * Dedicated shorthand for delete actions.
 */
export const confirmDelete = async (itemName = "این مورد", customText = null) => {
  return confirm({
    title: `آیا از حذف «${itemName}» اطمینان دارید؟`,
    text: customText || "این مورد برای همیشه حذف خواهد شد و امکان بازگردانی آن وجود ندارد.",
    confirmText: "بله، حذف کن",
    cancelText: "انصراف",
    icon: "warning",
    confirmColor: "#ef4444",
    isDestructive: true,
  });
};

export default confirm;
