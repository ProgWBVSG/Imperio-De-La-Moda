"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

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

export default function NuevoProducto() {
  const router = useRouter();
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
  const [novedad, setNovedad] = useState(true);
  const [fotos, setFotos] = useState<string[]>([]);
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);
  const [errores, setErrores] = useState<string[]>([]);

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
    if (nuevoColor.trim() && !colores.includes(nuevoColor.trim()) && !COLORES_PREDEFINIDOS.find(c => c.nombre === nuevoColor.trim())) {
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
        if (ev.target?.result) {
          setFotos(prev => [...prev, ev.target!.result as string]);
        }
      };
      reader.readAsDataURL(file);
    });
  };

  const quitarFoto = (index: number) => {
    setFotos(prev => prev.filter((_, i) => i !== index));
  };

  const handleGuardar = async (publicar: boolean) => {
    const errs: string[] = [];
    if (!nombre.trim()) errs.push("Nombre del producto");
    if (!categoria) errs.push("Categoría");
    if (!precioMin) errs.push("Precio minorista");
    if (!precioMay) errs.push("Precio mayorista");
    if (errs.length > 0) {
      setErrores(errs);
      window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });
      return;
    }
    setErrores([]);

    setGuardando(true);
    try {
      const res = await fetch("/api/admin/productos", {
        method: "POST",
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
          oculto: !publicar && !activo,
          destacado,
          novedad,
        }),
      });
      if (!res.ok) {
        const errData = await res.json().catch(() => null);
        throw new Error(errData?.error || "Error al guardar el producto. Intentá de nuevo.");
      }
      setGuardando(false);
      setGuardado(true);
      setTimeout(() => router.push("/admin/productos"), 1200);
    } catch (err: any) {
      setGuardando(false);
      setErrores([err.message || "Error al guardar el producto. Intentá de nuevo."]);
    }
  };

  const slug = nombre.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

  return (
    <div className="p-4 md:p-8 max-w-4xl mx-auto pb-32">
      {/* Header */}
      <div className="flex items-center gap-3 mb-8">
        <Link href="/admin/productos" className="admin-btn admin-btn-ghost">← Volver</Link>
        <div>
          <h1 className="text-2xl font-bold">Nuevo producto</h1>
          <p className="text-sm" style={{ color: "var(--admin-text-muted)" }}>Completá los datos de la prenda</p>
        </div>
      </div>

      {/* CAMPO 1 — Fotos */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">📸 Fotos del producto</h2>
        <div className="flex flex-wrap gap-3 mb-4">
          {fotos.map((foto, i) => (
            <div key={i} className="relative w-24 h-28 rounded-lg overflow-hidden group bg-gray-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={foto} alt={`Foto ${i + 1}`} className="w-full h-full object-cover" />
              {i === 0 && (
                <span className="absolute top-1 left-1 text-[9px] font-bold px-1.5 py-0.5 rounded" style={{ background: "var(--admin-accent)", color: "#0D0D0D" }}>
                  Principal
                </span>
              )}
              <button onClick={() => quitarFoto(i)} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                ✕
              </button>
            </div>
          ))}
          <label className="w-24 h-28 border-2 border-dashed rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-opacity-60 transition-colors" style={{ borderColor: "var(--admin-border)" }}>
            <span className="text-2xl mb-1">📷</span>
            <span className="text-[10px] font-bold" style={{ color: "var(--admin-text-muted)" }}>Agregar</span>
            <input type="file" accept="image/*" multiple capture="environment" onChange={handleFotoUpload} className="hidden" />
          </label>
        </div>
        <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>Máximo 8 fotos. La primera es la principal. Podés sacar foto directo desde el celular.</p>
      </div>

      {/* CAMPO 2 — Info básica */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">📝 Información básica</h2>
        <div className="space-y-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Nombre *</label>
            <input type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Ej: Campera inflable negra" className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Categoría *</label>
            <select value={categoria} onChange={(e) => setCategoria(e.target.value)} className="admin-input">
              <option value="">Seleccionar categoría...</option>
              {CATEGORIAS.map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Descripción</label>
            <textarea value={descripcion} onChange={(e) => setDescripcion(e.target.value)} placeholder="Material, características..." className="admin-input min-h-[100px] resize-y" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Código interno</label>
            <input type="text" value={codigoInterno} onChange={(e) => setCodigoInterno(e.target.value)} placeholder="Opcional" className="admin-input" />
          </div>
        </div>
      </div>

      {/* CAMPO 3 — Precios */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">💰 Precios</h2>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Minorista (ARS) *</label>
            <input type="number" value={precioMin} onChange={(e) => setPrecioMin(e.target.value)} placeholder="12000" className="admin-input text-lg font-bold" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Mayorista (ARS) *</label>
            <input type="number" value={precioMay} onChange={(e) => setPrecioMay(e.target.value)} placeholder="9000" className="admin-input text-lg font-bold" />
          </div>
        </div>
      </div>

      {/* CAMPO 4 — Talles y stock */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">📏 Talles y stock</h2>
        <p className="text-xs mb-3" style={{ color: "var(--admin-text-muted)" }}>Tocá un talle para activarlo y asigná la cantidad en stock</p>
        <div className="flex flex-wrap gap-2 mb-3">
          {todosLosTalles.map(t => (
            <button
              key={t}
              onClick={() => toggleTalle(t)}
              className="w-12 h-10 rounded-lg text-sm font-bold transition-all"
              style={{
                background: tallesSeleccionados[t] !== undefined ? "var(--admin-accent)" : "var(--admin-bg)",
                border: `1px solid ${tallesSeleccionados[t] !== undefined ? "var(--admin-accent)" : "var(--admin-border)"}`,
                color: tallesSeleccionados[t] !== undefined ? "#0D0D0D" : "var(--admin-text-muted)",
              }}
            >
              {t}
            </button>
          ))}
        </div>
        {/* Agregar talle personalizado */}
        <div className="flex gap-2 mb-4">
          <input type="text" value={nuevoTalle} onChange={(e) => setNuevoTalle(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregarTallePersonalizado()} placeholder="Otro talle..." className="admin-input w-36" />
          <button onClick={agregarTallePersonalizado} className="admin-btn admin-btn-secondary text-xs">+ Talle</button>
        </div>
        {Object.keys(tallesSeleccionados).length > 0 && (
          <div className="space-y-2 mt-2 p-4 rounded-lg" style={{ background: "var(--admin-bg)" }}>
            {Object.entries(tallesSeleccionados).map(([talle, stock]) => (
              <div key={talle} className="flex items-center gap-3">
                <span className="w-10 font-bold text-sm">{talle}</span>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStockTalle(talle, parseInt(e.target.value) || 0)}
                  className="admin-input w-24 text-center"
                  min={0}
                />
                <span className="text-xs" style={{ color: "var(--admin-text-muted)" }}>unidades</span>
                {stock === 0 && <span className="admin-badge admin-badge-danger">Agotado</span>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* CAMPO 5 — Colores (seleccionables) */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">🎨 Colores</h2>
        <p className="text-xs mb-3" style={{ color: "var(--admin-text-muted)" }}>Seleccioná los colores disponibles del producto</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {COLORES_PREDEFINIDOS.map(c => (
            <button
              key={c.nombre}
              onClick={() => toggleColor(c.nombre)}
              className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-all"
              style={{
                background: colores.includes(c.nombre) ? "var(--admin-accent)" : "var(--admin-bg)",
                border: `1px solid ${colores.includes(c.nombre) ? "var(--admin-accent)" : "var(--admin-border)"}`,
                color: colores.includes(c.nombre) ? "#0D0D0D" : "var(--admin-text-muted)",
              }}
            >
              <span className="w-4 h-4 rounded-full border border-gray-400" style={{ background: c.hex }} />
              {c.nombre}
            </button>
          ))}
        </div>
        {/* Agregar color personalizado */}
        <div className="flex gap-2">
          <input type="text" value={nuevoColor} onChange={(e) => setNuevoColor(e.target.value)} onKeyDown={(e) => e.key === "Enter" && agregarColorPersonalizado()} placeholder="Otro color..." className="admin-input w-48" />
          <button onClick={agregarColorPersonalizado} className="admin-btn admin-btn-secondary text-xs">+ Color</button>
        </div>
        {/* Colores personalizados seleccionados */}
        {colores.filter(c => !COLORES_PREDEFINIDOS.find(p => p.nombre === c)).length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {colores.filter(c => !COLORES_PREDEFINIDOS.find(p => p.nombre === c)).map(c => (
              <span key={c} className="admin-badge admin-badge-info flex items-center gap-1.5">
                {c}
                <button onClick={() => toggleColor(c)} className="text-xs hover:text-white">✕</button>
              </span>
            ))}
          </div>
        )}
      </div>

      {/* CAMPO 6 — Visibilidad */}
      <div className="admin-card mb-6">
        <h2 className="font-bold text-base mb-4">👁️ Visibilidad</h2>
        <div className="space-y-4">
          {[
            { label: "Activo", desc: "Visible en la web", value: activo, set: setActivo },
            { label: "Destacado", desc: "Aparece en el home", value: destacado, set: setDestacado },
            { label: "Novedad", desc: "Badge 'Nuevo' en el catálogo", value: novedad, set: setNovedad },
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

      {/* CAMPO 7 — SEO */}
      <details className="admin-card mb-6">
        <summary className="font-bold text-base cursor-pointer" style={{ color: "var(--admin-text-muted)" }}>
          🔍 SEO (opcional)
        </summary>
        <div className="space-y-4 mt-4">
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Meta título</label>
            <input type="text" defaultValue={nombre} placeholder="Se pre-rellena con el nombre" className="admin-input" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Meta descripción</label>
            <textarea defaultValue={descripcion?.substring(0, 160)} placeholder="Se pre-rellena con la descripción" className="admin-input min-h-[60px]" />
          </div>
          <div>
            <label className="block text-xs font-bold mb-1.5 uppercase" style={{ color: "var(--admin-text-muted)" }}>Slug URL</label>
            <input type="text" value={slug} readOnly className="admin-input opacity-60" />
          </div>
        </div>
      </details>

      {/* Errores de validación */}
      {errores.length > 0 && (
        <div className="admin-alert admin-alert-danger mb-6">
          <span className="text-xl">⚠️</span>
          <div>
            <p className="font-bold mb-1">Completá estos campos para poder guardar:</p>
            <ul className="list-disc list-inside text-sm">
              {errores.map(e => <li key={e}>{e}</li>)}
            </ul>
          </div>
        </div>
      )}

      {/* Botones de guardado (inline, siempre visibles) */}
      <div className="admin-card mb-8">
        <h2 className="font-bold text-base mb-4">💾 Guardar producto</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={() => handleGuardar(false)} className="admin-btn admin-btn-secondary flex-1 admin-btn-lg" disabled={guardando || guardado}>
            {guardando ? "Guardando..." : "Guardar borrador"}
          </button>
          <button onClick={() => handleGuardar(true)} className="admin-btn admin-btn-primary flex-1 admin-btn-lg" disabled={guardando || guardado}>
            {guardado ? "✓ ¡Guardado! Redirigiendo..." : guardando ? "Publicando..." : "✓ Guardar y publicar"}
          </button>
        </div>
        <p className="text-xs mt-3 text-center" style={{ color: "var(--admin-text-muted)" }}>
          'Guardar borrador' guarda sin publicar · 'Guardar y publicar' lo hace visible en la tienda
        </p>
      </div>

      {/* Toast de éxito */}
      {guardado && (
        <div className="admin-toast" style={{ color: "var(--admin-success)" }}>
          ✓ Producto guardado correctamente
        </div>
      )}
    </div>
  );
}

