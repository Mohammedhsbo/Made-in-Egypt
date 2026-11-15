import { createElement, useCallback, useEffect, useMemo, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  AlertTriangle,
  ArrowUpLeft,
  ArrowUpRight,
  CalendarDays,
  Check,
  CheckCircle2,
  ChevronRight,
  Clock3,
  CreditCard,
  Package,
  PackageCheck,
  RefreshCw,
  ShoppingBag,
  Truck,
  XCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";
import { useAuth } from "@/context/auth.context";
import api, { markApiErrorHandled } from "@/api/axios.base";
import { useLanguage } from "@/context/language.context";
import { toast } from "sonner";

const ORDER_STEPS = ["قيد الانتظار", "تم التأكيد", "تم الشحن", "تم التسليم"];
const ACTIVE_STATUSES = new Set(["pending", "confirmed", "shipped"]);

const STATUS_CONFIG = {
  pending: {
    label: "قيد الانتظار",
    icon: Clock3,
    classes: "border-amber-200 bg-amber-50 text-amber-800",
    iconColor: "text-amber-600",
    accent: "bg-amber-400",
  },
  confirmed: {
    label: "تم التأكيد",
    icon: CheckCircle2,
    classes: "border-emerald-200 bg-emerald-50 text-emerald-800",
    iconColor: "text-emerald-700",
    accent: "bg-emerald-600",
  },
  shipped: {
    label: "تم الشحن",
    icon: Truck,
    classes: "border-violet-200 bg-violet-50 text-violet-800",
    iconColor: "text-violet-600",
    accent: "bg-violet-500",
  },
  delivered: {
    label: "تم التسليم",
    icon: PackageCheck,
    classes: "border-green-200 bg-green-50 text-green-800",
    iconColor: "text-green-600",
    accent: "bg-green-500",
  },
  cancelled: {
    label: "ملغي",
    icon: XCircle,
    classes: "border-red-200 bg-red-50 text-red-700",
    iconColor: "text-red-500",
    accent: "bg-red-400",
  },
};

function getOrderStatus(order) {
  return STATUS_CONFIG[order?.status] || {
    label: order?.status || "قيد الانتظار",
    icon: Package,
    classes: "border-slate-200 bg-slate-50 text-slate-700",
    iconColor: "text-slate-500",
    accent: "bg-slate-300",
  };
}

function formatDate(value, isArabic) {
  if (!value) return "—";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "—";

  return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function formatMoney(value, isArabic) {
  return `${(Number(value) || 0).toLocaleString(isArabic ? "ar-EG" : "en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })} EGP`;
}

function getItemTitle(item, isArabic, t) {
  const product = item?.product;
  const title = isArabic
    ? item?.title_ar || product?.title_ar || item?.title_en || product?.title_en
    : item?.title_en || product?.title_en || item?.title_ar || product?.title_ar;

  return title || t("منتج غير معروف");
}

function StatusBadge({ status }) {
  const { t } = useLanguage();
  const config = getOrderStatus({ status });
  const Icon = config.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1.5 text-xs font-bold ${config.classes}`}>
      <Icon size={14} className={config.iconColor} aria-hidden="true" />
      {t(config.label)}
    </span>
  );
}

function OrderProgress({ status, isArabic, t }) {
  if (status === "cancelled") {
    return (
      <div className="flex items-center gap-2 rounded-xl bg-red-50 px-3 py-2.5 text-sm font-semibold text-red-700">
        <XCircle size={16} />
        {t("This order was cancelled")}
      </div>
    );
  }

  const currentStep = Math.max(0, ORDER_STEPS.findIndex((step) => {
    const configStatus = Object.entries(STATUS_CONFIG).find(([, config]) => config.label === step)?.[0];
    return configStatus === status;
  }));

  return (
    <div
      className="rounded-2xl border border-[#edf0eb] bg-[#fbfcfa] px-3 py-4 sm:px-5"
      role="progressbar"
      aria-label={t("Order progress")}
      aria-valuemin={0}
      aria-valuemax={ORDER_STEPS.length - 1}
      aria-valuenow={currentStep}
    >
      <div className="flex items-start" dir={isArabic ? "rtl" : "ltr"}>
        {ORDER_STEPS.map((step, index) => {
          const reached = index <= currentStep;
          const current = index === currentStep;

          return (
            <div className="flex min-w-0 flex-1 items-start last:flex-none" key={step}>
              <div className="flex w-12 shrink-0 flex-col items-center text-center sm:w-[4.25rem]">
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors ${
                    reached
                      ? "border-[#1a3a34] bg-[#1a3a34] text-white"
                      : "border-slate-200 bg-white text-slate-300"
                  } ${current ? "ring-4 ring-[#1a3a34]/10" : ""}`}
                >
                  {index < currentStep ? <Check size={14} /> : <span className="h-1.5 w-1.5 rounded-full bg-current" />}
                </span>
                <span className={`mt-2 text-[9px] font-semibold leading-4 sm:text-[11px] ${reached ? "text-[#1a3a34]" : "text-slate-400"}`}>
                  {t(step)}
                </span>
              </div>
              {index < ORDER_STEPS.length - 1 && (
                <span className={`mt-3.5 h-0.5 min-w-2 flex-1 rounded-full ${index < currentStep ? "bg-[#1a3a34]" : "bg-slate-200"}`} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

export function MyOrderDetailsPage() {
  const { id: orderId } = useParams();
  const { t, isArabic } = useLanguage();
  const { user, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  useEffect(() => {
    let active = true;

    const fetchOrder = async () => {
      try {
        const res = await api.get(`/orders/${orderId}`);
        if (active) setOrder(res.data?.data?.order || res.data?.data || res.data);
      } catch (err) {
        console.error(err);
        if (active) setError(t("فشل تحميل تفاصيل الطلب."));
      } finally {
        if (active) setLoading(false);
      }
    };

    if (user) fetchOrder();
    return () => {
      active = false;
    };
  }, [orderId, user, t]);

  if (authLoading) return null;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 pb-10 pt-3 sm:px-6 md:pb-14 md:pt-6">
      <Link
        to="/my-orders"
        className="inline-flex items-center gap-2 rounded-full border border-[#dce5de] bg-white px-4 py-2.5 text-sm font-bold text-[#1a3a34] shadow-sm transition hover:bg-[#f3f7f3]"
      >
        {isArabic ? <ArrowUpRight size={16} /> : <ArrowUpLeft size={16} />}
        {t("Back to orders")}
      </Link>

      <section className="mt-4 overflow-hidden rounded-[1.75rem] border border-[#e7e1d8] bg-[#fffdfa] shadow-[0_16px_45px_rgba(45,36,23,0.07)]">
        <header className="flex flex-wrap items-center justify-between gap-4 border-b border-[#ebe7df] bg-white px-5 py-5 sm:px-7">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#a17d4d]">{t("تفاصيل الطلب")}</p>
            <h1 className="mt-1 text-xl font-black text-slate-900 sm:text-2xl">
              {order ? `#${order._id?.slice(-10).toUpperCase()}` : t("تفاصيل الطلب")}
            </h1>
          </div>
          {order && <StatusBadge status={order.status} />}
        </header>

        <div className="p-5 sm:p-7">
          {loading ? (
            <div className="flex min-h-56 flex-col items-center justify-center gap-3 text-slate-500">
              <RefreshCw size={28} className="animate-spin text-[#1a3a34]" />
              <p className="text-sm font-semibold">{t("جاري تحميل تفاصيل الطلب...")}</p>
            </div>
          ) : error ? (
            <div className="flex min-h-52 flex-col items-center justify-center gap-3 rounded-2xl border border-red-100 bg-red-50 p-6 text-center text-red-700" role="alert">
              <AlertTriangle size={32} />
              <p className="font-semibold">{error}</p>
            </div>
          ) : order ? (
            <div className="space-y-5">
              <OrderProgress status={order.status} isArabic={isArabic} t={t} />

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e9e5dc] bg-white p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{t("حالة الطلب")}</p>
                  <StatusBadge status={order.status} />
                </div>
                <div className="rounded-2xl border border-[#e9e5dc] bg-white p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{t("تاريخ الطلب")}</p>
                  <p className="flex items-center gap-2 font-bold text-slate-800">
                    <CalendarDays size={16} className="text-[#a17d4d]" />
                    {formatDate(order.createdAt, isArabic)}
                  </p>
                </div>
              </div>

              <div className="rounded-2xl border border-[#e9e5dc] bg-white p-4 sm:p-5">
                <h3 className="mb-4 flex items-center gap-2 font-bold text-slate-900">
                  <Package size={17} className="text-[#1a3a34]" />
                  {t("المنتجات")} ({order.items?.length || 0})
                </h3>
                <div className="space-y-3">
                  {(order.items || []).map((item, index) => (
                    <div key={item._id || `${item.product?._id || "item"}-${index}`} className="flex items-center gap-3 rounded-xl bg-[#f7f5f0] p-3">
                      <SafeImage
                        src={getProductImageUrl(item.product)}
                        alt={getItemTitle(item, isArabic, t)}
                        className="h-14 w-14 shrink-0 rounded-xl border border-[#e9e5dc] object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-bold text-slate-800">{getItemTitle(item, isArabic, t)}</p>
                        <p className="mt-1 text-xs text-slate-500">{t("الكمية:")} {item.quantity}</p>
                      </div>
                      <p className="shrink-0 text-sm font-black text-[#1a3a34]" dir="ltr">
                        {formatMoney((Number(item.price) || 0) * (Number(item.quantity) || 0), isArabic)}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-[#e9e5dc] bg-white p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{t("عنوان الشحن")}</p>
                  <p className="font-bold text-slate-800">{order.shippingAddress?.fullName}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-600">
                    {order.shippingAddress?.address}
                    {order.shippingAddress?.city ? `, ${order.shippingAddress.city}` : ""}
                  </p>
                  {order.shippingAddress?.phone && (
                    <p className="mt-1 text-sm text-slate-600" dir="ltr">{order.shippingAddress.phone}</p>
                  )}
                </div>
                <div className="rounded-2xl border border-[#e9e5dc] bg-white p-4">
                  <p className="mb-2 text-xs font-semibold text-slate-500">{t("طريقة الدفع")}</p>
                  <p className="flex items-center gap-2 font-bold text-slate-800">
                    <CreditCard size={16} className="text-[#a17d4d]" />
                    {order.paymentMethod === "cash" ? t("نقداً عند الاستلام") : t("بطاقة ائتمانية")}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-4 rounded-2xl bg-[#173b34] px-5 py-4 text-white">
                <span className="font-semibold text-white/75">{t("الإجمالي")}</span>
                <span className="text-xl font-black" dir="ltr">{formatMoney(order.total, isArabic)}</span>
              </div>
            </div>
          ) : null}
        </div>
      </section>
    </div>
  );
}

export default function MyOrders() {
  const { user, loading: authLoading } = useAuth();
  const { t, isArabic } = useLanguage();
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");
  const [orderToCancel, setOrderToCancel] = useState(null);
  const [cancellingOrderId, setCancellingOrderId] = useState(null);

  useEffect(() => {
    if (!authLoading && !user) navigate("/login");
  }, [user, authLoading, navigate]);

  const fetchMyOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.get("/orders/my");
      const data = res.data?.data?.orders || res.data?.data || res.data || [];
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
      setError(t("فشل تحميل طلباتك. يرجى المحاولة مجدداً."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (user) fetchMyOrders();
  }, [user, fetchMyOrders]);

  const activeOrders = orders.filter((order) => ACTIVE_STATUSES.has(order.status)).length;
  const deliveredOrders = orders.filter((order) => order.status === "delivered").length;
  const orderValue = orders.reduce((total, order) => total + (Number(order.total) || 0), 0);

  const filters = [
    { id: "all", label: "All orders", count: orders.length },
    { id: "active", label: "In progress", count: activeOrders },
    { id: "delivered", label: "تم التسليم", count: deliveredOrders },
    { id: "cancelled", label: "ملغي", count: orders.filter((order) => order.status === "cancelled").length },
  ];

  const filteredOrders = useMemo(() => {
    if (activeFilter === "active") return orders.filter((order) => ACTIVE_STATUSES.has(order.status));
    if (activeFilter === "delivered" || activeFilter === "cancelled") {
      return orders.filter((order) => order.status === activeFilter);
    }
    return orders;
  }, [orders, activeFilter]);

  const confirmOrderCancellation = async () => {
    if (!orderToCancel) return;

    setCancellingOrderId(orderToCancel._id);
    try {
      const res = await api.patch(`/orders/${orderToCancel._id}/cancel`);
      const updatedOrder = res.data?.data?.order || res.data?.data || res.data;
      if (updatedOrder?._id !== orderToCancel._id || updatedOrder.status !== "cancelled") {
        throw new Error("The server returned an invalid cancellation response.");
      }
      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order._id === updatedOrder._id ? { ...order, status: updatedOrder.status } : order
        )
      );
      setOrderToCancel(null);
      toast.success(t("Order cancelled successfully."));
    } catch (err) {
      markApiErrorHandled(err);
      toast.error(err.response?.data?.message || t("Failed to cancel order. Please try again."));
    } finally {
      setCancellingOrderId(null);
    }
  };

  if (authLoading) return null;

  const statCards = [
    { label: "Total orders", value: orders.length, icon: Package, color: "text-[#1a3a34]", iconBg: "bg-[#eaf1ec]" },
    { label: "In progress", value: activeOrders, icon: Truck, color: "text-violet-700", iconBg: "bg-violet-50" },
    { label: "Delivered", value: deliveredOrders, icon: CheckCircle2, color: "text-emerald-700", iconBg: "bg-emerald-50" },
    { label: "Total order value", value: formatMoney(orderValue, isArabic), icon: ShoppingBag, color: "text-[#9a794c]", iconBg: "bg-[#f5efe5]" },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-10 pt-3 sm:px-6 md:pb-14 md:pt-6">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#9a794c]">{t("Order history")}</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">{t("My Orders")}</h1>
          <p className="mt-2 max-w-xl text-sm leading-6 text-slate-500 sm:text-base">
            {t("Track every order from confirmation to delivery.")}
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            asChild
            variant="outline"
            className="h-11 rounded-full border-[#dce5de] bg-white px-5 font-bold text-[#1a3a34] hover:bg-[#f3f7f3]"
          >
            <Link to="/profile">
              {isArabic ? <ArrowUpRight size={16} /> : <ArrowUpLeft size={16} />}
              {t("Back to account")}
            </Link>
          </Button>
          <Button asChild className="h-11 rounded-full bg-[#1a3a34] px-5 font-bold text-white shadow-sm hover:brightness-110">
            <Link to="/">
              <ShoppingBag size={16} />
              {t("Continue shopping")}
            </Link>
          </Button>
        </div>
      </header>

      <section className="relative isolate mb-6 overflow-hidden rounded-[2rem] bg-[#173b34] p-6 text-white shadow-[0_22px_55px_rgba(26,58,52,0.17)] sm:p-8">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -end-24 -top-40 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -end-10 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 start-[28%] h-64 w-64 rounded-full bg-[#c39a62]/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(195,154,98,0.16),transparent_35%)]" />
        </div>
        <div className="flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="max-w-xl">
            <span className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-[#f0d7ad]">
              <Package size={14} />
              {t("Your order dashboard")}
            </span>
            <h2 className="mt-4 text-2xl font-black leading-tight sm:text-3xl">{t("A clear view of every delivery.")}</h2>
            <p className="mt-2 max-w-lg text-sm leading-6 text-white/70">{t("Check progress, review your purchases, and find order details whenever you need them.")}</p>
          </div>
          <div className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/[0.07] p-4 sm:min-w-56">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-[#f0d7ad] text-[#173b34]">
              <PackageCheck size={23} />
            </div>
            <div>
              <p className="text-xs font-semibold text-white/65">{t("Orders placed")}</p>
              <p className="text-3xl font-black">{orders.length}</p>
            </div>
          </div>
        </div>
      </section>

      {!loading && !error && (
        <section className="mb-7 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4" aria-label={t("Order summary")}>
          {statCards.map(({ label, value, icon, color, iconBg }) => (
            <div key={label} className="min-w-0 rounded-2xl border border-[#e7e1d8] bg-white p-4 shadow-[0_8px_24px_rgba(45,36,23,0.035)] sm:rounded-3xl sm:p-5">
              <div className={`mb-3 flex h-10 w-10 items-center justify-center rounded-xl ${iconBg} ${color}`}>
                {createElement(icon, { size: 19 })}
              </div>
              <p className="text-xs font-semibold text-slate-500 sm:text-sm">{t(label)}</p>
              <p className={`mt-1 truncate font-black ${label === "Total order value" ? "text-sm sm:text-base" : "text-2xl text-slate-900"}`} dir={label === "Total order value" ? "ltr" : undefined}>
                {loading ? "—" : value}
              </p>
            </div>
          ))}
        </section>
      )}

      <section className="overflow-hidden rounded-[1.75rem] border border-[#e7e1d8] bg-white shadow-[0_12px_35px_rgba(45,36,23,0.045)]">
        <div className="flex flex-col gap-4 border-b border-[#eee9e1] px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
          <div>
            <h2 className="text-xl font-black text-slate-900">{t("Your orders")}</h2>
            {!loading && !error && (
              <p className="mt-1 text-sm text-slate-500">
                {t("Showing")} {filteredOrders.length} {t("of")} {orders.length} {t("orders")}
              </p>
            )}
          </div>
          {!loading && !error && orders.length > 0 && (
            <div className="flex max-w-full gap-2 overflow-x-auto pb-1 sm:flex-wrap sm:overflow-visible sm:pb-0" role="group" aria-label={t("Filter orders")}>
              {filters.map((filter) => (
                <button
                  type="button"
                  key={filter.id}
                  onClick={() => setActiveFilter(filter.id)}
                  aria-pressed={activeFilter === filter.id}
                  className={`inline-flex shrink-0 items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold transition sm:text-sm ${
                    activeFilter === filter.id
                      ? "border-[#1a3a34] bg-[#1a3a34] text-white shadow-sm"
                      : "border-[#e8e4dc] bg-white text-slate-600 hover:border-[#cbd8ce] hover:bg-[#f7f9f6]"
                  }`}
                >
                  {t(filter.label)}
                  <span className={`rounded-full px-1.5 py-0.5 text-[10px] ${activeFilter === filter.id ? "bg-white/15 text-white" : "bg-[#f1eee8] text-slate-500"}`}>
                    {filter.count}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

        {loading ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-5 py-12">
            <RefreshCw size={34} className="animate-spin text-[#1a3a34]" />
            <p className="font-semibold text-slate-500">{t("جاري تحميل طلباتك...")}</p>
          </div>
        ) : error ? (
          <div className="flex min-h-72 flex-col items-center justify-center gap-4 px-5 py-12 text-center" role="alert">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-red-50 text-red-500">
              <AlertTriangle size={26} />
            </div>
            <p className="max-w-md font-bold text-slate-800">{error}</p>
            <Button
              onClick={fetchMyOrders}
              disabled={loading}
              variant="outline"
              className="h-11 rounded-full border-red-200 px-5 font-bold text-red-700 hover:bg-red-50"
            >
              <RefreshCw size={16} />
              {t("إعادة المحاولة")}
            </Button>
          </div>
        ) : orders.length === 0 ? (
          <div className="flex min-h-[22rem] flex-col items-center justify-center px-6 py-12 text-center">
            <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-[1.75rem] bg-[#f3f1ec] text-[#a8b7ac]">
              <ShoppingBag size={35} />
            </div>
            <h3 className="text-xl font-black text-slate-900">{t("لا توجد طلبات بعد")}</h3>
            <p className="mt-2 max-w-sm text-sm leading-6 text-slate-500">
              {t("لم تقم بأي طلبات حتى الآن. ابدأ التسوق وستظهر طلباتك هنا.")}
            </p>
            <Button asChild className="mt-5 h-11 rounded-full bg-[#1a3a34] px-6 font-bold text-white hover:brightness-110">
              <Link to="/">{t("تصفح المنتجات")}</Link>
            </Button>
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex min-h-64 flex-col items-center justify-center px-6 py-10 text-center">
            <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f3f1ec] text-slate-400">
              <Package size={25} />
            </div>
            <h3 className="font-bold text-slate-800">{t("No orders match this filter.")}</h3>
            <button type="button" onClick={() => setActiveFilter("all")} className="mt-2 text-sm font-bold text-[#1a3a34] underline underline-offset-4">
              {t("Show all orders")}
            </button>
          </div>
        ) : (
          <div className="space-y-4 p-4 sm:space-y-5 sm:p-6">
            {filteredOrders.map((order) => {
              const status = getOrderStatus(order);
              const StatusIcon = status.icon;
              const itemCount = order.items?.length || 0;
              const previewItem = order.items?.[0];

              return (
                <article
                  key={order._id}
                  className="overflow-hidden rounded-2xl border border-[#e9e5dc] bg-white transition duration-200 hover:border-[#ccd9cf] hover:shadow-[0_12px_32px_rgba(27,56,47,0.08)] sm:rounded-3xl"
                >
                  <div className="flex min-w-0">
                    <span className={`w-1.5 shrink-0 ${status.accent}`} aria-hidden="true" />
                    <div className="min-w-0 flex-1 p-4 sm:p-5">
                      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-dashed border-[#e9e5dc] pb-4">
                        <div className="min-w-0">
                          <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-slate-400">{t("Order number")}</p>
                          <p className="mt-1 font-mono text-sm font-black text-slate-800">#{order._id?.slice(-10).toUpperCase()}</p>
                        </div>
                        <StatusBadge status={order.status} />
                      </div>

                      <div className="flex flex-col gap-4 py-4 sm:flex-row sm:items-center">
                        <div className="flex min-w-0 flex-1 items-center gap-3">
                          <SafeImage
                            src={getProductImageUrl(previewItem?.product)}
                            alt={previewItem ? getItemTitle(previewItem, isArabic, t) : ""}
                            className="h-[4.25rem] w-[4.25rem] shrink-0 rounded-2xl border border-[#e9e5dc] bg-[#f7f5f0] object-cover"
                          />
                          <div className="min-w-0">
                            <p className="truncate font-bold text-slate-800">
                              {previewItem ? getItemTitle(previewItem, isArabic, t) : t("No product details")}
                            </p>
                            <p className="mt-1 text-xs text-slate-500">{itemCount} {t("منتج")}</p>
                            <p className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
                              <CalendarDays size={13} className="text-[#a17d4d]" />
                              {formatDate(order.createdAt, isArabic)}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center justify-between gap-4 border-t border-[#f0ede7] pt-3 sm:min-w-44 sm:flex-col sm:items-end sm:border-0 sm:pt-0">
                          <div className="text-start sm:text-end">
                            <p className="text-[11px] font-semibold text-slate-400">{t("Order total")}</p>
                            <p className="mt-1 text-lg font-black text-[#1a3a34]" dir="ltr">{formatMoney(order.total, isArabic)}</p>
                          </div>
                          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500">
                            <CreditCard size={13} />
                            {order.paymentMethod === "cash" ? t("نقداً عند الاستلام") : t("بطاقة ائتمانية")}
                          </span>
                        </div>
                      </div>

                      <div className="border-t border-[#f0ede7] pt-4">
                        <OrderProgress status={order.status} isArabic={isArabic} t={t} />
                      </div>

                      <div className="mt-4 flex flex-wrap justify-end gap-2">
                        <button
                          type="button"
                          disabled={["delivered", "cancelled"].includes(order.status) || cancellingOrderId === order._id}
                          onClick={() => setOrderToCancel(order)}
                          title={order.status === "delivered" ? t("Delivered orders cannot be cancelled.") : undefined}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full border border-rose-200 bg-white px-4 text-sm font-bold text-rose-700 transition hover:bg-rose-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-700/30 disabled:cursor-not-allowed disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-400"
                        >
                          <XCircle size={15} aria-hidden="true" />
                          {cancellingOrderId === order._id ? t("Cancelling...") : t("Cancel order")}
                        </button>
                        <Link
                          to={`/my-orders/${order._id}`}
                          className="inline-flex min-h-10 items-center gap-2 rounded-full bg-[#f1f5f1] px-4 text-sm font-bold text-[#1a3a34] transition hover:bg-[#e3ece5] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#1a3a34]/30"
                        >
                          {t("View order details")}
                          {isArabic ? <ChevronRight size={15} className="rotate-180" /> : <ChevronRight size={15} />}
                        </Link>
                      </div>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}
      </section>

      {orderToCancel && (
        <ConfirmDialog
          title={t("Cancel this order?")}
          description={t("This action cannot be undone. The order will be cancelled.")}
          confirmText={t("Cancel order")}
          cancelText={t("Keep order")}
          pendingText={t("Cancelling...")}
          pending={cancellingOrderId === orderToCancel._id}
          onConfirm={confirmOrderCancellation}
          onCancel={() => setOrderToCancel(null)}
        />
      )}
    </div>
  );
}
