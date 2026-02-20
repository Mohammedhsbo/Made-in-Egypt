import { useState } from "react";
import { Link } from "react-router-dom";
import { HiMenu, HiX } from "react-icons/hi";

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  return (
    <div className="flex z-0">
      {/* زر فتح السايدبار في الموبايل */}
      <button
        onClick={() => setOpen(true)}
        className="md:hidden fixed top-25 right-4 z-50 bg-gray-800 text-white p-2 rounded"
      >
        <HiMenu size={22} />
      </button>

      {/* Overlay */}
      {open && (
        <div
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        className={`
          fixed md:static top-0 right-0 h-full w-64
          bg-gray-800 text-white flex flex-col p-6
          transform transition-transform duration-300 z-50
          ${open ? "translate-x-0" : "translate-x-full"}
          md:translate-x-0
        `}
      >
        {/* زر الإغلاق في الموبايل */}
        <button
          onClick={() => setOpen(false)}
          className="md:hidden self-end mb-4"
        >
          <HiX size={22} />
        </button>

        <h1 className="text-2xl font-bold mb-6">لوحة الإدارة</h1>

        <nav className="flex flex-col gap-3">
          <Link
            to="/admin"
            className="px-3 py-2 rounded border-b border-gray-600 hover:bg-gray-700 "
            onClick={() => setOpen(false)}
          >
            إدارة المنتجات
          </Link>

          <Link
            to="/admin/orders"
            className="px-3 py-2 rounded hover:bg-gray-700 border-b border-gray-600"
            onClick={() => setOpen(false)}
          >
            إدارة الأوردرات
          </Link>
        </nav>
      </aside>
    </div>
  );
}
