import React from 'react';
import { Link } from 'react-router-dom';
import { Mail, Phone, MapPin } from 'lucide-react';
import { useLanguage } from '@/context/language.context';

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="site-footer mt-auto w-full text-[rgba(255,255,255,0.78)]">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="mb-4 text-2xl font-bold text-white">{t("متجرنا")}</h2>
            <p className="text-sm leading-relaxed mb-6">
              {t("نقدم لكم أفضل المنتجات بأعلى جودة وبأنسب الأسعار. تجربة تسوق سهلة وسريعة تجعلك تعود دائماً.")}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("روابط سريعة")}</h3>
            <ul className="space-y-3 p-0 m-0 list-none">
              <li><Link to="/" className="hover:text-white transition-colors">{t("الرئيسية")}</Link></li>
              <li><Link to="/clothes" className="hover:text-white transition-colors">{t("الملابس")}</Link></li>
              <li><Link to="/shoes" className="hover:text-white transition-colors">{t("الأحذية")}</Link></li>
              <li><Link to="/perfumes" className="hover:text-white transition-colors">{t("العطور")}</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("خدمة العملاء")}</h3>
            <ul className="space-y-3 p-0 m-0 list-none">
              <li><Link to="/customer-service/about" className="hover:text-white transition-colors">{t("من نحن")}</Link></li>
              <li><Link to="/customer-service/privacy-policy" className="hover:text-white transition-colors">{t("سياسة الخصوصية")}</Link></li>
              <li><Link to="/customer-service/terms-and-conditions" className="hover:text-white transition-colors">{t("الشروط والأحكام")}</Link></li>
              <li><Link to="/customer-service/return-policy" className="hover:text-white transition-colors">{t("سياسة الاسترجاع")}</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">{t("تواصل معنا")}</h3>
            <ul className="space-y-3 p-0 m-0 list-none">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0" />
                <span>{t("القاهرة ، مصر")}</span>
              </li>
              <li className="flex items-center gap-3">
                <Phone size={18} className="shrink-0" />
                <span dir="ltr">+20 10 2042 6246</span>
              </li>
              <li className="flex items-center gap-3">
                <Mail size={18} className="shrink-0" />
                <span>madeinegyptt2@gmail.com</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-center text-sm text-white/70">
          <p>{t("جميع الحقوق محفوظة")} &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
