import { useEffect, useState } from "react";
import api from "../../api/axios.base";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import { Notebook, Trash2, Plus, Edit } from "lucide-react";

export default function Allcuppons() {
  const [allcuppons, setallcuppons] = useState([]);
  const [loading, setLoading] = useState(false);

  async function getAllcuppons() {
    setLoading(true);
    try {
      const res = await api.get("/coupons");
      setallcuppons(res.data.data.coupons);
    } catch (err) {
      console.log(err);
      toast.error("فشل تحميل الكوبونات");
    } finally {
      setLoading(false);
    }
  }

  async function deleteCoupon(id) {
    try {
      await api.delete(`/coupons/${id}`);
      setallcuppons((prev) => prev.filter((c) => c._id !== id));
      toast.success("تم حذف الكوبون");
    } catch (err) {
      console.log(err);
      toast.error("فشل الحذف");
    }
  }

  useEffect(() => {
    getAllcuppons();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-100 p-6">

      {/* HEADER PREMIUM */}
      <div className="flex items-center justify-between mb-6">

        <div>
          <h1 className="text-3xl font-bold text-gray-800">
            كوبونات الخصم
          </h1>
          <p className="text-gray-500 text-sm">
            إدارة الكوبونات والتحكم في العروض
          </p>
        </div>

        <Link to="/admin/create-cuppons">
          <Button className="bg-black text-white hover:bg-gray-800 flex items-center gap-2">
            <Plus className="w-4 h-4" />
            إضافة كوبون
          </Button>
        </Link>

      </div>

      {/* CARD */}
      <div className="bg-white/70 backdrop-blur-xl shadow-xl rounded-2xl overflow-hidden border border-gray-200">

        {/* LOADING */}
        {loading ? (
          <div className="p-10 text-center text-gray-500">
            جاري تحميل الكوبونات...
          </div>
        ) : (
          <table className="w-full text-sm">

            {/* HEADER */}
            <thead className="bg-gray-100/70 text-gray-600">
              <tr>
                <th className="p-4 text-right">الكود</th>
                <th className="p-4 text-right">القيمة</th>
                <th className="p-4 text-right">النوع</th>
                <th className="p-4 text-right">الاستخدام</th>
                <th className="p-4 text-right">الحالة</th>
                <th className="p-4 text-right">إجراءات</th>
              </tr>
            </thead>

            {/* BODY */}
            <tbody>
              {allcuppons.map((coupon, index) => (
                <tr
                  key={coupon._id}
                  className={`border-t hover:bg-gray-50 transition ${
                    index % 2 === 0 ? "bg-white" : "bg-gray-50/40"
                  }`}
                >

                  {/* CODE */}
                  <td className="p-4 font-bold text-gray-800">
                    {coupon.code}
                  </td>

                  {/* VALUE */}
                  <td className="p-4">
                    <span className="px-3 py-1 rounded-full bg-gray-100 text-gray-700">
                      {coupon.discountType === "percent"
                        ? `${coupon.discountValue}%`
                        : `${coupon.discountValue} EGP`}
                    </span>
                  </td>

                  {/* TYPE */}
                  <td className="p-4 text-gray-600">
                    {coupon.discountType === "percent"
                      ? "نسبة"
                      : "مبلغ"}
                  </td>

                  {/* USAGE */}
                  <td className="p-4 text-gray-600">
                    {coupon.usageCount} / {coupon.usageLimit || "∞"}
                  </td>

                  {/* STATUS */}
                  <td className="p-4">
                    {new Date(coupon.expireAt) > new Date() ? (
                      <span className="px-3 py-1 text-xs rounded-full bg-green-100 text-green-700">
                        نشط
                      </span>
                    ) : (
                      <span className="px-3 py-1 text-xs rounded-full bg-red-100 text-red-700">
                        منتهي
                      </span>
                    )}
                  </td>

                  {/* ACTIONS */}
                  <td className="p-4 flex gap-2">

                    {/* EDIT */}
                    <Link to={`/admin/edit-cuppons/${coupon._id}`}>
                      <Button 
                       className="bg-blue-50 text-blue-600 p-2 rounded hover:bg-blue-100 hover:text-blue-500"
                       >
                         <Edit size={16} />
                      </Button>
                    </Link>

                    {/* DELETE */}
                    <Button
                      onClick={() => deleteCoupon(coupon._id)}
                       className="bg-red-50 text-red-600 p-2 rounded hover:bg-red-100 hover:text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        )}

      </div>
    </div>
  );
}