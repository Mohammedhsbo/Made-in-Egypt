import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // منع سكرول الصفحة لما السايدبار مفتوح
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* زر الموبايل */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-4 right-4 z-[100] bg-gray-800 text-white p-3 rounded-lg shadow-lg"
     
      >
        <HiMenu size={26}  />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/50 z-[90] md:hidden transition-opacity"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed md:static top-0 right-0 h-full w-64
          bg-gray-800 text-white flex flex-col p-6
          z-[100]
          transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* Close button */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden self-end mb-6 p-2 hover:bg-gray-700 rounded"
        >
          <HiX size={22} />
        </button>

        <h1 className="text-2xl font-bold mb-8">لوحة الإدارة</h1>

        <nav className="flex flex-col gap-2">
          {[
            { to: "/admin", label: "إدارة المنتجات" },
            { to: "/admin/orders", label: "إدارة الأوردرات" },
            { to: "/admin/managecategories", label: "إدارة التصنيفات" },
            { to: "/admin/allcuppons", label: "إدارة الكوبونات" },
          ].map((item) => (
            <Link
              key={item.to}
              to={item.to}
              onClick={() => setOpen(false)}
              className="px-3 py-2 rounded hover:bg-gray-700 border-b border-gray-600 transition"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}