import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import Logo from "../assets/logo.png";
import { ChevronDown, Globe, LogIn, LogOut, Search, User, UserPlus } from "lucide-react";
import { useSearch } from "../context/searchContext";
import { useAuth } from "../context/auth.context";
import { useLanguage } from "@/context/language.context";

export default function Header() {
  const { searchTerm, setSearchTerm } = useSearch();
  const { user, logout } = useAuth();
  const { t, isArabic, toggleLanguage } = useLanguage();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setMenuOpen(false);
      }
    };
    const handleKeyDown = (event) => {
      if (event.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const handleLogout = () => {
    logout();
    setMenuOpen(false);
    window.location.href = "/login";
  };

  return (
    <header className="sticky top-0 z-[var(--z-header)] w-full bg-[var(--primary)] text-white shadow-[0_8px_20px_rgba(26,58,52,0.16)]">
      <div className="relative grid h-16 w-full grid-cols-[auto_1fr_auto] items-center gap-2 px-3 sm:px-4 md:flex md:gap-4 md:px-8 xl:px-12">
        <button
          type="button"
          onClick={() => setSearchOpen((open) => !open)}
          aria-label={searchOpen ? t("Close search") : t("Search products...")}
          aria-expanded={searchOpen}
        className="flex h-10 w-10 items-center justify-center rounded-full transition-colors hover:bg-white/10 md:hidden"
        >
          <Search size={21} />
        </button>

        <Link
          to="/"
          aria-label={t("MADE IN EGYPT")}
          className="group absolute left-1/2 flex -translate-x-1/2 items-center gap-2 md:static md:translate-x-0 md:gap-2.5"
        >
          <span className="relative flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#d6b47f] p-[2px] shadow-[0_3px_10px_rgba(9,29,25,0.28)] transition-transform duration-300 group-hover:rotate-[-6deg] group-hover:scale-105 lg:h-10 lg:w-10">
            <span className="flex h-full w-full items-center justify-center rounded-full border border-[#fff7e8]/80 bg-[#f8f0df]">
              <img src={Logo} alt="" className="h-[85%] w-[85%] object-contain" />
            </span>
          </span>
          <span className="flex flex-col leading-none">
            <span className="text-[8px] font-bold tracking-[0.24em] text-white/70 sm:text-[9px]">MADE IN</span>
            <span className="mt-1 flex items-center gap-1.5 text-[13px] font-black tracking-[0.18em] text-white sm:text-sm lg:text-base">
              EGYPT
              <span className="h-px w-3.5 bg-[#d6b47f] sm:w-5" aria-hidden="true" />
            </span>
          </span>
        </Link>

        <div className="group relative hidden min-w-0 flex-1 md:block">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder={t("Search products...")}
            aria-label={t("Search products...")}
            className="w-full rounded-full border border-white/15 bg-white/10 py-2 pl-5 pr-11 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-white/50 focus:bg-white/15"
          />
          <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors group-focus-within:text-white" size={18} />
        </div>

        <div className="col-start-3 flex items-center justify-self-end gap-1 sm:gap-2 md:ml-auto">
          <button
            type="button"
            onClick={toggleLanguage}
            aria-label={`Change language to ${isArabic ? "English" : "Arabic"}`}
            title={isArabic ? "English" : "العربية"}
            className="hidden h-10 items-center justify-center gap-2 rounded-full px-3 text-white transition-colors hover:bg-white/10 md:flex"
          >
            <Globe size={18} />
            <span className="text-sm font-medium">{isArabic ? "English" : "العربية"}</span>
          </button>

          <div ref={menuRef} className="relative">
            <button
              type="button"
              onClick={() => setMenuOpen((prev) => !prev)}
              className="flex h-10 w-10 items-center justify-center rounded-full text-white transition-colors hover:bg-white/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/80"
              aria-label={t("Account menu")}
              aria-expanded={menuOpen}
              aria-haspopup="menu"
              aria-controls="account-menu"
            >
              <span className="relative flex h-9 w-9 items-center justify-center rounded-full border border-white/25 bg-white/10 font-bold text-white">
                {user?.name?.charAt(0)?.toUpperCase() || <User size={18} />}
                <ChevronDown
                  size={12}
                  aria-hidden="true"
                  className={`absolute -bottom-0.5 rounded-full bg-[var(--primary)] ${isArabic ? "-left-0.5" : "-right-0.5"}`}
                />
              </span>
            </button>

            {menuOpen && (
              <div
                id="account-menu"
                role="menu"
                aria-label={t("Account menu")}
                className={`absolute ${isArabic ? "left-0 origin-top-left" : "right-0 origin-top-right"} top-full z-[var(--z-drawer)] mt-2 w-60 max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-2xl border border-slate-200 bg-white text-slate-800 shadow-[0_18px_48px_rgba(15,35,29,0.24)] ring-1 ring-black/5`}
              >
                <div className="flex items-center gap-3 bg-[var(--primary)] px-4 py-4 text-white">
                  <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/10 font-bold">
                    {user?.name?.charAt(0)?.toUpperCase() || <User size={18} aria-hidden="true" />}
                  </span>
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold">
                      {user?.name || t("Please sign in to continue")}
                    </p>
                    {user?.email && <p className="truncate text-xs text-white/70">{user.email}</p>}
                  </div>
                </div>
                <div className="py-1.5">
                  <button
                    type="button"
                    role="menuitem"
                    onClick={() => {
                      toggleLanguage();
                      setMenuOpen(false);
                    }}
                    className="flex w-full items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none md:hidden"
                  >
                    <Globe size={17} className="text-slate-500" aria-hidden="true" />
                    {isArabic ? "English" : "العربية"}
                  </button>
                  {!user ? (
                    <>
                      <Link
                        to="/login"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                      >
                        <LogIn size={17} className="text-slate-500" aria-hidden="true" />
                        {t("تسجيل الدخول")}
                      </Link>
                      <Link
                        to="/register"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                      >
                        <UserPlus size={17} className="text-slate-500" aria-hidden="true" />
                        {t("حساب جديد")}
                      </Link>
                    </>
                  ) : (
                    <>
                      <Link
                        to="/profile"
                        onClick={() => setMenuOpen(false)}
                        role="menuitem"
                        className="flex items-center gap-3 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                      >
                        <User size={17} className="text-slate-500" aria-hidden="true" />
                        {t("الملف الشخصي")}
                      </Link>
                      {user?.role === "admin" && (
                        <Link
                          to="/admin"
                          onClick={() => setMenuOpen(false)}
                          role="menuitem"
                          className="flex items-center gap-3 border-t border-slate-100 px-4 py-3 text-sm font-medium transition-colors hover:bg-slate-50 focus-visible:bg-slate-50 focus-visible:outline-none"
                        >
                          <span aria-hidden="true" className="text-base">⚙️</span>
                          {t("لوحة التحكم")}
                        </Link>
                      )}
                      <button
                        type="button"
                        onClick={handleLogout}
                        role="menuitem"
                        className="flex w-full items-center gap-3 border-t border-slate-100 px-4 py-3 text-start text-sm font-medium text-red-600 transition-colors hover:bg-red-50 focus-visible:bg-red-50 focus-visible:outline-none"
                      >
                        <LogOut size={17} aria-hidden="true" />
                        {t("تسجيل الخروج")}
                      </button>
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

        </div>
      </div>

      {searchOpen && (
        <div className="border-t border-white/10 px-3 py-2 md:hidden">
          <div className="group relative mx-auto max-w-7xl">
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={t("Search products...")}
              aria-label={t("Search products...")}
              className="w-full rounded-full border border-white/15 bg-white/10 py-2 pl-5 pr-11 text-sm text-white outline-none transition placeholder:text-white/60 focus:border-white/50 focus:bg-white/15"
            />
            <Search className="absolute right-4 top-1/2 -translate-y-1/2 text-white/60 transition-colors group-focus-within:text-white" size={18} />
          </div>
        </div>
      )}
    </header>
  );
}