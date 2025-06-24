"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X } from "lucide-react";
import Image from "next/image";
import { usePathname } from 'next/navigation';
import "./Navbar.css"; // 👈 Import custom CSS

export default function Navbar() {
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const pathname = usePathname();


      // 🔁 Auto-close menu on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
       {/* Mobile Toggle */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#111] flex items-center justify-between px-4 py-3 border-b border-gray-700">
                <Link href="/dashboard">
                  <Image src="/logo.png" width={200} height={200} alt="logo" />
                </Link>
        {/* Logo */}
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="text-white bg-gray-900 p-2 rounded"
          >
            {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Sidebar */}
        <aside
          className={`fixed md:static z-40 top-0 left-0 h-full w-64 bg-[#111] p-6 space-y-6 transform transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} md:translate-x-0`}
        >
          <Link href="/dashboard">
           <Image src="/logo.png" width={200} height={200} alt="logo" />
          </Link>
          <nav className="space-y-3">
            <SidebarLink href="/dashboard">Dashboard</SidebarLink>
            <SidebarLink href="/leaderboard">Leaderboard</SidebarLink>
            <SidebarLink href="/website">Website</SidebarLink>
            <SidebarLink href="https://t.me/dyfusionchain">Community</SidebarLink>
            <SidebarLink href="https://x.com/dyfusionchain">X</SidebarLink>
          </nav>
        </aside>
</>
     );
}

function SidebarLink({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <Link
      href={href}
      className="block text-white hover:text-yellow-400 transition-colors"
    >
      {children}
    </Link>
  );
}
