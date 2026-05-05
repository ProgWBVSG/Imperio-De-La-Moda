"use client";

import { useState, useEffect } from "react";
import { Download, Users } from "lucide-react";

function formatFecha(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "long", year: "numeric" });
}

function formatFechaCSV(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("es-AR", { day: "2-digit", month: "2-digit", year: "numeric", hour: "2-digit", minute: "2-digit" });
}

function formatHoy() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")}`;
}

interface Lead {
  id: string;
  nombre: string;
  email: string;
  creado_en: string;
}

export default function CRMClientes() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      const res = await fetch("/api/leads");
      if (res.ok) {
        const data = await res.json();
        setLeads(data);
      }
    } catch (error) {
      console.error("Error fetching leads", error);
    } finally {
      setLoading(false);
    }
  };

  const exportToCSV = () => {
    if (leads.length === 0) return;
    
    const headers = "Nombre,Email,Fecha de Registro\n";
    const csvContent = leads.map(l => 
      `"${l.nombre}","${l.email}","${formatFechaCSV(l.creado_en)}"`
    ).join("\n");
    
    const blob = new Blob([headers + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `imperio_leads_${formatHoy()}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="p-4 md:p-8 animate-pulse">
        <div className="h-8 bg-gray-200 rounded w-1/4 mb-8"></div>
        <div className="h-64 bg-gray-200 rounded"></div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-8 max-w-6xl mx-auto animate-fade-in">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Users className="text-accent" /> CRM Clientes
          </h1>
          <p className="text-sm mt-1" style={{ color: "var(--admin-text-muted)" }}>
            Listado de personas que se registraron a través del Pop-up de inicio.
          </p>
        </div>
        
        <button 
          onClick={exportToCSV}
          disabled={leads.length === 0}
          className="admin-btn admin-btn-outline flex items-center gap-2 disabled:opacity-50"
        >
          <Download size={18} />
          Exportar CSV ({leads.length})
        </button>
      </div>

      <div className="admin-card overflow-hidden p-0">
        <div className="overflow-x-auto">
          <table className="admin-table w-full text-sm text-left">
            <thead className="text-xs uppercase" style={{ backgroundColor: "var(--admin-bg)", color: "var(--admin-text-muted)" }}>
              <tr>
                <th className="px-6 py-4 rounded-tl-xl font-bold">Nombre</th>
                <th className="px-6 py-4 font-bold">Email</th>
                <th className="px-6 py-4 rounded-tr-xl font-bold text-right">Fecha de registro</th>
              </tr>
            </thead>
            <tbody>
              {leads.length === 0 ? (
                <tr>
                  <td colSpan={3} className="px-6 py-12 text-center text-gray-500">
                    Todavía no hay clientes registrados.
                  </td>
                </tr>
              ) : (
                leads.map((lead) => (
                  <tr key={lead.id} className="border-b last:border-0 hover:bg-black/5 dark:hover:bg-white/5 transition-colors" style={{ borderColor: "var(--admin-border)" }}>
                    <td className="px-6 py-4 font-medium whitespace-nowrap">
                      {lead.nombre}
                    </td>
                    <td className="px-6 py-4">
                      {lead.email}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap" style={{ color: "var(--admin-text-muted)" }}>
                      {formatFecha(lead.creado_en)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
