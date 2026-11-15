import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, LoaderCircle, Search, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import api, { markApiErrorHandled } from "@/api/axios.base";
import Offers from "@/components/offers";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";

const createOfferForm = (product) => {
  const hasOfferPricing = product?.offerBasePrice !== undefined && product?.offerBasePrice !== null;
  const productDiscount = Number(product?.priceAfterDiscount) > 0
    && Number(product.priceAfterDiscount) < Number(product.basePrice)
    ? product.priceAfterDiscount
    : "";
  return {
    offerBasePrice: product ? String(hasOfferPricing ? product.offerBasePrice : product.basePrice) : "",
    offerPriceAfterDiscount: product
      ? String(hasOfferPricing ? product.offerPriceAfterDiscount ?? "" : productDiscount)
      : "",
    offerDescription_ar: product?.offerDescription_ar ?? product?.description_ar ?? "",
    offerDescription_en: product?.offerDescription_en ?? product?.description_en ?? "",
    isOfferVisible: product?.isOfferVisible !== false,
  };
};

async function getAllProducts() {
  const firstPage = await api.get("/products", { params: { page: 1, limit: 100 } });
  const pages = Math.max(1, Number(firstPage.data.pages) || 1);
  const remainingPages = await Promise.all(
    Array.from({ length: pages - 1 }, (_, index) => (
      api.get("/products", { params: { page: index + 2, limit: 100 } })
    )),
  );
  return [firstPage, ...remainingPages].flatMap((response) => response.data.data.products || []);
}

export default function HomepageOfferPage() {
  const { t, isArabic } = useLanguage();
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [saving, setSaving] = useState(false);
  const [offerForm, setOfferForm] = useState(() => createOfferForm(null));
  const featuredProduct = products.find((product) => product.isFeatured);

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const loadedProducts = await getAllProducts();
      setProducts(loadedProducts);
      setOfferForm(createOfferForm(loadedProducts.find((product) => product.isFeatured)));
    } catch (error) {
      markApiErrorHandled(error);
      setLoadError(true);
      toast.error(t("Unable to load products. Please try again."));
    } finally {
      setLoading(false);
    }
  }, [t]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  const filteredProducts = useMemo(() => {
    const normalizedSearch = search.trim().toLocaleLowerCase();
    if (!normalizedSearch) return products;
    return products.filter((product) => (
      `${product.title_en || ""} ${product.title_ar || ""}`.toLocaleLowerCase().includes(normalizedSearch)
    ));
  }, [products, search]);

  async function chooseFeaturedProduct(product) {
    const target = product || featuredProduct;
    if (!target || saving) return;

    const isFeatured = Boolean(product);
    setSaving(true);
    try {
      const response = await api.put(`/products/${target._id}`, {
        isFeatured,
        ...(isFeatured ? { isOfferVisible: true } : {}),
      });
      const updatedProduct = response.data.data.product;
      setProducts((current) => current.map((item) => ({
        ...item,
        isFeatured: isFeatured && item._id === updatedProduct._id,
      })));
      setOfferForm(createOfferForm(isFeatured ? updatedProduct : null));
      toast.success(t(isFeatured ? "Homepage offer updated." : "Homepage offer removed."));
    } catch (error) {
      markApiErrorHandled(error);
      toast.error(t("Unable to update homepage offer."));
    } finally {
      setSaving(false);
    }
  }

  async function saveOfferSettings(event) {
    event.preventDefault();
    if (!featuredProduct || saving) return;

    const basePrice = Number(offerForm.offerBasePrice);
    const discountPrice = offerForm.offerPriceAfterDiscount === ""
      ? null
      : Number(offerForm.offerPriceAfterDiscount);
    if (!Number.isFinite(basePrice) || basePrice < 0) {
      toast.error(t("Enter a valid offer price."));
      return;
    }
    if (discountPrice !== null && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= basePrice)) {
      toast.error(t("Discounted price must be lower than offer price."));
      return;
    }

    setSaving(true);
    try {
      const response = await api.put(`/products/${featuredProduct._id}`, {
        isFeatured: true,
        isOfferVisible: offerForm.isOfferVisible,
        offerBasePrice: basePrice,
        offerPriceAfterDiscount: discountPrice,
        offerDescription_ar: offerForm.offerDescription_ar,
        offerDescription_en: offerForm.offerDescription_en,
      });
      const updatedProduct = response.data.data.product;
      setProducts((current) => current.map((item) => (
        item._id === updatedProduct._id ? updatedProduct : { ...item, isFeatured: false }
      )));
      setOfferForm(createOfferForm(updatedProduct));
      toast.success(t("Homepage offer settings saved."));
    } catch (error) {
      markApiErrorHandled(error);
      toast.error(t("Unable to update homepage offer."));
    } finally {
      setSaving(false);
    }
  }

  const previewProduct = featuredProduct ? {
    ...featuredProduct,
    offerBasePrice: offerForm.offerBasePrice === "" ? null : Number(offerForm.offerBasePrice),
    offerPriceAfterDiscount: offerForm.offerPriceAfterDiscount === "" ? null : Number(offerForm.offerPriceAfterDiscount),
    offerDescription_ar: offerForm.offerDescription_ar,
    offerDescription_en: offerForm.offerDescription_en,
    isOfferVisible: offerForm.isOfferVisible,
  } : null;
  const discountPercent = Number(offerForm.offerBasePrice) > 0
    && offerForm.offerPriceAfterDiscount !== ""
    && Number(offerForm.offerPriceAfterDiscount) >= 0
    && Number(offerForm.offerPriceAfterDiscount) < Number(offerForm.offerBasePrice)
    ? String(Number(((1 - Number(offerForm.offerPriceAfterDiscount) / Number(offerForm.offerBasePrice)) * 100).toFixed(2)))
    : "";

  return (
    <div className="admin-page mx-auto max-w-6xl">
      <header className="mb-7">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{t("Storefront")}</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h1>{t("Homepage offer")}</h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-slate-500">
              {t("Manage the product shown in the homepage offer banner.")}
            </p>
          </div>
          <span className="rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-900 shadow-sm">
            {products.length} {t("products")}
          </span>
        </div>
      </header>

      <section className="mb-8" aria-labelledby="offer-preview-heading">
        <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <Sparkles size={17} className="text-amber-600" />
            <h2 id="offer-preview-heading" className="text-sm font-bold text-slate-800">{t("Current offer")}</h2>
          </div>
          {featuredProduct && (
            <span className={`rounded-full px-3 py-1 text-xs font-bold ${offerForm.isOfferVisible ? "bg-emerald-100 text-emerald-800" : "bg-slate-200 text-slate-600"}`}>
              {t(offerForm.isOfferVisible ? "Visible on homepage" : "Hidden from homepage")}
            </span>
          )}
        </div>
        {featuredProduct ? (
          <Offers deals={[previewProduct]} preview />
        ) : (
          <div className="flex min-h-56 items-center justify-center rounded-[2rem] border border-white/15 bg-gradient-to-br from-[#163d36] via-[#102e28] to-[#0c2421] p-8 text-center shadow-lg">
            <p className="max-w-sm text-sm leading-6 text-emerald-50/75">
              {t("Select a product to preview the offer banner here.")}
            </p>
          </div>
        )}
        {featuredProduct && (
          <form onSubmit={saveOfferSettings} className="mt-3 rounded-2xl border border-emerald-100 bg-white p-4 shadow-sm sm:p-6">
            <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
              <p className="text-sm font-semibold text-slate-700">
                {t("Editing offer for")}{" "}
                <span className="text-emerald-900">
                  {isArabic ? featuredProduct.title_ar || featuredProduct.title_en : featuredProduct.title_en || featuredProduct.title_ar}
                </span>
              </p>
              <button
                type="button"
                onClick={() => chooseFeaturedProduct(null)}
                disabled={saving}
                className="inline-flex items-center gap-2 rounded-xl border border-rose-100 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <X size={15} />
                {t("Remove homepage offer")}
              </button>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="text-sm font-semibold text-slate-700">
                {t("Offer price")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  required
                  value={offerForm.offerBasePrice}
                  onChange={(event) => setOfferForm((current) => ({ ...current, offerBasePrice: event.target.value }))}
                  className="mt-1.5 w-full border px-3 py-2.5"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {t("Offer price after discount")}
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={offerForm.offerPriceAfterDiscount}
                  onChange={(event) => setOfferForm((current) => ({ ...current, offerPriceAfterDiscount: event.target.value }))}
                  placeholder={t("Leave empty for no offer discount")}
                  className="mt-1.5 w-full border px-3 py-2.5"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {t("Discount (%)")}
                <input
                  type="number"
                  min="0"
                  max="100"
                  step="0.1"
                  value={discountPercent}
                  onChange={(event) => {
                    const value = event.target.value;
                    setOfferForm((current) => {
                      if (value === "") return { ...current, offerPriceAfterDiscount: "" };
                      const percentage = Number(value);
                      const base = Number(current.offerBasePrice);
                      if (!Number.isFinite(percentage) || percentage < 0 || percentage > 100 || !Number.isFinite(base)) return current;
                      return {
                        ...current,
                        offerPriceAfterDiscount: (base * (1 - percentage / 100)).toFixed(2),
                      };
                    });
                  }}
                  className="mt-1.5 w-full border px-3 py-2.5"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {t("Offer description (English)")}
                <textarea
                  rows={3}
                  maxLength={2000}
                  value={offerForm.offerDescription_en}
                  onChange={(event) => setOfferForm((current) => ({ ...current, offerDescription_en: event.target.value }))}
                  className="mt-1.5 w-full border px-3 py-2.5"
                />
              </label>
              <label className="text-sm font-semibold text-slate-700">
                {t("Offer description (Arabic)")}
                <textarea
                  rows={3}
                  maxLength={2000}
                  dir="rtl"
                  value={offerForm.offerDescription_ar}
                  onChange={(event) => setOfferForm((current) => ({ ...current, offerDescription_ar: event.target.value }))}
                  className="mt-1.5 w-full border px-3 py-2.5"
                />
              </label>
            </div>

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4 border-t border-slate-100 pt-4">
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700">
                <input
                  type="checkbox"
                  checked={offerForm.isOfferVisible}
                  onChange={(event) => setOfferForm((current) => ({ ...current, isOfferVisible: event.target.checked }))}
                  className="h-4 w-4 accent-emerald-800"
                />
                {t("Show this offer on the homepage")}
              </label>
              <button
                type="submit"
                disabled={saving}
                className="rounded-xl bg-emerald-900 px-5 py-2.5 text-sm font-bold text-white shadow-sm transition hover:bg-emerald-800 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {saving ? t("Saving...") : t("Save offer settings")}
              </button>
            </div>
          </form>
        )}
      </section>

      <section aria-labelledby="choose-offer-heading">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 id="choose-offer-heading" className="text-lg font-bold text-slate-900">{t("Choose a featured product")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("Product selection will update the storefront banner immediately.")}</p>
          </div>
          <label className="relative block w-full sm:max-w-xs">
            <Search size={17} className={`absolute top-1/2 -translate-y-1/2 text-slate-400 ${isArabic ? "right-3.5" : "left-3.5"}`} />
            <input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder={t("Search products by name...")}
              className={`w-full rounded-xl border border-slate-200 bg-white py-2.5 text-sm shadow-sm focus:border-emerald-600 focus:outline-none focus:ring-4 focus:ring-emerald-900/10 ${isArabic ? "pr-10 pl-4" : "pl-10 pr-4"}`}
            />
          </label>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-3 rounded-2xl border border-slate-200 bg-white p-10 text-sm text-slate-500">
            <LoaderCircle size={18} className="animate-spin" />
            {t("Loading products…")}
          </div>
        ) : loadError ? (
          <div className="rounded-2xl border border-rose-100 bg-white p-8 text-center">
            <p className="text-sm text-rose-700">{t("Unable to load products. Please try again.")}</p>
            <button type="button" onClick={loadProducts} className="mt-4 rounded-xl bg-emerald-900 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-800">
              {t("Try again")}
            </button>
          </div>
        ) : filteredProducts.length ? (
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product) => {
              const isSelected = Boolean(product.isFeatured);
              const title = isArabic ? product.title_ar || product.title_en : product.title_en || product.title_ar;
              return (
                <article
                  key={product._id}
                  className={`flex min-w-0 items-center gap-3 rounded-2xl border p-3 shadow-sm transition sm:gap-4 sm:p-4 ${isSelected ? "border-emerald-700/35 bg-emerald-50/75 ring-1 ring-emerald-700/10" : "border-slate-200 bg-white hover:border-emerald-200 hover:shadow-md"}`}
                >
                  <SafeImage
                    src={product.imageCover}
                    alt={title}
                    className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                  />
                  <div className="min-w-0 flex-1">
                    <h3 className="line-clamp-2 text-sm font-bold leading-5 text-slate-800">{title}</h3>
                    <p className="mt-1 text-sm font-semibold text-emerald-900">{product.basePrice} {t("EGP")}</p>
                  </div>
                  <button
                    type="button"
                    onClick={() => chooseFeaturedProduct(isSelected ? null : product)}
                    disabled={saving}
                    aria-label={`${t(isSelected ? "Remove homepage offer" : "Choose this product")}: ${title}`}
                    aria-pressed={isSelected}
                    className={`grid h-10 w-10 shrink-0 place-items-center rounded-xl border transition disabled:cursor-not-allowed disabled:opacity-50 ${isSelected ? "border-emerald-800 bg-emerald-800 text-white" : "border-slate-200 bg-white text-slate-500 hover:border-emerald-700 hover:text-emerald-800"}`}
                  >
                    {isSelected ? <Check size={18} /> : <Sparkles size={17} />}
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
            {search ? t("No products match your search.") : t("No products available.")}
          </div>
        )}
      </section>
    </div>
  );
}
