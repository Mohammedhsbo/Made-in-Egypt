import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearch } from "@/context/searchContext";
import { Edit, Trash2, Package, Search, Plus } from "lucide-react";
import api from "../../api/axios.base";
import { useNavigate } from "react-router-dom";
import SafeImage from "@/components/ui/safe-image";



export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm, setSearchTerm } = useSearch();
    const navigate = useNavigate();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await api.get("/products");

        setProducts(res.data.data.products); // ✅ FIX
      } catch (err) {
        toast.error("فشل تحميل المنتجات");
        console.error(err);
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // ✅ search fix
  const filteredProducts =
    searchTerm?.length > 0
      ? products.filter((product) =>
          (product.title_ar || product.title_en)
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase())
        )
      : products;

  async function deleteProduct(id) {
    try {
      await api.delete(`/products/${id}`);
      toast.success("تم حذف المنتج");

      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (err) {
      console.error(err);
      toast.error("فشل الحذف");
    }
  }

//   async function editProducts(id, updatedData) {
//   try {
//     const res = await api.put(`/products/${id}`, updatedData);

//     console.log(res.data);
//     toast.success("تم تحديث المنتج بنجاح");
//   } catch (err) {
//     console.error(err);
//     toast.error("فشل تحديث المنتج");
//   }
// }

  return (
    <div className="w-full">

      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">إدارة المنتجات</h1>

        <Button onClick={() => (window.location.href = "/admin/createproduct")}>
          <Plus className="w-4 h-4 ml-2" />
          إضافة منتج
        </Button>
      </div>

      {/* Search */}
      <div className="relative mb-6">
        <Search className="absolute right-3 top-3 text-gray-400" />
        <input
          className="w-full border p-2 pr-10 rounded"
          placeholder="بحث..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Loading */}
      {loading ? (
        <p>Loading...</p>
      ) : filteredProducts.length === 0 ? (
        <p>لا توجد منتجات</p>
      ) : (
        <div className="grid gap-4">

          {filteredProducts.map((product) => (
            <div
              key={product._id}
              className="border p-4 rounded flex justify-between items-center"
            >

              {/* Image */}
              <SafeImage
                src={product.imageCover}
                className="w-16 h-16 object-cover rounded"
              />

              {/* Info */}
              <div className="flex-1 px-4">
                <h3 className="font-bold">
                  {product.title_ar || product.title_en}
                </h3>

                <p className="text-sm text-gray-500">
                  {product.basePrice} EGP
                </p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">

               <button
  onClick={() => navigate(`/admin/editproduct/${product._id}`)}
  className="bg-indigo-50 text-indigo-600 p-2 rounded-lg"
>
  <Edit size={16} />
</button>

                <button
                  onClick={() => deleteProduct(product._id)}
                  className="p-2 bg-red-100 rounded"
                >
                  <Trash2 size={16} />
                </button>

              </div>
            </div>
          ))}

        </div>
      )}
    </div>
  );
}