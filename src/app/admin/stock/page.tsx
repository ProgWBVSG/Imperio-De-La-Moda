"use client";

import { useState, useEffect } from "react";

interface Producto {
  id: string;
  nombre: string;
  stock_por_talle: Record<string, number>;
  fotos: string[];
}

export default function StockAdmin() {
  const [productos, setProductos] = useState<Producto[]>([]);
  const [loading, setLoading] = useState(true);
  const [soloStockBajo, setSoloStockBajo] = useState(false);
  const [toast, setToast] = useState("");

  useEffect(() => {
    fetch("/api/admin/productos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProductos(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const updateStock = async (id: string, talle: string, value: number) => {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;
    
    const newStock = { ...prod.stock_por_talle, [talle]: Math.max(0, value) };
    setProductos(prev => prev.map(p => p.id === id ? { ...p, stock_por_talle: newStock } : p));
  };

  const saveStock = async (id: string) => {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;
    
    await fetch(`/api/admin/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_por_talle: prod.stock_por_talle }),
    });
    showToast("Stock actualizado");
  };

  const agotarTodo = async (id: string) => {
    const prod = productos.find(p => p.id === id);
    if (!prod) return;
    
    const zeroed: Record<string, number> = {};
    Object.keys(prod.stock_por_talle).forEach(t => zeroed[t] = 0);
    
    await fetch(`/api/admin/productos/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ stock_por_talle: zeroed }),
    });
    
    setProductos(prev => prev.map(p => p.id === id ? { ...p, stock_por_talle: zeroed } : p));
    showToast("Producto agotado");
  };

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 3000);
  };

  const TODOS_TALLES = ["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44", "46"];
  
  const filteredProducts = soloStockBajo
    ? productos.filter(p => Object.values(p.stock_por_talle).some(v => v <= 3))
    : productos;

  if (loading) {
    return <div className="p-8 text-center" style={{ color: "var(--admin-text-muted)" }}>Cargando stock...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-2xl font-bold">📦 Stock</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Gestioná tu inventario manualmente o mediante Excel inteligente.</p>
        </div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <label className="flex items-center gap-2 cursor-pointer">
            <input type="checkbox" checked={soloStockBajo} onChange={() => setSoloStockBajo(!soloStockBajo)} />
            <span className="text-sm font-bold" style={{ color: "var(--admin-text-muted)" }}>Solo stock bajo</span>
          </label>
          
          <div className="relative">
            <input 
              type="file" 
              id="excel-upload" 
              accept=".xlsx,.csv" 
              className="hidden" 
              onChange={async (e) => {
                const file = e.target.files?.[0];
                if (!file) return;
                
                showToast("Analizando y procesando Excel (IA)...");
                const formData = new FormData();
                formData.append("file", file);
                
                try {
                  const res = await fetch("/api/admin/importar", { method: "POST", body: formData });
                  const data = await res.json();
                  if (data.error) {
                    showToast("❌ " + data.error);
                  } else {
                    showToast("✅ " + data.mensaje);
                    // Forzar recarga de los productos
                    setTimeout(() => window.location.reload(), 2000);
                  }
                } catch (err) {
                  showToast("❌ Error de red al procesar el archivo.");
                }
              }}
            />
            <label 
              htmlFor="excel-upload" 
              className="admin-btn admin-btn-primary flex items-center gap-2 cursor-pointer shadow-lg hover:scale-105 transition-transform"
            >
              <span>📄</span> Carga Masiva (Excel)
            </label>
          </div>
        </div>
      </div>

      <div className="admin-card overflow-x-auto">
        <table className="admin-table">
          <thead>
            <tr>
              <th className="sticky left-0 z-10" style={{ background: "var(--admin-surface)" }}>Producto</th>
              {TODOS_TALLES.map(t => <th key={t} className="text-center w-16">{t}</th>)}
              <th className="text-center">Acción</th>
            </tr>
          </thead>
          <tbody>
            {filteredProducts.map(p => (
              <tr key={p.id}>
                <td className="sticky left-0 z-10" style={{ background: "var(--admin-surface)" }}>
                  <div className="flex items-center gap-2 min-w-[160px]">
                    {p.fotos?.[0] && (
                      <div className="w-8 h-8 rounded overflow-hidden bg-gray-800 shrink-0">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={p.fotos[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                    )}
                    <span className="font-bold text-sm truncate">{p.nombre}</span>
                  </div>
                </td>
                {TODOS_TALLES.map(t => {
                  const val = p.stock_por_talle[t];
                  const hasTalle = val !== undefined;
                  return (
                    <td key={t} className="text-center px-1">
                      {hasTalle ? (
                        <input
                          type="number"
                          value={val}
                          onChange={(e) => updateStock(p.id, t, parseInt(e.target.value) || 0)}
                          onBlur={() => saveStock(p.id)}
                          className="admin-input w-14 text-center text-sm py-1 px-1"
                          min={0}
                          style={{
                            color: val === 0 ? "var(--admin-danger)" : val <= 3 ? "var(--admin-warning)" : "var(--admin-text)",
                            fontWeight: val <= 3 ? "800" : "500",
                          }}
                        />
                      ) : (
                        <span style={{ color: "var(--admin-border)" }}>—</span>
                      )}
                    </td>
                  );
                })}
                <td className="text-center">
                  <button onClick={() => agotarTodo(p.id)} className="admin-btn admin-btn-danger text-xs whitespace-nowrap">
                    Agotar
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {toast && (
        <div className="admin-toast" style={{ color: "var(--admin-success)" }}>
          ✓ {toast}
        </div>
      )}
    </div>
  );
}
