"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "./AdminThemeProvider";
import { 
  LayoutDashboard, 
  Package, 
  ClipboardList, 
  MessageCircle, 
  Star, 
  Tag, 
  Settings,
  Sun,
  Moon,
  Globe,
  Users,
  CheckSquare,
  Menu,
  X
} from "lucide-react";

const navItems = [
  { icon: <LayoutDashboard size={20} />, label: "Dashboard", href: "/admin" },
  { icon: <CheckSquare size={20} />, label: "Tareas", href: "/admin/tareas" },
  { icon: <Package size={20} />, label: "Productos", href: "/admin/productos" },
  { icon: <ClipboardList size={20} />, label: "Stock", href: "/admin/stock" },
  { icon: <MessageCircle size={20} />, label: "Pedidos WA", href: "/admin/pedidos" },
  { icon: <Users size={20} />, label: "CRM Clientes", href: "/admin/clientes" },
  { icon: <Star size={20} />, label: "Testimonios", href: "/admin/testimonios" },
  { icon: <Tag size={20} />, label: "Promos", href: "/admin/promos" },
  { icon: <Settings size={20} />, label: "Config", href: "/admin/configuracion" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useAdminTheme();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  const SidebarContent = () => (
    <>
      <div className="p-5 border-b flex justify-between items-center" style={{ borderColor: "var(--admin-border)" }}>
        <div>
          <Link href="/admin">
            <span className="text-xl font-bold tracking-widest" style={{ color: "var(--admin-accent)" }}>
              IMPERIO
            </span>
          </Link>
          <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--admin-text-muted)" }}>
            Panel de Control
          </p>
        </div>
        <button 
          className="md:hidden text-gray-400 hover:text-white"
          onClick={() => setIsMobileMenuOpen(false)}
        >
          <X size={24} />
        </button>
      </div>

      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-sidebar-link ${isActive(item.href) ? "active" : ""}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      <div className="p-4 space-y-2 border-t" style={{ borderColor: "var(--admin-border)" }}>
        {/* Toggle Modo Claro / Oscuro */}
        <button
          onClick={toggle}
          className="admin-sidebar-link w-full justify-between"
        >
          <span className="flex items-center gap-3">
            <span className="flex items-center justify-center w-5">{theme === "dark" ? <Sun size={20} /> : <Moon size={20} />}</span>
            <span>{theme === "dark" ? "Modo claro" : "Modo oscuro"}</span>
          </span>
          <div className="relative">
            <div
              className="w-9 h-5 rounded-full transition-colors"
              style={{ background: theme === "light" ? "var(--admin-accent)" : "var(--admin-border)" }}
            />
            <div
              className={`absolute top-0.5 w-4 h-4 rounded-full bg-white transition-transform ${theme === "light" ? "translate-x-4" : "translate-x-0.5"}`}
            />
          </div>
        </button>

        <Link
          href="/"
          target="_blank"
          className="admin-sidebar-link text-xs"
        >
          <Globe size={16} />
          <span>Ver sitio web</span>
        </Link>
      </div>
    </>
  );

  return (
    <>
      {/* MOBILE TOP BAR */}
      <div className="md:hidden fixed top-0 left-0 right-0 h-16 z-40 flex items-center justify-between px-4" style={{ background: "var(--admin-surface)", borderBottom: "1px solid var(--admin-border)" }}>
        <Link href="/admin">
          <span className="text-lg font-bold tracking-widest" style={{ color: "var(--admin-accent)" }}>
            IMPERIO
          </span>
        </Link>
        <button 
          onClick={() => setIsMobileMenuOpen(true)}
          className="p-2 -mr-2"
          style={{ color: "var(--admin-text)" }}
        >
          <Menu size={24} />
        </button>
      </div>

      {/* MOBILE OVERLAY */}
      {isMobileMenuOpen && (
        <div 
          className="md:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm transition-opacity"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* SIDEBAR DESKTOP & MOBILE */}
      <aside 
        className={`admin-sidebar fixed top-0 bottom-0 left-0 z-50 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${isMobileMenuOpen ? "translate-x-0" : "-translate-x-full"}`}
      >
        <SidebarContent />
      </aside>
    </>
  );
}
