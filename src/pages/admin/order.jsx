import { useEffect, useState } from "react";
import api from "@/api/axios.base";
import { useSearch } from "@/context/searchContext";
import {
  Search,
  ShoppingCart,
  Eye,
  ArrowLeft,
  CalendarCheck,
  Package,
  AlertTriangle,
  ChevronDown,
  MapPin,
  CreditCard,
} from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";
import { useNavigate, useParams } from "react-router-dom";


const STATUS_CONFIG = {
  pending: {
    label: "قيد الانتظار",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "جاري التجهيز",
    classes: "bg-emerald-50 text-emerald-800 border-emerald-200",
  },
  shipped: {
    label: "تم الشحن",
    classes: "bg-purple-50 text-purple-700 border-purple-200",
  },
  delivered: {
    label: "تم التسليم",
    classes: "bg-green-50 text-green-700 border-green-200",
  },
  cancelled: {
    label: "ملغي",
    classes: "bg-red-50 text-red-700 border-red-200",
  },
};

const ALL_STATUSES = Object.keys(STATUS_CONFIG);

function StatusBadge({ status }) {
  const { t } = useLanguage();
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    classes: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${cfg.classes}`}
    >
      {t(cfg.label)}
    </span>
  );
}

export function OrderDetailsPage() {
  const { t, isArabic } = useLanguage();
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data?.data?.order || res.data?.data || res.data);
      } catch (err) {
        setError(t("Failed to load order details."));
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId, t]);

  return (
    <div className="admin-page mx-auto w-full max-w-5xl">
      <header className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 shadow-sm transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-900"
          >
            <ArrowLeft size={17} className={isArabic ? "rotate-180" : ""} />
            {t("Orders")}
          </button>
          <h1 className="mt-4">{t("Order Details")}</h1>
          <p className="mt-1 text-sm text-slate-500" dir="ltr">
            #{(order?._id || orderId)?.slice(-8).toUpperCase()}
          </p>
        </div>
        {order && <StatusBadge status={order.status} />}
      </header>
      {loading ? (
        <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3">
          <div className="h-10 w-10 animate-spin rounded-full border-b-2 border-primary" />
          <p className="text-sm text-gray-500">{t("Loading order details...")}</p>
        </div>
      ) : error ? (
        <div className="flex min-h-[35vh] flex-col items-center justify-center gap-3 rounded-2xl border border-rose-100 bg-white p-8 text-center text-rose-600">
          <AlertTriangle size={36} />
          <p className="font-semibold">{error}</p>
          <button
            type="button"
            onClick={() => navigate("/admin/orders")}
            className="mt-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"
          >
            {t("Orders")}
          </button>
        </div>
      ) : order ? (
        <div className="space-y-5">
          <section className="grid gap-3 sm:grid-cols-2">
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">{t("Payment method")}</p>
                <p className="font-bold text-slate-800">
                  {order.paymentMethod === "cash"
                    ? t("نقداً عند الاستلام")
                    : order.paymentMethod === "card"
                      ? t("بطاقة")
                      : order.paymentMethod || "—"}
                </p>
              </div>
              <CreditCard size={22} className="text-emerald-800/60" />
            </div>
            <div className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div>
                <p className="mb-1 text-xs font-semibold text-slate-500">{t("Order date")}</p>
                <p className="font-bold text-slate-800">
                  {order.createdAt
                    ? new Date(order.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US")
                    : "—"}
                </p>
              </div>
              <CalendarCheck size={22} className="text-emerald-800/60" />
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <div className="mb-4 flex items-center gap-2">
              <MapPin size={19} className="text-emerald-800" />
              <h2 className="font-bold text-slate-800">{t("Shipping information")}</h2>
            </div>
            <div className="grid gap-4 text-sm sm:grid-cols-2">
              <p>
                <span className="text-slate-500">{t("الاسم:")}</span>{" "}
                <span className="font-semibold text-slate-800">{order.shippingAddress?.fullName || "—"}</span>
              </p>
              <p>
                <span className="text-slate-500">{t("الهاتف:")}</span>{" "}
                <span className="font-semibold text-slate-800" dir="ltr">{order.shippingAddress?.phone || "—"}</span>
              </p>
              <p>
                <span className="text-slate-500">{t("العنوان:")}</span>{" "}
                <span className="font-semibold text-slate-800">
                  {[order.shippingAddress?.address, order.shippingAddress?.city].filter(Boolean).join(" – ") || "—"}
                </span>
              </p>
              <p>
                <span className="text-slate-500">{t("الرمز البريدي:")}</span>{" "}
                <span className="font-semibold text-slate-800">{order.shippingAddress?.postalCode || "—"}</span>
              </p>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
            <h2 className="mb-4 font-bold text-slate-800">
              {t("Products")} ({order.items?.length || 0})
            </h2>
            <div className="space-y-3">
              {(order.items || []).map((item, idx) => (
                <div
                  key={item._id || idx}
                  className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50/80 p-3 sm:gap-4"
                >
                  <SafeImage
                    src={item.product}
                    alt={item.product?.title_ar || item.product?.title_en || ""}
                    className="h-14 w-14 shrink-0 rounded-xl border border-gray-100 bg-white object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="line-clamp-2 font-bold text-slate-800">
                      {isArabic
                        ? item.product?.title_ar || item.product?.title_en
                        : item.product?.title_en || item.product?.title_ar}
                    </p>
                    <p className="mt-0.5 text-xs text-gray-500">
                      {t("الكمية:")} {item.quantity}
                    </p>
                  </div>
                  <p className="shrink-0 text-sm font-bold text-primary">
                    {(
                      (Number(item.product?.priceAfterDiscount) ||
                        Number(item.product?.basePrice) ||
                        Number(item.price) ||
                        0) * (Number(item.quantity) || 0)
                    ).toFixed(2)}{" "}
                    EGP
                  </p>
                </div>
              ))}
            </div>
          </section>

          <div className="flex items-center justify-between gap-4 rounded-2xl bg-slate-900 px-5 py-4 text-white sm:px-6">
            <span className="font-bold">{t("Order total")}</span>
            <span className="text-xl font-black sm:text-2xl">
              {Number(order.total || 0).toFixed(2)} EGP
            </span>
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const { searchTerm, setSearchTerm } = useSearch();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();

  const fetchOrders = async () => {
    setLoadingOrders(true);
    setError(null);
    try {
      const res = await api.get("/orders/all");
      const data =
        res.data?.data?.orders || res.data?.data || res.data || [];
      setOrders([...data].reverse());
    } catch (err) {
      console.error(err);
      setError(t("فشل تحميل الطلبات. يرجى المحاولة لاحقاً."));
    } finally {
      setLoadingOrders(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleStatusUpdate = async (orderId, newStatus) => {
    // Optimistic update
    setOrders((prev) =>
      prev.map((o) =>
        o._id === orderId ? { ...o, status: newStatus } : o
      )
    );
    setUpdatingStatus(orderId);

    try {
      await api.patch(`/orders/${orderId}/status`, { status: newStatus });
    } catch (err) {
      console.error(err);
      // Revert on failure
      fetchOrders();
    } finally {
      setUpdatingStatus(null);
    }
  };

  const filteredOrders =
    searchTerm?.length > 0
      ? orders.filter(
          (order) =>
            order.shippingAddress?.fullName
              ?.toLowerCase()
              .includes(searchTerm.toLowerCase()) ||
            order._id?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : orders;

  return (
    <div className="admin-page w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            {t("متابعة الأوردرات")}
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            {t("عرض حالة الطلبات وشحنات العملاء")}
          </p>
        </div>

        <div className="relative w-full md:w-80">
          <Search
            className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? "right-3" : "left-3"}`}
            size={18}
          />
          <input
            type="text"
            placeholder={t("البحث برقم الطلب أو اسم العميل...")}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={`w-full border px-4 py-3 text-sm shadow-sm transition-all ${isArabic ? "pr-10" : "pl-10"}`}
          />
        </div>
      </div>

      {/* States */}
      {loadingOrders ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="font-semibold text-gray-500">
            {t("جاري تحميل الأوردرات  ...")}
          </p>
        </div>
      ) : error ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4 py-12 bg-white rounded-3xl border border-red-100 shadow-sm text-red-500">
          <AlertTriangle size={44} />
          <p className="font-bold text-lg">{error}</p>
          <button
            onClick={fetchOrders}
            className="mt-2 px-6 py-2 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 text-sm font-semibold transition-colors"
          >
            {t("إعادة المحاولة")}
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4 py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 rounded-full p-6 mb-2">
            <ShoppingCart size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            {t("لا توجد طلبات مسجلة")}
          </h3>
          <p className="text-gray-500 text-sm">
            {t("لم يقم أي عميل بالطلب حتى الآن.")}
          </p>
        </div>
      ) : searchTerm?.length > 0 && filteredOrders.length === 0 ? (
        <div className="flex flex-col min-h-[30vh] justify-center items-center gap-4 py-12">
          <p className="text-gray-500 font-bold text-lg">
            {t("لم نعثر على أوردر يطابق")} "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[50vh]">
            <table className={`w-full border-collapse min-w-[1100px] ${isArabic ? "text-right" : "text-left"}`}>
              <thead className="bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <tr>
                  <th className="py-4 px-6">{t("رقم الطلب")}</th>
                  <th className="py-4 px-6">{t("التاريخ")}</th>
                  <th className="py-4 px-6">{t("العميل والتواصل")}</th>
                  <th className="py-4 px-6">{t("العنوان")}</th>
                  <th className="py-4 px-6">{t("طريقة الدفع")}</th>
                  <th className="py-4 px-6 text-center">{t("الإجمالي")}</th>
                  <th className="py-4 px-6 text-center">{t("الحالة")}</th>
                  <th className="py-4 px-6 text-center">{t("التفاصيل")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.map((order, index) => (
                  <tr
                    key={order._id || index}
                    className="hover:bg-primary/5 transition-colors group align-top"
                  >
                    {/* Order ID */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 text-xs bg-slate-100 px-2 py-1 rounded inline-block font-mono">
                        #{order._id?.slice(-8).toUpperCase()}
                      </div>
                    </td>

                    {/* Date */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      <div className="flex items-center gap-2 text-gray-600 font-medium">
                        <CalendarCheck size={14} className="text-primary" />
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleDateString(
                              isArabic ? "ar-EG" : "en-US"
                            )
                          : "—"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 pr-6">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleTimeString(
                              isArabic ? "ar-EG" : "en-US",
                              { hour: "2-digit", minute: "2-digit" }
                            )
                          : ""}
                      </div>
                    </td>

                    {/* Customer */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 leading-tight">
                        {order.shippingAddress?.fullName ||
                          order.user?.name ||
                          "—"}
                      </div>
                      <div className="text-xs text-gray-500 mt-1" dir="ltr">
                        {order.shippingAddress?.phone}
                      </div>
                      <div className="text-xs text-gray-400 mt-0.5">
                        {order.user?.email}
                      </div>
                    </td>

                    {/* Address */}
                    <td className="py-4 px-6 max-w-[200px]">
                      <div className="text-slate-700 leading-relaxed text-xs">
                        {order.shippingAddress?.city} –{" "}
                        {order.shippingAddress?.address}
                        
                      </div>
                    </td>

                    {/* Payment */}
                    <td className="py-4 px-6">
                      <span className="text-xs font-semibold text-slate-600">
                        {order.paymentMethod === "cash"
                          ? ` ${t("نقداً عند الاستلام")}`
                          : order.paymentMethod === "card"
                            ? ` ${t("بطاقة")}`
                            : order.paymentMethod || "—"}
                      </span>
                    </td>

                    {/* Total */}
                    <td className="py-4 px-6 text-center">
                      <span className="font-bold text-slate-800 bg-green-50 text-green-700 px-3 py-1 rounded-md border border-green-100 inline-block shadow-sm">
                        {order.total?.toFixed(2)} EGP
                      </span>
                    </td>

                    {/* Status Dropdown */}
                    <td className="py-4 px-6 text-center">
  <div className="relative inline-block">
    {(() => {
      const status = order.status ?? "pending";

      return (
        <>
          <select
            value={status}
            onChange={(e) =>
              handleStatusUpdate(order._id, e.target.value)
            }
            disabled={updatingStatus === order._id}
            className={`appearance-none cursor-pointer text-xs font-bold px-3 py-1.5 pr-7 rounded-lg border transition-all focus:outline-none focus:ring-2 focus:ring-primary/40 ${
              STATUS_CONFIG[status]?.classes ||
              "bg-gray-100 text-gray-600 border-gray-200"
            } ${
              updatingStatus === order._id ? "opacity-50 cursor-not-allowed" : ""
            }`}
          >
            {ALL_STATUSES.map((s) => (
              <option key={s} value={s}>
                {STATUS_CONFIG[s].label}
              </option>
            ))}
          </select>

          <ChevronDown
            size={12}
            className="absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none text-current opacity-70"
          />
        </>
      );
    })()}
  </div>
</td>

                    {/* Detail Button */}
                    <td className="py-4 px-6 text-center">
                      <button
                        onClick={() => navigate(`/admin/orders/${order._id}`)}
                        className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-gray-200"
                        title={t("عرض التفاصيل")}
                        aria-label={`${t("عرض التفاصيل")} #${order._id?.slice(-8).toUpperCase()}`}
                      >
                        <Eye size={16} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Footer count */}
          <div className="px-6 py-3 border-t border-gray-100 bg-gray-50/50 text-xs text-gray-400 text-right">
            <Package size={12} className="inline ml-1" />
            {t("إجمالي الطلبات:")} {filteredOrders.length}
          </div>
        </div>
      )}

    </div>
  );
}
