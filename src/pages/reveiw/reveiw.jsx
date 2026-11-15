import React, { useCallback, useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import api, { markApiErrorHandled } from "../../api/axios.base";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import { useLanguage } from "@/context/language.context";

export default function Reviews() {
  const { id } = useParams();
  const { t, isArabic } = useLanguage();

  const [reviews, setReviews] = useState([]);
  const [comment, setComment] = useState("");
  const [rating, setRating] = useState(1);
  const getReviews = useCallback(async () => {
    try {
      const res = await api.get(`/reviews/product/${id}`);
      setReviews(res.data.data?.reviews || []);
    } catch (err) {
      console.log(err);
    }
  }, [id]);

  // ✅ add review
  async function addReview(e) {
    e.preventDefault();

    if (!comment.trim()) {
      toast.error(t("اكتب تعليق قبل الاضافة"));
      return;
    }

    try {
      const payload = {
        product: id,
        productId: id,
        comment: comment.trim(),
        comment_ar: comment.trim(),
        rating,
      };

      await api.post(`/reviews`, payload);


      toast.success(t("تمت اضافة التقييم"));
      setComment("");
      setRating(1);

      getReviews();
    } catch (err) {
      console.log(err);
      markApiErrorHandled(err);
      toast.error(err?.response?.data?.message || t("فشل اضافة التقييم"));
    }
  }
  async function deleteReview(reviewId) {
    try {
      await api.delete(`/reviews/${reviewId}`);
      toast.success(t("تم حذف التقييم"));
      getReviews();
    } catch (err) {
      console.log(err);
      markApiErrorHandled(err);
      toast.error(err?.response?.data?.message || t("فشل حذف التقييم"));
    }
  }

  useEffect(() => {
    const loadReviews = async () => {
      await getReviews();
    };
    loadReviews();
  }, [getReviews]);

  return (
 <div dir={isArabic ? "rtl" : "ltr"} className={`w-full p-4 ${isArabic ? "text-right" : "text-left"}`}>
<h2 className="text-2xl font-bold mb-6 text-right border-r-4 border-emerald-700 pr-3">
  {t("التقييمات")}
</h2>

  {/* ✅ form */}
<form
  onSubmit={addReview}
  className="mb-6 flex flex-col gap-3 md:flex-row md:items-center"
>
  {/* input */}
  <input
    type="text"
    placeholder={t("اكتب تعليقك هنا...")}
    value={comment}
    onChange={(e) => setComment(e.target.value)}
    className="border rounded-lg p-2 w-full focus:outline-none focus:ring-2 focus:ring-emerald-700 text-right"
  />

  {/* controls */}
  <div className="flex gap-2 justify-between md:justify-start">
    <select
      value={rating}
      onChange={(e) => setRating(Number(e.target.value))}
      className="border rounded-lg p-2"
    >
      {[1, 2, 3, 4, 5].map((r) => (
        <option key={r} value={r}>
          ⭐ {r}
        </option>
      ))}
    </select>

    <button className="bg-emerald-800 hover:bg-emerald-900 text-white px-4 py-2 rounded-lg transition">
      {t("إضافة")}
    </button>
  </div>
</form>

  {/* ✅ عرض التقييمات */}
  {reviews.length === 0 ? (
    <p className="text-center text-gray-500">{t("لا يوجد تقييمات بعد")}</p>
  ) : (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div
          key={review._id}
          className="bg-white shadow-md rounded-xl p-4 border hover:shadow-lg transition"
        >
          {/* الهيدر */}
          <div className="flex justify-between items-center mb-2">
             <div className="flex items-center gap-2">
             

              <span className="w-8 h-8 bg-emerald-800 text-white rounded-full flex items-center justify-center text-sm font-bold">
                {review.user?.name?.charAt(0)?.toUpperCase() || "?"}
              </span>
               <p className="font-semibold text-gray-800">
                {review.user?.name || t("مستخدم")}
              </p>
            </div>
            {/* النجوم */}
            <p className="text-yellow-500 text-sm">
              {"⭐".repeat(review.rating)}
            </p>

            {/* اسم اليوزر */}
           
          </div>

          {/* الكومنت */}
          <p className="text-gray-600 text-right leading-relaxed">
            {isArabic ? review.comment_ar : review.comment || review.comment_ar}
          </p>

          {/* التاريخ */}
          <div className="flex justify-between  items-center w-full">
            <p className="text-xs text-gray-400 mt-2 text-left">
            {new Date(review.createdAt).toLocaleDateString(isArabic ? "ar-EG" : "en-US")}
          </p>

          <button
            onClick={() => deleteReview(review._id)}
            className="bg-red-500 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition"
          >
            <Trash2 className="w-4 h-4 " aria-label={t("حذف التقييم")} />
          </button>
          </div>
        </div>
      ))}
    </div>
  )}
</div>
  );
  }