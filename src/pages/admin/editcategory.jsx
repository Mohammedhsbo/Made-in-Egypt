import React, { useEffect, useState } from "react";
import api, { markApiErrorHandled } from "../../api/axios.base";
import { useParams } from "react-router-dom";
import { toast } from "sonner";
import CategoryForm from "@/components/admin/CategoryForm";
import { useLanguage } from "@/context/language.context";

export default function EditCategory() {
  const { t } = useLanguage();
  const { id } = useParams();
  const [fetchLoading, setFetchLoading] = useState(true);
  const [category, setCategory] = useState(null);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        const res = await api.get(`/categories/manage/${id}`);
        setCategory(res.data.data.category);
      } catch (err) {
        markApiErrorHandled(err);
        toast.error(t(err.response?.data?.message || "Unable to load category."));
      } finally {
        setFetchLoading(false);
      }
    };

    fetchCategory();
  }, [id]);

  if (fetchLoading) {
    return (
      <div className="flex justify-center items-center min-h-[40vh]">
        <p>{t("جاري تحميل البيانات...")}</p>
      </div>
    );
  }

  if (!category) return <p className="text-center text-slate-600">{t("Category not found.")}</p>;
  return <CategoryForm category={category} />;
}