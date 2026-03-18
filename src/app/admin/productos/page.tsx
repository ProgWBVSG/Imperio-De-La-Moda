"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Producto {
  id: string;
  nombre: string;
  categoria: string;
  precio_mayorista: number;
  precio_minorista: number;
  stock: number;
  oculto: boolean;
  fotos: string[];
}

export default function ProductosAdmin() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [filtro, setFiltro] = useState("");
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");

  const fetchProductos = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (busqueda) params.set("q", busqueda);
      if (filtro) params.set("estado", filtro);
      const res = await fetch(`/api/admin/productos?${params}`);
      const data = await res.json();
      if (Array.isArray(data)) setProductos(data);
    } catch (err) {
      console.error("Error fetching productos:", err);
    }
    setLoading(false);
  };

  useEffect(() => { fetchProductos(); }, [filtro]);
  
  useEffect(() => {
    const timeout = setTimeout(fetchProductos, 300);
    return () => clearTimeout(timeout);
  }, [busqueda]);

  const toggleOculto = async (id: string, oculto: boolean) => {
    await fetch(`/api/admin/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ oculto: !oculto }),
    });
    setProductos(prev => prev.map(p => p.id === id ? { ...p, oculto: !p.oculto } : p));
    showToast(oculto ? "Producto activado" : "Producto ocultado");
  };

  const eliminar = async (id: string, nombre: string) => {
    if (!confirm(`¿Eliminar "${nombre}"? Esta acción no se puede deshacer.`)) return;
    await fetch(`/api/admin/productos/${id}`, { method: "DELETE" });
    setProductos(prev => prev.filter(p => p.id !== id));
    showToast("Producto eliminado");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold">Productos</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>{productos.length} productos</p>
        </div>
        <Link href="/admin/productos/nuevo" className="admin-btn admin-btn-primary admin-btn-lg">
          + Agregar producto
        </Link>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <input
          type="text"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          className="admin-input flex-1"
        />
        <div className="flex gap-2 flex-wrap">
          {[
            { label: "Todos", val: "" },
            { label: "Activos", val: "activos" },
            { label: "Ocultos", val: "ocultos" },
            { label: "Sin stock", val: "sin-stock" },
          ].map(f => (
            <button
              key={f.val}
              onClick={() => setFiltro(f.val)}
              className={`admin-btn text-xs ${filtro === f.val ? "admin-btn-primary" : "admin-btn-secondary"}`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="text-center py-12" style={{ color: "var(--admin-text-muted)" }}>
          Cargando productos...
        </div>
      )}

      {/* Lista vacía */}
      {!loading && productos.length === 0 && (
        <div className="admin-card text-center py-12">
          <p className="text-4xl mb-3">📦</p>
          <p className="font-bold text-lg mb-1">No hay productos</p>
          <p className="text-sm mb-4" style={{ color: "var(--admin-text-muted)" }}>Empezá agregando tu primer producto</p>
          <Link href="/admin/productos/nuevo" className="admin-btn admin-btn-primary">+ Agregar producto</Link>
        </div>
      )}

      {/* Tabla desktop */}
      {!loading && productos.length > 0 && (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Producto</th>
                <th>Categoría</th>
                <th>P. Mayorista</th>
                <th>P. Minorista</th>
                <th>Stock</th>
                <th>Estado</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {productos.map(p => (
                <tr key={p.id}>
                  <td>
                    <div className="flex items-center gap-3">
                      {p.fotos?.[0] && (
                        <div className="w-10 h-10 rounded-lg overflow-hidden bg-gray-800 shrink-0">
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={p.fotos[0]} alt="" className="w-full h-full object-cover" />
                        </div>
                      )}
                      <span className="font-bold text-sm">{p.nombre}</span>
                    </div>
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
                    <button onClick={() => toggleOculto(p.id, p.oculto)} className={`admin-badge cursor-pointer ${p.oculto ? "admin-badge-muted" : "admin-badge-success"}`}>
                      {p.oculto ? "OCULTO" : "ACTIVO"}
                    </button>
                  </td>
                  <td>
                    <div className="flex gap-2">
                      <Link href={`/admin/productos/${p.id}`} className="admin-btn admin-btn-secondary text-xs">Editar</Link>
                      <button onClick={() => eliminar(p.id, p.nombre)} className="admin-btn admin-btn-danger text-xs">Eliminar</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
