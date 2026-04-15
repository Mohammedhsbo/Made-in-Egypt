import { useEffect, useState } from "react";
import api from "@/api/axios.base";
import { useSearch } from "@/context/searchContext";
import {
  Search,
  ShoppingCart,
  Eye,
  X,
  CalendarCheck,
  Package,
  AlertTriangle,
  ChevronDown,
} from "lucide-react";
import SafeImage from "@/components/ui/safe-image";


const STATUS_CONFIG = {
  pending: {
    label: "قيد الانتظار",
    classes: "bg-yellow-50 text-yellow-700 border-yellow-200",
  },
  confirmed: {
    label: "جاري التجهيز",
    classes: "bg-blue-50 text-blue-700 border-blue-200",
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
  const cfg = STATUS_CONFIG[status] || {
    label: status,
    classes: "bg-gray-100 text-gray-600 border-gray-200",
  };
  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-md border text-xs font-bold ${cfg.classes}`}
    >
      {cfg.label}
    </span>
  );
}

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

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100 sticky top-0 bg-white rounded-t-3xl z-10">
          <div>
            <h2 className="text-xl font-black text-slate-800">تفاصيل الطلب</h2>
            {order && (
              <p className="text-xs text-gray-400 mt-0.5 font-mono">
                #{order._id?.slice(-8).toUpperCase()}
              </p>
            )}
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500"
          >
            <X size={20} />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-3">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary" />
              <p className="text-gray-500 text-sm">جاري التحميل...</p>
            </div>
          ) : error ? (
            <div className="flex flex-col items-center justify-center min-h-[200px] gap-3 text-red-500">
              <AlertTriangle size={36} />
              <p className="font-semibold">{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-6">
              {/* Status & Date */}
              <div className="flex items-center justify-between bg-gray-50 rounded-2xl p-4">
                <div>
                  <p className="text-xs text-gray-400 mb-1">الحالة</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="text-left">
                  <p className="text-xs text-gray-400 mb-1">تاريخ الطلب</p>
                  <p className="text-sm font-semibold text-slate-700">
                    {new Date(order.createdAt).toLocaleDateString("ar-EG")}
                  </p>
                </div>
              </div>

              {/* Shipping Address */}
              <div>
                <h3 className="font-bold text-slate-700 mb-3 text-sm">
                  بيانات الشحن
                </h3>
                <div className="bg-gray-50 rounded-2xl p-4 space-y-2 text-sm">
                  <p>
                    <span className="text-gray-400">الاسم:</span>{" "}
                    <span className="font-semibold">
                      {order.shippingAddress?.fullName}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">الهاتف:</span>{" "}
                    <span className="font-semibold" dir="ltr">
                      {order.shippingAddress?.phone}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">العنوان:</span>{" "}
                    <span className="font-semibold">
                      {order.shippingAddress?.address} –{" "}
                      {order.shippingAddress?.city}
                    </span>
                  </p>
                  <p>
                    <span className="text-gray-400">الرمز البريدي:</span>{" "}
                    <span className="font-semibold">
                      {order.shippingAddress?.postalCode}
                    </span>
                  </p>
                </div>
              </div>

              {/* Items */}
              <div>
                <h3 className="font-bold text-slate-700 mb-3 text-sm">
                  المنتجات ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {(order.items || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-4 bg-gray-50 p-3 rounded-2xl border border-gray-100"
                    >
                      <SafeImage
                        src={item.product}
                        alt={item.product?.title_ar}
                        className="w-14 h-14 object-cover rounded-xl border border-gray-100"
                      />
                      <div className="flex-1">
                        <p className="font-bold text-sm text-slate-800 line-clamp-1">
                          {item.product?.title_ar || item.product?.title_en}
                        </p>
                        <p className="text-xs text-gray-400 mt-0.5">
                          الكمية: {item.quantity}
                        </p>
                      </div>
                      <p className="font-bold text-primary text-sm">
                        {(
                          (item.product?.priceAfterDiscount ||
                            item.product?.basePrice ||
                            item.price ||
                            0) * item.quantity
                        ).toFixed(2)}{" "}
                        EGP
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between bg-slate-900 text-white rounded-2xl px-6 py-4">
                <span className="font-bold">الإجمالي الكلي</span>
                <span className="text-2xl font-black">
                  {order.total?.toFixed(2)} EGP
                </span>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const [error, setError] = useState(null);
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [updatingStatus, setUpdatingStatus] = useState(null);
  const { searchTerm, setSearchTerm } = useSearch();

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
      setError("فشل تحميل الطلبات. يرجى المحاولة لاحقاً.");
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
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800 tracking-tight">
            متابعة الأوردرات
          </h1>
          <p className="text-gray-500 font-medium mt-1">
            عرض حالة الطلبات وشحنات العملاء
          </p>
        </div>

        <div className="relative w-full md:w-72">
          <Search
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400"
            size={18}
          />
          <input
            type="text"
            placeholder="البحث برقم الطلب أو اسم العميل..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
          />
        </div>
      </div>

      {/* States */}
      {loadingOrders ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
          <p className="font-semibold text-gray-500">
            جاري تحميل الأوردرات  ...
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
            إعادة المحاولة
          </button>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4 py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 rounded-full p-6 mb-2">
            <ShoppingCart size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            لا توجد طلبات مسجلة
          </h3>
          <p className="text-gray-500 text-sm">
            لم يقم أي عميل بالطلب حتى الآن.
          </p>
        </div>
      ) : searchTerm?.length > 0 && filteredOrders.length === 0 ? (
        <div className="flex flex-col min-h-[30vh] justify-center items-center gap-4 py-12">
          <p className="text-gray-500 font-bold text-lg">
            لم نعثر على أوردر يطابق "{searchTerm}"
          </p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[50vh]">
            <table className="w-full text-right border-collapse min-w-[1100px]">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <tr>
                  <th className="py-4 px-6">رقم الطلب</th>
                  <th className="py-4 px-6">التاريخ</th>
                  <th className="py-4 px-6">العميل والتواصل</th>
                  <th className="py-4 px-6">العنوان</th>
                  <th className="py-4 px-6">طريقة الدفع</th>
                  <th className="py-4 px-6 text-center">الإجمالي</th>
                  <th className="py-4 px-6 text-center">الحالة</th>
                  <th className="py-4 px-6 text-center">التفاصيل</th>
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
                              "ar-EG"
                            )
                          : "—"}
                      </div>
                      <div className="text-xs text-gray-400 mt-1 pr-6">
                        {order.createdAt
                          ? new Date(order.createdAt).toLocaleTimeString(
                              "ar-EG",
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
                          ? " نقداً عند الاستلام"
                          : order.paymentMethod === "card"
                            ? " بطاقة"
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
                        onClick={() => setSelectedOrderId(order._id)}
                        className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-primary/10 hover:text-primary transition-colors border border-gray-200"
                        title="عرض التفاصيل"
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
            إجمالي الطلبات: {filteredOrders.length}
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrderId && (
        <OrderDetailModal
          orderId={selectedOrderId}
          onClose={() => setSelectedOrderId(null)}
        />
      )}
    </div>
  );
}
