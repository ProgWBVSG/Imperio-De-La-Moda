"use client";

import { useMemo } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

export default function TasksChart({ tasks }: { tasks: any[] }) {
  // Procesamos los datos para obtener completadas por día en el último mes
  const data = useMemo(() => {
    const last30Days = [...Array(30)].map((_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (29 - i));
      return {
        date: d.toISOString().split('T')[0],
        dayStr: d.toLocaleDateString('es-AR', { day: 'numeric', month: 'short' }),
        completadas: 0
      };
    });

    tasks.forEach(t => {
      if (t.status === 'DONE') {
        const dateStr = new Date(t.actualizado_en || t.creado_en).toISOString().split('T')[0];
        const dayItem = last30Days.find(d => d.date === dateStr);
        if (dayItem) {
          dayItem.completadas += 1;
        }
      }
    });

    return last30Days;
  }, [tasks]);

  return (
    <div className="admin-card mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-lg" style={{ color: 'var(--admin-text)' }}>Rendimiento Mensual</h3>
        <div className="text-sm px-3 py-1 rounded-full" style={{ background: 'var(--admin-surface-hover)', color: 'var(--admin-text-muted)' }}>
          Últimos 30 días
        </div>
      </div>
      <div className="h-64 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--admin-border)" opacity={0.5} />
            <XAxis 
              dataKey="dayStr" 
              tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} 
              axisLine={false} 
              tickLine={false} 
              tickMargin={10} 
              minTickGap={20}
            />
            <YAxis 
              tick={{ fontSize: 12, fill: 'var(--admin-text-muted)' }} 
              axisLine={false} 
              tickLine={false} 
              allowDecimals={false}
            />
            <Tooltip 
              cursor={{ fill: 'var(--admin-surface-hover)' }}
              contentStyle={{ 
                backgroundColor: 'var(--admin-surface)', 
                borderColor: 'var(--admin-border)',
                borderRadius: '8px',
                color: 'var(--admin-text)',
                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
              }}
              labelStyle={{ color: 'var(--admin-text-muted)', marginBottom: '4px' }}
            />
            <Bar 
              dataKey="completadas" 
              name="Tareas Completadas" 
              fill="var(--admin-accent)" 
              radius={[4, 4, 0, 0]} 
              maxBarSize={40}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
