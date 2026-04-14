import React, { useEffect, useState } from "react";
import api from "../../api/axios.base";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [fetchLoading, setFetchLoading] = useState(true);

  const [form, setForm] = useState({
    name_en: "",
    name_ar: "",
    icon: "",
    slug: "",
  });

  // ================= GET CATEGORY =================
  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/${id}`);
        const cat = res.data.data.category;

        setForm({
          name_en: cat.name_en || "",
          name_ar: cat.name_ar || "",
          icon: cat.icon || "",
          slug: cat.slug || "",
        });
      } catch (err) {
        console.log(err);
        toast.error("فشل تحميل البيانات");
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ================= UPDATE =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await api.put(`/categories/${id}`, form);

      toast.success("تم تحديث التصنيف بنجاح");

      navigate("/admin/managecategories");
    } catch (err) {
      console.log(err);
      toast.error("فشل التحديث");
    } finally {
      setLoading(false);
    }
  };

  // ================= LOADING =================
  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p>جاري تحميل البيانات...</p>
      </div>
    );
  }

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">

      <h2 className="text-2xl font-bold mb-5 text-center">
        تعديل التصنيف
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
          placeholder="Slug"
          className="border p-2 rounded"
        />

        <input
          name="icon"
          value={form.icon}
          onChange={handleChange}
          placeholder="Icon URL"
          className="border p-2 rounded"
        />

        {/* Preview */}
        {form.icon && (
          <img
            src={form.icon}
            alt="preview"
            className="w-16 h-16 object-cover rounded mx-auto"
          />
        )}

        <button
          disabled={loading}
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "جاري التحديث..." : "تحديث التصنيف"}
        </button>

      </form>
    </div>
  );
}