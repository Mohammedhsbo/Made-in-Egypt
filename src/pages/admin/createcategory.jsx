import React, { useState } from "react";
import api from "../../api/axios.base";
import { toast } from "sonner";
import { Navigate } from "react-router-dom";

export default function CreateCategory() {
  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    icon: "",
    slug: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.post("/categories", form);

      toast.success("تم إنشاء التصنيف بنجاح");

      setForm({
        name_en: "",
        name_ar: "",
        icon: "",
        slug: "",
      });
        
    } catch (err) {
      console.log(err);
      toast.error("فشل إنشاء التصنيف");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">

      <h2 className="text-2xl font-bold mb-5 text-center">
        إضافة تصنيف جديد
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4 text-right">

        <input
          name="name_ar"
          value={form.name_ar}
          onChange={handleChange}
          placeholder="الاسم بالعربي"
          className="border p-2 rounded"
        />

        <input
          name="name_en"
          value={form.name_en}
          onChange={handleChange}
          placeholder="English name"
          className="border p-2 rounded"
        />

        <input
          name="slug"
          value={form.slug}
          onChange={handleChange}
          placeholder="Slug (example: clothes)"
          className="border p-2 rounded"
        />

        <input
          name="icon"
          value={form.icon}
          onChange={handleChange}
          placeholder="Icon URL"
          className="border p-2 rounded"
        />

        <button
          disabled={loading}
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "جاري الإنشاء..." : "إنشاء التصنيف"}
        </button>
 
      </form>
      
    </div>
  );
}