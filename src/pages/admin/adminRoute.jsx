import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/auth.context";

export default function AdminRoute({ children }) {
  const { user, loading } = useAuth();

  if (loading) return <div className="flex items-center justify-center h-screen">
    <p>جاري التحميل</p>
  </div>;

  if (!user) return <Navigate to="/login" />;

  if (user.role !== "admin") return <Navigate to="/" />;

  return children;
}