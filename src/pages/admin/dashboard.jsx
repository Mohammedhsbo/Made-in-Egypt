import { useEffect, useState } from "react";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { useSearch } from "@/context/searchContext";

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { searchTerm } = useSearch();

  
  const filteredProducts =
    searchTerm?.length > 0
      ? products.filter((product) =>
          product.title.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : products;

 
  useEffect(() => {
    async function fetchProducts() {
      try {
        const res = await axios.get(
          "https://ecommerce.routemisr.com/api/v1/products"
        );
        setProducts(res.data.data);
      } catch (err) {
        console.error(err);
        toast.error("فشل تحميل المنتجات");
      } finally {
        setLoading(false);
      }
    }

    fetchProducts();
  }, []);

  // تعديل (وهمي لأن API read-only)
  async function editProducts(id) {
    try {
      await axios.put(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
      toast.success("تم تحديث المنتج بنجاح");
    } catch (err) {
      console.error(err);
      toast.error("فشل تحديث المنتج");
    }
  }

  // حذف (local فقط)
  async function deleteProduct(id) {
     try{
       await axios.delete(`https://ecommerce.routemisr.com/api/v1/products/${id}`);
       toast.success("تم حذف المنتج بنجاح");

     }
     catch(err){
      console.error(err);
      toast.error("فشل حذف المنتج");
     }
  }

  // حالة التحميل
  if (loading) {
    return (
      <p className="flex min-h-screen justify-center items-center text-xl font-bold">
        جاري تحميل المنتجات...
      </p>
    );
  }

  // لا يوجد منتجات
  if (filteredProducts.length === 0) {
    return (
      <p className="flex min-h-screen justify-center items-center text-xl font-bold">
        لا يوجد منتجات
      </p>
    );
  }

  return (
    <div>
      <h1 className="text-3xl font-bold mb-6 text-center">
        إدارة المنتجات
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <div key={product._id} className="border p-4 rounded shadow">
            <img
              src={product.imageCover}
              alt={product.title}
              className="w-full h-48 object-cover rounded mb-2"
            />

            <h2 className="font-semibold">{product.title}</h2>
            <p>السعر: EGP {product.price}</p>
            <p>الكمية: {product.quantity}</p>

            <div className="flex gap-2 mt-2">
              <Button
                className="bg-blue-500 hover:bg-blue-600"
                onClick={() => editProducts(product._id)}
              >
                تعديل
              </Button>

              <Button
                className="bg-red-500 hover:bg-red-600"
                onClick={() => deleteProduct(product._id)}
              >
                حذف
              </Button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
