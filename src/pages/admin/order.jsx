import { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "@/context/searchContext";
import { Search, ShoppingCart, Eye, FileText, CalendarCheck } from "lucide-react";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const { searchTerm, setSearchTerm } = useSearch();

  const filteredOrders =
    searchTerm?.length > 0
      ? orders.filter((order) =>
          order.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
          order.orderId?.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : orders;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const res = await axios.get("https://sheetdb.io/api/v1/g98ywcnp4enqr");
        // Sort descending by date hypothetically if possible, else just reverse to show newest first
        setOrders(res.data.reverse());
      } catch (err) {
        console.error(err);
      } finally {
        setLoadingOrders(false);
      }
    };
    fetchOrders();
  }, []);

  return (
    <div className="w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
        <div>
           <h1 className="text-3xl font-black text-slate-800 tracking-tight">
             متابعة الأوردرات
           </h1>
           <p className="text-gray-500 font-medium mt-1">عرض حالة الطلبات وشحنات العملاء</p>
        </div>
        
        <div className="relative w-full md:w-72">
          <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
          <input 
            type="text" 
            placeholder="البحث برقم الطلب أو اسم العميل..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-lg pr-10 pl-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 shadow-sm transition-all"
          />
        </div>
      </div>

      {loadingOrders ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="font-semibold text-gray-500">جاري سحب الأوردرات من القاعدة...</p>
        </div>
      ) : orders.length === 0 ? (
        <div className="flex flex-col min-h-[40vh] justify-center items-center gap-4 py-12 bg-white rounded-3xl border border-gray-100 shadow-sm">
          <div className="bg-gray-50 rounded-full p-6 mb-2">
            <ShoppingCart size={40} className="text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">لا توجد طلبات مسجلة</h3>
          <p className="text-gray-500 text-sm">لم يقم أي عميل بالطلب حتى الآن.</p>
        </div>
      ) : (searchTerm?.length > 0 && filteredOrders.length === 0) ? (
        <div className="flex flex-col min-h-[30vh] justify-center items-center gap-4 py-12">
          <p className="text-gray-500 font-bold text-lg">لم نعثر على أوردر يطابق "{searchTerm}"</p>
        </div>
      ) : (
        <div className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
          <div className="overflow-x-auto min-h-[50vh]">
            <table className="w-full text-right border-collapse min-w-[1000px]">
              <thead className="bg-gray-50/80 border-b border-gray-200 text-sm font-semibold text-gray-600">
                <tr>
                  <th className="py-4 px-6">رقم الطلب</th>
                  <th className="py-4 px-6">التاريخ</th>
                  <th className="py-4 px-6">العميل والتواصل</th>
                  <th className="py-4 px-6">العنوان</th>
                  <th className="py-4 px-6">المنتجات</th>
                  <th className="py-4 px-6 text-center">الإجمالي</th>
                  <th className="py-4 px-6 text-center">الإجراء</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-sm">
                {filteredOrders.map((order, index) => (
                  <tr key={index} className="hover:bg-primary/5 transition-colors group align-top">
                    
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 text-xs bg-slate-100 px-2 py-1 rounded inline-block">
                        {order.orderId || `#${index + 1}`}
                      </div>
                    </td>
                    
                    <td className="py-4 px-6 whitespace-nowrap">
                       <div className="flex items-center gap-2 text-gray-600 font-medium">
                         <CalendarCheck size={14} className="text-primary" />
                         {order.date || order.createdAt || "اليوم"}
                       </div>
                       <div className="text-xs text-gray-400 mt-1 pr-6">{order.time || ""}</div>
                    </td>

                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-800 leading-tight">{order.fullName}</div>
                      <div className="text-xs text-gray-500 mt-1" dir="ltr">{order.phone}</div>
                      <div className="text-xs text-gray-400 mt-0.5">{order.email}</div>
                    </td>

                    <td className="py-4 px-6 max-w-[200px]">
                      <div className="text-slate-700 leading-relaxed text-xs">
                        {order.city} - {order.address}
                        {order.postalCode && ` (الرمز: ${order.postalCode})`}
                      </div>
                    </td>

                    <td className="py-4 px-6 max-w-[250px]">
                      <div className="text-slate-600 text-xs leading-relaxed max-h-16 overflow-y-auto custom-scrollbar pr-1">
                         {order.orderDetails?.split(' | ').map((i, idx) => (
                           <div key={idx} className="mb-1 truncate border-b border-gray-50 pb-1 last:border-0">{i}</div>
                         ))}
                      </div>
                    </td>

                    <td className="py-4 px-6 text-center">
                      <span className="font-bold text-slate-800 bg-green-50 text-green-700 px-3 py-1 rounded-md border border-green-100 inline-block shadow-sm">
                        {order.total} EGP
                      </span>
                    </td>

                    <td className="py-4 px-6 text-center">
                       <button className="bg-gray-50 text-gray-600 p-2 rounded-lg hover:bg-gray-100 hover:text-primary transition-colors border border-gray-200" title="تفاصيل">
                          <Eye size={16} />
                       </button>
                    </td>

                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
