import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/auth.context";
import api from "../../api/axios.base";

export default function Profile() {
  const { logout } = useAuth();

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  
  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        setUser(res.data.data.user);
        console.log(res.data.data.user);
      } catch (err) {
        console.error(err);
        setError("فشل تحميل بيانات المستخدم");
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, []);

  
  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

 
  if (loading) {
    return <p className="text-center mt-10">جاري التحميل...</p>;
  }


  if (error) {
    return <p className="text-red-500 text-center mt-10">{error}</p>;
  }

  return (
    <div dir="rtl" className="max-w-md mx-auto mt-10 p-6 shadow-lg rounded-xl bg-white">
      
      <h2 className="text-xl font-bold mb-4 text-center">
        الملف الشخصي
      </h2>

      {/* بيانات المستخدم */}
      <div className="flex flex-col gap-3 text-right bg-gray-50 p-4 rounded-lg">
        <p><strong>الاسم:</strong> {user?.name}</p>
        <p><strong>الإيميل:</strong> {user.email}</p>
        
      </div>

      {/* زر تسجيل الخروج */}
      <button
        onClick={handleLogout}
        className="w-full mt-5 bg-red-500 text-white py-2 rounded-lg hover:bg-red-600 transition"
      >
        تسجيل الخروج
      </button>
    </div>
  );
}