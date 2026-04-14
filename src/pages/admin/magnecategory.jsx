import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Edit, Trash2, Plus, Tag } from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../../api/axios.base";

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  // ================= GET ALL =================
  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const res = await api.get("/categories");
      setCategories(res.data.data.categories);
    } catch (err) {
      console.log(err);
      toast.error("فشل تحميل الكاتيجوري");
    } finally {
      setLoading(false);
    }
  };

  // ================= DELETE =================
  const deleteCategory = async (id) => {
    try {
      await api.delete(`/categories/${id}`);
      toast.success("تم حذف التصنيف");

      setCategories((prev) => prev.filter((c) => c._id !== id));
    } catch (err) {
      console.log(err);
      toast.error("فشل الحذف");
    }
  };

  // ================= NAVIGATE EDIT =================
  const goToEdit = (id) => {
    navigate(`/admin/editcategory/${id}`);
  };

  return (
    <div className="w-full">

      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-3xl font-black text-slate-800">
            إدارة التصنيفات
          </h1>
          <p className="text-gray-500">إدارة جميع الكاتيجوري</p>
        </div>

        <Button
          onClick={() => navigate("/admin/createcategory")}
          className="bg-primary text-white gap-2"
        >
          <Plus size={18} />
          إضافة تصنيف
        </Button>
      </div>

      {/* LOADING */}
      {loading ? (
        <div className="flex justify-center py-20">
          <p>جاري التحميل...</p>
        </div>
      ) : categories.length === 0 ? (
        <div className="text-center py-20">
          <Tag size={40} className="mx-auto text-gray-300 mb-3" />
          <p className="text-gray-500">لا توجد تصنيفات</p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow border overflow-hidden">
          <table className="w-full text-right">

            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="p-4">Icon</th>
                <th className="p-4">الاسم</th>
                <th className="p-4">Slug</th>
                <th className="p-4 text-left">إجراءات</th>
              </tr>
            </thead>

            <tbody>
              {categories.map((cat) => (
                <tr key={cat._id} className="border-b hover:bg-gray-50">

                  <td className="p-4">
                    <img
                      src={cat.icon}
                      alt={cat.name_en}
                      className="w-10 h-10 object-cover rounded"
                    />
                  </td>

                  <td className="p-4 font-bold">
                    {cat.name_ar || cat.name_en}
                  </td>

                  <td className="p-4 text-gray-500">
                    {cat.slug}
                  </td>

                  <td className="p-4 flex justify-end gap-2">

                    <button
                      onClick={() => goToEdit(cat._id)}
                      className="bg-blue-50 text-blue-600 p-2 rounded"
                    >
                      <Edit size={16} />
                    </button>

                    <button
                      onClick={() => deleteCategory(cat._id)}
                      className="bg-red-50 text-red-600 p-2 rounded"
                    >
                      <Trash2 size={16} />
                    </button>

                  </td>

                </tr>
              ))}
            </tbody>

          </table>
        </div>
      )}
    </div>
  );
}