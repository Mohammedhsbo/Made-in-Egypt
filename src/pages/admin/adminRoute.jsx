import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";
import { useLanguage } from "@/context/language.context";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();
  const { t } = useLanguage();

  if (loading) return <div className="flex items-center justify-center h-screen">
    <p>{t("جاري التحميل")}</p>
  </div>;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
}