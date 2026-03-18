"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useParams } from "next/navigation";

const TALLES_DISPONIBLES = ["XS", "S", "M", "L", "XL", "XXL", "36", "38", "40", "42", "44", "46"];
const CATEGORIAS = ["Mujer", "Hombre", "Niños", "Accesorios"];
const COLORES_PREDEFINIDOS = [
  { nombre: "Negro", hex: "#000000" },
  { nombre: "Blanco", hex: "#FFFFFF" },
  { nombre: "Beige", hex: "#D4C5A9" },
  { nombre: "Gris", hex: "#808080" },
  { nombre: "Azul", hex: "#1E3A5F" },
  { nombre: "Rojo", hex: "#CC0000" },
  { nombre: "Rosa", hex: "#E91E8C" },
  { nombre: "Verde", hex: "#2D6A4F" },
  { nombre: "Marrón", hex: "#6B3A2A" },
  { nombre: "Celeste", hex: "#87CEEB" },
  { nombre: "Bordo", hex: "#800020" },
  { nombre: "Naranja", hex: "#E67E22" },
  { nombre: "Amarillo", hex: "#F1C40F" },
  { nombre: "Violeta", hex: "#7D3C98" },
];

export default function EditarProducto() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [nombre, setNombre] = useState("");
  const [categoria, setCategoria] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [codigoInterno, setCodigoInterno] = useState("");
  const [precioMin, setPrecioMin] = useState("");
  const [precioMay, setPrecioMay] = useState("");
  const [colores, setColores] = useState<string[]>([]);
  const [nuevoColor, setNuevoColor] = useState("");
  const [nuevoTalle, setNuevoTalle] = useState("");
  const [tallesExtra, setTallesExtra] = useState<string[]>([]);
  const [tallesSeleccionados, setTallesSeleccionados] = useState<Record<string, number>>({});
  const [activo, setActivo] = useState(true);
  const [destacado, setDestacado] = useState(false);
  const [novedad, setNovedad] = useState(false);
  const [fotos, setFotos] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  // Cargar producto desde la API
  useEffect(() => {
    fetch(`/api/admin/productos/${id}`)
      .then(res => {
        if (!res.ok) throw new Error("404");
        return res.json();
      })
      .then(p => {
        setNombre(p.nombre);
        setCategoria(p.categoria);
        setDescripcion(p.descripcion || "");
        setCodigoInterno(p.codigo_interno || "");
        setPrecioMin(String(p.precio_minorista));
        setPrecioMay(String(p.precio_mayorista));
        setColores(p.colores || []);
        setTallesSeleccionados(p.stock_por_talle || {});
        setActivo(!p.oculto);
        setDestacado(p.destacado);
        setNovedad(p.novedad);
        setFotos(p.fotos || []);
        setLoading(false);
      })
      .catch(() => { setNotFound(true); setLoading(false); });
  }, [id]);

  if (loading) {
    return (
      <div className="p-8 text-center" style={{ color: "var(--admin-text-muted)" }}>
        Cargando producto...
      </div>
    );
  }

  if (notFound) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold mb-4">Producto no encontrado</h1>
        <Link href="/admin/productos" className="admin-btn admin-btn-primary">← Volver a productos</Link>
      </div>
    );
  }

  const todosLosTalles = [...TALLES_DISPONIBLES, ...tallesExtra];

  const toggleTalle = (talle: string) => {
    setTallesSeleccionados(prev => {
      if (prev[talle] !== undefined) {
        const next = { ...prev };
        delete next[talle];
        return next;
      }
      return { ...prev, [talle]: 10 };
    });
  };

  const setStockTalle = (talle: string, stock: number) => {
    setTallesSeleccionados(prev => ({ ...prev, [talle]: Math.max(0, stock) }));
  };

  const agregarTallePersonalizado = () => {
    const t = nuevoTalle.trim().toUpperCase();
    if (t && !todosLosTalles.includes(t)) {
      setTallesExtra(prev => [...prev, t]);
      setTallesSeleccionados(prev => ({ ...prev, [t]: 10 }));
      setNuevoTalle("");
    }
  };

  const toggleColor = (c: string) => {
    setColores(prev => prev.includes(c) ? prev.filter(x => x !== c) : [...prev, c]);
  };

  const agregarColorPersonalizado = () => {
    if (nuevoColor.trim() && !colores.includes(nuevoColor.trim())) {
      setColores([...colores, nuevoColor.trim()]);
      setNuevoColor("");
    }
  };

  const handleFotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    Array.from(files).forEach(file => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        if (ev.target?.result) setFotos(prev => [...prev, ev.target!.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleGuardar = async () => {
    if (!nombre.trim() || !precioMin || !precioMay || !categoria) return;
    setGuardando(true);
    try {
      const res = await fetch(`/api/admin/productos/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nombre: nombre.trim(),
          categoria,
          precio_mayorista: precioMay,
          precio_minorista: precioMin,
          descripcion,
          codigo_interno: codigoInterno,
          talles: Object.keys(tallesSeleccionados),
          colores,
          stock_por_talle: tallesSeleccionados,
          fotos,
          oculto: !activo,
          destacado,
          novedad,
        }),
      });
      if (!res.ok) throw new Error();
      setGuardando(false);
      setGuardado(true);
      setTimeout(() => router.push("/admin/productos"), 1200);
    } catch {
      setGuardando(false);
    }
  };

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-12">
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/productos" className="admin-btn admin-btn-ghost">← Volver</Link>
        <div>
          <h1 className="text-2xl font-bold">Editar producto</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>{nombre}</p>
        </div>
      </div>

      {/* Fotos */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">📸 Fotos</h2>
        <div className="flex flex-wrap gap-3">
          {fotos.map((foto, i) => (
            <div key={i} className="relative w-24 h-28 rounded-lg overflow-hidden group bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt="" className="w-full h-full object-cover" />
              {i === 0 && <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--admin-accent)", color: "#0D0D0D" }}>Principal</span>}
              <button onClick={() => setFotos(prev => prev.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">✕</button>
            </div>
          ))}
          <label className="w-24 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer" style={{ borderColor: "var(--admin-border)" }}>
            <span className="text-2xl mb-1">📷</span>
            <span className="text-[10px] font-bold" style={{ color: "var(--admin-text-muted)" }}>Agregar</span>
            <input type="file" accept="image/*" multiple onChange={handleFotoUpload} className="hidden" />
          </label>
        </div>
      </div>

      {/* Info */}
      <div className="admin-card mb-6 space-y-4">
        <h2 className="font-bold text-base">📝 Información</h2>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Nombre *</label>
          <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Categoría *</label>
          <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="admin-input">
            {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Descripción</label>
          <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} className="admin-input min-h-[80px] resize-y" />
        </div>
        <div>
          <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Código interno</label>
          <input type="text" value={codigoInterno} onChange={(e) => setCodigoInterno(e.target.value)} className="admin-input" placeholder="Opcional" />
        </div>
      </div>

      {/* Precios */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">💰 Precios</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Minorista *</label>
            <input type="number" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} className="admin-input text-lg font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Mayorista *</label>
            <input type="number" value={precioMay} onChange={(e) => setPrecioMay(e.target.value)} className="admin-input text-lg font-bold" />
          </div>
        </div>
      </div>

      {/* Talles */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">📏 Talles y stock</h2>
        <div className="flex flex-wrap gap-2 mb-3">
          {todosLosTalles.map(t => (
            <button key={t} onClick={() => toggleTalle(t)} className="w-12 h-10 rounded-lg text-sm font-bold transition-all" style={{ background: tallesSeleccionados[t] !== undefined ? "var(--admin-accent)" : "var(--admin-bg)", border: `1px solid ${tallesSeleccionados[t] !== undefined ? "var(--admin-accent)" : "var(--admin-border)"}`, color: tallesSeleccionados[t] !== undefined ? "#0D0D0D" : "var(--admin-text-muted)" }}>
              {t}
            </button>
          ))}
        </div>
        <div className="flex gap-2 mb-4">
          <input type="text" value={nuevoTalle} onChange={(e) => setNuevoTalle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregarTallePersonalizado()} placeholder="Otro talle..." className="admin-input w-36" />
          <button onClick={agregarTallePersonalizado} className="admin-btn admin-btn-secondary text-xs">+ Talle</button>
        </div>
        {Object.keys(tallesSeleccionados).length > 0 && (
          <div className="space-y-2 p-4 rounded-lg" style={{ background: "var(--admin-bg)" }}>
            {Object.entries(tallesSeleccionados).map(([talle, stock]) => (
              <div key={talle} className="flex items-center gap-3">
                <span className="w-10 font-bold text-sm">{talle}</span>
                <input type="number" value={stock} onChange={(e) => setStockTalle(talle, parseInt(e.target.value) || 0)} className="admin-input w-24 text-center" min={0} />
                <span className="text-xs" style={{ color: "var(--admin-text-muted)" }}>unidades</span>
                {stock === 0 && <span className="admin-badge admin-badge-danger">Agotado</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Colores */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">🎨 Colores</h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {COLORES_PREDEFINIDOS.map(c => (
            <button key={c.nombre} onClick={() => toggleColor(c.nombre)} className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all" style={{ background: colores.includes(c.nombre) ? "var(--admin-accent)" : "var(--admin-bg)", border: `1px solid ${colores.includes(c.nombre) ? "var(--admin-accent)" : "var(--admin-border)"}`, color: colores.includes(c.nombre) ? "#0D0D0D" : "var(--admin-text-muted)" }}>
              <span className="w-4 h-4 rounded-full border border-gray-400" style={{ background: c.hex }} />
              {c.nombre}
            </button>
          ))}
        </div>
        <div className="flex gap-2">
          <input type="text" value={nuevoColor} onChange={(e) => setNuevoColor(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregarColorPersonalizado()} placeholder="Otro color..." className="admin-input w-48" />
          <button onClick={agregarColorPersonalizado} className="admin-btn admin-btn-secondary text-xs">+ Color</button>
        </div>
      </div>

      {/* Visibilidad */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">👁️ Visibilidad</h2>
        <div className="space-y-4">
          {[
            { label: "Activo", desc: "Visible en la web", value: activo, set: setActivo },
            { label: "Destacado", desc: "Aparece en el home", value: destacado, set: setDestacado },
            { label: "Novedad", desc: "Badge 'Nuevo' en catálogo", value: novedad, set: setNovedad },
          ].map(toggle => (
            <label key={toggle.label} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
              <div>
                <p className="font-bold text-sm">{toggle.label}</p>
                <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>{toggle.desc}</p>
              </div>
              <div className="relative">
                <input type="checkbox" className="sr-only" checked={toggle.value} onChange={() => toggle.set(!toggle.value)} />
                <div className={`block w-11 h-6 rounded-full transition-colors ${toggle.value ? "bg-green-500" : "bg-gray-600"}`}></div>
                <div className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${toggle.value ? "translate-x-5" : ""}`}></div>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Guardar */}
      <div className="admin-card mb-8">
        <h2 className="font-bold text-base mb-4">💾 Guardar cambios</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link href="/admin/productos" className="admin-btn admin-btn-secondary flex-1 admin-btn-lg text-center">Cancelar</Link>
          <button onClick={handleGuardar} className="admin-btn admin-btn-primary flex-1 admin-btn-lg" disabled={guardando || guardado}>
            {guardado ? "✓ ¡Guardado! Redirigiendo..." : guardando ? "Guardando..." : "✓ Guardar cambios"}
          </button>
        </div>
      </div>

      {guardado && (
        <div className="admin-toast" style={{ color: "var(--admin-success)" }}>
          ✓ Producto actualizado correctamente
        </div>
      )}
    </div>
  );
}
