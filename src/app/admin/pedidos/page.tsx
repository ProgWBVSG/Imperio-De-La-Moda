"use client";

import { useState } from "react";

const mockPedidos = [
  { id: "p1", cliente: "María López", items: [{ nombre: "Campera Puffer", talle: "M", cantidad: 2, precio: 18000 }], total: 36000, estado: "PENDIENTE", fecha: "17/03/2026 14:30" },
  { id: "p2", cliente: "Carlos Ruiz", items: [{ nombre: "Pantalón Cargo", talle: "42", cantidad: 6, precio: 11000 }, { nombre: "Remera Básica", talle: "L", cantidad: 6, precio: 3000 }], total: 84000, estado: "CONFIRMADO", fecha: "17/03/2026 12:15" },
  { id: "p3", cliente: "Ana Sánchez", items: [{ nombre: "Jean Recto", talle: "38", cantidad: 1, precio: 16000 }], total: 16000, estado: "ENTREGADO", fecha: "17/03/2026 10:00" },
  { id: "p4", cliente: "Laura G.", items: [{ nombre: "Calza Deportiva", talle: "S", cantidad: 3, precio: 7500 }], total: 22500, estado: "PENDIENTE", fecha: "16/03/2026 18:45" },
  { id: "p5", cliente: "Martín P.", items: [{ nombre: "Buzo Oversize", talle: "L", cantidad: 1, precio: 12000 }], total: 12000, estado: "CANCELADO", fecha: "16/03/2026 09:30" },
];

const estados = ["PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"];
const badgeColor: Record<string, string> = {
  PENDIENTE: "admin-badge-warning",
  CONFIRMADO: "admin-badge-info",
  ENTREGADO: "admin-badge-success",
  CANCELADO: "admin-badge-danger",
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState(mockPedidos);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [expandido, setExpandido] = useState<string | null>(null);

  const cambiarEstado = (id: string, nuevoEstado: string) => {
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
  };

  const filtered = filtroEstado === "TODOS" ? pedidos : pedidos.filter(p => p.estado === filtroEstado);

  const totalHoy = pedidos.filter(p => p.fecha.includes("17/03")).reduce((sum, p) => sum + p.total, 0);
  const pedidosHoy = pedidos.filter(p => p.fecha.includes("17/03")).length;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">💬 Pedidos por WhatsApp</h1>
      <p className="text-sm mb-6" style={{ color: "var(--admin-text-muted)" }}>Registro de consultas y pedidos recibidos</p>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        <div className="admin-kpi">
          <div className="kpi-value" style={{ color: "var(--admin-accent)" }}>{pedidosHoy}</div>
          <div className="kpi-label">Pedidos hoy</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value" style={{ color: "var(--admin-success)" }}>${totalHoy.toLocaleString("es-AR")}</div>
          <div className="kpi-label">Facturado hoy (est.)</div>
        </div>
      </div>

      {/* Filtros */}
      <div className="flex gap-2 overflow-x-auto mb-6 pb-1">
        {["TODOS", ...estados].map(s => (
          <button key={s} onClick={() => setFiltroEstado(s)} className={`admin-btn whitespace-nowrap ${filtroEstado === s ? "admin-btn-primary" : "admin-btn-secondary"}`}>
            {s === "TODOS" ? "Todos" : s.charAt(0) + s.slice(1).toLowerCase()}
          </button>
        ))}
      </div>

      {/* Lista */}
      <div className="space-y-3">
        {filtered.map(p => (
          <div key={p.id} className="admin-card">
            <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandido(expandido === p.id ? null : p.id)}>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--admin-accent)", color: "#0D0D0D" }}>
                  {p.cliente.charAt(0)}
                </div>
                <div>
                  <p className="font-bold text-sm">{p.cliente}</p>
                  <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>{p.fecha}</p>
                </div>
              </div>
              <div className="text-right flex items-center gap-3">
                <div>
                  <p className="font-bold">${p.total.toLocaleString("es-AR")}</p>
                  <select
                    value={p.estado}
                    onChange={(e) => { e.stopPropagation(); cambiarEstado(p.id, e.target.value); }}
                    onClick={(e) => e.stopPropagation()}
                    className={`${badgeColor[p.estado]} admin-badge cursor-pointer border-none outline-none text-[10px]`}
                    style={{ background: "transparent" }}
                  >
                    {estados.map(s => <option key={s} value={s} className="text-black">{s}</option>)}
                  </select>
                </div>
                <span className="text-lg" style={{ color: "var(--admin-text-muted)" }}>{expandido === p.id ? "▲" : "▼"}</span>
              </div>
            </div>

            {/* Detalle expandible */}
            {expandido === p.id && (
              <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--admin-border)" }}>
                <p className="text-xs font-bold uppercase mb-2" style={{ color: "var(--admin-text-muted)" }}>Detalle del pedido</p>
                {p.items.map((item, i) => (
                  <div key={i} className="flex justify-between py-1.5 text-sm">
                    <span>{item.cantidad}× {item.nombre} — Talle {item.talle}</span>
                    <span className="font-bold">${(item.cantidad * item.precio).toLocaleString("es-AR")}</span>
                  </div>
                ))}
                <div className="flex justify-between pt-3 mt-2 font-bold" style={{ borderTop: "1px solid var(--admin-border)" }}>
                  <span>Total</span>
                  <span style={{ color: "var(--admin-accent)" }}>${p.total.toLocaleString("es-AR")}</span>
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
