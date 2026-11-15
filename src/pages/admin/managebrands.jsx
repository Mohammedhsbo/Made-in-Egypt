import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Plus, Tag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { markApiErrorHandled } from "@/api/axios.base";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";
import { getManagedBrandsRequest } from "@/services/brand.service";

export default function BrandsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, isArabic } = useLanguage();
  const [brandToDelete, setBrandToDelete] = useState(null);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["managed-brands"],
    queryFn: getManagedBrandsRequest,
  });
  const brands = data?.data?.data?.brands || [];

  const refreshBrands = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["managed-brands"] }),
    queryClient.invalidateQueries({ queryKey: ["brands"] }),
  ]);

  const deleteBrand = useMutation({
    mutationFn: (id) => api.delete(`/brands/${id}`),
    onSuccess: async () => {
      setBrandToDelete(null);
      toast.success(t("Brand deleted."));
      await refreshBrands();
    },
    onError: (error) => {
      markApiErrorHandled(error);
      toast.error(error.response?.data?.message || t("Unable to delete brand."));
    },
  });

  const editBrand = (brand) => navigate(`/admin/managebrands/${brand._id}/edit`);
  const removeBrand = (brand) => {
    setBrandToDelete(brand);
  };
  const brandToDeleteName = brandToDelete
    ? isArabic
      ? brandToDelete.name_ar || brandToDelete.name_en
      : brandToDelete.name_en || brandToDelete.name_ar
    : "";

  return (
    <div className="admin-page mx-auto w-full max-w-7xl">
      <header className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">{t("Store catalog")}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{t("Brand Management")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("Manage brand names and logos shown in the storefront.")}</p>
        </div>
        <button
          type="button"
          onClick={() => navigate("/admin/managebrands/create")}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-[var(--primary)] px-5 py-3 font-semibold text-white shadow-sm transition hover:brightness-110"
        >
          <Plus size={18} />
          {t("Create brand")}
        </button>
      </header>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4 sm:px-6">
          <div>
            <h2 className="font-bold text-slate-900">{t("All brands")}</h2>
            {!isLoading && !isError && (
              <p className="mt-1 text-sm text-slate-500">{brands.length} {t("brands total")}</p>
            )}
          </div>
          <Tag aria-hidden="true" size={20} className="text-slate-400" />
        </div>

        {isLoading ? (
          <div className="p-12 text-center text-slate-500">{t("Loading brands…")}</div>
        ) : isError ? (
          <div className="p-10 text-center">
            <p className="mb-4 text-rose-700">{t("Could not load brands.")}</p>
            <button type="button" onClick={() => refetch()} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
              {t("Try again")}
            </button>
          </div>
        ) : brands.length === 0 ? (
          <div className="px-6 py-16 text-center">
            <Tag size={36} className="mx-auto mb-3 text-slate-300" />
            <h2 className="font-semibold text-slate-800">{t("No brands yet")}</h2>
            <p className="mt-1 text-sm text-slate-500">{t("Add your first brand to show it in the storefront.")}</p>
            <button
              type="button"
              onClick={() => navigate("/admin/managebrands/create")}
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 font-semibold text-white hover:brightness-110"
            >
              <Plus size={17} /> {t("Create brand")}
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[680px] text-sm ${isArabic ? "text-right" : "text-left"}`}>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold sm:px-6">{t("Brand")}</th>
                  <th className="px-5 py-4 font-semibold">{t("Status")}</th>
                  <th className="w-40 px-5 py-4 text-center font-semibold">{t("Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {brands.map((brand) => (
                  <tr key={brand._id} className="transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4 sm:px-6">
                      <div className="flex items-center gap-3">
                        {brand.logoUrl ? (
                          <SafeImage
                            src={brand.logoUrl}
                            alt=""
                            loading="lazy"
                            className="h-12 w-12 shrink-0 rounded-xl border border-slate-200 bg-white object-contain p-1"
                          />
                        ) : (
                          <span aria-hidden="true" className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-[var(--primary)] to-[#54836f] text-sm font-black uppercase text-white">
                            {(brand.name_en || brand.name_ar || "?").trim().slice(0, 2).toUpperCase()}
                          </span>
                        )}
                        <div className="min-w-0">
                          <p className="truncate font-semibold text-slate-900">{brand.name_en}</p>
                          <p className="mt-0.5 truncate text-sm text-slate-500" dir="rtl">{brand.name_ar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${brand.isActive === false ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>
                        {brand.isActive === false ? t("Hidden") : t("Visible")}
                      </span>
                    </td>
                    <td className="w-40 px-5 py-4">
                      <div className="flex flex-col items-center gap-2">
                        <button
                          type="button"
                          onClick={() => editBrand(brand)}
                          className="inline-flex w-32 items-center justify-center gap-1.5 rounded-lg border border-slate-200 px-3 py-2 font-semibold text-slate-700 transition hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800"
                        >
                          <Edit size={15} /> {t("Edit")}
                        </button>
                        <button
                          type="button"
                          disabled={deleteBrand.isPending}
                          onClick={() => removeBrand(brand)}
                          className="inline-flex w-32 items-center justify-center gap-1.5 rounded-lg border border-rose-100 px-3 py-2 font-semibold text-rose-700 transition hover:bg-rose-50 disabled:opacity-50"
                        >
                          <Trash2 size={15} /> {t("Delete")}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
      {brandToDelete && (
        <ConfirmDialog
          title={t("Delete brand?")}
          description={`${t("Delete")} "${brandToDeleteName}"? ${t("Brands assigned to products cannot be deleted.")}`}
          confirmText={t("Delete")}
          cancelText={t("Cancel")}
          pendingText={t("Deleting...")}
          pending={deleteBrand.isPending}
          onConfirm={() => deleteBrand.mutate(brandToDelete._id)}
          onCancel={() => setBrandToDelete(null)}
        />
      )}
    </div>
  );
}
