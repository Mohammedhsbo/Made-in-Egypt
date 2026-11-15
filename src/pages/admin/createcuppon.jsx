import React, { useState } from "react";
import api, { markApiErrorHandled } from "../../api/axios.base";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/language.context";

export default function Managecuppons() {
  const { t } = useLanguage();
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

      toast.success(t("تم إضافة الكوبون بنجاح"));

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
      markApiErrorHandled(error);
      toast.error(error?.response?.data?.message || t("حدث خطأ"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-page">

      {/* HEADER */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">

        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{t("Store catalog")}</p>
          <h1 className="mt-1">
            {t("إدارة الكوبونات")}
          </h1>
          <p className="mt-2 text-sm text-slate-500">
            {t("إنشاء وإدارة كوبونات الخصم بسهولة")}
          </p>
        </div>

        <Link to="/admin/allcuppons">
          <Button className="h-11 rounded-xl bg-[var(--primary)] px-4 font-bold text-white shadow-sm hover:brightness-110">
            {t("كل الكوبونات")}
          </Button>
        </Link>

      </div>

      {/* CARD */}
      <div className="mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(27,52,43,0.07)] sm:p-8">

        {/* TITLE */}
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-slate-900">
            {t("إنشاء كوبون جديد")}
          </h2>
          <p className="text-sm text-slate-500">
            {t("أدخل بيانات الكوبون بشكل صحيح")}
          </p>
        </div>

        <form onSubmit={handeSubmit} className="space-y-6">

          {/* CODE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              {t("كود الكوبون")}
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
              placeholder={t("مثال: SALE20")}
              className="mt-2 w-full border px-4 py-3"
            />
          </div>

          {/* TYPE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              {t("نوع الخصم")}
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="mt-2 w-full border px-4 py-3"
            >
              <option value="percent">{t("نسبة مئوية (%)")}</option>
              <option value="fixed">{t("مبلغ ثابت")}</option>
            </select>
          </div>

          {/* VALUE */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              {t("قيمة الخصم")}
            </label>
            <input
              type="number"
              name="discountValue"
              value={formData.discountValue}
              onChange={handleChange}
              placeholder="20"
              className="mt-2 w-full border px-4 py-3"
            />
          </div>

          {/* GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("أقل قيمة للسلة")}
              </label>
              <input
                type="number"
                name="minCartPrice"
                value={formData.minCartPrice}
                onChange={handleChange}
                placeholder="100"
                className="mt-2 w-full border px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("أقصى خصم")}
              </label>
              <input
                type="number"
                name="maxDiscountAmount"
                value={formData.maxDiscountAmount}
                onChange={handleChange}
                placeholder="50"
                className="mt-2 w-full border px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("تاريخ الانتهاء")}
              </label>
              <input
                type="date"
                name="expireAt"
                value={formData.expireAt}
                onChange={handleChange}
                className="mt-2 w-full border px-4 py-3"
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-gray-700">
                {t("حد الاستخدام")}
              </label>
              <input
                type="number"
                name="usageLimit"
                value={formData.usageLimit}
                onChange={handleChange}
                placeholder="100"
                className="mt-2 w-full border px-4 py-3"
              />
            </div>

          </div>

          {/* BUTTON */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-[var(--primary)] py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? t("جارٍ الإنشاء...") : t("إنشاء الكوبون")}
          </button>

        </form>
      </div>
    </div>
  );
}