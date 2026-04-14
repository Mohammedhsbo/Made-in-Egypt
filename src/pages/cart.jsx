import { Button } from "@/components/ui/button";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus, CreditCard } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const items = cart?.items || [];

  const total = Array.isArray(items)
    ? items.reduce((sum, item) => {
        const price =
          item.price ||
          0;

        return sum + price * (item.quantity || 1);
      }, 0)
    : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full mt-4">
      <div className="flex items-center gap-3 mb-10 border-b pb-6">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <ShoppingBag size={28} />
        </div>

        <h2 className="text-3xl md:text-4xl font-black text-slate-800">
          سلة المشتريات
        </h2>

        {/* FIXED */}
        <span className="text-muted-foreground mr-auto text-lg font-medium">
          {items.length} من العناصر
        </span>
      </div>

      {!items.length ? (
        <div className="flex flex-col min-h-[50vh] justify-center items-center gap-6 py-12">
          <div className="bg-gray-50 rounded-full w-32 h-32 flex items-center justify-center mb-2 shadow-inner border border-gray-100">
            <ShoppingBag size={50} className="text-gray-300" />
          </div>

          <h3 className="text-3xl font-bold text-gray-800">
            سلتك فارغة تماماً
          </h3>

          <p className="text-gray-500 text-lg mb-4 text-center max-w-md">
            يبدو أنك لم تقم بإضافة أي منتجات حتى الآن.
          </p>

          <Link to="/">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-lg font-bold">
              تصفح المنتجات الآن
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">

          {/* ITEMS */}
          <div className="lg:w-2/3 space-y-6">

            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden md:grid grid-cols-12 gap-4 text-gray-500 font-semibold mb-2 px-8">
              <div className="col-span-6">المنتجات</div>
              <div className="col-span-3 text-center">الكمية</div>
              <div className="col-span-2 text-center">السعر</div>
              <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              {items.map((item, index) => (
                <div
                  key={item._id || index}
                  className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6 relative group transition-all hover:shadow-md"
                >

                  {/* PRODUCT */}
                  <div className="flex items-center gap-4 w-full md:w-1/2">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 border border-gray-100 overflow-hidden">
                      <img
                        src={
                          item.product?.imageCover ||
                          item.product?.images?.[0]
                        }
                        alt={item.product?.title_ar || "منتج"}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>

                    <div>
                      <Link
                        to={`/productdetails/${item.product?._id}`}
                        className="font-bold text-lg text-slate-800 hover:text-primary transition-colors"
                      >
                        {item.product?.title_ar || item.product?.title_en}
                      </Link>
                    </div>
                  </div>

                  {/* QTY */}
                  <div className="w-full md:w-1/4 flex justify-between md:justify-center items-center">
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-10 w-[110px]">

                      <button
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) - 1)
                        }
                        className="w-10 h-10 flex items-center justify-center"
                      >
                        <Minus size={16} />
                        
                         
                      </button>

                      <span className="flex-1 text-center font-bold">
                        {item.quantity || 1}
                      </span>

                      <button
                        onClick={() =>
                          updateQuantity(item._id, (item.quantity || 1) + 1)
                        }
                        className="w-10 h-10 flex items-center justify-center"
                      >
                        <Plus size={16} />
                      </button>
                    
                    </div>
                  </div>

                  {/* PRICE */}
                  <div className="w-full md:w-auto md:flex-1 flex justify-center">
                    <p className="font-bold text-lg text-slate-800">
                      {(
                        (item.price ||
                         0) * (item.quantity || 1)
                      ).toFixed(2)}{" "}
                      EGP
                    </p>
                  </div>

                  {/* REMOVE */}
                  <div className="absolute left-6 top-6 md:relative md:left-0 md:top-0 w-auto">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all"
                    >
                      <Trash2 size={20} />
                    </button>
                  </div>

                </div>
              ))}
            </div>

            <div className="flex justify-end pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-gray-500 hover:text-red-500 hover:bg-red-50"
              >
                إفراغ السلة بالكامل
              </Button>
            </div>
          </div>

          {/* SUMMARY (UNCHANGED UI) */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-32 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">
                ملخص الطلب
              </h3>

              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-slate-300">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold text-white">
                    {total.toFixed(2)} EGP
                  </span>
                </div>

                <div className="flex justify-between items-center text-slate-300 pb-4 border-b border-white/10">
                  <span>مصاريف الشحن:</span>
                  <span className="text-green-400 font-bold">مجاناً</span>
                </div>

                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">الإجمالي الكلي:</span>
                  <span className="text-3xl font-black text-white">
                    {total.toFixed(2)}{" "}
                    <span className="text-sm text-slate-400">EGP</span>
                  </span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-8">
                <Button className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-14 text-lg font-bold shadow-lg flex items-center justify-center gap-3">
                  متابعة للدفع
                  <CreditCard size={20} />
                </Button>
              </Link>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}