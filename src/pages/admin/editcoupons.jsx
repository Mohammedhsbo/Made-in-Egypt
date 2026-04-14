import { useEffect, useState } from "react";
import api from "../../api/axios.base";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { useParams, useNavigate, Link } from "react-router-dom";

export default function EditCoupon() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    code: "",
    discountType: "percent",
    discountValue: "",
    minCartPrice: "",
    maxDiscountAmount: "",
    expireAt: "",
    usageLimit: "",
  });

  const getCoupon = async () => {
    try {
      const res = await api.get(`/coupons/${id}`);
      const c = res.data.data.coupon;

      setFormData({
        code: c.code || "",
        discountType: c.discountType || "percent",
        discountValue: c.discountValue || "",
        minCartPrice: c.minCartPrice || "",
        maxDiscountAmount: c.maxDiscountAmount || "",
        expireAt: c.expireAt ? c.expireAt.split("T")[0] : "",
        usageLimit: c.usageLimit || "",
      });
    } catch {
      toast.error("فشل تحميل الكوبون");
    }
  };

  useEffect(() => {
    getCoupon();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
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

      await api.patch(`/coupons/${id}`, payload);

      toast.success("تم تحديث الكوبون بنجاح");
      navigate("/admin/allcuppons");
    } catch (err) {
      toast.error("فشل تحديث الكوبون");
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6" dir="rtl">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-6">

        <div>
          <h1 className="text-2xl font-bold text-gray-800">
            تعديل الكوبون
          </h1>
          <p className="text-gray-500 text-sm">
            قم بتحديث بيانات الكوبون من هنا
          </p>
        </div>

        <Link to="/admin/allcuppons">
          <Button className="bg-black text-white hover:bg-gray-800">
            الرجوع لكل الكوبونات
          </Button>
        </Link>

      </div>

      {/* CARD */}
      <div className="max-w-3xl mx-auto bg-white shadow-xl rounded-2xl p-8">

        <form onSubmit={handleSubmit} className="space-y-6">

          {/* كود الكوبون */}
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

          {/* نوع الخصم */}
          <div>
            <label className="text-sm font-semibold text-gray-700">
              نوع الخصم
            </label>
            <select
              name="discountType"
              value={formData.discountType}
              onChange={handleChange}
              className="mt-2 w-full px-4 py-3 border rounded-xl"
            >
              <option value="percent">نسبة مئوية (%)</option>
              <option value="fixed">مبلغ ثابت</option>
            </select>
          </div>

          {/* قيمة الخصم */}
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

          {/* SUBMIT */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-black text-white py-3 rounded-xl hover:bg-gray-800 transition font-semibold"
          >
            {loading ? "جارٍ الحفظ..." : "حفظ التعديلات"}
          </button>

        </form>
      </div>
    </div>
  );
}