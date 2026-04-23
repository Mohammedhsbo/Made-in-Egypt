import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "auto";
  }, [open]);

  return (
    <>
      {/* زر الموبايل */}
      <button
        onClick={() => setOpen(true)}
        className="fixed top-[110px] right-3 z-[var(--z-header)] bg-gray-800 p-3 text-white shadow-lg md:hidden rounded-lg"
      >
        <HiMenu size={26}  />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 z-[var(--z-admin-overlay)] bg-black/50 transition-opacity md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
         fixed top-[100px] right-0 z-[var(--z-admin-sidebar)] flex h-[calc(100vh-100px)] w-64 flex-col
          transform bg-gray-800 p-6 text-white transition-transform duration-300 ease-in-out
          md:static md:top-auto md:h-full md:translate-x-0
          ${open ? "translate-x-0" : "translate-x-full"}
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