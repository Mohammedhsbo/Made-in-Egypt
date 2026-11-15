import React, { useEffect, useState } from "react";
import api, { markApiErrorHandled } from "../../api/axios.base";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

import { formatImageUrl } from "@/utils/formatImageUrl";
import { getAllCategoriesRequest } from "@/services/category.service";
import { getManagedBrandsRequest } from "@/services/brand.service";
import { useLanguage } from "@/context/language.context";
import ImageUploader from "@/components/admin/ImageUploader";
import {
  deleteImage,
  getImageUploadErrorMessage,
  uploadImage,
} from "@/services/image-upload.service";

export default function CreateProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { t, isArabic } = useLanguage();

  const [loading, setLoading] = useState(false);
  const [categories, setCategories] = useState([]);
  const [brands, setBrands] = useState([]);
  const [savedProductId, setSavedProductId] = useState("");
  const [imageCoverKey, setImageCoverKey] = useState("");
  const [imageKeys, setImageKeys] = useState([]);
  const [coverFiles, setCoverFiles] = useState([]);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [uploadingAsset, setUploadingAsset] = useState("");
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadErrors, setUploadErrors] = useState({});
  const resourceId = id || savedProductId;
  const isEdit = Boolean(resourceId);

  const [form, setForm] = useState({
    title_ar: "",
    title_en: "",
    description_ar: "",
    description_en: "",
    basePrice: "",
    priceAfterDiscount: "",
    isOnSale: false,
    quantity: "",
    category: "",
    brand: "",
    imageCover: "",
    isFeatured: false,
  });

  // Fetch Categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await getAllCategoriesRequest();
        setCategories(res.data.data.categories || []);
      } catch (err) {
        console.log("Failed to fetch categories:", err);
      }
    };
    fetchCategories();
    const fetchBrands = async () => {
      try {
        const res = await getManagedBrandsRequest();
        setBrands(res.data.data.brands || []);
      } catch (error) {
        console.error("Failed to fetch brands:", error);
      }
    };
    fetchBrands();
  }, []);
  useEffect(() => {
    if (!id) return;

    const fetchProduct = async () => {
      try {
        const res = await api.get(`/products/${id}`);
        const p = res.data.data.product;

        setForm({
          title_ar: p.title_ar || "",
          title_en: p.title_en || "",
          description_ar: p.description_ar || "",
          description_en: p.description_en || "",
          basePrice: p.basePrice || "",
          priceAfterDiscount: p.priceAfterDiscount || "",
          isOnSale: p.isOnSale ?? (
            Number(p.priceAfterDiscount) > 0
            && Number(p.priceAfterDiscount) < Number(p.basePrice)
          ),
          quantity: p.quantity || "",
          category: p.category?._id || "",
          brand: p.brand?._id || p.brand || "",
          imageCover: p.imageCover || "",
          isFeatured: Boolean(p.isFeatured),
        });
        setImageCoverKey(p.imageCoverKey || "");
        setImageKeys(p.imageKeys || []);
        setGalleryImages(p.images || []);
      } catch (err) {
        console.log(err);
        markApiErrorHandled(err);
        toast.error(t("فشل تحميل المنتج"));
      }
    };

    fetchProduct();
  }, [id, t]);

  const [galleryImages, setGalleryImages] = useState([]);

  // ================= HANDLE CHANGE =================
  const handleChange = (e) => {
    const value =
      e.target.name === "imageCover"
        ? formatImageUrl(e.target.value)
        : e.target.value;
    setForm((prev) => ({
      ...prev,
      [e.target.name]: value,
    }));
    if (e.target.name === "imageCover" && value !== form.imageCover) setImageCoverKey("");
  };

  // ================= SUBMIT =================
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!resourceId && !coverFiles.length && !form.imageCover) {
      toast.error(t("Choose a main product image before creating the product."));
      return;
    }
    setLoading(true);
    let currentAsset = "";

    try {
      const payload = {
        title_ar: form.title_ar,
        title_en: form.title_en,
        description_ar: form.description_ar,
        description_en: form.description_en,
        basePrice: Number(form.basePrice),
        priceAfterDiscount: Number(form.priceAfterDiscount),
        isOnSale: form.isOnSale,
        quantity: Number(form.quantity),
        category: form.category,
        brand: form.brand || null,
        isFeatured: form.isFeatured,
      };
      if (form.imageCover) payload.imageCover = formatImageUrl(form.imageCover);

      let productId = resourceId;
      if (isEdit) {
        await api.put(`/products/${productId}`, payload);
      } else {
        const response = await api.post("/products", payload);
        productId = response.data.data.product._id;
        setSavedProductId(productId);
      }

      if (coverFiles[0]) {
        currentAsset = "cover";
        setUploadingAsset(currentAsset);
        setUploadProgress(0);
        setUploadErrors((current) => ({ ...current, [currentAsset]: "" }));
        const result = await uploadImage({
          resourceType: "products",
          resourceId: productId,
          assetType: "cover",
          file: coverFiles[0],
          onProgress: setUploadProgress,
        });
        setForm((current) => ({ ...current, imageCover: result.image.url }));
        setImageCoverKey(result.image.key);
        setCoverFiles([]);
        if (result.cleanupPending) toast.warning(t("The new image is saved; cleanup of the previous image is pending."));
      }

      let uploadedGalleryCount = 0;
      for (const file of galleryFiles) {
        currentAsset = "gallery";
        setUploadingAsset(currentAsset);
        setUploadProgress(0);
        setUploadErrors((current) => ({ ...current, [currentAsset]: "" }));
        const result = await uploadImage({
          resourceType: "products",
          resourceId: productId,
          assetType: "gallery",
          file,
          onProgress: setUploadProgress,
        });
        setGalleryImages((current) => [...current, result.image.url]);
        setImageKeys((current) => {
          const next = [...current];
          while (next.length < galleryImages.length + uploadedGalleryCount) next.push("");
          next.push(result.image.key);
          return next;
        });
        uploadedGalleryCount += 1;
        setGalleryFiles((current) => current.filter((pendingFile) => pendingFile !== file));
        if (result.cleanupPending) toast.warning(t("The new image is saved; cleanup of the previous image is pending."));
      }

      toast.success(isEdit ? t("تم تحديث المنتج بنجاح") : t("تم إنشاء المنتج بنجاح"));
      navigate("/admin");
    } catch (err) {
      markApiErrorHandled(err);
      const message = currentAsset
        ? getImageUploadErrorMessage(err, t)
        : t(err.response?.data?.message || "حدث خطأ أثناء الحفظ");
      if (currentAsset) setUploadErrors((current) => ({ ...current, [currentAsset]: message }));
      toast.error(message);
    } finally {
      setLoading(false);
      setUploadingAsset("");
      setUploadProgress(0);
    }
  };

  const removeProductImage = async (assetType, index) => {
    if (!resourceId) {
      if (assetType === "cover") setForm((current) => ({ ...current, imageCover: "" }));
      return;
    }
    setUploadingAsset(assetType);
    setUploadErrors((current) => ({ ...current, [assetType]: "" }));
    try {
      const result = await deleteImage({
        resourceType: "products",
        resourceId,
        assetType,
        ...(index === undefined ? {} : { index }),
      });
      if (assetType === "cover") {
        setForm((current) => ({ ...current, imageCover: "" }));
        setImageCoverKey("");
      } else {
        setGalleryImages((current) => current.filter((_, imageIndex) => imageIndex !== index));
        setImageKeys((current) => current.filter((_, imageIndex) => imageIndex !== index));
      }
      if (result.cleanupPending) toast.warning(t("The image was removed; storage cleanup is pending."));
    } catch (error) {
      markApiErrorHandled(error);
      toast.error(getImageUploadErrorMessage(error, t));
    } finally {
      setUploadingAsset("");
    }
  };

  return (
    <div className="admin-page mx-auto max-w-3xl rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_16px_44px_rgba(27,52,43,0.07)] sm:p-8">

      <header className="mb-6">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-emerald-800">{t("Store catalog")}</p>
        <h1 className="mt-1">
          {isEdit ? t("تعديل المنتج") : t("إضافة منتج جديد")}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input name="title_ar" value={form.title_ar} onChange={handleChange} placeholder={t("العنوان بالعربي")} dir="rtl" className="border px-3 py-2.5" />

        <input name="title_en" value={form.title_en} onChange={handleChange} placeholder={t("English Title")} className="border px-3 py-2.5" />

        <textarea name="description_ar" value={form.description_ar} onChange={handleChange} placeholder={t("الوصف بالعربي")} dir="rtl" className="border px-3 py-2.5" />

        <textarea name="description_en" value={form.description_en} onChange={handleChange} placeholder={t("English Description")} className="border px-3 py-2.5" />

        <input name="basePrice" value={form.basePrice} onChange={handleChange} type="number" placeholder={t("السعر الأساسي")} className="border px-3 py-2.5" />

        <input name="priceAfterDiscount" value={form.priceAfterDiscount} onChange={handleChange} type="number" placeholder={t("بعد الخصم")} className="border px-3 py-2.5" />

        <label className="flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-700">
          <input
            name="isOnSale"
            type="checkbox"
            checked={form.isOnSale}
            onChange={(event) => setForm((current) => ({ ...current, isOnSale: event.target.checked }))}
            className="h-4 w-4 accent-rose-700"
          />
          <span>
            <span className="block font-bold text-rose-800">{t("Show SALE label")}</span>
            <span className="mt-1 block text-xs text-slate-500">{t("This label appears on storefront product cards.")}</span>
          </span>
        </label>

        <input name="quantity" value={form.quantity} onChange={handleChange} type="number" placeholder={t("الكمية")} className="border px-3 py-2.5" />

        <label className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-slate-700">
          <input
            name="isFeatured"
            type="checkbox"
            checked={form.isFeatured}
            onChange={(event) => setForm((current) => ({ ...current, isFeatured: event.target.checked }))}
            className="mt-0.5 h-4 w-4 accent-emerald-800"
          />
          <span>
            <span className="block font-semibold text-emerald-950">{t("Feature as homepage offer")}</span>
            <span className="mt-1 block text-xs leading-5 text-slate-500">{t("This product will appear in the featured offer banner. Selecting it replaces the current offer.")}</span>
          </span>
        </label>

        <select
          name="category"
          value={form.category}
          onChange={handleChange}
          className="border px-3 py-2.5 text-gray-700"
        >
          <option value="">{t("اختر القسم (Category)")}</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {isArabic ? `${cat.name_ar} | ${cat.name_en}` : `${cat.name_en} | ${cat.name_ar}`}
            </option>
          ))}
        </select>

        <select
          name="brand"
          value={form.brand}
          onChange={handleChange}
          className="border px-3 py-2.5 text-gray-700"
        >
          <option value="">{t("No brand")}</option>
          {brands.map((brand) => (
            <option
              key={brand._id}
              value={brand._id}
              disabled={brand.isActive === false && brand._id !== form.brand}
            >
              {isArabic ? `${brand.name_ar} | ${brand.name_en}` : `${brand.name_en} | ${brand.name_ar}`}
              {brand.isActive === false ? ` (${t("Hidden")})` : ""}
            </option>
          ))}
        </select>

        <ImageUploader
          label={t("Main product image")}
          images={form.imageCover ? [{ url: formatImageUrl(form.imageCover), key: imageCoverKey }] : []}
          files={coverFiles}
          onFilesChange={(files) => {
            setCoverFiles(files);
            setUploadErrors((current) => ({ ...current, cover: "" }));
          }}
          onRemoveImage={() => removeProductImage("cover")}
          uploading={loading || uploadingAsset === "cover"}
          progress={uploadProgress}
          error={uploadErrors.cover}
        />

        <ImageUploader
          label={t("Product gallery images")}
          images={galleryImages.map((url, index) => ({
            url: formatImageUrl(url),
            key: imageKeys[index] || "",
          }))}
          files={galleryFiles}
          onFilesChange={(files) => {
            setGalleryFiles(files);
            setUploadErrors((current) => ({ ...current, gallery: "" }));
          }}
          onRemoveImage={(index) => removeProductImage("gallery", index)}
          multiple
          uploading={loading || uploadingAsset === "gallery"}
          progress={uploadProgress}
          error={uploadErrors.gallery}
        />

        <label className="block space-y-1 text-sm font-medium text-slate-700">
          {t("Image URL (optional)")}
          <input name="imageCover" value={form.imageCover} onChange={handleChange} placeholder={t("Paste an existing public image URL")} className="w-full border px-3 py-2.5" />
        </label>

        <button
          disabled={loading || Boolean(uploadingAsset)}
          className="rounded-xl bg-[var(--primary)] py-3 font-semibold text-white transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? t("جاري الحفظ...") : isEdit ? t("تحديث المنتج") : t("إنشاء المنتج")}
        </button>

      </form>
      
      <div>
       
      </div>
    </div>
  );
}