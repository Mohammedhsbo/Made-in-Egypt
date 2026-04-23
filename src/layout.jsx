import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
       <Header />
       
       <main className="relative z-[var(--z-content)] flex-grow overflow-x-hidden pb-12 pt-[100px] md:pt-[120px]">
        <Outlet />
       </main>
       
       <Footer />
    </div>
  );
}
