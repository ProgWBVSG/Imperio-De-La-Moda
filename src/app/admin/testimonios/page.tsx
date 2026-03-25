"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface Testimonio {
  id: string;
  autor: string;
  texto: string;
  origen: string;
  visible: boolean;
  creado_en: string;
}

export default function TestimoniosAdmin() {
  const [testimonios, setTestimonios] = useState<Testimonio[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchTestimonios();
  }, []);

  const fetchTestimonios = async () => {
    try {
      const res = await fetch("/api/admin/testimonios");
      if (res.ok) {
        setTestimonios(await res.json());
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const toggleVisibility = async (id: string, current: boolean) => {
    try {
      setTestimonios(prev => prev.map(t => t.id === id ? { ...t, visible: !current } : t));
      await fetch(`/api/admin/testimonios/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ visible: !current })
      });
      router.refresh();
    } catch (e) {
      fetchTestimonios();
    }
  };

  const deleteTestimonio = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta reseña? Esta acción no se puede deshacer.")) return;
    try {
      setTestimonios(prev => prev.filter(t => t.id !== id));
      await fetch(`/api/admin/testimonios/${id}`, { method: "DELETE" });
      router.refresh();
    } catch (e) {
      fetchTestimonios();
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Testimonios y Reseñas</h1>
        <Link href="/admin/testimonios/nuevo" className="bg-black text-white px-4 py-2 rounded-lg font-medium hover:bg-gray-800 transition">
          + Agregar Nuevo
        </Link>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-gray-500">Cargando testimonios...</div>
        ) : testimonios.length === 0 ? (
          <div className="p-8 text-center">
            <h3 className="text-gray-500 mb-2">Aún no hay testimonios registrados</h3>
            <p className="text-sm text-gray-400">Agregá tu primera reseña para que aparezca en la página principal.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-gray-50 border-b border-gray-100 text-sm font-medium text-gray-500">
                  <th className="p-4">Autor</th>
                  <th className="p-4">Reseña</th>
                  <th className="p-4">Origen</th>
                  <th className="p-4">Visible Pág. Principal</th>
                  <th className="p-4 text-right">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {testimonios.map((t) => (
                  <tr key={t.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="p-4 font-medium text-gray-900 whitespace-nowrap">{t.autor}</td>
                    <td className="p-4 text-gray-600 text-sm max-w-xs truncate" title={t.texto}>{t.texto}</td>
                    <td className="p-4">
                      <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-medium">
                        {t.origen}
                      </span>
                    </td>
                    <td className="p-4">
                      <button 
                        onClick={() => toggleVisibility(t.id, t.visible)}
                        className={`w-12 h-6 rounded-full relative transition-colors ${t.visible ? 'bg-green-500' : 'bg-gray-300'}`}
                      >
                        <div className={`w-4 h-4 rounded-full bg-white absolute top-1 transition-transform ${t.visible ? 'left-7' : 'left-1'}`} />
                      </button>
                    </td>
                    <td className="p-4 text-right space-x-2 whitespace-nowrap">
                      <button onClick={() => deleteTestimonio(t.id)} className="text-red-500 hover:text-red-700 font-medium text-sm">
                        Eliminar
                      </button>
                    </td>
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
