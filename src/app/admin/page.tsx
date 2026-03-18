"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Stats {
  totalProductos: number;
  sinStock: number;
  totalGeneral: number;
  destacados: number;
}

interface StockBajo {
  id: string;
  nombre: string;
  stock: number;
}

interface UltimoProducto {
  id: string;
  nombre: string;
  categoria: string;
  precio_minorista: number;
  precio_mayorista: number;
  stock: number;
  oculto: boolean;
  fotos: string[];
  creado_en: string;
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<Stats>({ totalProductos: 0, sinStock: 0, totalGeneral: 0, destacados: 0 });
  const [stockBajo, setStockBajo] = useState<StockBajo[]>([]);
  const [ultimos, setUltimos] = useState<UltimoProducto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.stockBajo) setStockBajo(data.stockBajo);
        if (data.ultimos) setUltimos(data.ultimos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold">Bienvenido 👋</h1>
        <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Panel de control de Imperio de la Moda</p>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="admin-kpi">
          <div className="kpi-value">{loading ? "..." : stats.totalProductos}</div>
          <div className="kpi-label">Productos activos</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value" style={{ color: stats.sinStock > 0 ? "var(--admin-danger)" : "" }}>
            {loading ? "..." : stats.sinStock}
          </div>
          <div className="kpi-label">Sin stock</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value">{loading ? "..." : stats.totalGeneral}</div>
          <div className="kpi-label">Total productos</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value" style={{ color: "var(--admin-accent)" }}>
            {loading ? "..." : stats.destacados}
          </div>
          <div className="kpi-label">Destacados</div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Link href="/admin/productos/nuevo" className="admin-quick-action">
          <span className="text-2xl">➕</span>
          <div>
            <p className="font-bold text-sm">Agregar producto</p>
            <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Nuevo artículo</p>
          </div>
        </Link>
        <Link href="/admin/stock" className="admin-quick-action">
          <span className="text-2xl">📦</span>
          <div>
            <p className="font-bold text-sm">Actualizar stock</p>
            <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Edición rápida</p>
          </div>
        </Link>
        <Link href="/admin/pedidos" className="admin-quick-action">
          <span className="text-2xl">💬</span>
          <div>
            <p className="font-bold text-sm">Ver pedidos</p>
            <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>WhatsApp</p>
          </div>
        </Link>
        <Link href="/admin/testimonios" className="admin-quick-action">
          <span className="text-2xl">⭐</span>
          <div>
            <p className="font-bold text-sm">Testimonios</p>
            <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Agregar reseña</p>
          </div>
        </Link>
      </div>

      {/* Alertas stock bajo */}
      {stockBajo.length > 0 && (
        <div className="mb-8">
          <h2 className="font-bold text-lg mb-3">⚠️ Stock crítico</h2>
          <div className="space-y-2">
            {stockBajo.map(p => (
              <div key={p.id} className="admin-alert admin-alert-warning">
                <span>📦</span>
                <span className="flex-1 font-medium text-sm">{p.nombre}</span>
                <span className="admin-badge admin-badge-warning">{p.stock} uds</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Últimos productos */}
      <div className="admin-card">
        <h2 className="font-bold text-lg mb-4">📋 Últimos productos</h2>
        {loading ? (
          <p style={{ color: "var(--admin-text-muted)" }}>Cargando...</p>
        ) : ultimos.length === 0 ? (
          <p style={{ color: "var(--admin-text-muted)" }}>No hay productos todavía</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>Producto</th>
                  <th>Categoría</th>
                  <th>Mayorista</th>
                  <th>Minorista</th>
                  <th>Stock</th>
                  <th>Estado</th>
                </tr>
              </thead>
              <tbody>
                {ultimos.map(p => (
                  <tr key={p.id}>
                    <td>
                      <Link href={`/admin/productos/${p.id}`} className="flex items-center gap-2 hover:opacity-80">
                        {p.fotos?.[0] && (
                          <div className="w-8 h-8 rounded overflow-hidden bg-gray-800 shrink-0">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img src={p.fotos[0]} alt="" className="w-full h-full object-cover" />
                          </div>
                        )}
                        <span className="font-bold text-sm">{p.nombre}</span>
                      </Link>
                    </td>
                    <td className="text-sm">{p.categoria}</td>
                    <td className="font-bold text-sm">{formatPrecio(p.precio_mayorista)}</td>
                    <td className="font-bold text-sm">{formatPrecio(p.precio_minorista)}</td>
                    <td>
                      <span className={`admin-badge ${p.stock === 0 ? "admin-badge-danger" : p.stock <= 3 ? "admin-badge-warning" : "admin-badge-success"}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td>
                      <span className={`admin-badge ${p.oculto ? "admin-badge-muted" : "admin-badge-success"}`}>
                        {p.oculto ? "OCULTO" : "ACTIVO"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
