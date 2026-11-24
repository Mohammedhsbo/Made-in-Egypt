import { useEffect, useState } from "react";
import api from "@/api/axios.base";
import { toast } from "sonner";
import { useLanguage } from "@/context/language.context";

export default function WhatsAppSettings() {
  const { t } = useLanguage();
  const [form, setForm] = useState({
    country: "Egypt",
    countryCode: "+20",
    phoneNumber: "",
    enabled: false,
    defaultMessage: "",
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get("/settings/whatsapp").then((res) => {
      setForm((current) => ({ ...current, ...res.data.data.settings }));
    }).finally(() => setLoading(false));
  }, []);

  const change = (event) => {
    const { name, value, type, checked } = event.target;
    setForm((current) => ({ ...current, [name]: type === "checkbox" ? checked : value }));
  };

  const save = async (event) => {
    event.preventDefault();
    try {
      const res = await api.put("/settings/whatsapp", form);
      setForm((current) => ({ ...current, ...res.data.data.settings }));
      toast.success(t("WhatsApp settings saved."));
    } catch (_) {}
  };

  const previewNumber = `${String(form.countryCode).replace(/\D/g, "")}${String(form.phoneNumber).replace(/\D/g, "")}`;
  const previewUrl = form.enabled && previewNumber
    ? `https://wa.me/${previewNumber}?text=${encodeURIComponent(form.defaultMessage)}`
    : "";

  return (
    <div className="mx-auto max-w-4xl">
      <h1 className="text-2xl font-black text-slate-900">{t("WhatsApp Configuration")}</h1>
      <p className="mt-1 text-sm text-slate-500">{t("Configure the marketplace WhatsApp inquiry channel.")}</p>
      <form onSubmit={save} className="mt-6 grid gap-5 rounded-2xl border border-slate-200 bg-white p-5 sm:p-7">
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          {t("Country")}
          <input name="country" value={form.country} onChange={change} className="rounded-xl border border-slate-200 px-4 py-3" />
        </label>
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            {t("Country calling code")}
            <input name="countryCode" value={form.countryCode} onChange={change} placeholder="+20" className="rounded-xl border border-slate-200 px-4 py-3" />
          </label>
          <label className="grid gap-2 text-sm font-bold text-slate-700">
            {t("Phone number")}
            <input name="phoneNumber" value={form.phoneNumber} onChange={change} placeholder="10XXXXXXXX" className="rounded-xl border border-slate-200 px-4 py-3" />
          </label>
        </div>
        <label className="flex items-center gap-3 text-sm font-bold text-slate-700">
          <input type="checkbox" name="enabled" checked={form.enabled} onChange={change} className="h-5 w-5" />
          {t("Enable WhatsApp")}
        </label>
        <label className="grid gap-2 text-sm font-bold text-slate-700">
          {t("Default inquiry message")}
          <textarea name="defaultMessage" value={form.defaultMessage} onChange={change} rows={5} className="rounded-xl border border-slate-200 px-4 py-3" />
        </label>
        <div className="rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="mb-3 text-sm font-bold text-emerald-900">{t("Live WhatsApp button preview")}</p>
          {previewUrl ? (
            <a href={previewUrl} target="_blank" rel="noreferrer" className="inline-flex rounded-xl bg-[#25D366] px-5 py-3 font-bold text-white">{t("WhatsApp Inquiry")}</a>
          ) : (
            <span className="text-sm text-slate-500">{t("Enable WhatsApp and enter a valid number to preview.")}</span>
          )}
        </div>
        <button disabled={loading} className="h-12 rounded-xl bg-[#1a3a34] px-6 text-sm font-bold text-white disabled:opacity-60">{t("Save Changes")}</button>
      </form>
    </div>
  );
}
