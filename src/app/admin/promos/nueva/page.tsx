"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProductoSimple {
  id: string;
  nombre: string;
  categoria: string;
  precio_minorista: number;
  precio_mayorista: number;
  fotos: string[];
}

export default function NuevaPromo() {
  const router = useRouter();
  const [nombre, setNombre] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [porcentaje, setPorcentaje] = useState("15");
  const [fechaInicio, setFechaInicio] = useState(new Date().toISOString().split("T")[0]);
  const [fechaFin, setFechaFin] = useState(
    new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split("T")[0]
  );
  const [activa, setActiva] = useState(true);

  // Productos
  const [productos, setProductos] = useState<ProductoSimple[]>([]);
  const [seleccionados, setSeleccionados] = useState<string[]>([]);
  const [busqueda, setBusqueda] = useState("");
  const [loadingProductos, setLoadingProductos] = useState(true);

  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

  useEffect(() => {
    fetch("/api/admin/productos")
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setProductos(data);
        setLoadingProductos(false);
      })
      .catch(() => setLoadingProductos(false));
  }, []);

  const toggleProducto = (id: string) => {
    setSeleccionados(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const seleccionarTodos = () => {
    const filtrados = productosFiltrados.map(p => p.id);
    const todosSeleccionados = filtrados.every(id => seleccionados.includes(id));
    if (todosSeleccionados) {
      setSeleccionados(prev => prev.filter(id => !filtrados.includes(id)));
    } else {
      setSeleccionados(prev => [...new Set([...prev, ...filtrados])]);
    }
  };

  const productosFiltrados = productos.filter(p =>
    busqueda.length < 2 || p.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const desc = parseInt(porcentaje) || 0;

  const handleGuardar = async () => {
    const errs: string[] = [];
    if (!nombre.trim()) errs.push("Nombre de la promo");
    if (desc <= 0 || desc > 100) errs.push("Porcentaje válido (1-100)");
    if (seleccionados.length === 0) errs.push("Al menos un producto");
    if (errs.length > 0) {
      setErrores(errs);
      return;
    }
    setErrores([]);
    setGuardando(true);

    try {
      const res = await fetch("/api/admin/promos", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          descripcion,
          porcentaje_descuento: desc,
          fecha_inicio: new Date(fechaInicio).toISOString(),
          fecha_fin: new Date(fechaFin + "T23:59:59").toISOString(),
          activa,
          producto_ids: seleccionados,
        }),
      });
      if (!res.ok) throw new Error("Error al crear");
      setGuardado(true);
      setTimeout(() => router.push("/admin/promos"), 1200);
    } catch (err: any) {
      setGuardando(false);
      setErrores([err.message || "Error al crear la promo"]);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/promos" className="admin-btn admin-btn-ghost">← Volver</Link>
        <div>
          <h1 className="text-2xl font-bold">Nueva promoción</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Creá una promo y asigná productos</p>
        </div>
      </div>

      {/* Info básica */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">🏷️ Información de la promo</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>
              Nombre *
            </label>
            <input
              type="text"
              value={nombre}
              onChange={e => setNombre(e.target.value)}
              placeholder="Ej: Liquidación de Invierno"
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>
              Descripción
            </label>
            <textarea
              value={descripcion}
              onChange={e => setDescripcion(e.target.value)}
              placeholder="Descuento especial en toda la línea de abrigos..."
              className="admin-input min-h-[80px] resize-y"
            />
          </div>
        </div>
      </div>

      {/* Descuento */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">💰 Descuento</h2>
        <div className="flex items-center gap-4">
          <div className="flex-1">
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>
              Porcentaje de descuento *
            </label>
            <div className="relative">
              <input
                type="number"
                value={porcentaje}
                onChange={e => setPorcentaje(e.target.value)}
                min="1"
                max="100"
                className="admin-input text-3xl font-bold text-center"
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-2xl font-bold" style={{ color: "var(--admin-text-muted)" }}>%</span>
            </div>
          </div>
          <div className="text-center p-4 rounded-xl" style={{ background: "var(--admin-bg)" }}>
            <p className="text-xs font-bold mb-1" style={{ color: "var(--admin-text-muted)" }}>Vista previa</p>
            <p className="text-sm line-through" style={{ color: "var(--admin-text-muted)" }}>$10.000</p>
            <p className="text-xl font-bold" style={{ color: "var(--admin-accent)" }}>
              ${Math.round(10000 * (1 - desc / 100)).toLocaleString("es-AR")}
            </p>
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--admin-text-muted)" }}>
          Se aplica tanto al precio minorista como al mayorista
        </p>
      </div>

      {/* Fechas */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">📅 Fechas</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>
              Inicio
            </label>
            <input
              type="date"
              value={fechaInicio}
              onChange={e => setFechaInicio(e.target.value)}
              className="admin-input"
            />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>
              Fin
            </label>
            <input
              type="date"
              value={fechaFin}
              onChange={e => setFechaFin(e.target.value)}
              className="admin-input"
            />
          </div>
        </div>
        <p className="text-xs mt-3" style={{ color: "var(--admin-text-muted)" }}>
          La promo se activa/desactiva automáticamente según estas fechas
        </p>
      </div>

      {/* Toggle activa */}
      <div className="admin-card mb-6">
        <label className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
          <div>
            <p className="font-bold text-sm">Activa</p>
            <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>
              Activá o desactivá la promo manualmente
            </p>
          </div>
          <div className="relative">
            <input type="checkbox" className="sr-only" checked={activa} onChange={() => setActiva(!activa)} />
            <div className={`block w-11 h-6 rounded-full transition-colors ${activa ? "bg-green-500" : "bg-gray-600"}`}></div>
            <div className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${activa ? "translate-x-5" : ""}`}></div>
          </div>
        </label>
      </div>

      {/* Selector de productos */}
      <div className="admin-card mb-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-bold text-base">📦 Productos en promo ({seleccionados.length})</h2>
          <button onClick={seleccionarTodos} className="admin-btn admin-btn-secondary text-xs">
            {productosFiltrados.every(p => seleccionados.includes(p.id)) ? "Deseleccionar" : "Seleccionar"} todos
          </button>
        </div>

        {/* Buscador */}
        <input
          type="text"
          value={busqueda}
          onChange={e => setBusqueda(e.target.value)}
          placeholder="Buscar producto..."
          className="admin-input mb-4"
        />

        {loadingProductos ? (
          <p style={{ color: "var(--admin-text-muted)" }}>Cargando productos...</p>
        ) : (
          <div className="max-h-80 overflow-y-auto space-y-1 rounded-lg p-2" style={{ background: "var(--admin-bg)" }}>
            {productosFiltrados.map(p => {
              const isSelected = seleccionados.includes(p.id);
              return (
                <label
                  key={p.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-all ${
                    isSelected ? "ring-1" : "hover:bg-white/5"
                  }`}
                  style={isSelected ? { background: "var(--admin-accent)", color: "#0D0D0D", borderColor: "var(--admin-accent)" } : {}}
                >
                  <input
                    type="checkbox"
                    checked={isSelected}
                    onChange={() => toggleProducto(p.id)}
                    className="sr-only"
                  />
                  <div className={`w-5 h-5 rounded border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? "border-primary bg-white" : "border-gray-500"
                  }`}>
                    {isSelected && <span className="text-xs font-bold text-primary">✓</span>}
                  </div>
                  {p.fotos?.[0] && (
                    <div className="w-10 h-10 rounded overflow-hidden bg-gray-800 shrink-0">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={p.fotos[0]} alt="" className="w-full h-full object-cover" />
                    </div>
                  )}
                  <div className="flex-1 min-w-0">
                    <p className="font-bold text-sm truncate">{p.nombre}</p>
                    <p className={`text-xs ${isSelected ? "opacity-70" : ""}`} style={!isSelected ? { color: "var(--admin-text-muted)" } : {}}>
                      {p.categoria}
                    </p>
                  </div>
                  <div className="text-right shrink-0">
                    {isSelected && desc > 0 ? (
                      <>
                        <p className="text-xs line-through opacity-60">${p.precio_minorista.toLocaleString("es-AR")}</p>
                        <p className="font-bold text-sm">
                          ${Math.round(p.precio_minorista * (1 - desc / 100)).toLocaleString("es-AR")}
                        </p>
                      </>
                    ) : (
                      <p className="font-bold text-sm">${p.precio_minorista.toLocaleString("es-AR")}</p>
                    )}
                  </div>
                </label>
              );
            })}
          </div>
        )}
      </div>

      {/* Errores */}
      {errores.length > 0 && (
        <div className="admin-alert admin-alert-danger mb-6">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold mb-1">Completá estos campos:</p>
            <ul className="list-disc list-inside text-sm">
              {errores.map(e => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Guardar */}
      <div className="admin-card mb-8">
        <h2 className="font-bold text-base mb-4">💾 Guardar promo</h2>
        <button
          onClick={handleGuardar}
          className="admin-btn admin-btn-primary w-full admin-btn-lg"
          disabled={guardando || guardado}
        >
          {guardado ? "✓ ¡Promo creada! Redirigiendo..." : guardando ? "Creando..." : "✓ Crear promoción"}
        </button>
      </div>

      {/* Toast */}
      {guardado && (
        <div className="admin-toast" style={{ color: "var(--admin-success)" }}>
          ✓ Promoción creada correctamente
        </div>
      )}
    </div>
  );
}
