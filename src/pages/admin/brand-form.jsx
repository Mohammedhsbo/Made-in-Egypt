import { useEffect, useRef, useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { ArrowLeft } from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import api, { markApiErrorHandled } from "@/api/axios.base";
import ImageUploader from "@/components/admin/ImageUploader";
import { useLanguage } from "@/context/language.context";
import {
  deleteImage,
  getImageUploadErrorMessage,
  uploadImage,
} from "@/services/image-upload.service";
import { getManagedBrandsRequest } from "@/services/brand.service";

const emptyForm = {
  name_ar: "",
  name_en: "",
  isActive: true,
};

export default function BrandFormPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [resourceId, setResourceId] = useState("");
  const [form, setForm] = useState(emptyForm);
  const [logoFiles, setLogoFiles] = useState([]);
  const [currentLogo, setCurrentLogo] = useState(null);
  const [logoError, setLogoError] = useState("");
  const [formError, setFormError] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [saving, setSaving] = useState(false);
  const [removingLogo, setRemovingLogo] = useState(false);
  const hydratedBrandId = useRef("");
  const skipHydrationForId = useRef("");
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["managed-brands"],
    queryFn: getManagedBrandsRequest,
    enabled: Boolean(id),
  });
  const brands = data?.data?.data?.brands || [];
  const brand = brands.find((item) => item._id === id);
  const isEditing = Boolean(resourceId);

  useEffect(() => {
    if (!id) {
      hydratedBrandId.current = "";
      setResourceId("");
      setForm(emptyForm);
      setCurrentLogo(null);
      setLogoFiles([]);
      setLogoError("");
      setFormError("");
      return;
    }

    if (!brand || hydratedBrandId.current === id) return;
    hydratedBrandId.current = id;
    setResourceId(brand._id);
    setForm({
      name_ar: brand.name_ar || "",
      name_en: brand.name_en || "",
      isActive: brand.isActive !== false,
    });
    setCurrentLogo(brand.logoUrl ? { url: brand.logoUrl, key: brand.logoKey } : null);
    setFormError("");
    if (skipHydrationForId.current === id) {
      skipHydrationForId.current = "";
      return;
    }
    setLogoFiles([]);
    setLogoError("");
  }, [id, brand]);

  const refreshBrands = async () => Promise.all([
    queryClient.invalidateQueries({ queryKey: ["managed-brands"] }),
    queryClient.invalidateQueries({ queryKey: ["brands"] }),
  ]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    setFormError("");
    let savedId = resourceId;
    let uploadingLogo = false;
    try {
      const payload = {
        name_ar: form.name_ar.trim(),
        name_en: form.name_en.trim(),
        isActive: form.isActive,
      };
      const response = savedId
        ? await api.put(`/brands/${savedId}`, payload)
        : await api.post("/brands", payload);

      if (!savedId) {
        savedId = response.data.data.brand._id;
        setResourceId(savedId);
        if (logoFiles[0]) {
          skipHydrationForId.current = savedId;
          navigate(`/admin/managebrands/${savedId}/edit`, { replace: true });
        }
      }

      if (logoFiles[0]) {
        uploadingLogo = true;
        setUploadProgress(0);
        setLogoError("");
        const result = await uploadImage({
          resourceType: "brands",
          resourceId: savedId,
          assetType: "logo",
          file: logoFiles[0],
          onProgress: setUploadProgress,
        });
        setCurrentLogo(result.image);
        setLogoFiles([]);
        if (result.cleanupPending) {
          toast.warning(t("The new image is saved; cleanup of the previous image is pending."));
        }
      }

      await refreshBrands();
      toast.success(t(resourceId ? "Brand updated." : "Brand created."));
      navigate("/admin/managebrands");
    } catch (error) {
      markApiErrorHandled(error);
      await refreshBrands();
      const message = uploadingLogo
        ? getImageUploadErrorMessage(error, t)
        : error.response?.data?.message || t("Unable to save brand.");
      if (uploadingLogo) setLogoError(message);
      else setFormError(message);
      toast.error(message);
    } finally {
      setSaving(false);
      setUploadProgress(0);
    }
  };

  const removeLogo = async () => {
    if (!resourceId || !currentLogo) return;
    setRemovingLogo(true);
    setLogoError("");
    try {
      const result = await deleteImage({
        resourceType: "brands",
        resourceId,
        assetType: "logo",
      });
      setCurrentLogo(null);
      await refreshBrands();
      if (result.cleanupPending) toast.warning(t("The image was removed; storage cleanup is pending."));
    } catch (error) {
      markApiErrorHandled(error);
      const message = getImageUploadErrorMessage(error, t);
      setLogoError(message);
      toast.error(message);
    } finally {
      setRemovingLogo(false);
    }
  };

  if (id && (isLoading || (brand && !resourceId))) {
    return     <div className="admin-page rounded-2xl border border-slate-200 bg-white p-12 text-center text-slate-500">{t("Loading brands…")}</div>;
  }

  if (id && isError) {
    return (
      <div className="admin-page rounded-2xl border border-rose-100 bg-white p-10 text-center">
        <p className="mb-4 text-rose-700">{t("Could not load brands.")}</p>
        <button type="button" onClick={() => refetch()} className="rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
          {t("Try again")}
        </button>
      </div>
    );
  }

  if (id && !brand && !resourceId) {
    return (
      <div className="admin-page rounded-2xl border border-slate-200 bg-white p-10 text-center">
        <h1 className="text-xl font-bold text-slate-900">{t("Brand unavailable")}</h1>
        <button type="button" onClick={() => navigate("/admin/managebrands")} className="mt-4 rounded-lg border border-slate-300 px-4 py-2 font-semibold text-slate-700 hover:bg-slate-50">
          {t("Back to brands")}
        </button>
      </div>
    );
  }

  return (
    <section className="admin-page mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(27,52,43,0.07)] sm:p-8">
      <header className="mb-7">
        <button
          type="button"
          onClick={() => navigate("/admin/managebrands")}
          className="mb-5 inline-flex items-center gap-2 text-sm font-semibold text-slate-600 transition hover:text-[var(--primary)]"
        >
          <ArrowLeft size={17} /> {t("Back to brands")}
        </button>
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[var(--primary)]">{t("Store catalog")}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {t(isEditing ? "Edit brand" : "Create brand")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("Manage brand names and logos shown in the storefront.")}</p>
      </header>

      <form onSubmit={handleSubmit} className="space-y-6">
        <ImageUploader
          label={t("Brand logo")}
          images={currentLogo?.url ? [{ ...currentLogo, name: t("Current logo") }] : []}
          files={logoFiles}
          onFilesChange={(files) => {
            setLogoFiles(files.slice(0, 1));
            setLogoError("");
          }}
          onRemoveImage={removeLogo}
          uploading={saving || removingLogo}
          progress={uploadProgress}
          error={logoError}
        />

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            {t("English brand name")}
            <input
              required
              maxLength={120}
              value={form.name_en}
              onChange={(event) => setForm((current) => ({ ...current, name_en: event.target.value }))}
              dir="ltr"
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10"
            />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            {t("Arabic brand name")}
            <input
              required
              maxLength={120}
              dir="rtl"
              value={form.name_ar}
              onChange={(event) => setForm((current) => ({ ...current, name_ar: event.target.value }))}
              className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none transition focus:border-teal-700 focus:ring-2 focus:ring-teal-700/10"
            />
          </label>
        </div>

        <label className="flex items-center gap-3 rounded-lg border border-slate-200 px-3 py-3 text-sm font-medium text-slate-700">
          <input
            type="checkbox"
            checked={form.isActive}
            onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))}
            className="h-4 w-4 accent-teal-800"
          />
          {t("Show this brand in the storefront")}
        </label>

        {formError && <p role="alert" className="text-sm text-rose-700">{formError}</p>}

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate("/admin/managebrands")} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
            {t("Cancel")}
          </button>
          <button
            type="submit"
            disabled={saving || removingLogo}
            className="rounded-lg bg-[var(--primary)] px-5 py-2.5 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {saving ? t("Saving...") : t(isEditing ? "Save brand" : "Create brand")}
          </button>
        </div>
      </form>
    </section>
  );
}
