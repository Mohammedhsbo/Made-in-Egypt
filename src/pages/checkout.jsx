import { useCart } from "../context/CartContext";
import { Button } from "@/components/ui/button";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { toast } from "sonner";
import { Link } from "react-router-dom";

const checkoutSchema = yup.object().shape({
  fullName: yup.string().required("الاسم مطلوب"),
  email: yup
    .string()
    .required("البريد مطلوب")
    .matches(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      "البريد الإلكتروني غير صحيح",
    ),
  phone: yup
    .string()
    .required("رقم الهاتف مطلوب")
    .matches(
      /^(010|011|012|015)[0-9]{8}$/,
      "رقم الهاتف يجب أن يكون 11 رقم ويبدأ بـ 010 أو 011 أو 012 أو 015",
    ),
  address: yup.string().required("العنوان مطلوب"),
  city: yup.string().required("المدينة مطلوبة"),
  postalCode: yup.string().required("الرمز البريدي مطلوب"),
  paymentMethod: yup.string().required("اختر طريقة الدفع"),
  creditCardNumber: yup.string().when("paymentMethod", {
    is: "creditCard",
    then: () =>
      yup
        .string()
        .required("رقم البطاقة مطلوب")
        .matches(/^[0-9]{16}$/, "رقم البطاقة يجب أن يكون 16 رقم"),
  }),
  cvv: yup.string().when("paymentMethod", {
    is: "creditCard",
    then: () =>
      yup
        .string()
        .required("CVV مطلوب")
        .matches(/^[0-9]{3}$/, "CVV يجب أن يكون 3 رقم"),
    otherwise: () => yup.string().notRequired(),
  }),
});

export default function Checkout() {
  const { cart, clearCart } = useCart();

  const total = cart.reduce(
    (sum, item) => sum + item.price * (item.quantity || 1),
    0,
  );

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(checkoutSchema),
    defaultValues: {
      fullName: "",
      email: "",
      phone: "",
      address: "",
      city: "",
      postalCode: "",
      paymentMethod: "order",
      creditCardNumber: "",
      cvv: "",
    },
  });

  const paymentMethod = watch("paymentMethod");
const generateOrderMeta = () => {
  const now = new Date();

  const orderId =
    "ORD-" +
    now.getFullYear() +
    (now.getMonth() + 1).toString().padStart(2, "0") +
    now.getDate().toString().padStart(2, "0") +
    "-" +
    Math.floor(1000 + Math.random() * 9000);

  const orderDate = now.toLocaleDateString("ar-EG");
  const orderTime = now.toLocaleTimeString("ar-EG");

  return { orderId, orderDate, orderTime };
};

const sendWhatsApp = (data, orderDetails, meta) => {
  const message = `
━━━━━━━━━━━━━━
🧾 *فاتورة طلب جديد*
━━━━━━━━━━━━━━

🔢 *رقم الطلب:* ${meta.orderId}
📅 *التاريخ:* ${meta.orderDate}
⏰ *الوقت:* ${meta.orderTime}

👤 *العميل:* ${data.fullName}
📞 *الهاتف:* ${data.phone}
📍 *العنوان:* ${data.address} - ${data.city}

━━━━━━━━━━━━━━
🛒 *المنتجات:*
${orderDetails.split(" | ").map(i => `• ${i}`).join("\n")}

━━━━━━━━━━━━━━
💰 *الإجمالي:* ${total} جنيه
━━━━━━━━━━━━━━
`;

  const encoded = encodeURIComponent(message);
  window.open(`https://wa.me/201014625009?text=${encoded}`, "_blank");
};




const onSubmit = async (data) => {
  const meta = generateOrderMeta();

  const orderDetails = cart
    .map(
      (item) =>
        `${item.title} x ${item.quantity || 1} = ${
          item.price * (item.quantity || 1)
        } جنيه`,
    )
    .join(" | ");

  try {
    await fetch("https://sheetdb.io/api/v1/g98ywcnp4enqr", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: [
          {
            orderId: meta.orderId,
            date: meta.orderDate,
            time: meta.orderTime,
            fullName: data.fullName,
            email: data.email,
            phone: data.phone,
            address: data.address,
            city: data.city,
            postalCode: data.postalCode,
            total: total,
            orderDetails: orderDetails,
          },
        ],
      }),
    });

    toast.success("✅ تم حفظ الطلب وإرسال الفاتورة");
    sendWhatsApp(data, orderDetails, meta);
    clearCart();
    reset();
  } catch (error) {
    toast.error("حدث خطأ أثناء حفظ الطلب");
    console.log(error);
  }
};


  return (
    <div className="p-6 max-w-5xl mx-auto">
      <h2 className="text-4xl font-semibold mb-6 text-center">الدفع والشحن</h2>

      <div className="flex flex-col md:flex-row gap-6">
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex-1 border p-6 rounded-lg shadow-sm space-y-4"
        >
          <h3 className="text-2xl font-semibold mb-4">معلومات الشحن</h3>

          {/* الاسم */}
          <input
            type="text"
            placeholder="الاسم بالكامل"
            {...register("fullName")}
            className="w-full p-2 border rounded"
          />
          {errors.fullName && (
            <p className="text-red-500 text-sm">{errors.fullName.message}</p>
          )}

          {/* الإيميل */}
          <input
            type="email"
            placeholder="البريد الإلكتروني"
            {...register("email")}
            className="w-full p-2 border rounded"
          />
          {errors.email && (
            <p className="text-red-500 text-sm">{errors.email.message}</p>
          )}

          {/* الهاتف */}
          <input
            type="tel"
            dir="rtl"
            inputMode="numeric"
            maxLength={11}
            placeholder="رقم الهاتف"
            {...register("phone")}
            className="w-full p-2 border rounded"
          />
          {errors.phone && (
            <p className="text-red-500 text-sm">{errors.phone.message}</p>
          )}

          {/* العنوان */}
          <input
            type="text"
            placeholder="العنوان"
            {...register("address")}
            className="w-full p-2 border rounded"
          />
          {errors.address && (
            <p className="text-red-500 text-sm">{errors.address.message}</p>
          )}

          {/* المدينة */}
          <input
            type="text"
            placeholder="المدينة"
            {...register("city")}
            className="w-full p-2 border rounded"
          />
          {errors.city && (
            <p className="text-red-500 text-sm">{errors.city.message}</p>
          )}

          {/* الرمز البريدي */}
          <input
            type="text"
            inputMode="numeric"
            placeholder="الرمز البريدي"
            {...register("postalCode")}
            className="w-full p-2 border rounded"
          />
          {errors.postalCode && (
            <p className="text-red-500 text-sm">{errors.postalCode.message}</p>
          )}

          {/* الدفع */}
          <select
            {...register("paymentMethod")}
            className="w-full p-2 border rounded"
          >
            <option value="order">الدفع عند الاستلام</option>
            <option value="creditCard">بطاقة ائتمان</option>
          </select>

          {paymentMethod === "creditCard" && (
            <>
              <input
                type="text"
                placeholder="رقم البطاقة (16 رقم)"
                {...register("creditCardNumber")}
                className="w-full p-2 border rounded"
              />
              {errors.creditCardNumber && (
                <p className="text-red-500 text-sm">
                  {errors.creditCardNumber.message}
                </p>
              )}

              <input
                type="text"
                placeholder="CVV (3 رقم)"
                {...register("cvv")}
                className="w-full p-2 border rounded"
              />
              {errors.cvv && (
                <p className="text-red-500 text-sm">{errors.cvv.message}</p>
              )}
            </>
          )}

          <Button
            type="submit"
            className="w-full mt-4"
            disabled={cart.length === 0}
          >
            اتمام الطلب
          </Button>
        </form>

        {/* ملخص الطلب */}
        <div className="flex-1 border p-6 rounded-lg shadow-sm">
          <h3 className="text-2xl font-semibold mb-4">ملخص الطلب</h3>

          {cart.length === 0 ? (
            <div className="flex flex-col  gap-6 min-h-screen justify-center items-center text-red-700 text-3xl font-bold">
              <p>السلة فارغة</p>
              <Link to={`/`}>
                <Button>اذهب للتسوق </Button>
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {cart.map((item, index) => (
                <div key={index} className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <img
                      src={item.images[0]}
                      alt={item.title}
                      className="h-16 w-16 object-cover rounded"
                    />
                    <span>
                      {item.title} x {item.quantity || 1}
                    </span>
                  </div>
                  <span>EGP{item.price * (item.quantity || 1)}</span>
                </div>
              ))}

              <hr />

              <div className="flex justify-between font-semibold text-lg">
                <span>الإجمالي:</span>
                <span>EGP{total}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
