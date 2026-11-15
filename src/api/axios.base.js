import axios from "axios";
import { toast } from "sonner";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL, 
  headers: {
    "Content-Type": "application/json",
  },
});


api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const getApiErrorMessage = (error) => {
  const status = error.response?.status;
  const isArabic = document.documentElement.lang === "ar";
  if (status === 401) return isArabic ? "انتهت الجلسة. يرجى تسجيل الدخول مرة أخرى." : "Your session has expired. Please sign in again.";
  if (status === 403) return isArabic ? "ليس لديك صلاحية لتنفيذ هذا الإجراء." : "You do not have permission to perform this action.";
  if (status === 413) return isArabic ? "حجم الملف أكبر من الحد المسموح." : "The uploaded file exceeds the allowed size.";
  if (status >= 500) return isArabic ? "حدث خطأ في الخادم. يرجى المحاولة مرة أخرى." : "A server error occurred. Please try again.";
  if (!error.response) return isArabic ? "تعذر الاتصال بالخادم. تحقق من اتصالك وحاول مرة أخرى." : "Could not connect to the server. Check your connection and try again.";

  const message = error.response.data?.message;
  if (typeof message === "string" && message.trim()) return message.trim();
  return isArabic ? "تعذر إكمال الطلب. حاول مرة أخرى." : "The request could not be completed. Please try again.";
};

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const config = error.config;
    window.setTimeout(() => {
      if (config?.__handledByPageToast) return;
      const message = getApiErrorMessage(error);
      toast.error(message, { id: `api-error:${error.response?.status || "network"}:${message}` });
    }, 0);
    return Promise.reject(error);
  },
);

export const markApiErrorHandled = (error) => {
  if (error?.config) error.config.__handledByPageToast = true;
};

export default api;