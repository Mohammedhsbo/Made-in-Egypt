import { Outlet } from "react-router-dom";
import Sidebar from "../../components/admin/sidebar";


export default function AdminLayout() {

  
  return (
    <div className=" relative z-[var(--z-content)] flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Sidebar />

      {/* Main Content Area */}
      <div className="relative z-[var(--z-content)] flex min-h-0 flex-1 flex-col overflow-hidden mt-14 lg:mt-0 ">
        
       
        

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-6 md:p-10">
          <Outlet />
        </div>
        
      </div>
    </div>
  );
}
