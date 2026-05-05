import KanbanBoard from '@/components/admin/KanbanBoard';

export const metadata = {
  title: 'Gestor de Tareas | Admin',
};

export default function AdminTareasPage() {
  return (
    <div className="p-6 max-w-7xl mx-auto h-full flex flex-col">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-black tracking-tight" style={{ color: 'var(--admin-text)' }}>Gestor de Tareas</h1>
          <p className="mt-1" style={{ color: 'var(--admin-text-muted)' }}>Coordina el cumplimiento de pedidos, stock y atención al cliente.</p>
        </div>
      </div>
      
      <div className="flex-1 overflow-hidden">
        <KanbanBoard />
      </div>
    </div>
  );
}
