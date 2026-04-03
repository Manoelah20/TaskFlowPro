import React, { useState } from 'react';

interface Task {
  id: string;
  title: string;
  status: 'todo' | 'doing' | 'done';
}

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { id: '1', title: 'Implementar login', status: 'todo' },
    { id: '2', title: 'Corrigir bug', status: 'doing' },
    { id: '3', title: 'Documentar API', status: 'done' },
  ]);

  const [newTask, setNewTask] = useState('');

  const addTask = () => {
    if (newTask.trim()) {
      setTasks([...tasks, {
        id: Date.now().toString(),
        title: newTask,
        status: 'todo'
      }]);
      setNewTask('');
    }
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const todoTasks = tasks.filter(t => t.status === 'todo');
  const doingTasks = tasks.filter(t => t.status === 'doing');
  const doneTasks = tasks.filter(t => t.status === 'done');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: '#f7fafc',
      fontFamily: 'Inter, sans-serif',
      padding: '2rem'
    }}>
      <header style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '2rem',
        padding: '1.5rem',
        background: 'rgba(45, 55, 72, 0.8)',
        borderRadius: '0.75rem',
        backdropFilter: 'blur(10px)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#3b82f6',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold'
          }}>
            T
          </div>
          <div>
            <h1 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: 0 }}>TaskFlow Pro</h1>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: 0 }}>Gerenciamento de Tarefas</p>
          </div>
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <input
            type="text"
            value={newTask}
            onChange={(e) => setNewTask(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTask()}
            placeholder="Nova tarefa..."
            style={{
              padding: '0.75rem 1rem',
              background: 'rgba(30, 41, 59, 0.8)',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              color: '#f7fafc',
              fontSize: '0.875rem'
            }}
          />
          <button
            onClick={addTask}
            style={{
              padding: '0.75rem 1.5rem',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.5rem',
              fontSize: '0.875rem',
              fontWeight: '500',
              cursor: 'pointer'
            }}
          >
            Adicionar
          </button>
        </div>
      </header>

      <div style={{
        display: 'flex',
        gap: '1rem',
        flex: 1
      }}>
        {[
          { title: '📋 To Do', status: 'todo' as const, tasks: todoTasks, color: '#f59e0b' },
          { title: '⚙️ Doing', status: 'doing' as const, tasks: doingTasks, color: '#3b82f6' },
          { title: '✅ Done', status: 'done' as const, tasks: doneTasks, color: '#10b981' }
        ].map(column => (
          <div key={column.status} style={{
            flex: 1,
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '0.75rem',
            border: '1px solid #475569',
            borderTop: `4px solid ${column.color}`,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: '1rem',
              borderBottom: '1px solid #475569',
              background: 'rgba(15, 23, 42, 0.5)'
            }}>
              <h2 style={{
                fontSize: '1rem',
                fontWeight: '600',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}>
                {column.title}
                <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                  ({column.tasks.length})
                </span>
              </h2>
            </div>
            
            <div style={{ padding: '1rem' }}>
              {column.tasks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '2rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>📋</div>
                  <p>Nenhuma tarefa aqui</p>
                </div>
              ) : (
                column.tasks.map(task => (
                  <div key={task.id} style={{
                    background: 'rgba(51, 65, 85, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    padding: '1rem',
                    marginBottom: '0.75rem',
                    cursor: 'grab',
                    transition: 'all 0.2s ease'
                  }}>
                    <div style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem'
                    }}>
                      <h3 style={{ fontSize: '0.875rem', fontWeight: '600', margin: 0 }}>
                        {task.title}
                      </h3>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem'
                        }}
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {column.status !== 'todo' && (
                        <button
                          onClick={() => moveTask(task.id, 'todo')}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid #f59e0b',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          To Do
                        </button>
                      )}
                      {column.status !== 'doing' && (
                        <button
                          onClick={() => moveTask(task.id, 'doing')}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Doing
                        </button>
                      )}
                      {column.status !== 'done' && (
                        <button
                          onClick={() => moveTask(task.id, 'done')}
                          style={{
                            padding: '0.25rem 0.5rem',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            border: '1px solid #10b981',
                            borderRadius: '0.25rem',
                            fontSize: '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
