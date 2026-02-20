import { Outlet } from "react-router-dom";
import Sidebar from "../../components/Sidebar"; // عدل المسار حسب مكانه

export default function AdminLayout() {
  return (
    <div className="flex min-h-screen">
      {/* Sidebar ثابت */}
      <Sidebar />

      {/* الصفحات اللي بتتغير */}
      <div className="flex-1 p-6 ">
        <Outlet />
      </div>
    </div>
  );
}
