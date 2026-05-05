"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { 
  TrendingUp, 
  PlusCircle, 
  Package, 
  MessageCircle, 
  Star, 
  Trophy, 
  Eye, 
  TrendingDown, 
  AlertTriangle, 
  BarChart3 
} from 'lucide-react';

interface Stats {
  totalProductos: number;
  sinStock: number;
  totalGeneral: number;
  destacados: number;
  ingresosTotales: number;
  pedidosTotales: number;
  ticketPromedio: number;
}

interface StockBajo {
  id: string;
  nombre: string;
  stock: number;
}

interface TopProducto {
  id: string;
  nombre: string;
  vistas?: number;
  cantidad?: number;
  ingresos?: number;
  fotos?: string[];
  precio_minorista?: number;
}

export default function DashboardAdmin() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [stockBajo, setStockBajo] = useState<StockBajo[]>([]);
  const [topVistos, setTopVistos] = useState<TopProducto[]>([]);
  const [topVendidos, setTopVendidos] = useState<TopProducto[]>([]);
  const [menosVendidos, setMenosVendidos] = useState<TopProducto[]>([]);
  const [graficoVentas, setGraficoVentas] = useState<any[]>([]);
  const [rendimientoProductos, setRendimientoProductos] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/admin/stats")
      .then(res => res.json())
      .then(data => {
        if (data.stats) setStats(data.stats);
        if (data.stockBajo) setStockBajo(data.stockBajo);
        if (data.topVistos) setTopVistos(data.topVistos);
        if (data.topVendidos) setTopVendidos(data.topVendidos);
        if (data.menosVendidos) setMenosVendidos(data.menosVendidos);
        if (data.graficoVentas) setGraficoVentas(data.graficoVentas);
        if (data.rendimientoProductos) setRendimientoProductos(data.rendimientoProductos);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const formatPrecio = (n: number) => `$${n.toLocaleString("es-AR")}`;

  if (loading || !stats) {
    return <div className="p-8 text-center" style={{ color: "var(--admin-text-muted)" }}>Cargando inteligencia analítica...</div>;
  }

  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          Resumen Financiero <TrendingUp className="text-green-500" />
        </h1>
        <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Analíticas en tiempo real de Imperio de la Moda</p>
      </div>

      {/* Financial KPIs */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="admin-kpi" style={{ borderLeft: "4px solid var(--admin-accent)" }}>
          <div className="kpi-value text-green-400">{formatPrecio(stats.ingresosTotales)}</div>
          <div className="kpi-label">Ingresos Brutos</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value">{stats.pedidosTotales}</div>
          <div className="kpi-label">Pedidos Confirmados</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value">{formatPrecio(Math.round(stats.ticketPromedio))}</div>
          <div className="kpi-label">Ticket Promedio</div>
        </div>
        <div className="admin-kpi">
          <div className="kpi-value">{stats.totalProductos}</div>
          <div className="kpi-label">Productos Activos</div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div className="admin-card">
          <h2 className="font-bold text-lg mb-4">Evolución de Ingresos ($)</h2>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={graficoVentas}>
                <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                <XAxis dataKey="fecha" stroke="#888" fontSize={12} />
                <YAxis stroke="#888" fontSize={12} tickFormatter={(val) => `$${val/1000}k`} />
                <Tooltip contentStyle={{ backgroundColor: '#111', border: '1px solid #333' }} formatter={(val: number) => formatPrecio(val)} />
                <Line type="monotone" dataKey="total" stroke="var(--admin-accent)" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-2 gap-4">
          <Link href="/admin/productos/nuevo" className="admin-quick-action">
            <PlusCircle size={28} className="text-accent" />
            <div><p className="font-bold text-sm">Crear Producto</p></div>
          </Link>
          <Link href="/admin/stock" className="admin-quick-action">
            <Package size={28} className="text-blue-400" />
            <div><p className="font-bold text-sm">Importar Excel</p></div>
          </Link>
          <Link href="/admin/pedidos" className="admin-quick-action">
            <MessageCircle size={28} className="text-whatsapp" />
            <div><p className="font-bold text-sm">Gestionar Pedidos</p></div>
          </Link>
          <Link href="/admin/testimonios" className="admin-quick-action">
            <Star size={28} className="text-yellow-400" />
            <div><p className="font-bold text-sm">Testimonios</p></div>
          </Link>
        </div>
      </div>

      {/* Rankings Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="admin-card">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Trophy className="text-yellow-400" size={20} /> Top 5 Más Vendidos
          </h2>
          <div className="space-y-4">
            {topVendidos.length === 0 ? <p className="text-sm text-gray-500">No hay ventas registradas.</p> : topVendidos.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">#{i + 1}</span>
                  <span className="font-medium text-sm truncate max-w-[120px]" title={p.nombre}>{p.nombre}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-green-400">{p.cantidad} uds</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="admin-card">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <Eye className="text-blue-400" size={20} /> Top 5 Más Vistos
          </h2>
          <div className="space-y-4">
            {topVistos.length === 0 ? <p className="text-sm text-gray-500">No hay vistas registradas.</p> : topVistos.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">#{i + 1}</span>
                  <span className="font-medium text-sm truncate max-w-[120px]" title={p.nombre}>{p.nombre}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-blue-400">{p.vistas} vistas</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="admin-card">
          <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
            <TrendingDown className="text-red-400" size={20} /> Top 5 Menos Vendidos
          </h2>
          <div className="space-y-4">
            {menosVendidos.length === 0 ? <p className="text-sm text-gray-500">No hay datos.</p> : menosVendidos.map((p, i) => (
              <div key={p.id} className="flex items-center justify-between border-b border-gray-800 pb-2">
                <div className="flex items-center gap-3">
                  <span className="font-bold text-gray-500">#{i + 1}</span>
                  <span className="font-medium text-sm truncate max-w-[120px]" title={p.nombre}>{p.nombre}</span>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-bold text-sm text-red-400">{p.cantidad} uds</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Alertas stock bajo */}
      {stockBajo.length > 0 && (
        <div>
          <h2 className="font-bold text-lg mb-3 flex items-center gap-2">
            <AlertTriangle className="text-yellow-500" size={22} /> Stock crítico (Menos de 5 unidades)
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            {stockBajo.map(p => (
              <div key={p.id} className="admin-alert admin-alert-warning">
                <span className="flex-1 font-medium text-sm truncate">{p.nombre}</span>
                <span className="admin-badge admin-badge-warning">{p.stock} uds</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tabla de Rendimiento Individual */}
      <div className="admin-card mt-8">
        <h2 className="font-bold text-lg mb-4 flex items-center gap-2">
          <BarChart3 className="text-accent" size={22} /> Rendimiento Completo por Producto
        </h2>
        {rendimientoProductos.length === 0 ? (
          <p className="text-sm text-gray-500">No hay productos.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="admin-table w-full text-left">
              <thead>
                <tr>
                  <th className="p-2 border-b border-gray-800">Producto</th>
                  <th className="p-2 border-b border-gray-800">Stock</th>
                  <th className="p-2 border-b border-gray-800">Vistas</th>
                  <th className="p-2 border-b border-gray-800">Ventas</th>
                  <th className="p-2 border-b border-gray-800">Ingresos ($)</th>
                </tr>
              </thead>
              <tbody>
                {rendimientoProductos.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-800/50">
                    <td className="p-2 border-b border-gray-800/50 text-sm font-medium">
                      <Link href={`/admin/productos/${p.id}`} className="hover:text-accent truncate block max-w-[200px]" title={p.nombre}>
                        {p.nombre}
                      </Link>
                    </td>
                    <td className="p-2 border-b border-gray-800/50 text-sm">
                      <span className={`px-2 py-0.5 rounded text-xs ${p.stock === 0 ? 'bg-red-500/20 text-red-400' : p.stock <= 5 ? 'bg-yellow-500/20 text-yellow-400' : 'bg-green-500/20 text-green-400'}`}>
                        {p.stock}
                      </span>
                    </td>
                    <td className="p-2 border-b border-gray-800/50 text-sm font-bold text-blue-400">{p.vistas || 0}</td>
                    <td className="p-2 border-b border-gray-800/50 text-sm font-bold text-green-400">{p.ventas || 0}</td>
                    <td className="p-2 border-b border-gray-800/50 text-sm">{formatPrecio(p.ingresos || 0)}</td>
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
