import { Button } from "@/components/ui/button";
import { useCart } from "../context/cartContext";
import { Link } from "react-router-dom";
import { Trash2, ShoppingBag, Minus, Plus, CreditCard } from "lucide-react";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + (item.priceAfterDiscount || item.basePrice || 0) * (item.quantity || 1),
    0
  );

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-8 py-8 w-full mt-4">
      <div className="flex items-center gap-3 mb-10 border-b pb-6">
        <div className="bg-primary/10 p-3 rounded-full text-primary">
          <ShoppingBag size={28} />
        </div>
        <h2 className="text-3xl md:text-4xl font-black text-slate-800">سلة المشتريات</h2>
        {cart.length > 0 && (
          <span className="text-muted-foreground mr-auto text-lg font-medium">
            {cart.length} من العناصر
          </span>
        )}
      </div>

      {cart.length === 0 ? (
        <div className="flex flex-col min-h-[50vh] justify-center items-center gap-6 py-12">
          <div className="bg-gray-50 rounded-full w-32 h-32 flex items-center justify-center mb-2 shadow-inner border border-gray-100">
             <ShoppingBag size={50} className="text-gray-300" />
          </div>
          <h3 className="text-3xl font-bold text-gray-800">سلتك فارغة تماماً</h3>
          <p className="text-gray-500 text-lg mb-4 text-center max-w-md">
            يبدو أنك لم تقم بإضافة أي منتجات حتى الآن. تصفح أحدث صفقاتنا واكتشف المنتجات التي ستعجبك.
          </p>
          <Link to="/">
            <Button size="lg" className="rounded-full px-10 h-14 text-lg shadow-lg font-bold">
              تصفح المنتجات الآن
            </Button>
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-10">
          
          {/* Cart Items List */}
          <div className="lg:w-2/3 space-y-6">
            <div className="bg-white rounded-3xl p-6 shadow-sm border border-gray-100 hidden md:grid grid-cols-12 gap-4 text-gray-500 font-semibold mb-2 px-8">
               <div className="col-span-6">المنتجات</div>
               <div className="col-span-3 text-center">الكمية</div>
               <div className="col-span-2 text-center">السعر</div>
               <div className="col-span-1"></div>
            </div>

            <div className="space-y-4">
              {cart.map((item, index) => (
                <div key={index} className="bg-white rounded-3xl p-4 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row items-start md:items-center gap-6 relative group transition-all hover:shadow-md">
                  
                  {/* Item Image & Info */}
                  <div className="flex items-center gap-4 w-full md:w-1/2">
                    <div className="w-24 h-24 bg-gray-50 rounded-2xl flex-shrink-0 border border-gray-100 overflow-hidden">
                      <img
                        src={item.imageCover || item.images?.[0]}
                        alt={item.title_ar || item.title_en || "منتج"}
                        className="w-full h-full object-cover mix-blend-multiply"
                      />
                    </div>
                    <div>
                      <Link to={`/productdetails/${item._id}`} className="font-bold text-lg text-slate-800 hover:text-primary transition-colors line-clamp-2 leading-tight mb-2">
                        {item.title_ar || item.title_en}
                      </Link>
                      <p className="text-sm font-medium text-gray-500">{item.category?.name_ar || item.category?.name_en || ""}</p>
                    </div>
                  </div>

                  {/* Quantity Control */}
                  <div className="w-full md:w-1/4 flex justify-between md:justify-center items-center">
                    <span className="md:hidden font-semibold text-gray-500">الكمية:</span>
                    <div className="flex items-center bg-gray-50 border border-gray-200 rounded-full h-10 w-[110px]">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors focus:outline-none rounded-r-full"
                      >
                        <Minus size={16} />
                      </button>
                      <span className="flex-1 text-center font-bold text-sm bg-white border-x border-gray-200 h-full flex items-center justify-center">{item.quantity || 1}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center text-gray-600 hover:text-primary transition-colors focus:outline-none rounded-l-full"
                      >
                        <Plus size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Item Price */}
                  <div className="w-full md:w-auto md:flex-1 flex justify-between md:justify-center items-center">
                    <span className="md:hidden font-semibold text-gray-500">السعر:</span>
                    <p className="font-bold text-lg text-slate-800">
                      {(item.priceAfterDiscount || item.basePrice || 0) * (item.quantity || 1)} <span className="text-sm text-gray-400">EGP</span>
                    </p>
                  </div>

                  {/* Remove Button */}
                  <div className="absolute left-6 top-6 md:relative md:left-0 md:top-0 w-auto">
                    <button
                      onClick={() => removeFromCart(item._id)}
                      className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-2 rounded-full transition-all focus:outline-none"
                      title="إزالة المنتج"
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
                className="text-gray-500 hover:text-red-500 hover:bg-red-50 hover:border-red-200"
                onClick={clearCart}
              >
                إفراغ السلة بالكامل
              </Button>
            </div>
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:w-1/3">
            <div className="bg-slate-900 rounded-3xl p-8 text-white sticky top-32 shadow-xl">
              <h3 className="text-2xl font-bold mb-6 border-b border-white/10 pb-4">ملخص الطلب</h3>
              
              <div className="space-y-4 mb-6">
                <div className="flex justify-between items-center text-slate-300">
                  <span>المجموع الفرعي:</span>
                  <span className="font-semibold text-white">{total} EGP</span>
                </div>
                <div className="flex justify-between items-center text-slate-300 pb-4 border-b border-white/10">
                  <span>مصاريف الشحن:</span>
                  <span className="text-green-400 font-bold">مجاناً</span>
                </div>
                <div className="flex justify-between items-center pt-2">
                  <span className="text-lg font-bold">الإجمالي الكلي:</span>
                  <span className="text-3xl font-black text-white">{total} <span className="text-sm text-slate-400 font-medium">EGP</span></span>
                </div>
              </div>

              <Link to="/checkout" className="block mt-8">
                <Button size="lg" className="w-full bg-primary hover:bg-primary/90 text-white rounded-xl h-14 text-lg font-bold shadow-lg shadow-primary/20 flex items-center justify-center gap-3">
                  متابعة للدفع
                  <CreditCard size={20} />
                </Button>
              </Link>
              
              <div className="mt-6 flex justify-center items-center gap-2 text-sm text-slate-400">
                <span className="w-full flex justify-center mt-2 opacity-60">
                   {/* Dummy payment icons */}
                   💳 💵 🛒
                </span>
              </div>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}
