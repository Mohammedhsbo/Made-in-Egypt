import { ChevronRight, House } from "lucide-react";
import { Link } from "react-router-dom";
import { useLanguage } from "@/context/language.context";

export default function Breadcrumbs({ items }) {
  const { isArabic, t } = useLanguage();

  if (!items?.length) return null;

  return (
    <nav className="site-breadcrumbs" aria-label={t("Breadcrumbs")} dir={isArabic ? "rtl" : "ltr"}>
      <ol className="site-breadcrumb-list">
        {items.map((item, index) => {
          const isCurrent = index === items.length - 1;
          return (
            <li className="site-breadcrumb-item" key={`${item.label}-${index}`}>
              {index > 0 && (
                <ChevronRight
                  size={14}
                  className="site-breadcrumb-separator"
                  aria-hidden="true"
                />
              )}
              {index === 0 && item.to && (
                <House size={14} className="site-breadcrumb-icon" aria-hidden="true" />
              )}
              {item.to && !isCurrent ? (
                <Link to={item.to} className="site-breadcrumb-link">{t(item.label)}</Link>
              ) : (
                <span className="site-breadcrumb-current" aria-current="page">{t(item.label)}</span>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
