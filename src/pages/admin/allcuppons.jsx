import { useCallback, useEffect, useState } from "react";
import api, { markApiErrorHandled } from "../../api/axios.base";
import { toast } from "sonner";
import { Button } from "../../components/ui/button";
import { Link } from "react-router-dom";
import {
  BadgePercent,
  CalendarDays,
  CircleDollarSign,
  Edit,
  Plus,
  Tag,
  Ticket,
  Trash2,
  UsersRound,
} from "lucide-react";
import { useLanguage } from "@/context/language.context";

export default function Allcuppons() {
  const { t, isArabic } = useLanguage();
  const [allcuppons, setallcuppons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const getAllcuppons = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const res = await api.get("/coupons");
      setallcuppons(res.data.data.coupons);
    } catch (err) {
      markApiErrorHandled(err);
      setLoadError(true);
      toast.error(t("Unable to load coupons."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  async function deleteCoupon(id) {
    setDeletingId(id);
    try {
      await api.delete(`/coupons/${id}`);
      setallcuppons((prev) => prev.filter((coupon) => coupon._id !== id));
      toast.success(t("Coupon deleted."));
    } catch (err) {
      markApiErrorHandled(err);
      toast.error(t("Unable to delete coupon."));
    } finally {
      setDeletingId(null);
    }
  }

  useEffect(() => {
    getAllcuppons();
  }, [getAllcuppons]);

  const now = Date.now();
  const activeCount = allcuppons.filter((coupon) => new Date(coupon.expireAt).getTime() > now).length;
  const expiredCount = allcuppons.length - activeCount;

  function getDiscountLabel(coupon) {
    return coupon.discountType === "percent"
      ? `${coupon.discountValue}%`
      : `${coupon.discountValue} EGP`;
  }

  function getExpiryLabel(expireAt) {
    const date = new Date(expireAt);
    return Number.isNaN(date.getTime())
      ? "—"
      : date.toLocaleDateString(isArabic ? "ar-EG" : "en-GB", {
          day: "numeric",
          month: "short",
          year: "numeric",
        });
  }

  function getStatus(coupon) {
    return new Date(coupon.expireAt).getTime() > Date.now() ? "Active" : "Expired";
  }

  function getActions(coupon) {
    return (
      <div className="flex items-center gap-2">
        <Link
          to={`/admin/edit-cuppons/${coupon._id}`}
          aria-label={`${t("Edit")} ${coupon.code}`}
          title={t("Edit")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 transition hover:border-emerald-200 hover:bg-emerald-50 hover:text-emerald-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-700"
        >
          <Edit size={17} aria-hidden="true" />
        </Link>
        <button
          type="button"
          onClick={() => deleteCoupon(coupon._id)}
          disabled={deletingId === coupon._id}
          aria-label={`${t("Delete")} ${coupon.code}`}
          title={t("Delete")}
          className="inline-flex h-10 w-10 items-center justify-center rounded-xl border border-rose-100 bg-white text-rose-600 transition hover:bg-rose-50 hover:text-rose-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-600 disabled:cursor-wait disabled:opacity-50"
        >
          <Trash2 size={17} aria-hidden="true" />
        </button>
      </div>
    );
  }

  const stats = [
    { label: t("Total coupons"), value: allcuppons.length, icon: <Ticket size={20} aria-hidden="true" />, color: "text-slate-700", bg: "bg-slate-100" },
    { label: t("Active"), value: activeCount, icon: <BadgePercent size={20} aria-hidden="true" />, color: "text-emerald-700", bg: "bg-emerald-50" },
    { label: t("Expired"), value: expiredCount, icon: <CalendarDays size={20} aria-hidden="true" />, color: "text-amber-700", bg: "bg-amber-50" },
  ];

  return (
    <div className="admin-page mx-auto w-full max-w-7xl">
      <header className="mb-6 flex flex-col gap-4 sm:mb-8 sm:flex-row sm:items-end sm:justify-between">
        <div className="min-w-0">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--primary)]">{t("Store catalog")}</p>
          <h1 className="mt-1">{t("Discount coupons")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("Create and manage discount coupons easily")}</p>
        </div>
        <Link to="/admin/create-cuppons" className="w-full shrink-0 sm:w-auto">
          <Button className="h-11 w-full rounded-xl bg-[var(--primary)] px-5 font-bold text-white shadow-sm transition hover:brightness-110 sm:w-auto">
            <Plus size={18} aria-hidden="true" />
            {t("Add coupon")}
          </Button>
        </Link>
      </header>

      <section aria-label={t("Coupon overview")} className="mb-5 grid grid-cols-1 gap-3 sm:grid-cols-3 sm:gap-4">
        {stats.map(({ label, value, icon, color, bg }) => (
          <div key={label} className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${bg} ${color}`}>
              {icon}
            </span>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-500">{label}</p>
              <p className="mt-0.5 text-2xl font-bold leading-none text-slate-900">{loading ? "—" : value}</p>
            </div>
          </div>
        ))}
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6">
          <div className="min-w-0">
            <h2 className="font-bold text-slate-900">{t("All coupons")}</h2>
            {!loading && !loadError && (
              <p className="mt-1 text-sm text-slate-500">
                {allcuppons.length} {t("coupons total")}
              </p>
            )}
          </div>
          <Tag aria-hidden="true" size={20} className="shrink-0 text-slate-400" />
        </div>

        {loading ? (
          <div className="p-10 text-center text-slate-500 sm:p-14" role="status">{t("Loading coupons...")}</div>
        ) : loadError ? (
          <div className="px-5 py-12 text-center">
            <p className="mb-4 text-rose-700">{t("Unable to load coupons.")}</p>
            <button
              type="button"
              onClick={getAllcuppons}
              className="rounded-xl border border-slate-300 px-4 py-2.5 font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              {t("Try again")}
            </button>
          </div>
        ) : allcuppons.length === 0 ? (
          <div className="px-5 py-12 text-center sm:py-16">
            <span className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-800">
              <Ticket size={26} aria-hidden="true" />
            </span>
            <h3 className="font-bold text-slate-900">{t("No coupons yet")}</h3>
            <p className="mt-1 text-sm text-slate-500">{t("Create your first coupon to get started.")}</p>
            <Link to="/admin/create-cuppons" className="mt-5 inline-block">
              <Button className="h-10 rounded-xl bg-[var(--primary)] px-4 font-semibold text-white hover:brightness-110">
                <Plus size={17} aria-hidden="true" />
                {t("Add coupon")}
              </Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="divide-y divide-slate-100 md:hidden">
              {allcuppons.map((coupon) => {
                const isActive = getStatus(coupon) === "Active";
                return (
                  <article key={coupon._id} className="p-4 sm:p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex min-w-0 items-center gap-3">
                        <span className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${coupon.discountType === "percent" ? "bg-emerald-50 text-emerald-800" : "bg-teal-50 text-teal-800"}`}>
                          {coupon.discountType === "percent" ? <BadgePercent size={20} aria-hidden="true" /> : <CircleDollarSign size={20} aria-hidden="true" />}
                        </span>
                        <div className="min-w-0">
                          <p className="truncate font-mono text-base font-bold tracking-wide text-slate-900" dir="ltr">{coupon.code}</p>
                          <p className="mt-0.5 text-sm text-slate-500">{t(coupon.discountType === "percent" ? "Percentage discount" : "Fixed amount")}</p>
                        </div>
                      </div>
                      <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                        {t(isActive ? "Active" : "Expired")}
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-2 gap-3 rounded-xl bg-slate-50 p-3">
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">{t("Discount")}</p>
                        <p className="mt-1 truncate font-bold text-slate-900" dir="ltr">{getDiscountLabel(coupon)}</p>
                      </div>
                      <div className="min-w-0">
                        <p className="text-xs font-medium text-slate-500">{t("Coupon usage")}</p>
                        <p className="mt-1 flex items-center gap-1.5 font-semibold text-slate-800" dir="ltr">
                          <UsersRound size={15} className="text-slate-400" aria-hidden="true" />
                          {coupon.usageCount || 0} / {coupon.usageLimit || "∞"}
                        </p>
                      </div>
                      <div className="col-span-2 min-w-0 border-t border-slate-200 pt-2.5">
                        <p className="text-xs font-medium text-slate-500">{t("Expires")}</p>
                        <p className="mt-1 flex items-center gap-1.5 text-sm font-medium text-slate-700">
                          <CalendarDays size={15} className="shrink-0 text-slate-400" aria-hidden="true" />
                          {getExpiryLabel(coupon.expireAt)}
                        </p>
                      </div>
                    </div>
                    <div className="mt-3 flex justify-end">{getActions(coupon)}</div>
                  </article>
                );
              })}
            </div>

            <div className="hidden overflow-x-auto md:block">
              <table className={`w-full min-w-[720px] text-sm ${isArabic ? "text-right" : "text-left"}`}>
                <thead className="text-xs uppercase tracking-wide text-slate-500">
                  <tr>
                    <th scope="col" className="px-5 py-4 font-semibold sm:px-6">{t("Coupon code")}</th>
                    <th scope="col" className="px-5 py-4 font-semibold">{t("Discount")}</th>
                    <th scope="col" className="px-5 py-4 font-semibold">{t("Coupon usage")}</th>
                    <th scope="col" className="px-5 py-4 font-semibold">{t("Expires")}</th>
                    <th scope="col" className="px-5 py-4 font-semibold">{t("Status")}</th>
                    <th scope="col" className="px-5 py-4 text-center font-semibold">{t("Actions")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {allcuppons.map((coupon) => {
                    const isActive = getStatus(coupon) === "Active";
                    return (
                      <tr key={coupon._id} className="transition-colors hover:bg-slate-50/70">
                        <td className="px-5 py-4 sm:px-6">
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-50 text-emerald-800">
                              <Ticket size={18} aria-hidden="true" />
                            </span>
                            <span className="font-mono font-bold tracking-wide text-slate-900" dir="ltr">{coupon.code}</span>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <span className="font-bold text-slate-900" dir="ltr">{getDiscountLabel(coupon)}</span>
                          <span className="mt-0.5 block text-xs text-slate-500">{t(coupon.discountType === "percent" ? "Percentage discount" : "Fixed amount")}</span>
                        </td>
                        <td className="px-5 py-4 font-medium text-slate-700" dir="ltr">
                          {coupon.usageCount || 0} / {coupon.usageLimit || "∞"}
                        </td>
                        <td className="px-5 py-4 text-slate-600">{getExpiryLabel(coupon.expireAt)}</td>
                        <td className="px-5 py-4">
                          <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${isActive ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"}`}>
                            {t(isActive ? "Active" : "Expired")}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex justify-center">{getActions(coupon)}</div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
