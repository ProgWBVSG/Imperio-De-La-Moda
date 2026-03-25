"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function NuevoTestimonio() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    autor: "",
    texto: "",
    origen: "WhatsApp",
    visible: true
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const res = await fetch("/api/admin/testimonios", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData)
      });
      
      if (res.ok) {
        router.push("/admin/testimonios");
        router.refresh();
      } else {
        alert("Error al guardar el testimonio");
      }
    } catch (e) {
      alert("Error de red");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <Link href="/admin/testimonios" className="text-gray-400 hover:text-gray-900 transition flex items-center justify-center p-2 rounded-full hover:bg-gray-100">
          <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
        </Link>
        <h1 className="text-2xl font-bold text-gray-900">Agregar Testimonio</h1>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-border p-6 md:p-8">
        <form onSubmit={handleSubmit} className="space-y-6">
          
          <div>
            <label className="block text-sm font-bold text-primary mb-2">Nombre del Cliente / Autor *</label>
            <input 
              type="text" 
              required
              placeholder="Ej. María S."
              value={formData.autor}
              onChange={e => setFormData({...formData, autor: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Plataforma de Origen</label>
            <select 
              value={formData.origen}
              onChange={e => setFormData({...formData, origen: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent bg-white"
            >
              <option value="WhatsApp">WhatsApp</option>
              <option value="Instagram">Instagram</option>
              <option value="Google Maps">Google Maps</option>
              <option value="TikTok">TikTok</option>
              <option value="Facebook">Facebook</option>
              <option value="Local">Local Comercial</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-bold text-primary mb-2">Mensaje / Reseña *</label>
            <textarea 
              required
              rows={4}
              placeholder="Ej. Excelente calidad, compré por mayor y me llegó todo impecable."
              value={formData.texto}
              onChange={e => setFormData({...formData, texto: e.target.value})}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-accent focus:border-transparent transition-all resize-y"
            ></textarea>
            <p className="text-xs text-gray-500 mt-2">Mantené la reseña corta (hasta 3-4 líneas) para que se vea mejor en el carrusel de inicio.</p>
          </div>

          <div className="flex items-center gap-3 pt-2">
            <input 
              type="checkbox" 
              id="visible"
              checked={formData.visible}
              onChange={e => setFormData({...formData, visible: e.target.checked})}
              className="w-5 h-5 text-accent rounded focus:ring-accent"
            />
            <label htmlFor="visible" className="text-sm font-medium text-primary cursor-pointer">
              Mostrar en la página principal inmediatamente
            </label>
          </div>

          <div className="pt-6 border-t border-gray-100 flex justify-end gap-3">
            <Link 
              href="/admin/testimonios"
              className="px-6 py-3 font-medium text-gray-600 hover:text-gray-900 transition"
            >
              Cancelar
            </Link>
            <button 
              type="submit" 
              disabled={loading}
              className="bg-black text-white px-8 py-3 rounded-lg font-bold hover:bg-gray-800 transition disabled:opacity-50"
            >
              {loading ? "Guardando..." : "Guardar Testimonio"}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
