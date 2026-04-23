import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import { Outlet } from 'react-router-dom';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
       <Header />
       
       {/*
         * Layout fix: The header is fixed and has two visual layers on mobile:
         *   1. Nav row  → h-[70px]
         *   2. Search bar → lg:hidden, roughly 46px (py-2 input + pb-3 wrapper)
         * Total mobile header height ≈ 116px. Old pt-[100px] clipped the top of
         * every page's content on small screens. pt-[120px] gives a comfortable
         * 4px buffer. Desktop header is exactly 120px (lg:h-[120px]), unchanged.
         */}
       <main className="relative z-[var(--z-content)] flex-grow overflow-x-hidden pb-12 pt-[120px] md:pt-[120px]">
        <Outlet />
       </main>
       
       <Footer />
    </div>
  );
}
