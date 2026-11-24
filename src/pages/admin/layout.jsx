import { useCallback, useState } from "react";
import { PanelRightOpen } from "lucide-react";
import { Outlet, useLocation } from "react-router-dom";
import Breadcrumbs from "@/components/breadcrumbs";
import Sidebar from "../../components/admin/sidebar";
import { useLanguage } from "@/context/language.context";

function getAdminBreadcrumbs(pathname) {
  const adminRoot = { to: "/admin", label: "Admin panel" };

  if (pathname === "/admin") return [{ label: "Manage products" }];
  if (pathname === "/admin/orders") return [adminRoot, { label: "Manage orders" }];
  if (/^\/admin\/orders\/[^/]+$/.test(pathname)) {
    return [adminRoot, { to: "/admin/orders", label: "Manage orders" }, { label: "Order Details" }];
  }
  if (pathname === "/admin/managecategories") {
    return [adminRoot, { label: "Manage categories" }];
  }
  if (pathname === "/admin/createcategory") {
    return [adminRoot, { to: "/admin/managecategories", label: "Manage categories" }, { label: "Create category" }];
  }
  if (/^\/admin\/editcategory\/[^/]+$/.test(pathname)) {
    return [adminRoot, { to: "/admin/managecategories", label: "Manage categories" }, { label: "Edit category" }];
  }
  if (pathname === "/admin/managebrands") return [adminRoot, { label: "Brand Management" }];
  if (pathname === "/admin/managebrands/create") {
    return [adminRoot, { to: "/admin/managebrands", label: "Brand Management" }, { label: "Create brand" }];
  }
  if (/^\/admin\/managebrands\/[^/]+\/edit$/.test(pathname)) {
    return [adminRoot, { to: "/admin/managebrands", label: "Brand Management" }, { label: "Edit brand" }];
  }
  if (pathname === "/admin/allcuppons") return [adminRoot, { label: "Coupons" }];
  if (pathname === "/admin/settings/whatsapp") return [adminRoot, { label: "WhatsApp Configuration" }];
  if (pathname === "/admin/create-cuppons") {
    return [adminRoot, { to: "/admin/allcuppons", label: "Coupons" }, { label: "Create coupon" }];
  }
  if (/^\/admin\/edit-cuppons\/[^/]+$/.test(pathname)) {
    return [adminRoot, { to: "/admin/allcuppons", label: "Coupons" }, { label: "Edit coupon" }];
  }
  if (pathname === "/admin/createproduct") {
    return [adminRoot, { label: "Create product" }];
  }
  if (/^\/admin\/editproduct\/[^/]+$/.test(pathname)) {
    return [adminRoot, { label: "Edit product" }];
  }

  return [adminRoot];
}

export default function AdminLayout() {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const { isArabic, t } = useLanguage();
  const { pathname } = useLocation();
  const closeMobileNav = useCallback(() => setMobileNavOpen(false), []);
  const breadcrumbs = getAdminBreadcrumbs(pathname);

  return (
    <div className="admin-shell" dir={isArabic ? "rtl" : "ltr"}>
      <Sidebar mobileOpen={mobileNavOpen} onClose={closeMobileNav} />

      <div className="admin-workspace">
        <div className="admin-content">
          <Breadcrumbs items={breadcrumbs} />
          <Outlet />
        </div>
      </div>

      <button
        type="button"
        className="admin-mobile-nav-button"
        onClick={() => setMobileNavOpen(true)}
        aria-label={t("Open navigation menu")}
        aria-expanded={mobileNavOpen}
        aria-controls="admin-mobile-navigation"
      >
        <span className="admin-mobile-nav-icon" aria-hidden="true">
          <PanelRightOpen size={19} strokeWidth={2} />
        </span>
        <span className="admin-mobile-nav-label">{t("Admin panel")}</span>
        <span className="admin-mobile-nav-accent" aria-hidden="true" />
      </button>
    </div>
  );
}
