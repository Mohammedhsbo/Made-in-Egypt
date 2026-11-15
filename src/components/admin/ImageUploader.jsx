import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, UploadCloud, X } from "lucide-react";
import SafeImage from "@/components/ui/safe-image";
import { useLanguage } from "@/context/language.context";

const ACCEPTED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/avif"];
const ACCEPTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".webp", ".avif"];
const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_GALLERY_SIZE = 10;

const isAllowedImage = (file) => {
  const extension = file.name.slice(file.name.lastIndexOf(".")).toLowerCase();
  return ACCEPTED_TYPES.includes(file.type) || ACCEPTED_EXTENSIONS.includes(extension);
};

export default function ImageUploader({
  label,
  images = [],
  files = [],
  onFilesChange,
  onRemoveImage,
  multiple = false,
  uploading = false,
  progress = 0,
  error = "",
}) {
  const { t, isArabic } = useLanguage();
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [validationError, setValidationError] = useState("");
  const [dimensions, setDimensions] = useState({});
  const previews = useMemo(
    () => files.map((file) => ({
      file,
      url: URL.createObjectURL(file),
      id: `${file.name}-${file.lastModified}-${file.size}`,
    })),
    [files],
  );

  useEffect(() => () => previews.forEach(({ url }) => URL.revokeObjectURL(url)), [previews]);

  const acceptFiles = (selectedFiles) => {
    const incoming = Array.from(selectedFiles || []);
    if (!incoming.length) return;

    const invalidType = incoming.find((file) => !isAllowedImage(file));
    if (invalidType) {
      setValidationError(t("Choose a JPEG, PNG, WebP, or AVIF image."));
      return;
    }
    if (incoming.some((file) => file.size > MAX_FILE_SIZE)) {
      setValidationError(t("Image must be 5 MB or smaller."));
      return;
    }
    const nextFiles = multiple ? [...files, ...incoming] : [incoming[0]];
    if (multiple && nextFiles.length > MAX_GALLERY_SIZE) {
      setValidationError(t("You can upload up to 10 gallery images."));
      return;
    }

    setValidationError("");
    onFilesChange(nextFiles);
    if (inputRef.current) inputRef.current.value = "";
  };

  const removePendingFile = (fileToRemove) => {
    onFilesChange(files.filter((file) => file !== fileToRemove));
  };

  return (
    <section dir={isArabic ? "rtl" : "ltr"} className="space-y-3">
      <h3 className="text-sm font-semibold text-slate-800">{label}</h3>
      <div
        onDragOver={(event) => { event.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={(event) => {
          event.preventDefault();
          setDragging(false);
          acceptFiles(event.dataTransfer.files);
        }}
        className={`rounded-xl border-2 border-dashed p-4 transition-colors ${dragging ? "border-[#26716c] bg-teal-50" : "border-slate-200 bg-slate-50"}`}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp,image/avif,.jpg,.jpeg,.png,.webp,.avif"
          multiple={multiple}
          disabled={uploading}
          className="sr-only"
          onChange={(event) => acceptFiles(event.target.files)}
        />
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex min-h-24 w-full flex-col items-center justify-center gap-2 text-center text-slate-600 disabled:opacity-60"
        >
          <span className="rounded-full bg-white p-3 text-[#26716c] shadow-sm"><UploadCloud size={22} /></span>
          <span className="font-semibold">{t("Drag and drop, or click to browse")}</span>
          <span className="text-xs text-slate-500">{t("JPEG, PNG, WebP, or AVIF · up to 5 MB per image")}</span>
        </button>

        {(images.length > 0 || previews.length > 0) && (
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3">
            {images.map((image, index) => (
              <div key={`${image.key || image.url}-${index}`} className="relative overflow-hidden rounded-lg border border-slate-200 bg-white p-2">
                <SafeImage src={image.url} alt={label} loading="lazy" className="h-28 w-full rounded-md object-contain" />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => onRemoveImage?.(index)}
                  aria-label={`${t("Remove")} ${label}`}
                  className="absolute right-3 top-3 rounded-full bg-white/95 p-1.5 text-rose-700 shadow hover:bg-rose-50 disabled:opacity-50"
                >
                  <X size={15} />
                </button>
                <span className="mt-2 block truncate text-xs text-slate-500">{image.name || t("Current image")}</span>
              </div>
            ))}
            {previews.map(({ file, url, id }) => (
              <div key={id} className="relative overflow-hidden rounded-lg border border-[#26716c]/30 bg-white p-2">
                <img
                  src={url}
                  alt={file.name}
                  onLoad={(event) => {
                    const { naturalWidth, naturalHeight } = event.currentTarget;
                    setDimensions((current) => ({
                      ...current,
                      [id]: `${naturalWidth} × ${naturalHeight}`,
                    }));
                  }}
                  className="h-28 w-full rounded-md object-contain"
                />
                <button
                  type="button"
                  disabled={uploading}
                  onClick={() => removePendingFile(file)}
                  aria-label={`${t("Remove")} ${file.name}`}
                  className="absolute right-3 top-3 rounded-full bg-white/95 p-1.5 text-rose-700 shadow hover:bg-rose-50 disabled:opacity-50"
                >
                  <X size={15} />
                </button>
                <span className="mt-2 block truncate text-xs font-medium text-slate-700">{file.name}</span>
                <span className="block text-xs text-slate-500">
                  {[dimensions[id], `${(file.size / (1024 * 1024)).toFixed(2)} MB`].filter(Boolean).join(" · ")}
                </span>
              </div>
            ))}
          </div>
        )}

        {images.length === 0 && previews.length === 0 && (
          <div className="flex items-center justify-center gap-2 pb-1 text-slate-400">
            <ImagePlus size={16} />
            <span className="text-xs">{t("No image selected")}</span>
          </div>
        )}

        {uploading && (
          <div className="mt-4" role="status" aria-live="polite">
            <div className="mb-1 flex justify-between text-xs text-slate-500">
              <span>{t("Uploading image")}</span><span>{progress}%</span>
            </div>
            <div className="h-1.5 overflow-hidden rounded-full bg-slate-200">
              <div className="h-full bg-[#26716c] transition-all" style={{ width: `${progress}%` }} />
            </div>
          </div>
        )}
      </div>
      {(validationError || error) && (
        <p role="alert" className="text-sm text-rose-700">{validationError || error}</p>
      )}
    </section>
  );
}
