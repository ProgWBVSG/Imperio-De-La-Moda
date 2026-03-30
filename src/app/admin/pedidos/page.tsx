"use client";

import { useState, useEffect } from "react";

// Estructura de Pedido según nuestra API y Prisma
type Pedido = {
  id: string;
  cliente: string;
  items: string; // JSON guardado en string
  total: number;
  estado: string;
  creado_en: string;
};

type ItemDetalle = {
  nombre: string;
  cantidad: number;
  precio: number;
  talle: string;
};

const estados = ["PENDIENTE", "CONFIRMADO", "ENTREGADO", "CANCELADO"];
const badgeColor: Record<string, string> = {
  PENDIENTE: "admin-badge-warning",
  CONFIRMADO: "admin-badge-info",
  ENTREGADO: "admin-badge-success",
  CANCELADO: "admin-badge-danger",
};

export default function PedidosPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [cargando, setCargando] = useState(true);
  const [filtroEstado, setFiltroEstado] = useState("TODOS");
  const [expandido, setExpandido] = useState<string | null>(null);

  useEffect(() => {
    fetchPedidos();
  }, []);

  const fetchPedidos = async () => {
    try {
      const res = await fetch('/api/admin/pedidos');
      if (res.ok) {
        const data = await res.json();
        setPedidos(data);
      }
    } catch (error) {
      console.error("Error al cargar pedidos:", error);
    } finally {
      setCargando(false);
    }
  };

  const cambiarEstado = async (id: string, nuevoEstado: string) => {
    // Actualización optimista
    setPedidos(prev => prev.map(p => p.id === id ? { ...p, estado: nuevoEstado } : p));
    
    // Impactar en Base de Datos
    fetch(`/api/admin/pedidos/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ estado: nuevoEstado })
    }).catch(e => {
      console.error(e);
      // Revertir si falla
      fetchPedidos();
    });
  };

  if (cargando) return <div className="p-8 text-center text-[var(--admin-text-muted)]">Cargando pedidos...</div>;

  const filtered = filtroEstado === "TODOS" ? pedidos : pedidos.filter(p => p.estado === filtroEstado);

  // Fecha actual formateada simple para estadística de "hoy" mm/dd
  const today = new Date().toISOString().substring(0, 10);
  const pedidosHoyArray = pedidos.filter(p => p.creado_en.includes(today));
  const totalHoy = pedidosHoyArray.reduce((sum, p) => sum + p.total, 0);
  const pedidosHoy = pedidosHoyArray.length;

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
      {filtered.length === 0 ? (
        <div className="text-center p-8 border border-dashed rounded-lg" style={{ borderColor: 'var(--admin-border)', color: 'var(--admin-text-muted)' }}>
          No se encontraron pedidos.
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map(p => {
            let itemsDecoded: ItemDetalle[] = [];
            try { itemsDecoded = JSON.parse(p.items); } catch(e) {}
            
            const fechaValida = new Date(p.creado_en);
            const fechaStr = fechaValida.toLocaleDateString("es-AR", { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });

            return (
              <div key={p.id} className="admin-card min-h-[80px]">
                <div className="flex items-center justify-between cursor-pointer" onClick={() => setExpandido(expandido === p.id ? null : p.id)}>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm" style={{ background: "var(--admin-accent)", color: "#0D0D0D" }}>
                      {p.cliente ? p.cliente.charAt(0).toUpperCase() : '?'}
                    </div>
                    <div>
                      <p className="font-bold text-sm">{p.cliente || 'Desconocido'}</p>
                      <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>{fechaStr}</p>
                    </div>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <div>
                      <p className="font-bold">${p.total.toLocaleString("es-AR")}</p>
                      <select
                        value={p.estado}
                        onChange={(e) => { e.stopPropagation(); cambiarEstado(p.id, e.target.value); }}
                        onClick={(e) => e.stopPropagation()}
                        className={`${badgeColor[p.estado] || badgeColor['PENDIENTE']} admin-badge cursor-pointer border-none outline-none text-[10px] w-auto text-center`}
                        style={{ background: "transparent" }}
                      >
                        {estados.map(s => <option key={s} value={s} className="text-black">{s}</option>)}
                      </select>
                    </div>
                    <span className="text-lg w-6 inline-block text-center" style={{ color: "var(--admin-text-muted)" }}>{expandido === p.id ? "▲" : "▼"}</span>
                  </div>
                </div>

                {/* Detalle expandible */}
                {expandido === p.id && (
                  <div className="mt-4 pt-4" style={{ borderTop: "1px solid var(--admin-border)" }}>
                    <p className="text-xs font-bold uppercase mb-2" style={{ color: "var(--admin-text-muted)" }}>Detalle del pedido</p>
                    {itemsDecoded.map((item, i) => (
                      <div key={i} className="flex justify-between py-1.5 text-sm">
                        <span>{item.cantidad}× {item.nombre} {item.talle ? `— Talle ${item.talle}` : ''}</span>
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
            );
          })}
        </div>
      )}
    </div>
  );
}

