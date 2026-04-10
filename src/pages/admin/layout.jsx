import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";


export default function AdminLayout() {

  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      {/* Sidebar Overlay for Mobile could be added here, currently sticking to existing logic */}
      <div className="w-64 bg-white border-l border-gray-200 shadow-sm hidden md:block">
        <Sidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col overflow-hidden">
        
       
        

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}
