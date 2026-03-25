"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAdminTheme } from "./AdminThemeProvider";

const navItems = [
  { icon: "📊", label: "Dashboard", href: "/admin" },
  { icon: "📦", label: "Productos", href: "/admin/productos" },
  { icon: "📋", label: "Stock", href: "/admin/stock" },
  { icon: "💬", label: "Pedidos WA", href: "/admin/pedidos" },
  { icon: "⭐", label: "Testimonios", href: "/admin/testimonios" },
  { icon: "🎤", label: "Charlas", href: "/admin/charlas" },
  { icon: "⚙️", label: "Config", href: "/admin/configuracion" },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const { theme, toggle } = useAdminTheme();

  const isActive = (href: string) => {
    if (href === "/admin") return pathname === "/admin";
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className="admin-sidebar hidden md:flex">
        <div className="p-5 border-b" style={{ borderColor: "var(--admin-border)" }}>
          <Link href="/admin">
            <span className="text-xl font-bold tracking-widest" style={{ color: "var(--admin-accent)" }}>
              IMPERIO
            </span>
          </Link>
          <p className="text-[10px] uppercase tracking-widest mt-1" style={{ color: "var(--admin-text-muted)" }}>
            Panel de Control
          </p>
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
              <span className="text-lg">{theme === "dark" ? "☀️" : "🌙"}</span>
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
            <span>🌐</span>
            <span>Ver sitio web</span>
          </Link>
        </div>
      </aside>

      {/* BOTTOM TAB BAR MOBILE */}
      <nav className="admin-tab-bar md:hidden">
        {navItems.slice(0, 5).map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`admin-tab-item ${isActive(item.href) ? "active" : ""}`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
        {/* Theme toggle en mobile */}
        <button onClick={toggle} className={`admin-tab-item`}>
          <span className="text-lg">{theme === "dark" ? "☀️" : "🌙"}</span>
          <span>{theme === "dark" ? "Claro" : "Oscuro"}</span>
        </button>
      </nav>
    </>
  );
}
