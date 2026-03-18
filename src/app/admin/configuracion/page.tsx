"use client";

import { useState } from "react";

export default function ConfiguracionPage() {
  const [config, setConfig] = useState({
    numeroWhatsApp: "+5493515555123",
    horarios: "Lun-Vie 9 a 18hs / Sáb 9 a 13hs",
    direccion: "San Martín 390, X5000 Córdoba",
    instagram: "@imperiolamoda",
    tiktok: "@imperiolamoda",
    mensajeWAHeader: "Hola Imperio de la Moda! Quiero consultar por:",
    enviosActivos: false,
    modoMantenimiento: false,
  });
  const [guardando, setGuardando] = useState(false);
  const [guardado, setGuardado] = useState(false);

  const update = (key: string, value: string | boolean) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const guardar = () => {
    setGuardando(true);
    setTimeout(() => {
      setGuardando(false);
      setGuardado(true);
      setTimeout(() => setGuardado(false), 3000);
    }, 800);
  };

  return (
    <div className="p-4 md:p-8 max-w-3xl mx-auto">
      <h1 className="text-2xl font-bold mb-2">⚙️ Configuración</h1>
      <p className="text-sm mb-8" style={{ color: "var(--admin-text-muted)" }}>Datos del negocio. Los cambios se reflejan de inmediato en la web.</p>

      {/* Datos de contacto */}
      <div className="admin-card mb-6 space-y-4">
        <h2 className="font-bold text-base">📱 Contacto</h2>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Número WhatsApp</label>
          <input type="text" value={config.numeroWhatsApp} onChange={(e) => update("numeroWhatsApp", e.target.value)} className="admin-input" placeholder="+549XXXXXXXXXX" />
          <p className="text-xs mt-1" style={{ color: "var(--admin-text-muted)" }}>Formato: +549 + código de área + número sin 15</p>
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Instagram</label>
          <input type="text" value={config.instagram} onChange={(e) => update("instagram", e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>TikTok</label>
          <input type="text" value={config.tiktok} onChange={(e) => update("tiktok", e.target.value)} className="admin-input" />
        </div>
      </div>

      {/* Datos del local */}
      <div className="admin-card mb-6 space-y-4">
        <h2 className="font-bold text-base">🏪 Local</h2>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Dirección</label>
          <input type="text" value={config.direccion} onChange={(e) => update("direccion", e.target.value)} className="admin-input" />
        </div>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Horarios</label>
          <input type="text" value={config.horarios} onChange={(e) => update("horarios", e.target.value)} className="admin-input" />
        </div>
      </div>

      {/* WhatsApp */}
      <div className="admin-card mb-6 space-y-4">
        <h2 className="font-bold text-base">💬 Mensaje de WhatsApp</h2>
        <div>
          <label className="block text-xs font-bold uppercase mb-1" style={{ color: "var(--admin-text-muted)" }}>Encabezado del mensaje del carrito</label>
          <textarea value={config.mensajeWAHeader} onChange={(e) => update("mensajeWAHeader", e.target.value)} className="admin-input min-h-[60px]" />
        </div>
      </div>

      {/* Toggles */}
      <div className="admin-card mb-8 space-y-1">
        <h2 className="font-bold text-base mb-3">🔧 Opciones del sitio</h2>
        {[
          { key: "enviosActivos", label: "Envíos activos", desc: "Muestra la sección de envíos en la web", value: config.enviosActivos },
          { key: "modoMantenimiento", label: "Modo mantenimiento", desc: "Oculta la web y muestra 'Volvemos pronto'", value: config.modoMantenimiento },
        ].map(t => (
          <label key={t.key} className="flex items-center justify-between cursor-pointer p-3 rounded-lg hover:bg-white/5 transition-colors">
            <div>
              <p className="font-bold text-sm">{t.label}</p>
              <p className="text-xs" style={{ color: "var(--admin-text-muted)" }}>{t.desc}</p>
            </div>
            <div className="relative">
              <input type="checkbox" className="sr-only" checked={t.value} onChange={() => update(t.key, !t.value)} />
              <div className={`block w-11 h-6 rounded-full transition-colors ${t.value ? t.key === "modoMantenimiento" ? "bg-red-500" : "bg-green-500" : "bg-gray-600"}`}></div>
              <div className={`dot absolute left-0.5 top-0.5 bg-white w-5 h-5 rounded-full transition-transform ${t.value ? "translate-x-5" : ""}`}></div>
            </div>
          </label>
        ))}
      </div>

      {/* Botón guardar */}
      <button onClick={guardar} className="admin-btn admin-btn-primary admin-btn-lg w-full" disabled={guardando}>
        {guardado ? "✓ Configuración guardada" : guardando ? "Guardando..." : "Guardar configuración"}
      </button>
    </div>
  );
}
