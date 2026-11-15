import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Edit, Image as ImageIcon, Plus, Tag, Trash2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import api, { markApiErrorHandled } from "@/api/axios.base";
import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { getManagedCategoriesRequest } from "@/services/category.service";
import { formatImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";

export default function CategoriesPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t, isArabic } = useLanguage();
  const [deletingId, setDeletingId] = useState(null);
  const [categoryToDelete, setCategoryToDelete] = useState(null);
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["managed-categories"],
    queryFn: getManagedCategoriesRequest,
  });
  const categories = data?.data?.data?.categories || [];

  const deleteCategory = useMutation({
    mutationFn: (id) => api.delete(`/categories/${id}`),
    onSuccess: async () => {
      setCategoryToDelete(null);
      toast.success(t("Category deleted."));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["managed-categories"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["category"] }),
      ]);
    },
    onError: (error) => {
      markApiErrorHandled(error);
      toast.error(error.response?.data?.message || t("Unable to delete category."));
    },
    onSettled: () => setDeletingId(null),
  });

  const handleDelete = (category) => {
    setCategoryToDelete(category);
  };
  const categoryToDeleteName = categoryToDelete
    ? isArabic
      ? categoryToDelete.name_ar || categoryToDelete.name_en
      : categoryToDelete.name_en || categoryToDelete.name_ar
    : "";
  const confirmDelete = () => {
    if (!categoryToDelete) return;
    setDeletingId(categoryToDelete._id);
    deleteCategory.mutate(categoryToDelete._id);
  };

  return (
    <div className="admin-page mx-auto w-full max-w-7xl">
      <div className="mb-7 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">{t("Store catalog")}</p>
          <h1 className="mt-1 text-3xl font-bold text-slate-900">{t("Categories Management")}</h1>
          <p className="mt-2 text-sm text-slate-500">{t("Update storefront categories, covers, visibility, and display order.")}</p>
        </div>
        <button onClick={() => navigate("/admin/createcategory")} className="inline-flex items-center justify-center gap-2 rounded-lg bg-[var(--primary)] px-4 py-2.5 font-semibold text-white shadow-[0_10px_22px_rgba(26,58,52,0.16)] transition hover:brightness-110">
          <Plus size={18} /> {t("Add New Category")}
        </button>
      </div>

      {isLoading ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">{t("Loading categories…")}</div>
      ) : isError ? (
        <div className="rounded-2xl border border-rose-100 bg-white p-10 text-center">
          <p className="mb-4 text-rose-700">{t("Could not load categories.")}</p>
          <button onClick={() => refetch()} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">{t("Try again")}</button>
        </div>
      ) : categories.length === 0 ? (
        <div className="rounded-2xl border border-slate-200 bg-white px-6 py-16 text-center">
          <Tag size={36} className="mx-auto mb-3 text-slate-300" />
          <h2 className="font-semibold text-slate-800">{t("No categories yet")}</h2>
          <p className="mt-1 text-sm text-slate-500">{t("Add your first category to start organizing the store.")}</p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="overflow-x-auto">
            <table className={`w-full min-w-[880px] text-sm ${isArabic ? "text-right" : "text-left"}`}>
              <thead className="bg-slate-50 text-xs uppercase tracking-wide text-slate-500">
                <tr>
                  <th className="px-5 py-4 font-semibold">{t("Category")}</th>
                  <th className="px-5 py-4 font-semibold">{t("Slug")}</th>
                  <th className="px-5 py-4 font-semibold">{t("Description")}</th>
                  <th className="px-5 py-4 font-semibold">{t("Status")}</th>
                  <th className="px-5 py-4 font-semibold">{t("Order")}</th>
                  <th className="px-5 py-4 font-semibold">{t("Created")}</th>
                  <th className={`px-5 py-4 font-semibold ${isArabic ? "text-left" : "text-right"}`}>{t("Actions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {categories.map((category) => (
                  <tr key={category._id} className="align-middle transition-colors hover:bg-slate-50/70">
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        {category.icon ? (
                          <img src={formatImageUrl(category.icon)} alt="" loading="lazy" className="h-12 w-12 rounded-lg border border-slate-100 bg-white object-contain p-1" />
                        ) : (
                          <span className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-slate-50 text-slate-400"><ImageIcon size={20} /></span>
                        )}
                        <div>
                          <p className="font-semibold text-slate-900">{isArabic ? category.name_ar || category.name_en : category.name_en || category.name_ar}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 font-mono text-xs text-slate-600">{category.fullSlug || category.slug}</td>
                    <td className="max-w-56 truncate px-5 py-4 text-slate-500">{(isArabic ? category.description_ar || category.description_en : category.description_en || category.description_ar) || "—"}</td>
                    <td className="px-5 py-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${category.isActive === false ? "bg-slate-100 text-slate-600" : "bg-emerald-50 text-emerald-700"}`}>
                        {category.isActive === false ? t("Hidden") : t("Visible")}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-slate-600">{category.displayOrder ?? 0}</td>
                    <td className="px-5 py-4 text-slate-500">{category.createdAt ? new Date(category.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US") : "—"}</td>
                    <td className="px-5 py-4">
                      <div className="flex justify-end gap-2">
                        <button aria-label={`${t("Edit")} ${category.name_en}`} onClick={() => navigate(`/admin/editcategory/${category._id}`)} className="rounded-lg border border-slate-200 p-2 text-slate-600 hover:border-teal-200 hover:bg-teal-50 hover:text-teal-800">
                          <Edit size={16} />
                        </button>
                        <button aria-label={`Delete ${category.name_en}`} disabled={deletingId === category._id} onClick={() => handleDelete(category)} className="rounded-lg border border-slate-200 p-2 text-slate-500 hover:border-rose-200 hover:bg-rose-50 hover:text-rose-700 disabled:opacity-50">
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
      {categoryToDelete && (
        <ConfirmDialog
          title={t("Delete category?")}
          description={`${t("Delete")} "${categoryToDeleteName}"? ${t("Products must be reassigned or removed before deleting a category.")}`}
          confirmText={t("Delete")}
          cancelText={t("Cancel")}
          pendingText={t("Deleting...")}
          pending={deleteCategory.isPending}
          onConfirm={confirmDelete}
          onCancel={() => setCategoryToDelete(null)}
        />
      )}
    </div>
  );
}
