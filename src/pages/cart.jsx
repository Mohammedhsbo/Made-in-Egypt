import { Button } from "@/components/ui/button";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus, CreditCard } from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { getProductImageUrl } from "@/utils/formatImageUrl";
import { useAuth } from "../context/auth.context";
import { useLanguage } from "@/context/language.context";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();
  const { user } = useAuth();
  const { t, isArabic } = useLanguage();
  const formatTitle = (product) => t(isArabic ? product?.title_ar || product?.title_en : product?.title_en || product?.title_ar);

  const items = cart?.items || [];

  const total = Array.isArray(items)
    ? items.reduce((sum, item) => {
        const price =
          item.price ||
          item.product?.priceAfterDiscount ||
          item.product?.basePrice ||
          0;

        return sum + price * (item.quantity || 1);
      }, 0)
    : 0;

  return (
    <div className="mx-auto mt-4 w-full max-w-screen-2xl px-3 py-6 sm:px-5 sm:py-10 lg:px-8 2xl:px-12">
      <header className="mb-7 flex flex-wrap items-center justify-between gap-4 rounded-[2rem] border border-white/80 bg-gradient-to-r from-[#f1f5f0] via-white to-[#f7f2e9] p-5 shadow-[0_16px_44px_rgba(26,58,52,0.07)] sm:mb-9 sm:p-8">
        <div className="flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-[#1f5a53] to-[#26716c] text-white shadow-lg shadow-emerald-900/15">
            <ShoppingBag size={25} />
          </div>
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#26716c]">{t("Your selection")}</p>
            <h1 className="mt-1 text-2xl font-black tracking-tight text-slate-900 sm:text-3xl">{t("سلة المشتريات")}</h1>
          </div>
        </div>
        <span className="rounded-full border border-slate-200 bg-white/80 px-4 py-2 text-sm font-bold text-slate-600 shadow-sm">
          {items.length} {t("من العناصر")}
        </span>
      </header>

      {!items.length ? (
        <div className="flex min-h-[50vh] flex-col items-center justify-center gap-5 rounded-[2rem] border border-slate-200/80 bg-white px-5 py-14 text-center shadow-[0_18px_50px_rgba(26,58,52,0.06)]">
          <div className="mb-2 flex h-28 w-28 items-center justify-center rounded-full border border-emerald-100 bg-gradient-to-br from-emerald-50 to-[#f7f3ed] shadow-inner">
            <ShoppingBag size={46} className="text-[#26716c]" />
          </div>

          <h3 className="text-2xl font-black text-slate-900 sm:text-3xl">
            {t("سلتك فارغة تماماً")}
          </h3>

          <p className="mb-2 max-w-md text-sm leading-6 text-slate-500 sm:text-base">
            {t("يبدو أنك لم تقم بإضافة أي منتجات حتى الآن.")}
          </p>

          <Link to="/">
            <Button size="lg" className="h-12 rounded-full bg-gradient-to-r from-[#1f5a53] to-[#26716c] px-8 font-bold text-white shadow-lg shadow-emerald-900/15 hover:brightness-110 sm:h-14 sm:px-10">
              {t("تصفح المنتجات الآن")}
            </Button>
          </Link>
        </div>
      ) : (
        <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(300px,0.85fr)] lg:gap-8">

          {/* ITEMS */}
          <div className="min-w-0 space-y-5">

            <div className="mb-2 hidden grid-cols-12 gap-4 rounded-2xl border border-slate-200/80 bg-white px-8 py-4 font-semibold text-slate-500 shadow-sm md:grid">
              <div className="col-span-6">{t("المنتجات")}</div>
              <div className="col-span-3 text-center">{t("الكمية")}</div>
              <div className="col-span-2 text-center">{t("السعر")}</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="group relative flex flex-col items-start gap-4 rounded-3xl border border-slate-200/80 bg-white p-4 shadow-[0_8px_24px_rgba(26,58,52,0.045)] transition-all hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-lg sm:gap-5 sm:p-5 md:flex-row md:items-center md:gap-4"
                >

                  {/* PRODUCT */}
                  <div className="flex w-full items-center gap-4 md:w-1/2">
                    <div className="h-20 w-20 flex-shrink-0 overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 sm:h-24 sm:w-24">
                      <SafeImage
                        src={getProductImageUrl(item.product)}
                        alt={formatTitle(item.product) || t("منتج")}
                        className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>

                    <div className="min-w-0">
                      <Link
                        to={`/productdetails/${item.product?._id}`}
                        className="line-clamp-2 font-bold leading-6 text-slate-900 transition-colors hover:text-[#26716c] sm:text-lg"
                      >
                        {formatTitle(item.product)}
                      </Link>
                    </div>
                  </div>

                  {/* QTY */}
                  <div className="flex w-full items-center justify-between md:w-auto md:justify-center">
                    <span className="text-xs font-semibold text-slate-500 md:hidden">{t("الكمية")}</span>
                    <div className="flex h-10 w-[110px] items-center rounded-full border border-slate-200 bg-slate-50">

                      <button
                        type="button"
                        aria-label={t("Decrease quantity")}
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) - 1)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-[#26716c]"
                      >
                        <Minus size={16} />
                        
                         
                      </button>

                      <span className="flex-1 text-center font-bold">
                        {item.quantity || 1}
                      </span>

                      <button
                        type="button"
                        aria-label={t("Increase quantity")}
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) + 1)
                        }
                        className="flex h-10 w-10 items-center justify-center rounded-full text-slate-500 transition hover:bg-white hover:text-[#26716c]"
                      >
                        <Plus size={16} />
                      </button>
                    
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="flex w-full items-center justify-between border-t border-slate-100 pt-3 md:w-auto md:flex-1 md:justify-center md:border-0 md:pt-0">
                    <span className="text-xs font-semibold text-slate-500 md:hidden">{t("السعر")}</span>
                    <p className="text-lg font-black text-[#17665e]">
                      {(
                        (item.price ||
                         0) * (item.quantity || 1)
                      ).toFixed(2)}{" "}
                      EGP
                    </p>
                  </div>

                  {/* REMOVE */}
                  <div className="absolute top-3 w-auto ltr:right-3 rtl:left-3 md:relative md:left-0 md:right-0 md:top-0">
                    <button
                      type="button"
                      aria-label={t("Remove item")}
                      onClick={() => removeFromCart(item._id)}
                      className="rounded-full p-2 text-slate-400 transition-all hover:bg-rose-50 hover:text-rose-600"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="flex justify-end pt-1">
              <Button
                variant="outline"
                onClick={clearCart}
                className="rounded-xl border-slate-200 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-600"
              >
                {t("إفراغ السلة بالكامل")}
              </Button>
            </div>
          </div>

          {/* SUMMARY */}
          <div className="min-w-0">
            <div className="rounded-[2rem] border border-emerald-900/10 bg-gradient-to-br from-[#173e39] via-[#1f5a53] to-[#26716c] p-6 text-white shadow-[0_24px_55px_rgba(26,58,52,0.2)] sm:p-8 lg:sticky lg:top-28">
              <p className="mb-2 text-xs font-bold uppercase tracking-[0.18em] text-[#e6c692]">{t("Order overview")}</p>
              <h3 className="mb-6 border-b border-white/15 pb-4 text-xl font-black sm:text-2xl">
                {t("ملخص الطلب")}
              </h3>

              <div className="mb-6 space-y-4">
                <div className="flex items-center justify-between text-sm text-white/70">
                  <span>{t("المجموع الفرعي:")}</span>
                  <span className="font-bold text-white">
                    {total.toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex items-center justify-between border-b border-white/15 pb-4 text-sm text-white/70">
                  <span>{t("مصاريف الشحن:")}</span>
                  <span className="text-green-400 font-bold">{t("مجاناً")}</span>
                </div>

                <div className="flex items-end justify-between pt-2">
                  <span className="text-base font-bold text-white/90">{t("الإجمالي الكلي:")}</span>
                  <span className="text-3xl font-black text-white">
                    {total.toFixed(2)}{" "}
                    <span className="text-sm text-slate-400">EGP</span>
                  </span>
                </div>
              </div>

              <Link
                to={user ? "/checkout" : "/login?redirect=/checkout"}
                className="mt-8 block"
              >
                <Button className="flex h-14 w-full items-center justify-center gap-3 rounded-xl bg-[#e6c692] text-base font-black text-[#173e39] shadow-lg shadow-black/10 transition hover:bg-[#f0d7a8]">
                  {t("متابعة للدفع")}
                  <CreditCard size={20} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}