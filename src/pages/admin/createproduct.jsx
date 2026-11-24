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
    moq: "",
    unitOfMeasurement: "",
    packagingUnit: "carton",
    unitsPerCarton: "",
    weightPerUnitKg: "",
    wholesalePrice: "",
    leadTimeMinDays: "",
    leadTimeMaxDays: "",
    flcQuantity20ft: "",
    flcQuantity40ftHc: "",
    cartonDimensions: "",
    packagingDetails: "",
    originCountry: "",
    hsCode: "",
    sku: "",
    datasheetUrl: "",
    catalogUrl: "",
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
          moq: p.moq ?? "",
          unitOfMeasurement: p.unitOfMeasurement || "",
          packagingUnit: p.packagingUnit || (/kg|kilogram/i.test(p.unitOfMeasurement || "") ? "kg" : "carton"),
          unitsPerCarton: p.unitsPerCarton ?? "",
          weightPerUnitKg: p.weightPerUnitKg ?? "",
          wholesalePrice: p.wholesalePrice ?? "",
          leadTimeMinDays: p.leadTimeMinDays ?? "",
          leadTimeMaxDays: p.leadTimeMaxDays ?? "",
          flcQuantity20ft: p.flcQuantity20ft ?? "",
          flcQuantity40ftHc: p.flcQuantity40ftHc ?? "",
          cartonDimensions: p.cartonDimensions || "",
          packagingDetails: p.packagingDetails || "",
          originCountry: p.originCountry || "",
          hsCode: p.hsCode || "",
          sku: p.sku || "",
          datasheetUrl: p.datasheetUrl || "",
          catalogUrl: p.catalogUrl || "",
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
        moq: form.moq === "" ? null : Number(form.moq),
        unitOfMeasurement: form.unitOfMeasurement,
        packagingUnit: form.packagingUnit,
        unitsPerCarton: form.unitsPerCarton === "" ? null : Number(form.unitsPerCarton),
        weightPerUnitKg: form.weightPerUnitKg === "" ? null : Number(form.weightPerUnitKg),
        wholesalePrice: form.wholesalePrice === "" ? null : Number(form.wholesalePrice),
        leadTimeMinDays: form.leadTimeMinDays === "" ? null : Number(form.leadTimeMinDays),
        leadTimeMaxDays: form.leadTimeMaxDays === "" ? null : Number(form.leadTimeMaxDays),
        flcQuantity20ft: form.flcQuantity20ft === "" ? null : Number(form.flcQuantity20ft),
        flcQuantity40ftHc: form.flcQuantity40ftHc === "" ? null : Number(form.flcQuantity40ftHc),
        cartonDimensions: form.cartonDimensions,
        packagingDetails: form.packagingDetails,
        originCountry: form.originCountry,
        hsCode: form.hsCode,
        sku: form.sku,
        datasheetUrl: form.datasheetUrl,
        catalogUrl: form.catalogUrl,
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
    <div className="admin-page mx-auto max-w-6xl">
      <header className="mb-5">
        <h1>{isEdit ? t("تعديل المنتج") : t("إضافة منتج جديد")}</h1>
      </header>

      <form onSubmit={handleSubmit} className="admin-product-form space-y-5">
        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-sm font-black text-emerald-800">01</span>
            <h2 className="text-lg font-extrabold text-slate-900">{t("Product information")}</h2>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("العنوان بالعربي")}
              <input name="title_ar" value={form.title_ar} onChange={handleChange} dir="rtl" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("English Title")}
              <input name="title_en" value={form.title_en} onChange={handleChange} dir="ltr" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("الوصف بالعربي")}
              <textarea name="description_ar" value={form.description_ar} onChange={handleChange} dir="rtl" rows={4} className="w-full resize-y px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("English Description")}
              <textarea name="description_en" value={form.description_en} onChange={handleChange} dir="ltr" rows={4} className="w-full resize-y px-3 py-2.5" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-amber-50 text-sm font-black text-amber-800">02</span>
            <h2 className="text-lg font-extrabold text-slate-900">{t("Price & inventory")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("السعر الأساسي")}
              <input name="basePrice" value={form.basePrice} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("بعد الخصم")}
              <input name="priceAfterDiscount" value={form.priceAfterDiscount} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("المخزون المتاح")}
              <input name="quantity" value={form.quantity} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("آخر سعر معروف")}
              <input name="wholesalePrice" value={form.wholesalePrice} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
          </div>
          <label className="mt-4 flex items-center gap-3 rounded-xl border border-rose-100 bg-rose-50/60 p-4 text-sm text-slate-700">
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
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-sky-50 text-sm font-black text-sky-800">03</span>
            <h2 className="text-lg font-extrabold text-slate-900">{t("Product categorization")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Category")}
              <select name="category" value={form.category} onChange={handleChange} className="w-full px-3 py-2.5 text-gray-700">
                <option value="">{t("اختر القسم (Category)")}</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {isArabic ? `${cat.name_ar} | ${cat.name_en}` : `${cat.name_en} | ${cat.name_ar}`}
                  </option>
                ))}
              </select>
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Brand")}
              <select name="brand" value={form.brand} onChange={handleChange} className="w-full px-3 py-2.5 text-gray-700">
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
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-sm font-black text-violet-800">04</span>
            <h2 className="text-lg font-extrabold text-slate-900">{t("B2B Product Information")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Minimum Order Quantity (MOQ)")}
              <input name="moq" value={form.moq} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Unit of Measurement")}
              <input name="unitOfMeasurement" value={form.unitOfMeasurement} onChange={handleChange} className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Product packaging unit")}
              <select name="packagingUnit" value={form.packagingUnit} onChange={handleChange} className="w-full px-3 py-2.5">
                <option value="carton">{t("Carton")}</option>
                <option value="kg">{t("Kilogram")}</option>
                <option value="unit">{t("Unit")}</option>
              </select>
            </label>
            {form.packagingUnit === "carton" && (
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                {t("Units per carton")}
                <input name="unitsPerCarton" value={form.unitsPerCarton} onChange={handleChange} type="number" min="0" className="w-full px-3 py-2.5" />
              </label>
            )}
            {form.packagingUnit === "carton" ? (
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                {t("Weight (Carton)")}
                <input name="weightPerUnitKg" value={form.weightPerUnitKg} onChange={handleChange} type="number" min="0" step="0.01" className="w-full px-3 py-2.5" />
              </label>
            ) : form.packagingUnit === "kg" ? (
              <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
                {t("Weight per unit (kg)")}
                <input name="weightPerUnitKg" value={form.weightPerUnitKg} onChange={handleChange} type="number" min="0" step="0.01" className="w-full px-3 py-2.5" />
              </label>
            ) : null}
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Lead time minimum days")}
              <input name="leadTimeMinDays" value={form.leadTimeMinDays} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Lead time maximum days")}
              <input name="leadTimeMaxDays" value={form.leadTimeMaxDays} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {form.packagingUnit === "kg" ? t("20 FT container weight (kg)") : t("20 FT container quantity")}
              <input name="flcQuantity20ft" value={form.flcQuantity20ft} onChange={handleChange} type="number" className="w-full px-3 py-2.5" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-sm font-black text-orange-800">05</span>
            <h2 className="text-lg font-extrabold text-slate-900">{t("Identification & documents")}</h2>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              {t("Country of origin")}
              <input name="originCountry" value={form.originCountry} onChange={handleChange} className="w-full px-3 py-2.5" />
            </label>
            <label className="grid gap-1.5 text-sm font-semibold text-slate-700">
              <span>{t("Product Code")} <span className="font-normal text-slate-400">({t("Optional")})</span></span>
              <input name="hsCode" value={form.hsCode} onChange={handleChange} className="w-full px-3 py-2.5" />
            </label>
          </div>
        </section>

        <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm sm:p-7">
          <div className="mb-5 flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-sm font-black text-teal-800">06</span>
            <h2 className="text-lg font-extrabold text-slate-900">{t("Product images")}</h2>
          </div>
          <div className="grid gap-6 lg:grid-cols-2">
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
          </div>
          <label className="mt-5 grid gap-1.5 text-sm font-semibold text-slate-700">
            {t("Image URL (optional)")}
            <input name="imageCover" value={form.imageCover} onChange={handleChange} placeholder={t("Paste an existing public image URL")} className="w-full px-3 py-2.5" />
          </label>
        </section>

        <label className="flex items-start gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/70 p-4 text-sm text-slate-700 sm:p-5">
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

        <div className="flex justify-end rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm sm:p-4">
          <button
            type="submit"
            disabled={loading || Boolean(uploadingAsset)}
            className="w-full rounded-xl bg-[var(--primary)] px-8 py-3 font-bold text-white shadow-sm transition hover:brightness-110 disabled:cursor-not-allowed disabled:opacity-60 sm:w-auto"
          >
            {loading ? t("جاري الحفظ...") : isEdit ? t("تحديث المنتج") : t("إنشاء المنتج")}
          </button>
        </div>
      </form>
    </div>
  );
}