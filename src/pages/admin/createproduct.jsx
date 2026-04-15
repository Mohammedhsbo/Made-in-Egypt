import React, { useEffect, useState } from "react";
import api from "../../api/axios.base";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import SafeImage from "@/components/ui/safe-image";
import { formatImageUrl } from "@/utils/formatImageUrl";

export default function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(id);

  const [loading, setLoading] = useState(false);

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    basePrice: "",
    priceAfterDiscount: "",
    quantity: "",
    category: "",
    imageCover: "",
  });

 
  useEffect(() => {
    if (!isEdit) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.data.product;

        setForm({
          title_ar: p.title_ar || "",
          title_en: p.title_en || "",
          description_ar: p.description_ar || "",
          description_en: p.description_en || "",
          basePrice: p.basePrice || "",
          priceAfterDiscount: p.priceAfterDiscount || "",
          quantity: p.quantity || "",
          category: p.category?._id || "",
          imageCover:p.imageCover || "",
        });
      } catch (err) {
        console.log(err);
        toast.error("فشل تحميل المنتج");
      }
    };

    fetchProduct();
  }, [id, isEdit]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const value =
      e.target.name === "imageCover"
        ? formatImageUrl(e.target.value)
        : e.target.value;
    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      
      const payload = {
        title_ar: form.title_ar,
        title_en: form.title_en,
        description_ar: form.description_ar,
        description_en: form.description_en,
        basePrice: Number(form.basePrice),
        priceAfterDiscount: Number(form.priceAfterDiscount),
        quantity: Number(form.quantity),
        category: form.category,
        imageCover: formatImageUrl(form.imageCover),
      };

      if (isEdit) {
        await api.put(`/products/${id}`, payload);
        toast.success("تم تحديث المنتج بنجاح");
      } else {
        await api.post("/products", payload);
        toast.success("تم إنشاء المنتج بنجاح");
      }

      navigate("/admin");
    } catch (err) {
      console.log(err.response?.data || err.message);
      toast.error("حدث خطأ أثناء الحفظ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto p-6 bg-white shadow rounded-xl mt-10">

      <h2 className="text-2xl font-bold mb-5 text-center">
        {isEdit ? "تعديل المنتج" : "إضافة منتج جديد"}
      </h2>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input name="title_ar" value={form.title_ar} onChange={handleChange} placeholder="العنوان بالعربي" className="border p-2 rounded" />

        <input name="title_en" value={form.title_en} onChange={handleChange} placeholder="English Title" className="border p-2 rounded" />

        <textarea name="description_ar" value={form.description_ar} onChange={handleChange} placeholder="الوصف بالعربي" className="border p-2 rounded" />

        <textarea name="description_en" value={form.description_en} onChange={handleChange} placeholder="English Description" className="border p-2 rounded" />

        <input name="basePrice" value={form.basePrice} onChange={handleChange} type="number" placeholder="السعر الأساسي" className="border p-2 rounded" />

        <input name="priceAfterDiscount" value={form.priceAfterDiscount} onChange={handleChange} type="number" placeholder="بعد الخصم" className="border p-2 rounded" />

        <input name="quantity" value={form.quantity} onChange={handleChange} type="number" placeholder="الكمية" className="border p-2 rounded" />

        <input name="category" value={form.category} onChange={handleChange} placeholder="Category ID (ObjectId)" className="border p-2 rounded" />

        <input name="imageCover" value={form.imageCover} onChange={handleChange} placeholder="Image URL" className="border p-2 rounded" />

        {/* Preview */}
        {form.imageCover && (
          <SafeImage
            src={form.imageCover}
            alt="preview"
            className="w-32 h-32 object-cover rounded border"
          />
        )}

        <button
          disabled={loading}
          className="bg-black text-white py-2 rounded hover:bg-gray-800 transition"
        >
          {loading ? "جاري الحفظ..." : isEdit ? "تحديث المنتج" : "إنشاء المنتج"}
        </button>

      </form>
      
      <div>
       
      </div>
    </div>
  );
}