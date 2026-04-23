import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import api from "@/api/axios.base";
import {
  Package,
  ShoppingBag,
  AlertTriangle,
  ChevronRight,
  X,
  Clock,
  Truck,
  CheckCircle2,
  XCircle,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";


// ─── Status config ────────────────────────────────────────────────────────────
const STATUS_CONFIG = {
  pending: {
    label: "قيد الانتظار",
    icon: Clock,
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200",
    iconColor: "text-yellow-500",
  },
  confirmed: {
    label: "تم التأكيد",
    icon: Loader2,
    classes: "bg-blue-50 text-blue-700 border-blue-200",
    iconColor: "text-blue-500",
  },
  shipped: {
    label: "تم الشحن",
    icon: Truck,
    classes: "bg-purple-50 text-purple-700 border-purple-200",
    iconColor: "text-purple-500",
  },
  delivered: {
    label: "تم التسليم",
    icon: CheckCircle2,
    classes: "bg-green-50 text-green-700 border-green-200",
    iconColor: "text-green-500",
  },
  cancelled: {
    label: "ملغي",
    icon: XCircle,
    classes: "bg-red-50 text-red-700 border-red-200",
    iconColor: "text-red-500",
  },
};

function StatusBadge({ status }) {
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    icon: Package,
    classes: "bg-gray-100 text-gray-600 border-gray-200",
    iconColor: "text-gray-400",
  };
  const Icon = cfg.icon;
  return (
    <span
      className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-bold ${cfg.classes}`}
    >
      <Icon size={12} className={cfg.iconColor} />
      {cfg.label}
    </span>
  );
}

// ─── Order Detail Modal ───────────────────────────────────────────────────────
function OrderDetailModal({ orderId, onClose }) {
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        setOrder(res.data?.data?.order || res.data?.data || res.data);
      } catch (err) {
        setError("فشل تحميل تفاصيل الطلب.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchOrder();
  }, [orderId]);

  // Lock body scroll while modal is open
  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => (document.body.style.overflow = "");
  }, []);

  return (
    <div 
      className=" absolute inset-0 z-[var(--z-drawer)] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm  "
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className=" flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800">تفاصيل الطلب</h2>
            {order && (
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                #{order._id?.slice(-10).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-400 hover:text-gray-700"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 ">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[220px] gap-3 text-gray-400">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              <p className="text-sm">جاري تحميل تفاصيل الطلب...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[220px] gap-3 text-red-500 ">
              <AlertTriangle size={36} />
              <p className="font-semibold text-sm">{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-5 ">
              {/* Status + Date */}
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-2">حالة الطلب</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="bg-gray-50 rounded-2xl p-4">
                  <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
                  <p className="text-sm font-bold text-slate-700">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {new Date(order.createdAt).toLocaleTimeString("ar-EG", {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              </div>

              {/* Shipping */}
              <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                <p className="font-bold text-slate-700 mb-3">📍 عنوان الشحن</p>
                <p>
                  <span className="text-gray-400 ml-1">الاسم:</span>
                  <span className="font-semibold">
                    {order.shippingAddress?.fullName}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400 ml-1">الهاتف:</span>
                  <span className="font-semibold" dir="ltr">
                    {order.shippingAddress?.phone}
                  </span>
                </p>
                <p>
                  <span className="text-gray-400 ml-1">العنوان:</span>
                  <span className="font-semibold">
                    {order.shippingAddress?.address} –{" "}
                    {order.shippingAddress?.city}
                  </span>
                </p>
              </div>

              {/* Items */}
              <div>
                <p className="font-bold text-slate-700 mb-3 text-sm">
                   المنتجات ({order.items?.length || 0})
                </p>
                <div className="space-y-3">
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-3 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                    >
                      <SafeImage
                        src={getProductImageUrl(item.product)}
                        alt={item.product?.title_ar}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="font-bold text-sm text-slate-800 truncate">
                          {item.title_ar || item.title_en || item.product?.title_ar || item.product?.title_en || "منتج غير معروف"}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary text-sm flex-shrink-0">
                        {(
                          (item.price || 0) * item.quantity
                        ).toFixed(2)}{" "}
                        EGP
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl px-5 py-4">
                <div>
                  <p className="text-xs text-slate-400">طريقة الدفع</p>
                  <p className="font-semibold text-sm mt-0.5">
                    {order.paymentMethod === "cash"
                      ? " نقداً عند الاستلام"
                      : " بطاقة ائتمانية"}
                  </p>
                </div>
                <div className="text-left">
                  <p className="text-xs text-slate-400">الإجمالي</p>
                  <p className="text-2xl font-black">
                    {(order.total || 0).toFixed(2)}
                    <span className="text-sm font-normal text-slate-400 mr-1">
                      EGP
                    </span>
                  </p>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

// ─── Main Page ─────────────────────────────────────────────────────────────────
export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate("/login");
    }
  }, [user, authLoading, navigate]);

  const fetchMyOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/my");
      const data =
        res.data?.data?.orders || res.data?.data || res.data || [];
      setOrders(data);
    } catch (err) {
      console.error(err);
      setError("فشل تحميل طلباتك. يرجى المحاولة مجدداً.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user]);

  if (authLoading) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 md:px-8 py-10 w-full">
      {/* Page Header */}
      <div className="mb-10">
        <div className="flex items-center gap-3 mb-2">
          <div className="bg-primary/10 p-3 rounded-full text-primary">
            <Package size={26} />
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-800 tracking-tight">
            طلباتي
          </h1>
        </div>
        <p className="text-gray-500 font-medium mr-16">
          تتبع حالة جميع طلباتك السابقة
        </p>
      </div>

      {/* Loading */}
      {loading ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="font-semibold text-gray-400">
            جاري تحميل طلباتك...
          </p>
        </div>
      ) : error ? (
        /* Error */
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4 py-14 bg-white rounded-3xl border border-red-100 text-red-500 shadow-sm">
          <AlertTriangle size={44} />
          <p className="font-bold text-lg">{error}</p>
          <button
            onClick={fetchMyOrders}
            className="mt-2 px-6 py-2.5 bg-red-50 hover:bg-red-100 text-red-600 rounded-xl border border-red-200 text-sm font-semibold transition-colors"
          >
            إعادة المحاولة
          </button>
        </div>
      ) : orders.length === 0 ? (
        /* Empty */
        <div className="flex flex-col min-h-[50vh] justify-center items-center gap-5 py-14 bg-white rounded-3xl border border-gray-100 shadow-sm text-center">
          <div className="bg-gray-50 rounded-full p-7 mb-2">
            <ShoppingBag size={52} className="text-gray-200" />
          </div>
          <h2 className="text-2xl font-black text-gray-800">
            لا توجد طلبات بعد
          </h2>
          <p className="text-gray-400 max-w-xs">
            لم تقم بأي طلبات حتى الآن. ابدأ التسوق وستظهر طلباتك هنا.
          </p>
          <Link to="/">
            <Button className="mt-2 rounded-full px-10 h-12 text-base font-bold shadow-md">
              تصفح المنتجات
            </Button>
          </Link>
        </div>
      ) : (
        /* Orders List */
        <div className="space-y-4 md:space-y-6">
          {orders.map((order) => {
            const cfg = STATUS_CONFIG[order.status] || STATUS_CONFIG.pending;
            const StatusIcon = cfg.icon;
            const itemCount = order.items?.length || 0;
            const previewItem = order.items?.[0];

            return (
              <div
                key={order._id}
                className="bg-white border border-gray-100 rounded-3xl shadow-sm hover:shadow-md transition-all overflow-hidden"
              >
                <div className="flex items-stretch">
                  {/* Left accent bar */}
                  <div
                    className={`w-1.5 flex-shrink-0 rounded-l-3xl ${
                      order.status === "delivered"
                        ? "bg-green-400"
                        : order.status === "cancelled"
                          ? "bg-red-400"
                          : order.status === "shipped"
                            ? "bg-purple-400"
                            : order.status === "confirmed"
                              ? "bg-blue-400"
                              : "bg-yellow-400"
                    }`}
                  />

                  <div className="flex-1 p-5">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      {/* Order info */}
                      <div className="flex items-center gap-4">
                        {/* Product thumbnail */}
                        <SafeImage
                          src={getProductImageUrl(previewItem?.product)}
                          alt=""
                          className="w-14 h-14 object-cover rounded-xl border border-gray-100 flex-shrink-0"
                        />
                        <div>
                          <p className="font-mono text-xs text-gray-400 mb-0.5">
                            #{order._id?.slice(-10).toUpperCase()}
                          </p>
                          <p className="font-bold text-slate-800">
                            {itemCount} منتج
                            {itemCount > 1 ? "ات" : ""}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5">
                            {new Date(order.createdAt).toLocaleDateString(
                              "ar-EG",
                              {
                                year: "numeric",
                                month: "long",
                                day: "numeric",
                              }
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right side */}
                      <div className="flex flex-col sm:items-end gap-2">
                        <StatusBadge status={order.status} />
                        <p className="text-xl font-black text-slate-800">
                          {(order.total || 0).toFixed(2)}{" "}
                          <span className="text-sm font-normal text-gray-400">
                            EGP
                          </span>
                        </p>
                      </div>
                    </div>

                    {/* Footer: payment + view button */}
                    <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-50">
                      <p className="text-xs text-gray-400">
                        {order.paymentMethod === "cash"
                          ? " دفع نقدي عند الاستلام"
                          : " دفع بالبطاقة"}
                      </p>
                      <button
                        onClick={() => setSelectedOrderId(order._id)}
                        className="flex items-center gap-1.5 text-primary hover:text-primary/80 text-xs font-bold transition-colors"
                      >
                        عرض التفاصيل
                        <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal

          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
