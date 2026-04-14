import React, { useState } from "react";
import api from "../../api/axios.base";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

export default function Managecuppons() {
  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minCartPrice: "",
    maxDiscountAmount: "",
    expireAt: "",
    usageLimit: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handeSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        ...formData,
        discountValue: Number(formData.discountValue),
        minCartPrice: Number(formData.minCartPrice),
        maxDiscountAmount: Number(formData.maxDiscountAmount),
        usageLimit: Number(formData.usageLimit),
        expireAt: formData.expireAt
          ? new Date(formData.expireAt).toISOString()
          : null,
      };

      await api.post("/coupons", payload);

      toast.success("تم إضافة الكوبون بنجاح");

      setFormData({
        code: "",
        discountType: "percent",
        discountValue: "",
        minCartPrice: "",
        maxDiscountAmount: "",
        expireAt: "",
        usageLimit: "",
      });
    } catch (error) {
      toast.error(error?.response?.data?.message || "حدث خطأ");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6" dir="rtl">

      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            إدارة الكوبونات
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            إنشاء وإدارة كوبونات الخصم بسهولة
          </p>
        </div>

        <Link to="/admin/allcuppons">
          <Button className="bg-black text-white hover:bg-gray-800 px-5 py-2 rounded-xl">
            كل الكوبونات
          </Button>
        </Link>

      </div>

      {/* CARD */}
      <div className="max-w-3xl mx-auto bg-white/80 backdrop-blur-xl shadow-2xl rounded-2xl p-8 border border-gray-200">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-800">
            إنشاء كوبون جديد
          </h2>
          <p className="text-gray-500 text-sm">
            أدخل بيانات الكوبون بشكل صحيح
          </p>
        </div>

        <form onSubmit={handeSubmit} className="space-y-6">

          {/* CODE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              كود الكوبون
            </label>
            <input
              name="code"
              value={formData.code}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  code: e.target.value.toUpperCase(),
                })
              }
              placeholder="مثال: SALE20"
              className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black outline-none"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              نوع الخصم
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl focus:ring-2 focus:ring-black"
            >
              <option value="percent">نسبة مئوية (%)</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </div>

          {/* VALUE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              قيمة الخصم
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="20"
              className="mt-2 w-full px-4 py-3 border rounded-xl"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-semibold text-gray-700">
                أقل قيمة للسلة
              </label>
              <input
                type="number"
                name="minCartPrice"
                value={formData.minCartPrice}
                onChange={handleChange}
                placeholder="100"
                className="mt-2 w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                أقصى خصم
              </label>
              <input
                type="number"
                name="maxDiscountAmount"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                placeholder="50"
                className="mt-2 w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                تاريخ الانتهاء
              </label>
              <input
                type="date"
                name="expireAt"
                value={formData.expireAt}
                onChange={handleChange}
                className="mt-2 w-full px-4 py-3 border rounded-xl"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                حد الاستخدام
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="100"
                className="mt-2 w-full px-4 py-3 border rounded-xl"
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
          >
            {loading ? "جارٍ الإنشاء..." : "إنشاء الكوبون"}
          </button>

        </form>
      </div>
    </div>
  );
}