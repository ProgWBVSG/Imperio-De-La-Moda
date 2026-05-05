"use client";

import { useState, useEffect } from 'react';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Plus, CheckSquare, Clock, Trash2, X, FileText, Bell } from 'lucide-react';
import TasksChart from './TasksChart';

export interface TaskChecklistItem {
  id: string;
  text: string;
  completed: boolean;
}

export interface AdminTask {
  id: string;
  title: string;
  description: string;
  status: string;
  priority: string;
  tags: string;
  checklist: string;
  position: number;
  due_date: string | null;
  creado_en: string;
  actualizado_en: string;
}

const COLUMNS = [
  { id: 'TODO', title: 'Pendiente', color: 'rgba(255, 255, 255, 0.05)', dot: '#9CA3AF' },
  { id: 'IN_PROGRESS', title: 'En Proceso', color: 'rgba(59, 130, 246, 0.05)', dot: '#3B82F6' },
  { id: 'REVIEW', title: 'En Revisión', color: 'rgba(234, 179, 8, 0.05)', dot: '#EAB308' },
  { id: 'DONE', title: 'Completado', color: 'rgba(34, 197, 94, 0.05)', dot: '#22C55E' }
];

const PRIORITIES: Record<string, { label: string, badge: string }> = {
  LOW: { label: 'Baja', badge: 'admin-badge-muted' },
  NORMAL: { label: 'Normal', badge: 'admin-badge-info' },
  HIGH: { label: 'Alta', badge: 'admin-badge-warning' },
  URGENT: { label: 'Urgente', badge: 'admin-badge-danger' }
};

export default function KanbanBoard() {
  const [tasks, setTasks] = useState<AdminTask[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<AdminTask | null>(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await fetch('/api/admin/tasks');
      if (res.ok) {
        const data = await res.json();
        setTasks(data);
      }
    } catch (error) {
      console.error("Error fetching tasks:", error);
    } finally {
      setLoading(false);
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId && source.index === destination.index) return;

    const newTasks = Array.from(tasks);
    const draggedTaskIndex = newTasks.findIndex(t => t.id === draggableId);
    const draggedTask = newTasks[draggedTaskIndex];

    if (source.droppableId !== destination.droppableId) {
      draggedTask.status = destination.droppableId;
      draggedTask.actualizado_en = new Date().toISOString(); // Para el gráfico
    }

    newTasks.splice(draggedTaskIndex, 1);
    
    const tasksInDestination = newTasks.filter(t => t.status === destination.droppableId).sort((a, b) => a.position - b.position);
    let insertIndex = newTasks.length;
    
    if (tasksInDestination.length > 0) {
      if (destination.index === 0) {
        insertIndex = newTasks.findIndex(t => t.id === tasksInDestination[0].id);
      } else if (destination.index >= tasksInDestination.length) {
        insertIndex = newTasks.findIndex(t => t.id === tasksInDestination[tasksInDestination.length - 1].id) + 1;
      } else {
        insertIndex = newTasks.findIndex(t => t.id === tasksInDestination[destination.index].id);
      }
    }
    
    newTasks.splice(insertIndex, 0, draggedTask);
    const finalTasks = newTasks.map((t, idx) => ({ ...t, position: idx * 1024 }));
    setTasks(finalTasks);

    try {
      await fetch(`/api/admin/tasks/${draggableId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          status: destination.droppableId,
          position: finalTasks.find(t => t.id === draggableId)?.position
        })
      });
    } catch (error) {
      console.error("Error updating task position:", error);
    }
  };

  const handleCreateTask = async (statusId: string) => {
    const newTask = { title: "Nueva Tarea", status: statusId, priority: "NORMAL", tags: "[]", checklist: "[]" };
    try {
      const res = await fetch('/api/admin/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask)
      });
      if (res.ok) {
        const created = await res.json();
        setTasks([...tasks, created]);
        setEditingTask(created);
        setIsModalOpen(true);
      }
    } catch (error) {
      console.error("Error creating task:", error);
    }
  };

  const handleUpdateTask = async (id: string, updates: Partial<AdminTask>) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, ...updates, actualizado_en: new Date().toISOString() } as AdminTask : t));
    try {
      await fetch(`/api/admin/tasks/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
    } catch (error) {
      console.error("Error updating task:", error);
    }
  };

  const handleDeleteTask = async (id: string) => {
    if (!confirm("¿Seguro que querés eliminar esta tarea?")) return;
    setTasks(tasks.filter(t => t.id !== id));
    setIsModalOpen(false);
    try {
      await fetch(`/api/admin/tasks/${id}`, { method: 'DELETE' });
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const parseJsonSafe = (str: string, fallback: any) => {
    try { return JSON.parse(str); } catch { return fallback; }
  };

  const isOverdue = (dateStr: string | null) => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    due.setHours(23, 59, 59, 999);
    return due < new Date();
  };

  const isDueSoon = (dateStr: string | null) => {
    if (!dateStr) return false;
    const due = new Date(dateStr);
    const now = new Date();
    const diffTime = due.getTime() - now.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays >= 0 && diffDays <= 2;
  };

  if (loading) return <div className="p-8 text-center" style={{ color: 'var(--admin-text-muted)' }}>Cargando tablero...</div>;

  return (
    <div className="flex flex-col h-full">
      
      {/* GRÁFICO DE PRODUCTIVIDAD */}
      <TasksChart tasks={tasks} />

      {/* KANBAN BOARD */}
      <div className="flex-1 overflow-x-auto pb-4 custom-scrollbar">
        <DragDropContext onDragEnd={onDragEnd}>
          <div className="flex gap-6 h-full min-w-max items-start">
            {COLUMNS.map(col => (
              <div 
                key={col.id} 
                className="w-[320px] flex flex-col max-h-[70vh] rounded-xl border flex-shrink-0"
                style={{ 
                  backgroundColor: 'var(--admin-surface)', 
                  borderColor: 'var(--admin-border)'
                }}
              >
                {/* Header */}
                <div className="p-4 flex items-center justify-between border-b" style={{ borderColor: 'var(--admin-border)' }}>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: col.dot }} />
                    <h3 className="font-bold" style={{ color: 'var(--admin-text)' }}>{col.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full font-medium" style={{ background: 'var(--admin-bg)', color: 'var(--admin-text-muted)' }}>
                      {tasks.filter(t => t.status === col.id).length}
                    </span>
                  </div>
                  <button 
                    onClick={() => handleCreateTask(col.id)}
                    className="p-1 rounded transition-colors"
                    style={{ color: 'var(--admin-text-muted)' }}
                    onMouseOver={(e) => e.currentTarget.style.color = 'var(--admin-accent)'}
                    onMouseOut={(e) => e.currentTarget.style.color = 'var(--admin-text-muted)'}
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>

                {/* Zona Drop */}
                <Droppable droppableId={col.id}>
                  {(provided, snapshot) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="flex-1 p-3 overflow-y-auto flex flex-col gap-3 custom-scrollbar"
                      style={{ 
                        backgroundColor: snapshot.isDraggingOver ? 'rgba(0,0,0,0.2)' : col.color,
                        transition: 'background 0.2s'
                      }}
                    >
                      {tasks
                        .filter(t => t.status === col.id)
                        .sort((a, b) => a.position - b.position)
                        .map((task, index) => {
                          const tags = parseJsonSafe(task.tags, []);
                          const checklist = parseJsonSafe(task.checklist, []) as TaskChecklistItem[];
                          const completedChecklist = checklist.filter(c => c.completed).length;
                          const hasNotes = typeof task.description === 'string' && task.description.trim().length > 0;
                          
                          const overdue = task.status !== 'DONE' && isOverdue(task.due_date);
                          const dueSoon = task.status !== 'DONE' && isDueSoon(task.due_date);

                          return (
                            <Draggable key={task.id} draggableId={task.id} index={index}>
                              {(provided, snapshot) => (
                                <div
                                  ref={provided.innerRef}
                                  {...provided.draggableProps}
                                  {...provided.dragHandleProps}
                                  onClick={() => {
                                    setEditingTask(task);
                                    setIsModalOpen(true);
                                  }}
                                  className={`p-4 rounded-xl border group transition-all cursor-pointer relative overflow-hidden`}
                                  style={{
                                    backgroundColor: 'var(--admin-surface)',
                                    borderColor: snapshot.isDragging ? 'var(--admin-accent)' : overdue ? 'var(--admin-danger)' : dueSoon ? 'var(--admin-warning)' : 'var(--admin-border)',
                                    boxShadow: snapshot.isDragging ? '0 8px 30px rgba(0,0,0,0.5)' : '0 2px 8px rgba(0,0,0,0.2)',
                                    transform: snapshot.isDragging ? 'rotate(2deg)' : 'none',
                                    zIndex: snapshot.isDragging ? 50 : 1
                                  }}
                                >
                                  {/* Alerta Lateral (Recordatorio) */}
                                  {(overdue || dueSoon) && (
                                    <div 
                                      className="absolute left-0 top-0 bottom-0 w-1 animate-pulse" 
                                      style={{ backgroundColor: overdue ? 'var(--admin-danger)' : 'var(--admin-warning)' }} 
                                    />
                                  )}

                                  <div className="flex justify-between items-start mb-3">
                                    <div className="flex flex-wrap gap-1">
                                      <span className={`admin-badge ${PRIORITIES[task.priority]?.badge || 'admin-badge-muted'}`}>
                                        {PRIORITIES[task.priority]?.label}
                                      </span>
                                      {tags.map((tag: string) => (
                                        <span key={tag} className="admin-badge admin-badge-muted">
                                          {tag}
                                        </span>
                                      ))}
                                    </div>
                                  </div>
                                  
                                  <h4 className="font-bold text-sm mb-3 leading-snug" style={{ color: 'var(--admin-text)' }}>
                                    {task.title}
                                  </h4>
                                  
                                  {/* Barra de progreso de Checklist visual */}
                                  {checklist.length > 0 && (
                                    <div className="mb-3">
                                      <div className="flex justify-between text-[10px] mb-1 font-medium" style={{ color: 'var(--admin-text-muted)' }}>
                                        <span className="flex items-center gap-1"><CheckSquare size={10} /> Checklist</span>
                                        <span>{completedChecklist}/{checklist.length}</span>
                                      </div>
                                      <div className="h-1.5 w-full rounded-full overflow-hidden" style={{ background: 'var(--admin-border)' }}>
                                        <div 
                                          className="h-full transition-all duration-500" 
                                          style={{ 
                                            width: `${(completedChecklist / checklist.length) * 100}%`,
                                            background: completedChecklist === checklist.length ? 'var(--admin-success)' : 'var(--admin-accent)'
                                          }} 
                                        />
                                      </div>
                                    </div>
                                  )}

                                  <div className="flex items-center justify-between mt-2 pt-2 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                                    <div className="flex items-center gap-3 text-xs font-medium" style={{ color: 'var(--admin-text-muted)' }}>
                                      {hasNotes && (
                                        <div className="flex items-center gap-1" title="Contiene notas">
                                          <FileText size={14} />
                                        </div>
                                      )}
                                      
                                      {task.due_date && (
                                        <div className="flex items-center gap-1" style={{ color: overdue ? 'var(--admin-danger)' : dueSoon ? 'var(--admin-warning)' : 'inherit' }}>
                                          {overdue ? <Bell size={14} className="animate-bounce" /> : <Clock size={14} />}
                                          {new Date(task.due_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'short' })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              )}
                            </Draggable>
                          );
                        })}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </div>
            ))}
          </div>
        </DragDropContext>
      </div>

      {/* MODAL DE EDICIÓN (Usando admin-card variables) */}
      {isModalOpen && editingTask && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setIsModalOpen(false)} />
          <div 
            className="rounded-2xl shadow-2xl w-full max-w-3xl relative z-10 flex flex-col max-h-[90vh] overflow-hidden"
            style={{ background: 'var(--admin-surface)', border: '1px solid var(--admin-border)' }}
          >
            {/* Header Modal */}
            <div className="flex items-start justify-between p-6 border-b" style={{ borderColor: 'var(--admin-border)' }}>
              <input 
                type="text" 
                value={editingTask.title}
                onChange={(e) => setEditingTask({...editingTask, title: e.target.value})}
                onBlur={() => handleUpdateTask(editingTask.id, { title: editingTask.title })}
                className="text-xl font-bold bg-transparent border-none outline-none focus:ring-0 w-full"
                style={{ color: 'var(--admin-text)' }}
                placeholder="Título de la tarea..."
              />
              <button onClick={() => setIsModalOpen(false)} className="p-2 rounded-full transition-colors hover:bg-white/5" style={{ color: 'var(--admin-text-muted)' }}>
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto flex-1 grid grid-cols-1 md:grid-cols-3 gap-8 custom-scrollbar">
              
              {/* Columna Izquierda: Notas y Checklists */}
              <div className="md:col-span-2 space-y-6">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                    <FileText size={14} /> Notas / Descripción
                  </label>
                  <textarea 
                    value={editingTask.description}
                    onChange={(e) => setEditingTask({...editingTask, description: e.target.value})}
                    onBlur={() => handleUpdateTask(editingTask.id, { description: editingTask.description })}
                    className="admin-input h-32 resize-none"
                    placeholder="Escribe notas detalladas para esta tarea..."
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-3 flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                    <CheckSquare size={14} /> Checklist Interactiva
                  </label>
                  <div className="space-y-2">
                    {parseJsonSafe(editingTask.checklist, []).map((item: TaskChecklistItem) => (
                      <div key={item.id} className="flex items-start gap-3 group p-2 rounded-lg transition-colors hover:bg-white/5" style={{ border: '1px solid var(--admin-border)' }}>
                        <input 
                          type="checkbox" 
                          checked={item.completed}
                          onChange={(e) => {
                            const newChecklist = parseJsonSafe(editingTask.checklist, []).map((c: TaskChecklistItem) => 
                              c.id === item.id ? { ...c, completed: e.target.checked } : c
                            );
                            const updatedString = JSON.stringify(newChecklist);
                            setEditingTask({...editingTask, checklist: updatedString});
                            handleUpdateTask(editingTask.id, { checklist: updatedString });
                          }}
                          className="mt-1 w-4 h-4 text-accent bg-transparent border-gray-500 rounded focus:ring-0"
                        />
                        <input 
                          type="text" 
                          value={item.text}
                          onChange={(e) => {
                            const newChecklist = parseJsonSafe(editingTask.checklist, []).map((c: TaskChecklistItem) => 
                              c.id === item.id ? { ...c, text: e.target.value } : c
                            );
                            setEditingTask({...editingTask, checklist: JSON.stringify(newChecklist)});
                          }}
                          onBlur={() => handleUpdateTask(editingTask.id, { checklist: editingTask.checklist })}
                          className={`flex-1 bg-transparent border-none outline-none focus:ring-0 text-sm ${item.completed ? 'line-through opacity-50' : ''}`}
                          style={{ color: 'var(--admin-text)' }}
                        />
                        <button 
                          onClick={() => {
                            const newChecklist = parseJsonSafe(editingTask.checklist, []).filter((c: TaskChecklistItem) => c.id !== item.id);
                            const updatedString = JSON.stringify(newChecklist);
                            setEditingTask({...editingTask, checklist: updatedString});
                            handleUpdateTask(editingTask.id, { checklist: updatedString });
                          }}
                          className="opacity-0 group-hover:opacity-100 p-1 rounded transition-all"
                          style={{ color: 'var(--admin-danger)' }}
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}
                    
                    <button 
                      onClick={() => {
                        const newChecklist = [...parseJsonSafe(editingTask.checklist, []), { id: Date.now().toString(), text: '', completed: false }];
                        const updatedString = JSON.stringify(newChecklist);
                        setEditingTask({...editingTask, checklist: updatedString});
                        handleUpdateTask(editingTask.id, { checklist: updatedString });
                      }}
                      className="admin-btn admin-btn-secondary w-full text-xs mt-2"
                    >
                      <Plus size={14} /> Añadir Sub-tarea
                    </button>
                  </div>
                </div>
              </div>

              {/* Columna Derecha: Metadatos */}
              <div className="space-y-6 md:border-l pl-0 md:pl-6" style={{ borderColor: 'var(--admin-border)' }}>
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--admin-text-muted)' }}>Estado</label>
                  <select 
                    value={editingTask.status}
                    onChange={(e) => {
                      setEditingTask({...editingTask, status: e.target.value});
                      handleUpdateTask(editingTask.id, { status: e.target.value });
                    }}
                    className="admin-input"
                  >
                    {COLUMNS.map(c => <option key={c.id} value={c.id}>{c.title}</option>)}
                  </select>
                </div>
                
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--admin-text-muted)' }}>Prioridad</label>
                  <select 
                    value={editingTask.priority}
                    onChange={(e) => {
                      setEditingTask({...editingTask, priority: e.target.value});
                      handleUpdateTask(editingTask.id, { priority: e.target.value });
                    }}
                    className="admin-input"
                  >
                    <option value="LOW">Baja</option>
                    <option value="NORMAL">Normal</option>
                    <option value="HIGH">Alta</option>
                    <option value="URGENT">Urgente 🔥</option>
                  </select>
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 flex items-center gap-2" style={{ color: 'var(--admin-text-muted)' }}>
                    <Bell size={14} /> Recordatorio (Vencimiento)
                  </label>
                  <input 
                    type="date" 
                    value={editingTask.due_date ? new Date(editingTask.due_date).toISOString().split('T')[0] : ''}
                    onChange={(e) => {
                      const dateVal = e.target.value ? new Date(e.target.value).toISOString() : null;
                      setEditingTask({...editingTask, due_date: dateVal});
                      handleUpdateTask(editingTask.id, { due_date: dateVal });
                    }}
                    className="admin-input"
                    style={{ colorScheme: 'dark' }} // Forza icono de calendario oscuro
                  />
                </div>

                <div>
                  <label className="text-xs font-bold uppercase tracking-wider mb-2 block" style={{ color: 'var(--admin-text-muted)' }}>Etiquetas (Separadas por comas)</label>
                  <input 
                    type="text" 
                    defaultValue={parseJsonSafe(editingTask.tags, []).join(', ')}
                    onBlur={(e) => {
                      const tagsArray = e.target.value.split(',').map(t => t.trim()).filter(t => t);
                      const updatedString = JSON.stringify(tagsArray);
                      setEditingTask({...editingTask, tags: updatedString});
                      handleUpdateTask(editingTask.id, { tags: updatedString });
                    }}
                    className="admin-input"
                    placeholder="Ej: Marketing, Urgente"
                  />
                </div>

                <div className="pt-6 mt-6 border-t" style={{ borderColor: 'var(--admin-border)' }}>
                  <button 
                    onClick={() => handleDeleteTask(editingTask.id)}
                    className="admin-btn admin-btn-danger w-full"
                  >
                    <Trash2 size={16} /> Eliminar Tarea
                  </button>
                </div>
              </div>

            </div>
          </div>
        </div>
      )}
    </div>
  );
}
