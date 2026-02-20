import { Button } from "@/components/ui/button";
import { useCart } from "../context/CartContext";
import { Link } from "react-router-dom";

export default function Cart() {
  const { cart, removeFromCart, clearCart, updateQuantity } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );

  return (
    <div className="p-6">
      <h2 className="text-4xl font-semibold mb-8 text-center">سلة المشتريات</h2>

      {cart.length === 0 ? (
        <p className="className= flex   min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
          السلة فارغة
        </p>
      ) : (
        <>
          <div className="hidden md:block overflow-x-auto mb-6">
            <table className="w-full border border-gray-300 table-auto text-center">
              <thead className="bg-gray-100">
                <tr>
                  <th className="p-2 border">صورة</th>
                  <th className="p-2 border">اسم المنتج</th>
                  <th className="p-2 border">السعر</th>
                  <th className="p-2 border">الكمية</th>
                  <th className="p-2 border"></th>
                </tr>
              </thead>
              <tbody>
                {cart.map((item, index) => (
                  <tr key={index} className="border-b">
                    <td className="p-2 border">
                      <img
                        src={item.images[0]}
                        alt={item.title}
                        className="h-20 w-20 object-cover rounded mx-auto"
                      />
                    </td>
                    <td className="p-2 border">{item.title}</td>
                    <td className="p-2 border">EGP{item.price}</td>
                    <td className="p-2 border">
                      <div className="flex justify-center items-center">
                        <Button
                          size={"icon-sm"}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity - 1)
                          }
                        >
                          -
                        </Button>
                        <span className="mx-2">{item.quantity || 1}</span>
                        <Button
                          size={"icon-sm"}
                          onClick={() =>
                            updateQuantity(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </Button>
                      </div>
                    </td>
                    <td className="p-2 border">
                      <Button
                        variant="destructive"
                        onClick={() => removeFromCart(item.id)}
                      >
                        إزالة
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="md:hidden space-y-4">
            {cart.map((item, index) => (
              <div
                key={index}
                className="border rounded-lg p-4 flex flex-col gap-3 shadow-sm"
              >
                <img
                  src={item.images[0]}
                  alt={item.title}
                  className="h-40 w-full object-cover rounded"
                />
                <h3 className="font-semibold text-lg">{item.title}</h3>
                <p className="text-gray-700 font-medium">EGP{item.price}</p>
                <div className="flex items-center gap-2">
                  <Button
                    size={"icon-sm"}
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                  >
                    -
                  </Button>
                  <span>{item.quantity || 1}</span>
                  <Button
                    size={"icon-sm"}
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  >
                    +
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => removeFromCart(item.id)}
                  >
                    إزالة
                  </Button>
                </div>
              </div>
            ))}
          </div>

          <div className="flex flex-col md:flex-row justify-between items-center gap-4 my-6">
            <h3 className="text-2xl font-semibold">الإجمالي: EGP{total}</h3>
            <div className="flex gap-4 flex-col md:flex-row w-full md:w-auto">
              <Button variant="destructive" onClick={clearCart}>
                مسح السلة
              </Button>

              <Button>
                <Link to="/checkout">الدفع واتمام الطلب</Link>
              </Button>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
