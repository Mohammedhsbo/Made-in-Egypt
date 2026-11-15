import { useEffect } from "react";
import { Layers, Megaphone, Package, ShoppingCart, Tag, Tags, X } from "lucide-react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/context/language.context";

const navigation = [
  { to: "/admin", label: "إدارة المنتجات", icon: Package, key: "products" },
  { to: "/admin/offer", label: "Homepage offer", icon: Megaphone, key: "offer" },
  { to: "/admin/orders", label: "إدارة الأوردرات", icon: ShoppingCart, key: "orders" },
  { to: "/admin/managecategories", label: "إدارة التصنيفات", icon: Layers, key: "categories" },
  { to: "/admin/managebrands", label: "Brand Management", icon: Tags, key: "brands" },
  { to: "/admin/allcuppons", label: "إدارة الكوبونات", icon: Tag, key: "coupons" },
];

function isNavigationItemActive(item, pathname) {
  if (item.key === "products") {
    return pathname === "/admin" || /^\/admin\/(createproduct|editproduct\/)/.test(pathname);
  }
  if (item.key === "categories") {
    return pathname.startsWith("/admin/managecategories")
      || pathname === "/admin/createcategory"
      || pathname.startsWith("/admin/editcategory/");
  }
  if (item.key === "brands") return pathname.startsWith(item.to);
  if (item.key === "coupons") return pathname.includes("cuppon");
  return pathname === item.to || pathname.startsWith(`${item.to}/`);
}

export default function Sidebar({ mobileOpen, onClose }) {
  const { isArabic, t } = useLanguage();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!mobileOpen) return undefined;

    const previousOverflow = document.body.style.overflow;
    const handleKeyDown = (event) => {
      if (event.key === "Escape") onClose();
    };

    document.body.style.overflow = "hidden";
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = previousOverflow;
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [mobileOpen, onClose]);

  const renderLinks = () => navigation.map((item) => {
    const Icon = item.icon;
    const active = isNavigationItemActive(item, pathname);
    return (
      <Link
        key={item.to}
        to={item.to}
        onClick={onClose}
        aria-current={active ? "page" : undefined}
        className={`admin-nav-link${active ? " is-active" : ""}`}
      >
        <span className="admin-nav-icon"><Icon size={19} strokeWidth={1.9} /></span>
        <span>{t(item.label)}</span>
        {active && <span className="admin-nav-indicator" aria-hidden="true" />}
      </Link>
    );
  });

  return (
    <>
      <aside className="admin-sidebar-desktop" aria-label={t("Admin panel")}>
        <p className="admin-nav-heading">{t("Admin panel")}</p>
        <nav className="admin-nav-list">{renderLinks()}</nav>
        <div className="admin-sidebar-footer">
          <span className="admin-status-dot" aria-hidden="true" />
          <span>MADE IN EGYPT</span>
        </div>
      </aside>

      {mobileOpen && createPortal(
        <div className="admin-mobile-overlay" dir={isArabic ? "rtl" : "ltr"}>
          <button
            type="button"
            className="admin-mobile-backdrop"
            onClick={onClose}
            aria-label={t("Close")}
          />
          <aside
            id="admin-mobile-navigation"
            className="admin-sidebar-mobile"
            role="dialog"
            aria-modal="true"
            aria-label={t("Admin panel")}
          >
            <div className="admin-sidebar-mobile-heading">
              <span>{t("Admin panel")}</span>
              <button
                type="button"
                className="admin-close-button"
                onClick={onClose}
                aria-label={t("Close")}
              >
                <X size={19} />
              </button>
            </div>
            <nav className="admin-nav-list">{renderLinks()}</nav>
            <div className="admin-sidebar-footer">
              <span className="admin-status-dot" aria-hidden="true" />
              <span>MADE IN EGYPT</span>
            </div>
          </aside>
        </div>,
        document.body,
      )}
    </>
  );
}
