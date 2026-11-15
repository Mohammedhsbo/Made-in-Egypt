import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearch } from "@/context/searchContext";
import { Edit, Trash2, Search, Plus } from "lucide-react";
import api, { markApiErrorHandled } from "../../api/axios.base";
import { useNavigate } from "react-router-dom";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, setSearchTerm } = useSearch();
    const navigate = useNavigate();
  const { t, isArabic } = useLanguage();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");

        setProducts(res.data.data.products); // ✅ FIX
      } catch (err) {
        markApiErrorHandled(err);
        toast.error(t("فشل تحميل المنتجات"));
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, [t]);

  // ✅ search fix
  const filteredProducts =
    searchTerm?.length > 0
      ? products.filter((product) =>
          (product.title_ar || product.title_en)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : products;

  async function deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
      toast.success(t("تم حذف المنتج"));

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      markApiErrorHandled(err);
      toast.error(t("فشل الحذف"));
    }
  }

  async function setSaleLabel(product, isOnSale) {
    try {
      await api.put(`/products/${product._id}`, { isOnSale });
      setProducts((current) => current.map((item) => (
        item._id === product._id ? { ...item, isOnSale } : item
      )));
      toast.success(t("تم تحديث المنتج بنجاح"));
    } catch (error) {
      markApiErrorHandled(error);
      toast.error(t("فشل تحديث المنتج"));
    }
  }

//   async function editProducts(id, updatedData) {
//   try {
//     const res = await api.put(`/products/${id}`, updatedData);

//     console.log(res.data);
//     toast.success("تم تحديث المنتج بنجاح");
//   } catch (err) {
//     console.error(err);
//     toast.error("فشل تحديث المنتج");
//   }
// }

  return (
    <div className="admin-page mx-auto max-w-6xl">

      {/* Header */}
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{t("Store catalog")}</p>
          <h1 className="mt-1">{t("إدارة المنتجات")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("Manage products in your storefront.")}</p>
        </div>

        <Button onClick={() => navigate("/admin/createproduct")} className="h-11 rounded-xl bg-[var(--primary)] px-4 font-bold text-white shadow-sm hover:brightness-110">
          <Plus className="w-4 h-4 ml-2" />
          {t("إضافة منتج")}
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-5">
        <Search className={`absolute top-1/2 -translate-y-1/2 text-gray-400 ${isArabic ? "right-3.5" : "left-3.5"}`} size={18} />
        <input
          className={`w-full border bg-white py-3 ${isArabic ? "pr-11 pl-4" : "pl-11 pr-4"}`}
          placeholder={t("بحث...")}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">{t("جاري التحميل...")}</div>
      ) : filteredProducts.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-10 text-center text-slate-500">{t("لا توجد منتجات")}</div>
      ) : (
        <div className="grid gap-3">

          {filteredProducts.map((product) => {
            const hasSale = Number(product.priceAfterDiscount) > 0
              && Number(product.priceAfterDiscount) < Number(product.basePrice);
            const showSaleLabel = product.isOnSale ?? hasSale;

            return (
              <div
                key={product._id}
                className="flex min-w-0 items-center gap-3 rounded-2xl border border-slate-200/90 bg-white p-3 shadow-[0_5px_18px_rgba(27,52,43,0.035)] transition hover:border-emerald-200 hover:shadow-sm sm:gap-4 sm:p-4"
              >

                {/* Image */}
                <SafeImage
                  src={product.imageCover}
                  className="h-16 w-16 shrink-0 rounded-xl border border-slate-100 bg-slate-50 object-cover sm:h-[4.5rem] sm:w-[4.5rem]"
                />

                {/* Info */}
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-2 font-bold leading-6 text-slate-800">
                    {isArabic ? product.title_ar || product.title_en : product.title_en || product.title_ar}
                  </h3>

                  <div className="mt-1 flex flex-wrap items-center gap-x-2 gap-y-1">
                    {showSaleLabel && (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-rose-700">SALE</span>
                    )}
                    {hasSale ? (
                      <>
                        <span className="text-sm font-bold text-emerald-800">{product.priceAfterDiscount} EGP</span>
                        <span className="text-xs text-slate-400 line-through">{product.basePrice} EGP</span>
                      </>
                    ) : (
                      <span className="text-sm font-semibold text-emerald-900">{product.basePrice} EGP</span>
                    )}
                  </div>
                </div>

                {/* Actions */}
                <div className="flex shrink-0 gap-1.5 sm:gap-2">

                  <label className="flex cursor-pointer items-center gap-1.5 rounded-xl border border-rose-100 bg-rose-50 px-2 py-1.5 text-[10px] font-black uppercase tracking-wide text-rose-700 transition hover:bg-rose-100 sm:gap-2 sm:px-3">
                    <input
                      type="checkbox"
                      checked={Boolean(showSaleLabel)}
                      onChange={(event) => setSaleLabel(product, event.target.checked)}
                      aria-label={`${t("Show SALE label")}: ${product.title_en || product.title_ar}`}
                      className="h-4 w-4 accent-rose-700"
                    />
                    SALE
                  </label>

                  <button
                    onClick={() => navigate(`/admin/editproduct/${product._id}`)}
                    aria-label={`${t("Edit")} ${product.title_en || product.title_ar}`}
                    className="rounded-xl border border-emerald-100 bg-emerald-50 p-2.5 text-emerald-800 transition hover:bg-emerald-100"
                  >
                    <Edit size={16} />
                  </button>

                  <button
                    onClick={() => deleteProduct(product._id)}
                    aria-label={`${t("Delete")} ${product.title_en || product.title_ar}`}
                    className="rounded-xl border border-rose-100 bg-rose-50 p-2.5 text-rose-700 transition hover:bg-rose-100"
                  >
                    <Trash2 size={16} />
                  </button>

                </div>
              </div>
            );
          })}

        </div>
      )}
    </div>
  );
}