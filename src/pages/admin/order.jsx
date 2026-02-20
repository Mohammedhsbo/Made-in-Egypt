import { useEffect, useState } from "react";
import axios from "axios";
import { useSearch } from "@/context/searchContext";

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [loadingOrders, setLoadingOrders] = useState(true);
  const{searchTerm}=useSearch();

 const filteredOrders =

    searchTerm?.length > 0
      ? orders.filter((order) =>
          order.fullName.toLowerCase().includes(searchTerm.toLowerCase())
        )
      : orders;

 

  useEffect(() => {
     const fetchOrders = async () => {
    try {
      
      const res = await axios.get("https://sheetdb.io/api/v1/g98ywcnp4enqr");
      setOrders(res.data);
      setLoadingOrders(false);
    } catch (err) {
      console.error(err);
      setLoadingOrders(false);
    }
  };
    fetchOrders();
  }, []);

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <h1 className="text-3xl font-bold mb-6 text-center">الأوردرات</h1>

      {loadingOrders ? (
        <p className="className= flex   min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
          جاري تحميل الأوردرات
        </p>
      ) : orders.length === 0 ? (
        <p className="className= flex   min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
          لا يوجد أوردرات
        </p>
      ) :
       (searchTerm?.length > 0 && filteredOrders.length === 0) ? (
        <p className="className= flex   min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
          لا يوجد نتائج
        </p>
      ) :
       (
        <div className="overflow-x-auto border rounded shadow">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-2 text-left">#</th>
                <th className="px-4 py-2 text-left">الاسم</th>
                <th className="px-4 py-2 text-left">الهاتف</th>
                <th className="px-4 py-2 text-left">البريد</th>
                <th className="px-4 py-2 text-left">العنوان</th>
                <th className="px-4 py-2 text-left">تفاصيل الطلب</th>
                <th className="px-4 py-2 text-left">الإجمالي</th>
                <th className="px-4 py-2 text-left">تاريخ الطلب</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredOrders.map((order, index) => (
                <tr key={index}>
                  <td className="px-4 py-2">{index + 1}</td>
                  <td className="px-4 py-2">{order.fullName}</td>
                  <td className="px-4 py-2">{order.phone}</td>
                  <td className="px-4 py-2">{order.email}</td>
                  <td className="px-4 py-2">
                    {order.address}, {order.city}, {order.postalCode}
                  </td>
                  <td className="px-4 py-2">{order.orderDetails}</td>
                  <td className="px-4 py-2">EGP {order.total}</td>
                  <td className="px-4 py-2">{order.createdAt || "غير محدد"}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
