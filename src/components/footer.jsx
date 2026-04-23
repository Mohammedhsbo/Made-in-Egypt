import React from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 w-full mt-auto">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand & About */}
          <div className="col-span-1 md:col-span-1">
            <h2 className="text-2xl font-bold text-white mb-4">متجرنا</h2>
            <p className="text-sm leading-relaxed mb-6">
              نقدم لكم أفضل المنتجات بأعلى جودة وبأنسب الأسعار. تجربة تسوق سهلة وسريعة تجعلك تعود دائماً.
            </p>
            <div className="flex gap-4">
              <a href="#" className="hover:text-white transition-colors"><Facebook size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Twitter size={20} /></a>
              <a href="#" className="hover:text-white transition-colors"><Instagram size={20} /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">روابط سريعة</h3>
            <ul className="space-y-3 p-0 m-0 list-none">
              <li><Link to="/" className="hover:text-white transition-colors">الرئيسية</Link></li>
              <li><Link to="/clothes" className="hover:text-white transition-colors">الملابس</Link></li>
              <li><Link to="/shoes" className="hover:text-white transition-colors">الأحذية</Link></li>
              <li><Link to="/perfumes" className="hover:text-white transition-colors">العطور</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">خدمة العملاء</h3>
            <ul className="space-y-3 p-0 m-0 list-none">
              <li><Link to="#" className="hover:text-white transition-colors">من نحن</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">سياسة الخصوصية</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">الشروط والأحكام</Link></li>
              <li><Link to="#" className="hover:text-white transition-colors">سياسة الاسترجاع</Link></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-lg font-semibold text-white mb-4">تواصل معنا</h3>
            <ul className="space-y-3 p-0 m-0 list-none">
              <li className="flex items-center gap-3">
                <MapPin size={18} className="shrink-0" />
                <span>القاهرة ، مصر</span>
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

        <div className="border-t border-slate-700 mt-10 pt-6 text-center text-sm">
          <p>جميع الحقوق محفوظة &copy; {new Date().getFullYear()}</p>
        </div>
      </div>
    </footer>
  );
}
