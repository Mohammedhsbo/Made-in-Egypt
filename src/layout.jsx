import React from 'react';
import Header from '@/components/header';
import Footer from '@/components/footer';
import Breadcrumbs from '@/components/breadcrumbs';
import { Outlet, useLocation } from 'react-router-dom';

function getStoreBreadcrumbs(pathname) {
  const home = { to: '/', label: 'Home' };

  if (pathname === '/') return null;
  if (pathname === '/cart') return [home, { label: 'Shopping cart' }];
  if (pathname === '/checkout') {
    return [home, { to: '/cart', label: 'Shopping cart' }, { label: 'Checkout' }];
  }
  if (pathname === '/clothes') return [home, { label: 'الملابس' }];
  if (pathname === '/shoes') return [home, { label: 'الأحذية' }];
  if (pathname === '/perfumes') return [home, { label: 'العطور' }];
  if (pathname === '/socks') return [home, { label: 'الجوارب' }];
  if (/^\/productdetails\/[^/]+$/.test(pathname)) {
    return [home, { label: 'Product details' }];
  }
  if (/^\/categories\/[^/]+$/.test(pathname)) {
    return [home, { label: 'Categories' }];
  }
  if (/^\/brands\/[^/]+$/.test(pathname)) {
    return [home, { label: 'Brands' }];
  }
  if (pathname === '/login' || pathname === '/register') {
    return [home, { label: pathname === '/login' ? 'Login' : 'Register' }];
  }
  if (pathname === '/forgot-password') {
    return [home, { to: '/login', label: 'Login' }, { label: 'Forgot password?' }];
  }
  if (pathname === '/verify-otp') {
    return [home, { to: '/login', label: 'Login' }, { label: 'Verify OTP' }];
  }
  if (pathname === '/verify-email') {
    return [home, { to: '/register', label: 'Register' }, { label: 'Verify email' }];
  }
  if (pathname === '/profile') return [home, { label: 'Profile' }];
  if (pathname === '/my-orders') return [home, { label: 'My Orders' }];
  if (/^\/my-orders\/[^/]+$/.test(pathname)) {
    return [home, { to: '/my-orders', label: 'My Orders' }, { label: 'تفاصيل الطلب' }];
  }

  return [home, { label: 'Not found' }];
}

export default function Layout() {
  const { pathname } = useLocation();
  const isAdminRoute = pathname === '/admin' || pathname.startsWith('/admin/');
  const breadcrumbs = isAdminRoute ? null : getStoreBreadcrumbs(pathname);

  return (
    <div className="min-h-screen flex flex-col font-sans bg-gray-50/50">
       <Header />
       
       <main className={`relative z-[var(--z-content)] flex-grow overflow-x-hidden ${isAdminRoute ? 'admin-route-main' : 'pb-12'}`}>
        {breadcrumbs && (
          <div className="site-breadcrumb-container">
            <Breadcrumbs items={breadcrumbs} />
          </div>
        )}
        <Outlet />
       </main>
       
       <Footer />
    </div>
  );
}
