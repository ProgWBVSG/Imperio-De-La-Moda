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
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Testimonios y Reseñas</h1>
        <Link href="/admin/testimonios/nuevo" className="admin-btn admin-btn-primary admin-btn-lg">
          + Agregar Nuevo
        </Link>
      </div>

      {loading ? (
        <div className="text-center py-12" style={{ color: "var(--admin-text-muted)" }}>
          Cargando testimonios...
        </div>
      ) : testimonios.length === 0 ? (
        <div className="admin-card text-center py-12">
          <p className="text-4xl mb-3">💬</p>
          <p className="font-bold text-lg mb-1">Aún no hay testimonios registrados</p>
          <p className="text-sm mb-4" style={{ color: "var(--admin-text-muted)" }}>Agregá tu primera reseña para que aparezca en la página principal.</p>
        </div>
      ) : (
        <div className="admin-card overflow-x-auto">
          <table className="admin-table">
            <thead>
              <tr>
                <th>Autor</th>
                <th>Reseña</th>
                <th>Origen</th>
                <th>Visibilidad</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {testimonios.map((t) => (
                <tr key={t.id}>
                  <td className="font-bold">{t.autor}</td>
                  <td className="text-sm max-w-xs truncate" title={t.texto} style={{ color: "var(--admin-text-muted)" }}>{t.texto}</td>
                  <td>
                    <span className="admin-badge admin-badge-secondary">
                      {t.origen}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => toggleVisibility(t.id, t.visible)}
                      className={`admin-badge cursor-pointer ${!t.visible ? 'admin-badge-muted' : 'admin-badge-success'}`}
                    >
                      {t.visible ? "VISIBLE" : "OCULTO"}
                    </button>
                  </td>
                  <td>
                    <button onClick={() => deleteTestimonio(t.id)} className="admin-btn admin-btn-danger text-xs">
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
  );
}
