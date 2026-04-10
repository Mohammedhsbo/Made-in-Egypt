import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
       <Header />
       
       <main className="flex-grow pt-[100px] md:pt-[120px] pb-12 overflow-x-hidden">
        <Outlet />
       </main>
       
       <Footer />
    </div>
  );
}
