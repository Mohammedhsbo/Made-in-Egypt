import React, { useCallback, useEffect, useState } from "react";
import api from "../../api/axios.base";
import { Button } from "@/components/ui/button";
import {
  ArrowUpRight,
  BadgeCheck,
  CalendarDays,
  CheckCircle2,
  Clock3,
  LogOut,
  Mail,
  Package,
  RefreshCw,
  ShoppingBag,
  Sparkles,
  UserRound,
} from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/context/auth.context";
import { useLanguage } from "@/context/language.context";

const ORDER_STATUS_LABELS = {
  pending: "قيد الانتظار",
  confirmed: "تم التأكيد",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
};

function formatDate(value, isArabic) {
  if (!value) return null;

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  return date.toLocaleDateString(isArabic ? "ar-EG" : "en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export default function Profile() {
  const { logout } = useAuth();
  const { t, isArabic } = useLanguage();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);
  const [ordersError, setOrdersError] = useState(null);

  useEffect(() => {
    let active = true;

    const fetchUserProfile = async () => {
      try {
        const res = await api.get("/auth/me");
        if (active) setUser(res.data.data.user);
      } catch (err) {
        console.error(err);
        if (active) setError(t("فشل تحميل بيانات المستخدم، يرجى تسجيل الدخول مجدداً"));
      } finally {
        if (active) setLoading(false);
      }
    };

    fetchUserProfile();
    return () => {
      active = false;
    };
  }, [t]);

  const fetchOrders = useCallback(async () => {
    setOrdersLoading(true);
    setOrdersError(null);
    try {
      const res = await api.get("/orders/my");
      setOrders(res.data?.data?.orders || []);
    } catch (err) {
      console.error(err);
      setOrdersError(t("Could not load your order summary."));
    } finally {
      setOrdersLoading(false);
    }
  }, [t]);

  useEffect(() => {
    if (user) fetchOrders();
  }, [user, fetchOrders]);

  const handleLogout = () => {
    logout();
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4">
        <div className="h-11 w-11 animate-spin rounded-full border-[3px] border-primary/15 border-t-primary" />
        <p className="font-semibold text-slate-500">{t("جاري تحميل بيانات حسابك...")}</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center p-6">
        <div className="w-full max-w-md rounded-3xl border border-red-100 bg-white p-8 text-center shadow-sm">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-red-50 text-red-500">
            <UserRound size={25} />
          </div>
          <p className="font-bold text-red-600">{error}</p>
          <Button onClick={handleLogout} variant="destructive" className="mt-6 h-11 w-full">
            {t("تسجيل الخروج والعودة")}
          </Button>
        </div>
      </div>
    );
  }

  const latestOrder = orders[0];
  const completedOrders = orders.filter((order) => order.status === "delivered").length;
  const orderValue = orders
    .filter((order) => order.status !== "cancelled")
    .reduce((total, order) => total + (Number(order.total) || 0), 0);

  return (
    <div className="mx-auto w-full max-w-6xl px-4 pb-8 pt-3 sm:px-6 md:pb-12 md:pt-6">
      <div className="mb-6 flex items-end justify-between gap-4 sm:mb-8">
        <div>
          <p className="mb-2 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.18em] text-[#9a794c]">
            <Sparkles size={14} />
            {t("Your account, all in one place")}
          </p>
          <h1 className="text-3xl font-black tracking-tight text-slate-900 sm:text-4xl">
            {t("Welcome to your account")}
          </h1>
        </div>
        <span className="hidden items-center gap-2 rounded-full border border-[#d9e4dc] bg-white/80 px-4 py-2 text-sm font-bold text-[#1a3a34] shadow-sm sm:inline-flex">
          <BadgeCheck size={17} />
          {t("Active and ready to shop")}
        </span>
      </div>

      <section className="relative isolate overflow-hidden rounded-[2rem] bg-[#173b34] text-white shadow-[0_22px_55px_rgba(26,58,52,0.18)]">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <div className="absolute -end-24 -top-40 h-96 w-96 rounded-full border border-white/10" />
          <div className="absolute -end-10 -top-24 h-72 w-72 rounded-full border border-white/10" />
          <div className="absolute -bottom-36 start-[30%] h-64 w-64 rounded-full bg-[#c39a62]/15 blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_10%_0%,rgba(195,154,98,0.16),transparent_35%)]" />
        </div>

        <div className="flex flex-col gap-7 p-6 sm:p-8 md:flex-row md:items-center md:justify-between md:p-10">
          <div className="flex min-w-0 items-center gap-4 sm:gap-6">
            <div className="flex h-[4.5rem] w-[4.5rem] shrink-0 items-center justify-center rounded-[1.4rem] border border-white/25 bg-white/10 text-3xl font-black text-[#f4d8a9] shadow-inner sm:h-24 sm:w-24 sm:text-4xl">
              {user?.name?.trim()?.charAt(0)?.toUpperCase() || <UserRound size={38} />}
            </div>
            <div className="min-w-0">
              <p className="mb-1 text-sm font-semibold text-white/65">{t("Welcome to your account")}</p>
              <h2 className="truncate text-2xl font-black sm:text-3xl">{user?.name || t("Registered member")}</h2>
              <p className="mt-2 flex min-w-0 items-center gap-2 text-sm text-white/75">
                <Mail size={15} className="shrink-0" />
                <span className="truncate" dir="ltr">{user?.email}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="h-12 rounded-full bg-[#f0d7ad] px-6 font-bold text-[#183b34] shadow-none hover:bg-[#f7e5c7]"
            >
              <Link to="/my-orders">
                <ShoppingBag size={18} />
                {t("Order tracking")}
                <ArrowUpRight size={16} className={isArabic ? "rotate-[-90deg]" : ""} />
              </Link>
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="h-12 rounded-full border-white/25 bg-white/5 px-5 font-bold text-white shadow-none hover:border-white/50 hover:bg-white/10 hover:text-white"
            >
              <LogOut size={17} />
              {t("تسجيل الخروج")}
            </Button>
          </div>
        </div>

        <div className="flex flex-wrap gap-x-6 gap-y-3 border-t border-white/10 bg-black/10 px-6 py-4 text-sm text-white/70 sm:px-8 md:px-10">
          <span className="inline-flex items-center gap-2">
            <CalendarDays size={15} className="text-[#e7c994]" />
            {t("Member since")}{" "}
            <strong className="font-bold text-white">
              {formatDate(user?.createdAt, isArabic) || t("Registered member")}
            </strong>
          </span>
          <span className="inline-flex items-center gap-2">
            <BadgeCheck size={15} className="text-[#a8d7ba]" />
            {t("Active and ready to shop")}
          </span>
        </div>
      </section>

      <div className="mt-6 grid gap-6 lg:grid-cols-[minmax(0,1.35fr)_minmax(19rem,0.85fr)]">
        <section className="rounded-[1.75rem] border border-[#e7e1d8] bg-white p-5 shadow-[0_12px_35px_rgba(45,36,23,0.045)] sm:p-7">
          <div className="mb-6 flex items-center justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a17d4d]">{t("Account")}</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{t("Personal account details")}</h2>
            </div>
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#f5f0e8] text-[#1a3a34]">
              <UserRound size={21} />
            </span>
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-[#eee9e1] bg-[#fcfbf9] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#1a3a34] shadow-sm">
                <UserRound size={17} />
              </div>
              <p className="text-xs font-semibold text-slate-500">{t("الاسم بالكامل")}</p>
              <p className="mt-1 break-words font-bold text-slate-800">{user?.name || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#eee9e1] bg-[#fcfbf9] p-4">
              <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#1a3a34] shadow-sm">
                <Mail size={17} />
              </div>
              <p className="text-xs font-semibold text-slate-500">{t("البريد الإلكتروني")}</p>
              <p className="mt-1 break-all font-bold text-slate-800" dir="ltr">{user?.email || "—"}</p>
            </div>
            <div className="rounded-2xl border border-[#eee9e1] bg-[#fcfbf9] p-4 sm:col-span-2">
              <div className="flex items-center gap-3">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-[#1a3a34] shadow-sm">
                  <CalendarDays size={17} />
                </div>
                <div className="min-w-0">
                  <p className="text-xs font-semibold text-slate-500">{t("Membership date")}</p>
                  <p className="mt-1 font-bold text-slate-800">
                    {formatDate(user?.createdAt, isArabic) || t("Registered member")}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[1.75rem] border border-[#e7e1d8] bg-white p-5 shadow-[0_12px_35px_rgba(45,36,23,0.045)] sm:p-7">
          <div className="mb-5 flex items-start justify-between gap-3">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.14em] text-[#a17d4d]">{t("Your shopping")}</p>
              <h2 className="mt-1 text-xl font-black text-slate-900">{t("Orders at a glance")}</h2>
            </div>
            <button
              type="button"
              onClick={fetchOrders}
              disabled={ordersLoading}
              aria-label={t("Refresh order summary")}
              className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-[#e9e4dc] text-slate-500 transition hover:bg-[#f7f4ef] hover:text-[#1a3a34] disabled:opacity-50"
            >
              <RefreshCw size={17} className={ordersLoading ? "animate-spin" : ""} />
            </button>
          </div>

          {ordersError ? (
            <div className="rounded-2xl border border-red-100 bg-red-50 p-4 text-sm text-red-700" role="alert">
              <p className="font-semibold">{ordersError}</p>
              <button
                type="button"
                onClick={fetchOrders}
                className="mt-3 font-bold underline underline-offset-2"
              >
                {t("Try again")}
              </button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-[#f6f3ed] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#1a3a34] shadow-sm">
                    <Package size={17} />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{t("Total orders")}</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {ordersLoading ? "—" : orders.length}
                  </p>
                </div>
                <div className="rounded-2xl bg-[#f6f3ed] p-4">
                  <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#28704e] shadow-sm">
                    <CheckCircle2 size={17} />
                  </div>
                  <p className="text-xs font-semibold text-slate-500">{t("Delivered")}</p>
                  <p className="mt-1 text-2xl font-black text-slate-900">
                    {ordersLoading ? "—" : completedOrders}
                  </p>
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between gap-3 rounded-2xl border border-[#eee9e1] px-4 py-3.5">
                <span className="text-sm font-semibold text-slate-500">{t("Total order value")}</span>
                <span className="text-base font-black text-[#1a3a34]" dir="ltr">
                  {ordersLoading ? "—" : `${orderValue.toLocaleString(isArabic ? "ar-EG" : "en-US")} EGP`}
                </span>
              </div>

              {ordersLoading ? (
                <div className="mt-4 flex items-center gap-2 text-sm text-slate-500" aria-live="polite">
                  <Clock3 size={15} />
                  {t("Loading order insights...")}
                </div>
              ) : latestOrder ? (
                <div className="mt-4 rounded-2xl border border-[#e6eee8] bg-[#f7faf7] p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-500">{t("Latest order")}</p>
                      <p className="mt-1 truncate font-mono text-sm font-bold text-slate-800">
                        #{latestOrder._id?.slice(-8).toUpperCase()}
                      </p>
                    </div>
                    <span className="shrink-0 rounded-full bg-white px-3 py-1 text-xs font-bold text-[#1a3a34] shadow-sm">
                      {t(ORDER_STATUS_LABELS[latestOrder.status] || "Order placed")}
                    </span>
                  </div>
                  {formatDate(latestOrder.createdAt, isArabic) && (
                    <p className="mt-2 text-xs text-slate-500">{formatDate(latestOrder.createdAt, isArabic)}</p>
                  )}
                </div>
              ) : (
                <div className="mt-4 rounded-2xl border border-dashed border-[#dcd5c9] bg-[#fcfbf9] px-4 py-5 text-center">
                  <p className="font-bold text-slate-800">{t("No orders yet")}</p>
                  <p className="mt-1 text-sm leading-6 text-slate-500">{t("Your recent orders will appear here once you shop.")}</p>
                  <Link to="/" className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-[#1a3a34] hover:underline">
                    {t("Browse the collection")}
                    <ArrowUpRight size={15} />
                  </Link>
                </div>
              )}
            </>
          )}

          <Link
            to="/my-orders"
            className="mt-5 flex min-h-11 items-center justify-center gap-2 rounded-full border border-[#dce6df] px-4 text-sm font-bold text-[#1a3a34] transition hover:bg-[#f3f7f3]"
          >
            <ShoppingBag size={16} />
            {t("Order tracking")}
            <ArrowUpRight size={15} className={isArabic ? "rotate-[-90deg]" : ""} />
          </Link>
        </section>
      </div>
    </div>
  );
}
