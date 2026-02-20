import { Link } from "react-router";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[100vh] px-4 text-center">
      <h1 className="text-8xl font-bold text-red-600 mb-4">404</h1>
      <h2 className="text-2xl font-semibold mb-4">هذه الصفحة غير موجودة</h2>
      <p className="text-gray-600 mb-8">
        عذرًا! الصفحة التي تبحث عنها غير موجودة أو تم نقلها. يرجى التحقق من الرابط أو العودة إلى الصفحة الرئيسية.

      </p>
      <Link to="/">
        <Button>تصفح المنتجات</Button>
      </Link>
    </div>
  );
}
