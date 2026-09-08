/**
 * ============================================================================
 * sweetAlert.ts - Luxury Toast and Notification Engine for KIXORA
 * ============================================================================
 * Provides customized SweetAlert2 modals, floating toasts, and confirmation
 * dialogs styled to match KIXORA luxury aesthetics (dark accents, clean typography).
 */

import Swal, { type SweetAlertOptions } from "sweetalert2";

// Luxury Dark Toast Configuration
const Toast = Swal.mixin({
  toast: true,
  position: "top-end",
  showConfirmButton: false,
  timer: 3000,
  timerProgressBar: true,
  background: "#09090b",
  color: "#ffffff",
  customClass: {
    popup: "kixora-luxury-toast",
  },
  didOpen: (toast) => {
    toast.addEventListener("mouseenter", Swal.stopTimer);
    toast.addEventListener("mouseleave", Swal.resumeTimer);
  },
});

/**
 * Display a floating top-right luxury success toast.
 * @param title - Notification message
 * @param duration - Timer duration in milliseconds (default 3000ms)
 */
export const sweetTopSuccessAlert = async (title: string, duration: number = 2800) => {
  return Toast.fire({
    icon: "success",
    title,
    timer: duration,
    iconColor: "#10b981",
  });
};

/**
 * Display a floating top-right luxury info or cart toast.
 * @param title - Notification message
 * @param duration - Timer duration in milliseconds
 */
export const sweetTopSmallSuccessAlert = async (title: string, duration: number = 2500) => {
  return Toast.fire({
    icon: "success",
    title,
    timer: duration,
    iconColor: "#eab308",
  });
};

/**
 * Display a floating error toast.
 * @param message - Error message to present
 */
export const sweetErrorAlert = async (message: string) => {
  return Toast.fire({
    icon: "error",
    title: message || "An unexpected error occurred",
    timer: 3500,
    iconColor: "#ef4444",
  });
};

/**
 * Display a luxury confirmation modal before destructive actions (e.g. Emptying Bag).
 * @param title - Dialog title
 * @param text - Explanatory text
 * @param confirmButtonText - Action button label
 */
export const sweetConfirmAlert = async (
  title: string,
  text: string,
  confirmButtonText: string = "Yes, proceed"
): Promise<boolean> => {
  const result = await Swal.fire({
    title,
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonText,
    cancelButtonText: "Cancel",
    background: "#09090b",
    color: "#ffffff",
    confirmButtonColor: "#111827",
    cancelButtonColor: "#374151",
    customClass: {
      popup: "kixora-luxury-modal",
      confirmButton: "kixora-btn-confirm",
      cancelButton: "kixora-btn-cancel",
    },
  });

  return result.isConfirmed;
};

export default Swal;
