import { Outlet } from "react-router-dom";
import Sidebar from "../../components/sidebar";


export default function AdminLayout() {

  
  return (
    <div className="flex min-h-screen bg-slate-50 font-sans" dir="rtl">
      <Sidebar />

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
