"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Promo {
  id: string;
  nombre: string;
  descripcion: string;
  porcentaje_descuento: number;
  fecha_inicio: string;
  fecha_fin: string;
  activa: boolean;
  producto_ids: string[];
  creado_en: string;
}

export default function PromosAdmin() {
  const [promos, setPromos] = useState<Promo[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const fetchPromos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/promos");
      const data = await res.json();
      if (Array.isArray(data)) setPromos(data);
    } catch (err) {
      console.error("Error fetching promos:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchPromos(); }, []);

  const toggleActiva = async (id: string, activa: boolean) => {
    await fetch(`/api/admin/promos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ activa: !activa }),
    });
    setPromos(prev => prev.map(p => p.id === id ? { ...p, activa: !p.activa } : p));
    showToast(activa ? "Promo desactivada" : "Promo activada");
  };

  const eliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar promo "${nombre}"? Los productos volverán a su precio normal.`)) return;
    await fetch(`/api/admin/promos/${id}`, { method: "DELETE" });
    setPromos(prev => prev.filter(p => p.id !== id));
    showToast("Promo eliminada");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const getEstado = (promo: Promo) => {
    const now = new Date();
    const inicio = new Date(promo.fecha_inicio);
    const fin = new Date(promo.fecha_fin);
    if (!promo.activa) return { label: "INACTIVA", className: "admin-badge-muted" };
    if (now < inicio) return { label: "PROGRAMADA", className: "admin-badge-info" };
    if (now > fin) return { label: "VENCIDA", className: "admin-badge-warning" };
    return { label: "ACTIVA", className: "admin-badge-success" };
  };

  const formatFecha = (d: string) =>
    new Date(d).toLocaleDateString("es-AR", { day: "2-digit", month: "short", year: "numeric" });

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">🏷️ Promociones</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>
            {promos.length} promociones · {promos.filter(p => getEstado(p).label === "ACTIVA").length} activas
          </p>
        </div>
        <Link href="/admin/promos/nueva" className="admin-btn admin-btn-primary admin-btn-lg">
          + Nueva promo
        </Link>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12" style={{ color: "var(--admin-text-muted)" }}>
          Cargando promos...
        </div>
      )}

      {/* Vacío */}
      {!loading && promos.length === 0 && (
        <div className="admin-card text-center py-12">
          <p className="text-4xl mb-3">🏷️</p>
          <p className="font-bold text-lg mb-1">No hay promociones</p>
          <p className="text-sm mb-4" style={{ color: "var(--admin-text-muted)" }}>
            Creá tu primera promo para atraer más clientes
          </p>
          <Link href="/admin/promos/nueva" className="admin-btn admin-btn-primary">+ Crear promo</Link>
        </div>
      )}

      {/* Cards de promos */}
      {!loading && promos.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {promos.map(promo => {
            const estado = getEstado(promo);
            return (
              <div key={promo.id} className="admin-card flex flex-col">
                {/* Header card */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-bold text-lg truncate">{promo.nombre}</h3>
                    {promo.descripcion && (
                      <p className="text-xs mt-1 line-clamp-2" style={{ color: "var(--admin-text-muted)" }}>
                        {promo.descripcion}
                      </p>
                    )}
                  </div>
                  <span className={`admin-badge ${estado.className} shrink-0 ml-2`}>
                    {estado.label}
                  </span>
                </div>

                {/* Info */}
                <div className="space-y-2 flex-1">
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--admin-text-muted)" }}>Descuento</span>
                    <span className="font-bold text-lg" style={{ color: "var(--admin-accent)" }}>
                      -{promo.porcentaje_descuento}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--admin-text-muted)" }}>Productos</span>
                    <span className="font-bold">{promo.producto_ids.length}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--admin-text-muted)" }}>Desde</span>
                    <span className="text-xs font-medium">{formatFecha(promo.fecha_inicio)}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span style={{ color: "var(--admin-text-muted)" }}>Hasta</span>
                    <span className="text-xs font-medium">{formatFecha(promo.fecha_fin)}</span>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-2 mt-4 pt-4 border-t" style={{ borderColor: "var(--admin-border)" }}>
                  <button
                    onClick={() => toggleActiva(promo.id, promo.activa)}
                    className={`admin-btn flex-1 text-xs ${promo.activa ? "admin-btn-secondary" : "admin-btn-primary"}`}
                  >
                    {promo.activa ? "⏸ Desactivar" : "▶ Activar"}
                  </button>
                  <Link
                    href={`/admin/promos/${promo.id}`}
                    className="admin-btn admin-btn-secondary text-xs"
                  >
                    ✏️ Editar
                  </Link>
                  <button
                    onClick={() => eliminar(promo.id, promo.nombre)}
                    className="admin-btn admin-btn-danger text-xs"
                  >
                    🗑
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className="admin-toast" style={{ color: "var(--admin-success)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
