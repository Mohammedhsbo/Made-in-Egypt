import { Link, useParams } from "react-router-dom";
import { useLanguage } from "@/context/language.context";

const pages = {
  about: {
    title: { en: "About us", ar: "من نحن" },
    intro: {
      en: "Made in Egypt helps buyers discover Egyptian products, manufacturers, and suppliers.",
      ar: "تساعد منصة Made in Egypt المشترين على اكتشاف المنتجات والمصنعين والموردين المصريين.",
    },
    sections: [
      {
        heading: { en: "Our platform", ar: "منصتنا" },
        body: {
          en: "Browse product categories, review supplier information, and contact sellers directly to ask about wholesale prices, availability, and trade requirements.",
          ar: "تصفح فئات المنتجات، واطلع على معلومات الموردين، وتواصل مباشرة مع البائعين للاستفسار عن أسعار الجملة والتوافر ومتطلبات التعامل.",
        },
      },
      {
        heading: { en: "Product information", ar: "معلومات المنتجات" },
        body: {
          en: "Product descriptions and specifications are provided by suppliers. Please confirm current details, prices, and availability with the seller before placing an order.",
          ar: "يقدم الموردون أوصاف المنتجات ومواصفاتها. يرجى تأكيد التفاصيل والأسعار والتوافر الحالي مع البائع قبل تقديم الطلب.",
        },
      },
    ],
  },
  "privacy-policy": {
    title: { en: "Privacy policy", ar: "سياسة الخصوصية" },
    intro: {
      en: "This page explains how information connected with your account and use of the platform is handled.",
      ar: "توضح هذه الصفحة كيفية التعامل مع المعلومات المرتبطة بحسابك واستخدامك للمنصة.",
    },
    sections: [
      {
        heading: { en: "Information and use", ar: "المعلومات واستخدامها" },
        body: {
          en: "Information you provide may be used to operate your account, respond to requests, support platform features, and maintain service security.",
          ar: "قد تُستخدم المعلومات التي تقدمها لتشغيل حسابك والرد على طلباتك ودعم ميزات المنصة والحفاظ على أمان الخدمة.",
        },
      },
      {
        heading: { en: "Your choices", ar: "خياراتك" },
        body: {
          en: "Keep your account details up to date and avoid sharing sensitive information in product inquiries. Contact us if you have a question about information associated with your account.",
          ar: "احرص على تحديث بيانات حسابك وتجنب مشاركة المعلومات الحساسة في استفسارات المنتجات. تواصل معنا إذا كان لديك سؤال حول المعلومات المرتبطة بحسابك.",
        },
      },
    ],
  },
  "terms-and-conditions": {
    title: { en: "Terms & conditions", ar: "الشروط والأحكام" },
    intro: {
      en: "By using Made in Egypt, you agree to use the platform responsibly and confirm important product details directly with the seller.",
      ar: "باستخدام منصة Made in Egypt، فإنك توافق على استخدام المنصة بمسؤولية والتحقق من تفاصيل المنتجات المهمة مباشرةً مع البائع.",
    },
    sections: [
      {
        heading: { en: "Listings and availability", ar: "المنتجات والتوافر" },
        body: {
          en: "Product information is supplied by sellers and may change. Listings do not guarantee price, stock, or availability; confirm these details with the seller before making a purchase decision.",
          ar: "يقدم البائعون معلومات المنتجات وقد تتغير. لا تضمن قوائم المنتجات السعر أو المخزون أو التوافر؛ يرجى تأكيد هذه التفاصيل مع البائع قبل اتخاذ قرار الشراء.",
        },
      },
      {
        heading: { en: "Using the platform", ar: "استخدام المنصة" },
        body: {
          en: "You are responsible for the accuracy of information you submit and for complying with applicable laws when using the site or contacting sellers.",
          ar: "أنت مسؤول عن دقة المعلومات التي تقدمها وعن الالتزام بالقوانين المعمول بها عند استخدام الموقع أو التواصل مع البائعين.",
        },
      },
    ],
  },
  "return-policy": {
    title: { en: "Returns policy", ar: "سياسة الاسترجاع" },
    intro: {
      en: "Return, exchange, and refund arrangements should be confirmed with the seller before completing a transaction.",
      ar: "يجب تأكيد ترتيبات الإرجاع والاستبدال واسترداد الأموال مع البائع قبل إتمام أي معاملة.",
    },
    sections: [
      {
        heading: { en: "Contact the seller", ar: "تواصل مع البائع" },
        body: {
          en: "Each seller may have different return requirements. Ask the seller about eligibility, condition of goods, shipping, and any applicable deadlines before ordering.",
          ar: "قد تختلف متطلبات الإرجاع من بائع إلى آخر. استفسر من البائع عن شروط قبول الإرجاع وحالة البضائع والشحن وأي مواعيد محددة قبل الطلب.",
        },
      },
      {
        heading: { en: "Need help?", ar: "هل تحتاج إلى مساعدة؟" },
        body: {
          en: "For help with a platform inquiry, contact our support team and include the product name and seller so we can direct your request.",
          ar: "للحصول على مساعدة بشأن استفسار في المنصة، تواصل مع فريق الدعم وأرفق اسم المنتج والبائع لنتمكن من توجيه طلبك.",
        },
      },
    ],
  },
};

export default function CustomerServicePage() {
  const { page: pageSlug } = useParams();
  const { isArabic } = useLanguage();
  const page = pages[pageSlug];

  if (!page) {
    return (
      <main className="customer-info-page">
        <div className="customer-info-card">
          <h1>{isArabic ? "الصفحة غير متاحة" : "Page unavailable"}</h1>
          <Link to="/" className="customer-info-back">{isArabic ? "العودة للرئيسية" : "Back to home"}</Link>
        </div>
      </main>
    );
  }

  const language = isArabic ? "ar" : "en";

  return (
    <main className="customer-info-page">
      <article className="customer-info-card">
        <p className="customer-info-eyebrow">{isArabic ? "خدمة العملاء" : "Customer service"}</p>
        <h1>{page.title[language]}</h1>
        <p className="customer-info-intro">{page.intro[language]}</p>
        <div className="customer-info-sections">
          {page.sections.map((section) => (
            <section key={section.heading.en}>
              <h2>{section.heading[language]}</h2>
              <p>{section.body[language]}</p>
            </section>
          ))}
        </div>
        <Link to="/" className="customer-info-back">{isArabic ? "العودة للرئيسية" : "Back to home"}</Link>
      </article>
    </main>
  );
}
