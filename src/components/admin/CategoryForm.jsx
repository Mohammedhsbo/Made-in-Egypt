import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import api, { markApiErrorHandled } from "@/api/axios.base";
import { formatImageUrl } from "@/utils/formatImageUrl";
import { useLanguage } from "@/context/language.context";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  deleteImage,
  getImageUploadErrorMessage,
  uploadImage,
} from "@/services/image-upload.service";

const slugify = (value) => value
  .toLowerCase()
  .trim()
  .replace(/[^a-z0-9]+/g, "-")
  .replace(/^-|-$/g, "");

export default function CategoryForm({ category }) {
  const [form, setForm] = useState({
    name_en: category?.name_en || "",
    name_ar: category?.name_ar || "",
    slug: category?.slug || "",
    description_en: category?.description_en || "",
    description_ar: category?.description_ar || "",
    displayOrder: category?.displayOrder ?? 0,
    isActive: category?.isActive !== false,
    icon: category?.icon || "",
    coverImageUrl: category?.coverImageUrl || "",
  });
  const [resourceId, setResourceId] = useState(category?._id || "");
  const [imageKeys, setImageKeys] = useState({
    thumbnail: category?.imageKey || "",
    cover: category?.coverImageKey || "",
  });
  const [thumbnailFiles, setThumbnailFiles] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [saving, setSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadingAsset, setUploadingAsset] = useState("");
  const [uploadErrors, setUploadErrors] = useState({});
  const [slugTouched, setSlugTouched] = useState(Boolean(category));
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const isEditing = Boolean(resourceId);

  const setField = (event) => {
    const { name, value } = event.target;
    setForm((current) => ({
      ...current,
      [name]: value,
      ...(name === "name_en" && !slugTouched ? { slug: slugify(value) } : {}),
    }));
  };

  const removeAsset = async (assetType) => {
    if (!resourceId) return;
    setUploadingAsset(assetType);
    setUploadErrors((current) => ({ ...current, [assetType]: "" }));
    try {
      const result = await deleteImage({
        resourceType: "categories",
        resourceId,
        assetType,
      });
      setForm((current) => ({
        ...current,
        ...(assetType === "thumbnail" ? { icon: "" } : { coverImageUrl: "" }),
      }));
      setImageKeys((current) => ({ ...current, [assetType]: "" }));
      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["managed-categories"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["category"] }),
      ]);
      if (result.cleanupPending) toast.warning(t("The image was removed; storage cleanup is pending."));
    } catch (error) {
      markApiErrorHandled(error);
      toast.error(getImageUploadErrorMessage(error, t));
    } finally {
      setUploadingAsset("");
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setSaving(true);
    let currentAsset = "";
    try {
      let savedId = resourceId;
      if (savedId) {
        await api.put(`/categories/${savedId}`, form);
      } else {
        const response = await api.post("/categories", form);
        savedId = response.data.data.category._id;
        setResourceId(savedId);
      }

      const pendingUploads = [
        { assetType: "thumbnail", file: thumbnailFiles[0], setFiles: setThumbnailFiles },
        { assetType: "cover", file: coverFiles[0], setFiles: setCoverFiles },
      ].filter(({ file }) => file);

      for (const { assetType, file, setFiles } of pendingUploads) {
        currentAsset = assetType;
        setUploadingAsset(assetType);
        setUploadProgress(0);
        setUploadErrors((current) => ({ ...current, [assetType]: "" }));
        const result = await uploadImage({
          resourceType: "categories",
          resourceId: savedId,
          assetType,
          file,
          onProgress: setUploadProgress,
        });
        setForm((current) => ({
          ...current,
          ...(assetType === "thumbnail" ? { icon: result.image.url } : { coverImageUrl: result.image.url }),
        }));
        setImageKeys((current) => ({ ...current, [assetType]: result.image.key }));
        setFiles([]);
        if (result.cleanupPending) toast.warning(t("The new image is saved; cleanup of the previous image is pending."));
      }

      await Promise.all([
        queryClient.invalidateQueries({ queryKey: ["managed-categories"] }),
        queryClient.invalidateQueries({ queryKey: ["categories"] }),
        queryClient.invalidateQueries({ queryKey: ["category"] }),
      ]);
      toast.success(isEditing ? t("Category updated.") : t("Category created."));
      navigate("/admin/managecategories");
    } catch (error) {
      markApiErrorHandled(error);
      const message = currentAsset
        ? getImageUploadErrorMessage(error, t)
        : t(error.response?.data?.message || "Unable to save this category.");
      if (currentAsset) {
        setUploadErrors((current) => ({ ...current, [currentAsset]: message }));
      }
      toast.error(message);
    } finally {
      setSaving(false);
      setUploadingAsset("");
      setUploadProgress(0);
    }
  };

  return (
    <section className="admin-page mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(27,52,43,0.07)] sm:p-8">
      <div className="mb-7">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-[#26716c]">{t("Store catalog")}</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">
          {isEditing ? t("Edit category") : t("Add a category")}
        </h1>
        <p className="mt-1 text-sm text-slate-500">{t("Manage how this category appears in the storefront.")}</p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid gap-5 md:grid-cols-2">
          <ImageUploader
            label={t("Category thumbnail")}
            images={form.icon ? [{ url: formatImageUrl(form.icon), key: imageKeys.thumbnail }] : []}
            files={thumbnailFiles}
            onFilesChange={(files) => {
              setThumbnailFiles(files);
              setUploadErrors((current) => ({ ...current, thumbnail: "" }));
            }}
            onRemoveImage={() => removeAsset("thumbnail")}
            uploading={saving || uploadingAsset === "thumbnail"}
            progress={uploadProgress}
            error={uploadErrors.thumbnail}
          />
          <ImageUploader
            label={t("Category cover image")}
            images={form.coverImageUrl ? [{ url: formatImageUrl(form.coverImageUrl), key: imageKeys.cover }] : []}
            files={coverFiles}
            onFilesChange={(files) => {
              setCoverFiles(files);
              setUploadErrors((current) => ({ ...current, cover: "" }));
            }}
            onRemoveImage={() => removeAsset("cover")}
            uploading={saving || uploadingAsset === "cover"}
            progress={uploadProgress}
            error={uploadErrors.cover}
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            {t("English name")}
            <input name="name_en" required value={form.name_en} onChange={setField} dir="ltr" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#26716c] focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            {t("Arabic name")}
            <input name="name_ar" required value={form.name_ar} onChange={setField} dir="rtl" className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#26716c] focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            {t("Slug")}
            <input name="slug" required pattern="[a-z0-9]+(?:-[a-z0-9]+)*" value={form.slug} onChange={(event) => { setSlugTouched(true); setField(event); }} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#26716c] focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700">
            {t("Display order")}
            <input name="displayOrder" type="number" min="0" step="1" value={form.displayOrder} onChange={setField} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#26716c] focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            {t("Description (English)")}
            <textarea name="description_en" rows="3" dir="ltr" value={form.description_en} onChange={setField} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#26716c] focus:ring-2 focus:ring-teal-100" />
          </label>
          <label className="space-y-1.5 text-sm font-medium text-slate-700 sm:col-span-2">
            {t("Description (Arabic)")}
            <textarea name="description_ar" rows="3" dir="rtl" value={form.description_ar} onChange={setField} className="w-full rounded-lg border border-slate-300 px-3 py-2.5 outline-none focus:border-[#26716c] focus:ring-2 focus:ring-teal-100" />
          </label>
        </div>

        <label className="flex items-center gap-3 text-sm font-medium text-slate-700">
          <input type="checkbox" checked={form.isActive} onChange={(event) => setForm((current) => ({ ...current, isActive: event.target.checked }))} className="h-4 w-4 accent-[#26716c]" />
          {t("Show this category in the public store")}
        </label>

        <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-5 sm:flex-row sm:justify-end">
          <button type="button" onClick={() => navigate("/admin/managecategories")} className="rounded-lg border border-slate-300 px-5 py-2.5 font-semibold text-slate-700 hover:bg-slate-50">
            {t("Cancel")}
          </button>
          <button type="submit" disabled={saving || Boolean(uploadingAsset)} className="rounded-lg bg-[#073b3a] px-5 py-2.5 font-semibold text-white transition hover:bg-[#0b514f] disabled:cursor-not-allowed disabled:opacity-60">
            {saving ? t("Saving...") : isEditing ? t("Save changes") : t("Create category")}
          </button>
        </div>
      </form>
    </section>
  );
}
