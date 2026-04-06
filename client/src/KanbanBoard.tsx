import React, { useState, useEffect } from 'react';

interface Task {
  id: string;
  title: string;
  description?: string;
  status: 'todo' | 'doing' | 'done';
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
  deadline?: string;
  estimatedTime?: number;
  actualTime?: number;
  tags: string[];
  assignedTo?: string;
  attachments?: string[];
  comments: Comment[];
  recurrence?: RecurrenceRule;
  workflow?: WorkflowRule;
  dependencies?: string[];
  subtasks?: SubTask[];
  checklist?: ChecklistItem[];
  customFields?: Record<string, any>;
}

interface Comment {
  id: string;
  taskId: string;
  userId: string;
  content: string;
  createdAt: string;
  reactions?: CommentReaction[];
}

interface CommentReaction {
  userId: string;
  emoji: string;
  createdAt: string;
}

interface User {
  id: string;
  name: string;
  avatar?: string;
  role: 'admin' | 'member' | 'viewer';
  email?: string;
  timezone?: string;
  preferences?: UserPreferences;
}

interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  notifications: NotificationSettings;
  dashboardLayout: string[];
}

interface NotificationSettings {
  email: boolean;
  push: boolean;
  taskAssigned: boolean;
  deadlineReminder: boolean;
  taskCompleted: boolean;
}

interface Analytics {
  tasksCompleted: number;
  averageCompletionTime: number;
  productivityTrend: number[];
  categoryBreakdown: Record<string, number>;
  heatMapData: HeatMapPoint[];
  teamPerformance: TeamPerformance[];
  resourceAllocation: ResourceAllocation[];
}

interface TeamPerformance {
  userId: string;
  userName: string;
  tasksCompleted: number;
  averageTime: number;
  efficiency: number;
}

interface ResourceAllocation {
  userId: string;
  workload: number;
  availability: number;
  skills: string[];
}

interface TimeEntry {
  id: string;
  taskId: string;
  userId: string;
  startTime: string;
  endTime?: string;
  duration?: number;
  description?: string;
  billable?: boolean;
}

interface RecurrenceRule {
  type: 'daily' | 'weekly' | 'monthly' | 'yearly';
  interval: number;
  endDate?: string;
  daysOfWeek?: number[];
  customPattern?: string;
}

interface WorkflowRule {
  id: string;
  name: string;
  trigger: 'status_change' | 'deadline_approaching' | 'time_elapsed' | 'task_assigned';
  conditions: Record<string, any>;
  actions: WorkflowAction[];
  enabled: boolean;
}

interface WorkflowAction {
  type: 'change_status' | 'assign_user' | 'send_notification' | 'add_tag' | 'create_subtask' | 'move_to_backlog';
  parameters: Record<string, any>;
}

interface HeatMapPoint {
  date: string;
  count: number;
  intensity: number;
}

interface Automation {
  id: string;
  name: string;
  description: string;
  trigger: string;
  actions: string[];
  enabled: boolean;
}

interface Template {
  id: string;
  name: string;
  description: string;
  tasks: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>[];
  category: string;
  estimatedDuration?: number;
  difficulty?: 'easy' | 'medium' | 'hard';
}

interface SubTask {
  id: string;
  title: string;
  completed: boolean;
  assignedTo?: string;
  dueDate?: string;
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  assignee?: string;
}

interface Integration {
  id: string;
  name: string;
  type: 'slack' | 'github' | 'jira' | 'calendar' | 'email';
  enabled: boolean;
  settings: Record<string, any>;
  lastSync?: string;
}

interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
  actionUrl?: string;
}

interface ScreenSize {
  isMobile: boolean;
  isTablet: boolean;
  isDesktop: boolean;
}

export const KanbanBoard: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([
    { 
      id: '1', 
      title: 'Implementar login', 
      description: 'Criar sistema de autenticação com JWT',
      status: 'todo',
      priority: 'high',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: 4,
      actualTime: 0,
      tags: ['backend', 'autenticação'],
      assignedTo: 'user1',
      attachments: [],
      comments: []
    },
    { 
      id: '2', 
      title: 'Corrigir bug', 
      description: 'Corrigir erro de validação no formulário',
      status: 'doing',
      priority: 'medium',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: 2,
      actualTime: 1.5,
      tags: ['frontend', 'bug'],
      assignedTo: 'user2',
      attachments: [],
      comments: [
        {
          id: 'c1',
          taskId: '2',
          userId: 'user1',
          content: 'Já identifiquei o problema, está na validação do email.',
          createdAt: new Date().toISOString()
        }
      ]
    },
    { 
      id: '3', 
      title: 'Documentar API', 
      description: 'Atualizar documentação Swagger',
      status: 'done',
      priority: 'low',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimatedTime: 3,
      actualTime: 2.5,
      tags: ['documentação', 'api'],
      assignedTo: 'user1',
      attachments: ['swagger.pdf'],
      comments: []
    },
  ]);

  const [users] = useState<User[]>([
    { id: 'user1', name: 'João Silva', avatar: '👨‍💼', role: 'admin' },
    { id: 'user2', name: 'Maria Santos', avatar: '👩‍💻', role: 'member' },
    { id: 'user3', name: 'Pedro Costa', avatar: '👨‍🔧', role: 'member' }
  ]);

  const [newTask, setNewTask] = useState('');
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [newTaskPriority, setNewTaskPriority] = useState<Task['priority']>('medium');
  const [newTaskDeadline, setNewTaskDeadline] = useState('');
  const [newTaskEstimatedTime, setNewTaskEstimatedTime] = useState('');
  const [newTaskTags, setNewTaskTags] = useState('');
  const [newTaskAssignedTo, setNewTaskAssignedTo] = useState('');
  const [editingTask, setEditingTask] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [showAutomations, setShowAutomations] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);
  const [showHeatMap, setShowHeatMap] = useState(false);
  const [showBurndown, setShowBurndown] = useState(false);
  const [activeTimer, setActiveTimer] = useState<string | null>(null);
  const [timerStartTime, setTimerStartTime] = useState<number | null>(null);
  const [filterTag, setFilterTag] = useState<string>('');
  const [filterAssignedTo, setFilterAssignedTo] = useState<string>('');
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const [newComment, setNewComment] = useState<string>('');
  const [commentingTask, setCommentingTask] = useState<string>('');
  
  // Novos estados para funcionalidades 6-10
  const [automations, setAutomations] = useState<Automation[]>([
    {
      id: '1',
      name: 'Mover tarefas atrasadas',
      description: 'Move automaticamente tarefas atrasadas para alta prioridade',
      trigger: 'deadline_approaching',
      actions: ['change_priority', 'send_notification'],
      enabled: true
    }
  ]);
  
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: '1',
      name: 'Sprint Development',
      description: 'Template padrão para sprints de desenvolvimento',
      category: 'Development',
      tasks: [
        {
          title: 'Planning',
          description: 'Planejamento do sprint',
          status: 'todo',
          priority: 'high',
          tags: ['planning', 'sprint'],
          comments: [],
          estimatedTime: 4
        },
        {
          title: 'Development',
          description: 'Desenvolvimento das features',
          status: 'todo',
          priority: 'high',
          tags: ['development', 'sprint'],
          comments: [],
          estimatedTime: 20
        },
        {
          title: 'Testing',
          description: 'Testes e validação',
          status: 'todo',
          priority: 'medium',
          tags: ['testing', 'qa'],
          comments: [],
          estimatedTime: 8
        },
        {
          title: 'Deployment',
          description: 'Deploy para produção',
          status: 'todo',
          priority: 'high',
          tags: ['deployment', 'devops'],
          comments: [],
          estimatedTime: 2
        }
      ]
    }
  ]);
  
  const [workflowRules, setWorkflowRules] = useState<WorkflowRule[]>([
    {
      id: '1',
      name: 'Auto-assign QA',
      trigger: 'status_change',
      conditions: { status: 'doing', priority: 'high' },
      actions: [
        { type: 'assign_user', parameters: { userId: 'user2' } },
        { type: 'add_tag', parameters: { tag: 'qa-review' } }
      ],
      enabled: true
    }
  ]);
  
  // Novos estados para funcionalidades 11-15
  const [showDependencies, setShowDependencies] = useState(false);
  const [showIntegrations, setShowIntegrations] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [showTeamPerformance, setShowTeamPerformance] = useState(false);
  const [showSubtasks, setShowSubtasks] = useState<string>('');
  const [showChecklist, setShowChecklist] = useState<string>('');
  
  const [integrations, setIntegrations] = useState<Integration[]>([
    {
      id: '1',
      name: 'Slack',
      type: 'slack',
      enabled: true,
      settings: { webhook: 'https://hooks.slack.com/...', channel: '#general' },
      lastSync: new Date().toISOString()
    },
    {
      id: '2',
      name: 'GitHub',
      type: 'github',
      enabled: false,
      settings: { repository: 'taskflow-pro', token: '***' }
    },
    {
      id: '3',
      name: 'Google Calendar',
      type: 'calendar',
      enabled: true,
      settings: { calendarId: 'primary', syncDeadlines: true }
    }
  ]);
  
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: '1',
      type: 'info',
      title: 'Nova tarefa atribuída',
      message: 'Você foi atribuído à tarefa "Implementar autenticação"',
      timestamp: new Date().toISOString(),
      read: false
    },
    {
      id: '2',
      type: 'warning',
      title: 'Deadline aproximando',
      message: 'A tarefa "Update documentation" vence em 2 dias',
      timestamp: new Date(Date.now() - 3600000).toISOString(),
      read: false
    },
    {
      id: '3',
      type: 'success',
      title: 'Tarefa concluída',
      message: 'Maria completou a tarefa "Fix login bug"',
      timestamp: new Date(Date.now() - 7200000).toISOString(),
      read: true
    }
  ]);
  
  const [screenSize, setScreenSize] = useState<ScreenSize>({
    isMobile: false,
    isTablet: false,
    isDesktop: true
  });

  useEffect(() => {
    const checkScreenSize = () => {
      const width = window.innerWidth;
      setScreenSize({
        isMobile: width < 768,
        isTablet: width >= 768 && width < 1024,
        isDesktop: width >= 1024
      });
    };

    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const addTask = () => {
    if (newTask.trim()) {
      const task: Task = {
        id: Date.now().toString(),
        title: newTask,
        description: newTaskDescription.trim(),
        status: 'todo',
        priority: newTaskPriority,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        deadline: newTaskDeadline || undefined,
        estimatedTime: newTaskEstimatedTime ? parseFloat(newTaskEstimatedTime) : undefined,
        actualTime: 0,
        tags: newTaskTags ? newTaskTags.split(',').map(tag => tag.trim()).filter(tag => tag) : [],
        assignedTo: newTaskAssignedTo || undefined,
        attachments: [],
        comments: []
      };
      setTasks([...tasks, task]);
      setNewTask('');
      setNewTaskDescription('');
      setNewTaskPriority('medium');
      setNewTaskDeadline('');
      setNewTaskEstimatedTime('');
      setNewTaskTags('');
      setNewTaskAssignedTo('');
      setShowAddForm(false);
    }
  };

  const updateTask = (id: string, updates: Partial<Task>) => {
    setTasks(tasks.map(task => 
      task.id === id 
        ? { ...task, ...updates, updatedAt: new Date().toISOString() }
        : task
    ));
    setEditingTask(null);
  };

  const addComment = (taskId: string, content: string) => {
    const newComment: Comment = {
      id: Date.now().toString(),
      taskId,
      userId: 'user1',
      content,
      createdAt: new Date().toISOString()
    };
    
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, comments: [...task.comments, newComment] }
        : task
    ));
  };

  const startTimer = (taskId: string) => {
    setActiveTimer(taskId);
    setTimerStartTime(Date.now());
  };

  const stopTimer = (taskId: string) => {
    if (activeTimer === taskId && timerStartTime) {
      const duration = (Date.now() - timerStartTime) / 1000 / 60 / 60; // em horas
      setTasks(tasks.map(task => 
        task.id === taskId 
          ? { ...task, actualTime: (task.actualTime || 0) + duration }
          : task
      ));
    }
    setActiveTimer(null);
    setTimerStartTime(null);
  };

  const getAnalytics = (): Analytics => {
    const completedTasks = tasks.filter(t => t.status === 'done');
    const totalCompletedTime = completedTasks.reduce((sum, task) => sum + (task.actualTime || 0), 0);
    const categoryBreakdown: Record<string, number> = {};
    
    tasks.forEach(task => {
      task.tags.forEach(tag => {
        categoryBreakdown[tag] = (categoryBreakdown[tag] || 0) + 1;
      });
    });

    // Gerar dados para heatmap
    const heatMapData: HeatMapPoint[] = [];
    for (let i = 90; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      const count = Math.floor(Math.random() * 10);
      heatMapData.push({
        date: date.toISOString().split('T')[0],
        count,
        intensity: count / 10
      });
    }

    // Gerar dados de performance do time
    const teamPerformance: TeamPerformance[] = users.map(user => {
      const userTasks = tasks.filter(t => t.assignedTo === user.id);
      const userCompleted = userTasks.filter(t => t.status === 'done');
      const avgTime = userCompleted.length > 0 
        ? userCompleted.reduce((sum, task) => sum + (task.actualTime || 0), 0) / userCompleted.length 
        : 0;
      
      return {
        userId: user.id,
        userName: user.name,
        tasksCompleted: userCompleted.length,
        averageTime: avgTime,
        efficiency: userTasks.length > 0 ? (userCompleted.length / userTasks.length) * 100 : 0
      };
    });

    // Gerar dados de alocação de recursos
    const resourceAllocation: ResourceAllocation[] = users.map(user => {
      const userTasks = tasks.filter(t => t.assignedTo === user.id);
      const workload = userTasks.reduce((sum, task) => sum + (task.estimatedTime || 0), 0);
      
      return {
        userId: user.id,
        workload,
        availability: 40 - workload, // 40h semanal
        skills: ['Development', 'Design', 'Testing'] // Simplificado
      };
    });

    return {
      tasksCompleted: completedTasks.length,
      averageCompletionTime: completedTasks.length > 0 ? totalCompletedTime / completedTasks.length : 0,
      productivityTrend: [0, 0, 0, 0, 0], // Simplificado
      categoryBreakdown,
      heatMapData,
      teamPerformance,
      resourceAllocation
    };
  };

  const toggleIntegration = (integrationId: string) => {
    setIntegrations(integrations.map(integration => 
      integration.id === integrationId 
        ? { ...integration, enabled: !integration.enabled, lastSync: new Date().toISOString() }
        : integration
    ));
  };

  const markNotificationAsRead = (notificationId: string) => {
    setNotifications(notifications.map(notification => 
      notification.id === notificationId 
        ? { ...notification, read: true }
        : notification
    ));
  };

  const addSubtask = (taskId: string, title: string) => {
    const newSubtask: SubTask = {
      id: Date.now().toString(),
      title,
      completed: false
    };

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, subtasks: [...(task.subtasks || []), newSubtask] }
        : task
    ));
  };

  const toggleSubtask = (taskId: string, subtaskId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            subtasks: task.subtasks?.map(subtask => 
              subtask.id === subtaskId 
                ? { ...subtask, completed: !subtask.completed }
                : subtask
            )
          }
        : task
    ));
  };

  const addChecklistItem = (taskId: string, text: string) => {
    const newItem: ChecklistItem = {
      id: Date.now().toString(),
      text,
      completed: false
    };

    setTasks(tasks.map(task => 
      task.id === taskId 
        ? { ...task, checklist: [...(task.checklist || []), newItem] }
        : task
    ));
  };

  const toggleChecklistItem = (taskId: string, itemId: string) => {
    setTasks(tasks.map(task => 
      task.id === taskId 
        ? {
            ...task,
            checklist: task.checklist?.map(item => 
              item.id === itemId 
                ? { ...item, completed: !item.completed }
                : item
            )
          }
        : task
    ));
  };

  const createFromTemplate = (templateId: string) => {
    const template = templates.find(t => t.id === templateId);
    if (!template) return;

    const newTasks = template.tasks.map(task => ({
      ...task,
      id: Date.now().toString() + Math.random(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      comments: [],
      attachments: []
    }));

    setTasks([...tasks, ...newTasks]);
    setSelectedTemplate('');
    setShowTemplates(false);
  };

  const toggleAutomation = (automationId: string) => {
    setAutomations(automations.map(auto => 
      auto.id === automationId 
        ? { ...auto, enabled: !auto.enabled }
        : auto
    ));
  };

  const executeWorkflow = (taskId: string, newStatus: Task['status']) => {
    const task = tasks.find(t => t.id === taskId);
    if (!task) return;

    // Executar regras de workflow
    workflowRules.forEach(rule => {
      if (rule.enabled && rule.trigger === 'status_change') {
        const conditionsMet = rule.conditions.status === newStatus && 
                              (!rule.conditions.priority || task.priority === rule.conditions.priority);
        
        if (conditionsMet) {
          rule.actions.forEach(action => {
            switch (action.type) {
              case 'assign_user':
                setTasks(tasks.map(t => 
                  t.id === taskId ? { ...t, assignedTo: action.parameters.userId } : t
                ));
                break;
              case 'add_tag':
                setTasks(tasks.map(t => 
                  t.id === taskId ? { ...t, tags: [...t.tags, action.parameters.tag] } : t
                ));
                break;
            }
          });
        }
      }
    });
  };

  const getHeatMapColor = (intensity: number) => {
    if (intensity === 0) return '#1e293b';
    if (intensity <= 0.2) return '#0f4c75';
    if (intensity <= 0.4) return '#0284c7';
    if (intensity <= 0.6) return '#0ea5e9';
    if (intensity <= 0.8) return '#38bdf8';
    return '#7dd3fc';
  };

  const getFilteredTasks = () => {
    return tasks.filter(task => {
      const tagMatch = !filterTag || task.tags.includes(filterTag);
      const userMatch = !filterAssignedTo || task.assignedTo === filterAssignedTo;
      return tagMatch && userMatch;
    });
  };

  const getUniqueTags = () => {
    const allTags = tasks.flatMap(task => task.tags);
    return Array.from(new Set(allTags));
  };

  const formatTime = (hours: number) => {
    if (hours < 1) {
      return `${Math.round(hours * 60)}min`;
    }
    return `${hours.toFixed(1)}h`;
  };

  const isOverdue = (deadline?: string) => {
    if (!deadline) return false;
    return new Date(deadline) < new Date();
  };

  const getDeadlineColor = (deadline?: string) => {
    if (!deadline) return '#64748b';
    if (isOverdue(deadline)) return '#ef4444';
    const daysUntil = (new Date(deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24);
    if (daysUntil <= 1) return '#f59e0b';
    if (daysUntil <= 3) return '#3b82f6';
    return '#10b981';
  };

  const moveTask = (id: string, newStatus: Task['status']) => {
    executeWorkflow(id, newStatus);
    setTasks(tasks.map(task => 
      task.id === id ? { ...task, status: newStatus } : task
    ));
  };

  const deleteTask = (id: string) => {
    setTasks(tasks.filter(task => task.id !== id));
  };

  const getPriorityColor = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
    }
  };

  const getPriorityLabel = (priority: Task['priority']) => {
    switch (priority) {
      case 'high': return 'Alta';
      case 'medium': return 'Média';
      case 'low': return 'Baixa';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('pt-BR');
  };

  const todoTasks = getFilteredTasks().filter(t => t.status === 'todo');
  const doingTasks = getFilteredTasks().filter(t => t.status === 'doing');
  const doneTasks = getFilteredTasks().filter(t => t.status === 'done');

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #1a202c 0%, #2d3748 100%)',
      color: '#f7fafc',
      fontFamily: 'Inter, sans-serif',
      padding: screenSize.isMobile ? '1rem' : screenSize.isTablet ? '1.5rem' : '2rem',
      fontSize: screenSize.isMobile ? '14px' : '16px'
    }}>
      <header style={{
        display: 'flex',
        flexDirection: screenSize.isMobile ? 'column' : 'row',
        justifyContent: 'space-between',
        alignItems: screenSize.isMobile ? 'flex-start' : 'center',
        marginBottom: screenSize.isMobile ? '1rem' : '2rem',
        padding: screenSize.isMobile ? '1rem' : '1.5rem',
        background: 'rgba(45, 55, 72, 0.8)',
        borderRadius: '0.75rem',
        backdropFilter: 'blur(10px)',
        gap: screenSize.isMobile ? '1rem' : '0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            width: screenSize.isMobile ? '32px' : '40px',
            height: screenSize.isMobile ? '32px' : '40px',
            background: '#3b82f6',
            borderRadius: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            fontSize: screenSize.isMobile ? '14px' : '16px'
          }}>
            T
          </div>
          <div>
            <h1 style={{ 
              fontSize: screenSize.isMobile ? '1.25rem' : '1.5rem', 
              fontWeight: 'bold', 
              margin: 0 
            }}>
              TaskFlow Pro
            </h1>
            <p style={{ 
              fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
              color: '#94a3b8', 
              margin: 0 
            }}>
              Gerenciamento de Tarefas
            </p>
          </div>
        </div>
        
        <div style={{ 
          display: 'flex', 
          flexDirection: screenSize.isMobile ? 'column' : 'row',
          gap: '1rem', 
          alignItems: screenSize.isMobile ? 'flex-start' : 'center',
          width: screenSize.isMobile ? '100%' : 'auto'
        }}>
          <div style={{
            display: 'flex',
            gap: screenSize.isMobile ? '0.5rem' : '0.75rem',
            flexWrap: 'wrap'
          }}>
            <button
              onClick={() => setShowAnalytics(!showAnalytics)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showAnalytics ? '#8b5cf6' : 'rgba(139, 92, 246, 0.2)',
                color: '#a78bfa',
                border: '1px solid #8b5cf6',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📊 Analytics
            </button>
            
            <button
              onClick={() => setShowCalendar(!showCalendar)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showCalendar ? '#06b6d4' : 'rgba(6, 182, 212, 0.2)',
                color: '#67e8f9',
                border: '1px solid #06b6d4',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📅 Calendário
            </button>
            
            <button
              onClick={() => setShowAutomations(!showAutomations)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showAutomations ? '#f97316' : 'rgba(249, 115, 22, 0.2)',
                color: '#fb923c',
                border: '1px solid #f97316',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🤖 Automações
            </button>
            
            <button
              onClick={() => setShowTemplates(!showTemplates)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showTemplates ? '#10b981' : 'rgba(16, 185, 129, 0.2)',
                color: '#34d399',
                border: '1px solid #10b981',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              📋 Templates
            </button>
            
            <button
              onClick={() => setShowHeatMap(!showHeatMap)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showHeatMap ? '#ec4899' : 'rgba(236, 72, 153, 0.2)',
                color: '#f472b6',
                border: '1px solid #ec4899',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔥 HeatMap
            </button>
            
            <button
              onClick={() => setShowDependencies(!showDependencies)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showDependencies ? '#14b8a6' : 'rgba(20, 184, 166, 0.2)',
                color: '#2dd4bf',
                border: '1px solid #14b8a6',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔗 Dependências
            </button>
            
            <button
              onClick={() => setShowIntegrations(!showIntegrations)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showIntegrations ? '#0ea5e9' : 'rgba(14, 165, 233, 0.2)',
                color: '#38bdf8',
                border: '1px solid #0ea5e9',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              🔌 Integrações
            </button>
            
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showNotifications ? '#f59e0b' : 'rgba(245, 158, 11, 0.2)',
                color: '#fbbf24',
                border: '1px solid #f59e0b',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                position: 'relative'
              }}
            >
              🔔 Notificações
              {notifications.filter(n => !n.read).length > 0 && (
                <span style={{
                  position: 'absolute',
                  top: '-4px',
                  right: '-4px',
                  background: '#ef4444',
                  color: 'white',
                  borderRadius: '50%',
                  width: '16px',
                  height: '16px',
                  fontSize: '0.625rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  {notifications.filter(n => !n.read).length}
                </span>
              )}
            </button>
            
            <button
              onClick={() => setShowTeamPerformance(!showTeamPerformance)}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: showTeamPerformance ? '#059669' : 'rgba(5, 150, 105, 0.2)',
                color: '#10b981',
                border: '1px solid #059669',
                borderRadius: '0.375rem',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              👥 Time Performance
            </button>
            
            <select
              value={filterTag}
              onChange={(e) => setFilterTag(e.target.value)}
              title="Filtrar por tag"
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.5rem' : '0.5rem 0.75rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #475569',
                borderRadius: '0.375rem',
                color: '#f7fafc',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
              }}
            >
              <option value="">Todas as Tags</option>
              {getUniqueTags().map(tag => (
                <option key={tag} value={tag}>{tag}</option>
              ))}
            </select>
            
            <select
              value={filterAssignedTo}
              onChange={(e) => setFilterAssignedTo(e.target.value)}
              title="Filtrar por usuário"
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.5rem' : '0.5rem 0.75rem',
                background: 'rgba(30, 41, 59, 0.8)',
                border: '1px solid #475569',
                borderRadius: '0.375rem',
                color: '#f7fafc',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
              }}
            >
              <option value="">Todos os Usuários</option>
              {users.map(user => (
                <option key={user.id} value={user.id}>{user.name}</option>
              ))}
            </select>
          </div>
          
          {!showAddForm ? (
            <button
              onClick={() => setShowAddForm(true)}
              style={{
                padding: screenSize.isMobile ? '0.5rem 1rem' : '0.75rem 1.5rem',
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '0.5rem',
                fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
                fontWeight: '500',
                cursor: 'pointer',
                width: screenSize.isMobile ? '100%' : 'auto'
              }}
            >
              ➕ Nova Tarefa
            </button>
          ) : (
            <div style={{
              background: 'rgba(30, 41, 59, 0.9)',
              border: '1px solid #475569',
              borderRadius: '0.5rem',
              padding: screenSize.isMobile ? '0.75rem' : '1rem',
              minWidth: screenSize.isMobile ? '100%' : '300px',
              width: screenSize.isMobile ? '100%' : 'auto'
            }}>
              <input
                type="text"
                value={newTask}
                onChange={(e) => setNewTask(e.target.value)}
                placeholder="Título da tarefa..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: '#f7fafc',
                  fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
                  marginBottom: '0.5rem'
                }}
              />
              <textarea
                value={newTaskDescription}
                onChange={(e) => setNewTaskDescription(e.target.value)}
                placeholder="Descrição (opcional)..."
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: '#f7fafc',
                  fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
                  marginBottom: '0.5rem',
                  minHeight: '60px',
                  resize: 'vertical'
                }}
              />
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="date"
                  value={newTaskDeadline}
                  onChange={(e) => setNewTaskDeadline(e.target.value)}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.25rem',
                    color: '#f7fafc',
                    fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem'
                  }}
                />
                <input
                  type="number"
                  value={newTaskEstimatedTime}
                  onChange={(e) => setNewTaskEstimatedTime(e.target.value)}
                  placeholder="Tempo (h)"
                  min="0.5"
                  step="0.5"
                  style={{
                    width: '100px',
                    padding: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.25rem',
                    color: '#f7fafc',
                    fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem'
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
                <input
                  type="text"
                  value={newTaskTags}
                  onChange={(e) => setNewTaskTags(e.target.value)}
                  placeholder="Tags (separadas por vírgula)"
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.25rem',
                    color: '#f7fafc',
                    fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem'
                  }}
                />
                <select
                  value={newTaskAssignedTo}
                  onChange={(e) => setNewTaskAssignedTo(e.target.value)}
                  style={{
                    padding: '0.5rem',
                    background: 'rgba(15, 23, 42, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.25rem',
                    color: '#f7fafc',
                    fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem'
                  }}
                >
                  <option value="">Atribuir a...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>{user.avatar} {user.name}</option>
                  ))}
                </select>
              </div>
              <select
                value={newTaskPriority}
                onChange={(e) => setNewTaskPriority(e.target.value as Task['priority'])}
                title="Selecione a prioridade"
                style={{
                  width: '100%',
                  padding: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.8)',
                  border: '1px solid #475569',
                  borderRadius: '0.25rem',
                  color: '#f7fafc',
                  fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
                  marginBottom: '0.5rem'
                }}
              >
                <option value="low">Baixa Prioridade</option>
                <option value="medium">Média Prioridade</option>
                <option value="high">Alta Prioridade</option>
              </select>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button
                  onClick={addTask}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#3b82f6',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Adicionar
                </button>
                <button
                  onClick={() => {
                    setShowAddForm(false);
                    setNewTask('');
                    setNewTaskDescription('');
                    setNewTaskPriority('medium');
                  }}
                  style={{
                    flex: 1,
                    padding: '0.5rem',
                    background: '#64748b',
                    color: 'white',
                    border: 'none',
                    borderRadius: '0.25rem',
                    fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
                    cursor: 'pointer'
                  }}
                >
                  Cancelar
                </button>
              </div>
            </div>
          )}
          
          {!showAddForm && (
            <div style={{
              display: 'flex',
              gap: screenSize.isMobile ? '0.5rem' : '1rem',
              padding: screenSize.isMobile ? '0.5rem 0.75rem' : '0.75rem 1rem',
              background: 'rgba(15, 23, 42, 0.6)',
              borderRadius: '0.5rem',
              fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
              color: '#94a3b8',
              flexWrap: screenSize.isMobile ? 'wrap' : 'nowrap'
            }}>
              <div>
                <strong style={{ color: '#f59e0b' }}>{todoTasks.length}</strong> To Do
              </div>
              <div>
                <strong style={{ color: '#3b82f6' }}>{doingTasks.length}</strong> Doing
              </div>
              <div>
                <strong style={{ color: '#10b981' }}>{doneTasks.length}</strong> Done
              </div>
              <div>
                <strong style={{ color: '#f7fafc' }}>{tasks.length}</strong> Total
              </div>
            </div>
          )}
        </div>
      </header>

      {showAnalytics && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            📊 Analytics Dashboard
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            <div style={{
              background: 'rgba(51, 65, 85, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #475569'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Tarefas Concluídas
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#10b981' }}>
                {getAnalytics().tasksCompleted}
              </div>
            </div>
            
            <div style={{
              background: 'rgba(51, 65, 85, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #475569'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Tempo Médio
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#3b82f6' }}>
                {formatTime(getAnalytics().averageCompletionTime)}
              </div>
            </div>
            
            <div style={{
              background: 'rgba(51, 65, 85, 0.8)',
              padding: '1rem',
              borderRadius: '0.5rem',
              border: '1px solid #475569'
            }}>
              <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                Total de Tarefas
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#f59e0b' }}>
                {tasks.length}
              </div>
            </div>
          </div>
          
          <div style={{ marginTop: '1rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#f7fafc' }}>
              Categorias
            </h3>
            <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
              {Object.entries(getAnalytics().categoryBreakdown).map(([tag, count]) => (
                <span key={tag} style={{
                  background: 'rgba(139, 92, 246, 0.2)',
                  color: '#a78bfa',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '1rem',
                  fontSize: '0.875rem'
                }}>
                  {tag}: {count}
                </span>
              ))}
            </div>
          </div>
        </div>
      )}

      {showCalendar && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            📅 Timeline de Tarefas
          </h2>
          <div style={{
            display: 'grid',
            gap: '0.75rem'
          }}>
            {tasks
              .filter(task => task.deadline)
              .sort((a, b) => new Date(a.deadline!).getTime() - new Date(b.deadline!).getTime())
              .map(task => (
                <div key={task.id} style={{
                  background: 'rgba(51, 65, 85, 0.8)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${getDeadlineColor(task.deadline)}`,
                  borderLeft: `4px solid ${getDeadlineColor(task.deadline)}`
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div>
                      <div style={{ fontWeight: '600', color: '#f7fafc' }}>{task.title}</div>
                      <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginTop: '0.25rem' }}>
                        {formatDate(task.deadline!)} • {isOverdue(task.deadline) ? 'Atrasada' : `${Math.ceil((new Date(task.deadline!).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} dias`}
                      </div>
                    </div>
                    <div style={{
                      padding: '0.25rem 0.75rem',
                      background: `${getDeadlineColor(task.deadline)}20`,
                      color: getDeadlineColor(task.deadline),
                      borderRadius: '1rem',
                      fontSize: '0.75rem',
                      fontWeight: '500'
                    }}>
                      {task.status === 'done' ? '✅ Concluída' : task.status === 'doing' ? '⚙️ Em Andamento' : '📋 A Fazer'}
                    </div>
                  </div>
                </div>
              ))}
          </div>
        </div>
      )}

      {showAutomations && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            🤖 Automações e Workflows
          </h2>
          
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#f7fafc' }}>
              Automações Ativas
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {automations.map(automation => (
                <div key={automation.id} style={{
                  background: 'rgba(51, 65, 85, 0.8)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #475569',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f7fafc', marginBottom: '0.25rem' }}>
                      {automation.name}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      {automation.description}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Trigger: {automation.trigger} • Actions: {automation.actions.join(', ')}
                    </div>
                  </div>
                  <button
                    onClick={() => toggleAutomation(automation.id)}
                    style={{
                      padding: '0.5rem 1rem',
                      background: automation.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                      color: automation.enabled ? '#10b981' : '#64748b',
                      border: `1px solid ${automation.enabled ? '#10b981' : '#64748b'}`,
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {automation.enabled ? '✅ Ativo' : '❌ Inativo'}
                  </button>
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.75rem 0', color: '#f7fafc' }}>
              Regras de Workflow
            </h3>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {workflowRules.map(rule => (
                <div key={rule.id} style={{
                  background: 'rgba(51, 65, 85, 0.8)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: '1px solid #475569'
                }}>
                  <div style={{ fontWeight: '600', color: '#f7fafc', marginBottom: '0.25rem' }}>
                    {rule.name}
                  </div>
                  <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                    Quando: {rule.trigger} • Se: {JSON.stringify(rule.conditions)} • Então: {rule.actions.map(a => a.type).join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {showTemplates && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            📋 Templates de Projetos
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '1rem'
          }}>
            {templates.map(template => (
              <div key={template.id} style={{
                background: 'rgba(51, 65, 85, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569'
              }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '600', margin: '0 0 0.5rem 0', color: '#f7fafc' }}>
                  {template.name}
                </h3>
                <p style={{ fontSize: '0.875rem', color: '#94a3b8', margin: '0 0 0.75rem 0' }}>
                  {template.description}
                </p>
                <div style={{ fontSize: '0.75rem', color: '#64748b', marginBottom: '0.75rem' }}>
                  📁 {template.category} • 📋 {template.tasks.length} tarefas
                </div>
                <button
                  onClick={() => createFromTemplate(template.id)}
                  style={{
                    padding: '0.5rem 1rem',
                    background: 'rgba(16, 185, 129, 0.2)',
                    color: '#10b981',
                    border: '1px solid #10b981',
                    borderRadius: '0.375rem',
                    fontSize: '0.75rem',
                    cursor: 'pointer',
                    width: '100%'
                  }}
                >
                  🚀 Usar Template
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {showHeatMap && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            🔥 HeatMap de Atividade
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Atividade dos últimos 90 dias
          </div>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(13, 1fr)',
            gap: '0.25rem',
            marginBottom: '1rem'
          }}>
            {getAnalytics().heatMapData.map((point, index) => (
              <div
                key={index}
                style={{
                  aspectRatio: '1',
                  background: getHeatMapColor(point.intensity),
                  borderRadius: '0.25rem'
                }}
                title={`${point.date}: ${point.count} tarefas`}
              />
            ))}
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
            <span>Menos</span>
            <div style={{ display: 'flex', gap: '0.25rem' }}>
              {[0, 0.2, 0.4, 0.6, 0.8, 1].map(intensity => (
                <div
                  key={intensity}
                  style={{
                    width: '12px',
                    height: '12px',
                    background: getHeatMapColor(intensity),
                    borderRadius: '0.125rem'
                  }}
                />
              ))}
            </div>
            <span>Mais</span>
          </div>
        </div>
      )}

      {showDependencies && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            🔗 Gerenciamento de Dependências
          </h2>
          <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '1rem' }}>
            Visualize e gerencie as dependências entre tarefas
          </div>
          <div style={{
            display: 'grid',
            gap: '0.75rem'
          }}>
            {tasks.filter(task => task.dependencies && task.dependencies.length > 0).map(task => (
              <div key={task.id} style={{
                background: 'rgba(51, 65, 85, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569',
                borderLeft: '4px solid #14b8a6'
              }}>
                <div style={{ fontWeight: '600', color: '#f7fafc', marginBottom: '0.5rem' }}>
                  {task.title}
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  Depende de:
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {task.dependencies?.map(depId => {
                    const depTask = tasks.find(t => t.id === depId);
                    return depTask ? (
                      <span key={depId} style={{
                        background: 'rgba(20, 184, 166, 0.2)',
                        color: '#2dd4bf',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '0.25rem',
                        fontSize: '0.75rem'
                      }}>
                        {depTask.title}
                      </span>
                    ) : null;
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showIntegrations && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            🔌 Integrações Externas
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: screenSize.isMobile ? '1fr' : 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1rem'
          }}>
            {integrations.map(integration => (
              <div key={integration.id} style={{
                background: 'rgba(51, 65, 85, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1rem', fontWeight: '600', color: '#f7fafc', margin: 0 }}>
                    {integration.name}
                  </h3>
                  <button
                    onClick={() => toggleIntegration(integration.id)}
                    style={{
                      padding: '0.25rem 0.75rem',
                      background: integration.enabled ? 'rgba(16, 185, 129, 0.2)' : 'rgba(107, 114, 128, 0.2)',
                      color: integration.enabled ? '#10b981' : '#64748b',
                      border: `1px solid ${integration.enabled ? '#10b981' : '#64748b'}`,
                      borderRadius: '0.375rem',
                      fontSize: '0.75rem',
                      cursor: 'pointer'
                    }}
                  >
                    {integration.enabled ? '✅ Ativo' : '❌ Inativo'}
                  </button>
                </div>
                <div style={{ fontSize: '0.875rem', color: '#94a3b8', marginBottom: '0.5rem' }}>
                  Tipo: {integration.type}
                </div>
                {integration.lastSync && (
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    Última sinc: {new Date(integration.lastSync).toLocaleString()}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {showNotifications && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            🔔 Centro de Notificações
          </h2>
          <div style={{
            display: 'grid',
            gap: '0.75rem',
            maxHeight: '400px',
            overflowY: 'auto'
          }}>
            {notifications.map(notification => (
              <div
                key={notification.id}
                onClick={() => markNotificationAsRead(notification.id)}
                style={{
                  background: notification.read ? 'rgba(51, 65, 85, 0.4)' : 'rgba(51, 65, 85, 0.8)',
                  padding: '1rem',
                  borderRadius: '0.5rem',
                  border: `1px solid ${notification.read ? '#475569' : '#0ea5e9'}`,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                      <span style={{
                        padding: '0.125rem 0.5rem',
                        background: notification.type === 'info' ? 'rgba(14, 165, 233, 0.2)' :
                                       notification.type === 'success' ? 'rgba(16, 185, 129, 0.2)' :
                                       notification.type === 'warning' ? 'rgba(245, 158, 11, 0.2)' :
                                       'rgba(239, 68, 68, 0.2)',
                        color: notification.type === 'info' ? '#38bdf8' :
                               notification.type === 'success' ? '#34d399' :
                               notification.type === 'warning' ? '#fbbf24' :
                               '#f87171',
                        borderRadius: '0.25rem',
                        fontSize: '0.625rem',
                        fontWeight: '500'
                      }}>
                        {notification.type.toUpperCase()}
                      </span>
                      {!notification.read && (
                        <span style={{
                          width: '8px',
                          height: '8px',
                          background: '#0ea5e9',
                          borderRadius: '50%'
                        }} />
                      )}
                    </div>
                    <div style={{ fontWeight: '600', color: '#f7fafc', marginBottom: '0.25rem' }}>
                      {notification.title}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      {notification.message}
                    </div>
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    {new Date(notification.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showTeamPerformance && (
        <div style={{
          background: 'rgba(30, 41, 59, 0.9)',
          border: '1px solid #475569',
          borderRadius: '0.75rem',
          padding: '1.5rem',
          marginBottom: '2rem'
        }}>
          <h2 style={{ fontSize: '1.25rem', fontWeight: '600', margin: '0 0 1rem 0', color: '#f7fafc' }}>
            👥 Performance do Time
          </h2>
          <div style={{
            display: 'grid',
            gap: '0.75rem'
          }}>
            {getAnalytics().teamPerformance.map(performance => (
              <div key={performance.userId} style={{
                background: 'rgba(51, 65, 85, 0.8)',
                padding: '1rem',
                borderRadius: '0.5rem',
                border: '1px solid #475569'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: '600', color: '#f7fafc', marginBottom: '0.25rem' }}>
                      {performance.userName}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Tarefas concluídas: {performance.tasksCompleted}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
                      Tempo médio: {formatTime(performance.averageTime)}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: '#10b981' }}>
                      {performance.efficiency.toFixed(1)}%
                    </div>
                    <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                      Eficiência
                    </div>
                  </div>
                </div>
                <div style={{
                  width: '100%',
                  height: '6px',
                  background: 'rgba(16, 185, 129, 0.2)',
                  borderRadius: '3px',
                  marginTop: '0.75rem',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    width: `${performance.efficiency}%`,
                    height: '100%',
                    background: '#10b981',
                    borderRadius: '3px'
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <div style={{
        display: 'flex',
        flexDirection: screenSize.isMobile ? 'column' : 'row',
        gap: screenSize.isMobile ? '1rem' : '1rem',
        flex: 1,
        overflowX: screenSize.isTablet ? 'auto' : 'visible'
      }}>
        {[
          { title: '📋 To Do', status: 'todo' as const, tasks: todoTasks, color: '#f59e0b' },
          { title: '⚙️ Doing', status: 'doing' as const, tasks: doingTasks, color: '#3b82f6' },
          { title: '✅ Done', status: 'done' as const, tasks: doneTasks, color: '#10b981' }
        ].map(column => (
          <div key={column.status} style={{
            flex: screenSize.isMobile ? 'none' : 1,
            minWidth: screenSize.isMobile ? '100%' : screenSize.isTablet ? '280px' : 'auto',
            background: 'rgba(30, 41, 59, 0.8)',
            borderRadius: '0.75rem',
            border: '1px solid #475569',
            borderTop: `4px solid ${column.color}`,
            overflow: 'hidden'
          }}>
            <div style={{
              padding: screenSize.isMobile ? '0.75rem' : '1rem',
              borderBottom: '1px solid #475569',
              background: 'rgba(15, 23, 42, 0.5)'
            }}>
              <h2 style={{
                fontSize: screenSize.isMobile ? '0.875rem' : '1rem',
                fontWeight: '600',
                margin: 0,
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                flexWrap: 'wrap'
              }}>
                <span>{column.title}</span>
                <span style={{ 
                  fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem', 
                  color: '#94a3b8' 
                }}>
                  ({column.tasks.length})
                </span>
              </h2>
            </div>
            
            <div style={{ 
              padding: screenSize.isMobile ? '0.75rem' : '1rem',
              maxHeight: screenSize.isMobile ? '400px' : 'none',
              overflowY: screenSize.isMobile ? 'auto' : 'visible'
            }}>
              {column.tasks.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: screenSize.isMobile ? '1.5rem' : '2rem',
                  color: '#94a3b8'
                }}>
                  <div style={{ 
                    fontSize: screenSize.isMobile ? '1.5rem' : '2rem', 
                    marginBottom: '0.5rem' 
                  }}>
                    📋
                  </div>
                  <p style={{ fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem' }}>
                    Nenhuma tarefa aqui
                  </p>
                </div>
              ) : (
                column.tasks.map(task => {
                  const assignedUser = task.assignedTo ? users.find(u => u.id === task.assignedTo) : null;
                  const timerActive = activeTimer === task.id;
                  
                  return (
                  <div key={task.id} style={{
                    background: 'rgba(51, 65, 85, 0.8)',
                    border: '1px solid #475569',
                    borderRadius: '0.5rem',
                    padding: screenSize.isMobile ? '0.75rem' : '1rem',
                    marginBottom: '0.75rem',
                    cursor: 'grab',
                    transition: 'all 0.2s ease',
                    position: 'relative',
                    borderTop: task.deadline && isOverdue(task.deadline) ? '3px solid #ef4444' : undefined
                  }}>
                    <div style={{
                      position: 'absolute',
                      top: screenSize.isMobile ? '0.25rem' : '0.5rem',
                      right: screenSize.isMobile ? '0.25rem' : '0.5rem',
                      display: 'flex',
                      gap: '0.25rem'
                    }}>
                      <button
                        onClick={() => setEditingTask(task.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                        }}
                        title="Editar tarefa"
                      >
                        ✏️
                      </button>
                      <button
                        onClick={() => deleteTask(task.id)}
                        style={{
                          background: 'transparent',
                          border: 'none',
                          color: '#94a3b8',
                          cursor: 'pointer',
                          padding: '0.25rem',
                          borderRadius: '0.25rem',
                          fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                        }}
                        title="Excluir tarefa"
                      >
                        🗑️
                      </button>
                    </div>
                    
                    <div style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      marginBottom: '0.5rem',
                      paddingRight: screenSize.isMobile ? '2.5rem' : '3rem'
                    }}>
                      <div style={{ flex: 1 }}>
                        <h3 style={{ 
                          fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
                          fontWeight: '600', 
                          margin: '0 0 0.25rem 0',
                          color: '#f7fafc',
                          lineHeight: '1.3'
                        }}>
                          {task.title}
                        </h3>
                        {task.description && (
                          <p style={{ 
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem', 
                            color: '#94a3b8', 
                            margin: '0 0 0.5rem 0',
                            lineHeight: '1.4'
                          }}>
                            {task.description}
                          </p>
                        )}
                        
                        {/* Tags */}
                        {task.tags.length > 0 && (
                          <div style={{
                            display: 'flex',
                            gap: '0.25rem',
                            flexWrap: 'wrap',
                            marginBottom: '0.5rem'
                          }}>
                            {task.tags.map(tag => (
                              <span key={tag} style={{
                                background: 'rgba(139, 92, 246, 0.2)',
                                color: '#a78bfa',
                                padding: '0.125rem 0.375rem',
                                borderRadius: '0.25rem',
                                fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                                fontWeight: '500'
                              }}>
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}
                        
                        {/* Deadline e Tempo */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                          color: '#64748b',
                          flexWrap: 'wrap',
                          marginBottom: '0.5rem'
                        }}>
                          <span style={{
                            background: getPriorityColor(task.priority),
                            color: 'white',
                            padding: '0.125rem 0.375rem',
                            borderRadius: '0.25rem',
                            fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                            fontWeight: '500'
                          }}>
                            {getPriorityLabel(task.priority)}
                          </span>
                          {task.deadline && (
                            <span style={{
                              color: getDeadlineColor(task.deadline),
                              fontWeight: '500'
                            }}>
                              📅 {formatDate(task.deadline)}
                            </span>
                          )}
                          {task.estimatedTime && (
                            <span>
                              ⏱️ {formatTime(task.estimatedTime)}
                            </span>
                          )}
                          {task.actualTime && task.actualTime > 0 && (
                            <span style={{ color: '#10b981' }}>
                              ✅ {formatTime(task.actualTime)}
                            </span>
                          )}
                        </div>
                        
                        {/* Usuário atribuído */}
                        {assignedUser && (
                          <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                            color: '#94a3b8',
                            marginBottom: '0.5rem'
                          }}>
                            <span>{assignedUser.avatar}</span>
                            <span>{assignedUser.name}</span>
                          </div>
                        )}
                        
                        {/* Timer */}
                        <div style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '0.5rem',
                          marginTop: '0.5rem'
                        }}>
                          <button
                            onClick={() => timerActive ? stopTimer(task.id) : startTimer(task.id)}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: timerActive ? 'rgba(239, 68, 68, 0.2)' : 'rgba(16, 185, 129, 0.2)',
                              color: timerActive ? '#ef4444' : '#10b981',
                              border: `1px solid ${timerActive ? '#ef4444' : '#10b981'}`,
                              borderRadius: '0.25rem',
                              fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.25rem'
                            }}
                          >
                            {timerActive ? '⏹️ Parar' : '▶️ Iniciar'}
                          </button>
                          {task.actualTime && task.actualTime > 0 && (
                            <span style={{ fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem', color: '#94a3b8' }}>
                              Total: {formatTime(task.actualTime)}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    
                    {/* Subtasks */}
                    {task.subtasks && task.subtasks.length > 0 && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        marginTop: '0.5rem',
                        fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                      }}>
                        <div style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>
                          📋 {task.subtasks.filter(st => st.completed).length}/{task.subtasks.length} subtarefas
                        </div>
                        {task.subtasks.slice(-3).map(subtask => (
                          <div key={subtask.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: subtask.completed ? '#10b981' : '#64748b'
                          }}>
                            <input
                              type="checkbox"
                              checked={subtask.completed}
                              onChange={() => toggleSubtask(task.id, subtask.id)}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{ textDecoration: subtask.completed ? 'line-through' : 'none' }}>
                              {subtask.title}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Checklist */}
                    {task.checklist && task.checklist.length > 0 && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        marginTop: '0.5rem',
                        fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                      }}>
                        <div style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>
                          ✅ {task.checklist.filter(ci => ci.completed).length}/{task.checklist.length} itens
                        </div>
                        {task.checklist.slice(-3).map(item => (
                          <div key={item.id} style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '0.25rem',
                            color: item.completed ? '#10b981' : '#64748b'
                          }}>
                            <input
                              type="checkbox"
                              checked={item.completed}
                              onChange={() => toggleChecklistItem(task.id, item.id)}
                              style={{ cursor: 'pointer' }}
                            />
                            <span style={{ textDecoration: item.completed ? 'line-through' : 'none' }}>
                              {item.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {/* Botões de Subtasks e Checklist */}
                    <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                      <button
                        onClick={() => setShowSubtasks(showSubtasks === task.id ? '' : task.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: 'rgba(20, 184, 166, 0.2)',
                          color: '#2dd4bf',
                          border: '1px solid #14b8a6',
                          borderRadius: '0.25rem',
                          fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                          cursor: 'pointer'
                        }}
                      >
                        📋 {showSubtasks === task.id ? 'Ocultar' : 'Subtasks'}
                      </button>
                      
                      <button
                        onClick={() => setShowChecklist(showChecklist === task.id ? '' : task.id)}
                        style={{
                          padding: '0.25rem 0.5rem',
                          background: 'rgba(168, 85, 247, 0.2)',
                          color: '#c084fc',
                          border: '1px solid #a855f7',
                          borderRadius: '0.25rem',
                          fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                          cursor: 'pointer'
                        }}
                      >
                        ✅ {showChecklist === task.id ? 'Ocultar' : 'Checklist'}
                      </button>
                    </div>
                    
                    {/* Formulário de Subtasks */}
                    {showSubtasks === task.id && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #475569',
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        <input
                          type="text"
                          placeholder="Adicionar subtarefa..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addSubtask(task.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '0.375rem',
                            background: 'rgba(30, 41, 59, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '0.25rem',
                            color: '#f7fafc',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Formulário de Checklist */}
                    {showChecklist === task.id && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #475569',
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        <input
                          type="text"
                          placeholder="Adicionar item à checklist..."
                          onKeyPress={(e) => {
                            if (e.key === 'Enter' && e.currentTarget.value.trim()) {
                              addChecklistItem(task.id, e.currentTarget.value);
                              e.currentTarget.value = '';
                            }
                          }}
                          style={{
                            width: '100%',
                            padding: '0.375rem',
                            background: 'rgba(30, 41, 59, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '0.25rem',
                            color: '#f7fafc',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                          }}
                        />
                      </div>
                    )}
                    
                    {/* Comentários */}
                    {task.comments.length > 0 && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.5)',
                        padding: '0.5rem',
                        borderRadius: '0.25rem',
                        marginTop: '0.5rem',
                        fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem'
                      }}>
                        <div style={{ color: '#94a3b8', marginBottom: '0.25rem' }}>
                          💬 {task.comments.length} comentário{task.comments.length > 1 ? 's' : ''}
                        </div>
                        {task.comments.slice(-1).map(comment => {
                          const commentUser = users.find(u => u.id === comment.userId);
                          return (
                            <div key={comment.id} style={{ color: '#64748b' }}>
                              {commentUser?.avatar} {commentUser?.name}: {comment.content}
                            </div>
                          );
                        })}
                      </div>
                    )}
                    
                    {/* Adicionar comentário */}
                    {commentingTask === task.id && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #475569',
                        borderRadius: '0.25rem',
                        padding: '0.5rem',
                        marginTop: '0.5rem'
                      }}>
                        <input
                          type="text"
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          placeholder="Adicionar comentário..."
                          style={{
                            width: '100%',
                            padding: '0.375rem',
                            background: 'rgba(30, 41, 59, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '0.25rem',
                            color: '#f7fafc',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                            marginBottom: '0.375rem'
                          }}
                        />
                        <div style={{ display: 'flex', gap: '0.375rem' }}>
                          <button
                            onClick={() => {
                              if (newComment.trim()) {
                                addComment(task.id, newComment);
                                setNewComment('');
                                setCommentingTask('');
                              }
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                              cursor: 'pointer'
                            }}
                          >
                            Enviar
                          </button>
                          <button
                            onClick={() => {
                              setNewComment('');
                              setCommentingTask('');
                            }}
                            style={{
                              padding: '0.25rem 0.5rem',
                              background: '#64748b',
                              color: 'white',
                              border: 'none',
                              borderRadius: '0.25rem',
                              fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                              cursor: 'pointer'
                            }}
                          >
                            Cancelar
                          </button>
                        </div>
                      </div>
                    )}
                    
                    <button
                      onClick={() => setCommentingTask(commentingTask === task.id ? '' : task.id)}
                      style={{
                        padding: '0.25rem 0.5rem',
                        background: 'rgba(59, 130, 246, 0.2)',
                        color: '#3b82f6',
                        border: '1px solid #3b82f6',
                        borderRadius: '0.25rem',
                        fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                        cursor: 'pointer',
                        marginTop: '0.5rem'
                      }}
                    >
                      💬 {commentingTask === task.id ? 'Cancelar' : 'Comentar'}
                    </button>
                    
                    {/* Anexos */}
                    {task.attachments && task.attachments.length > 0 && (
                      <div style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                        color: '#94a3b8',
                        marginTop: '0.5rem'
                      }}>
                        📎 {task.attachments.length} arquivo{task.attachments.length > 1 ? 's' : ''}
                      </div>
                    )}
                    
                    {editingTask === task.id && (
                      <div style={{
                        background: 'rgba(15, 23, 42, 0.9)',
                        border: '1px solid #475569',
                        borderRadius: '0.25rem',
                        padding: screenSize.isMobile ? '0.5rem' : '0.75rem',
                        marginTop: '0.5rem'
                      }}>
                        <input
                          type="text"
                          defaultValue={task.title}
                          onBlur={(e) => updateTask(task.id, { title: e.target.value })}
                          placeholder="Título..."
                          style={{
                            width: '100%',
                            padding: '0.375rem',
                            background: 'rgba(30, 41, 59, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '0.25rem',
                            color: '#f7fafc',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                            marginBottom: '0.375rem'
                          }}
                        />
                        <textarea
                          defaultValue={task.description || ''}
                          onBlur={(e) => updateTask(task.id, { description: e.target.value })}
                          placeholder="Descrição..."
                          style={{
                            width: '100%',
                            padding: '0.375rem',
                            background: 'rgba(30, 41, 59, 0.8)',
                            border: '1px solid #475569',
                            borderRadius: '0.25rem',
                            color: '#f7fafc',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                            marginBottom: '0.375rem',
                            minHeight: '40px',
                            resize: 'vertical'
                          }}
                        />
                        <button
                          onClick={() => setEditingTask(null)}
                          style={{
                            padding: '0.375rem 0.75rem',
                            background: '#3b82f6',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.25rem',
                            fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                            cursor: 'pointer'
                          }}
                        >
                          Concluir
                        </button>
                      </div>
                    )}
                    
                    <div style={{ 
                      display: 'flex', 
                      gap: screenSize.isMobile ? '0.25rem' : '0.375rem', 
                      marginTop: '0.75rem',
                      flexWrap: 'wrap'
                    }}>
                      {column.status !== 'todo' && (
                        <button
                          onClick={() => moveTask(task.id, 'todo')}
                          style={{
                            padding: screenSize.isMobile ? '0.1875rem 0.375rem' : '0.25rem 0.5rem',
                            background: 'rgba(245, 158, 11, 0.2)',
                            color: '#f59e0b',
                            border: '1px solid #f59e0b',
                            borderRadius: '0.25rem',
                            fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          To Do
                        </button>
                      )}
                      {column.status !== 'doing' && (
                        <button
                          onClick={() => moveTask(task.id, 'doing')}
                          style={{
                            padding: screenSize.isMobile ? '0.1875rem 0.375rem' : '0.25rem 0.5rem',
                            background: 'rgba(59, 130, 246, 0.2)',
                            color: '#3b82f6',
                            border: '1px solid #3b82f6',
                            borderRadius: '0.25rem',
                            fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Doing
                        </button>
                      )}
                      {column.status !== 'done' && (
                        <button
                          onClick={() => moveTask(task.id, 'done')}
                          style={{
                            padding: screenSize.isMobile ? '0.1875rem 0.375rem' : '0.25rem 0.5rem',
                            background: 'rgba(16, 185, 129, 0.2)',
                            color: '#10b981',
                            border: '1px solid #10b981',
                            borderRadius: '0.25rem',
                            fontSize: screenSize.isMobile ? '0.5rem' : '0.625rem',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease'
                          }}
                        >
                          Done
                        </button>
                      )}
                    </div>
                  </div>
                )})
              )}
            </div>
          </div>
        ))}
      </div>
      
      <footer style={{
        marginTop: '2rem',
        padding: screenSize.isMobile ? '1rem' : '2rem',
        background: 'rgba(15, 23, 42, 0.8)',
        borderTop: '1px solid #475569',
        borderRadius: '0.75rem',
        textAlign: 'center'
      }}>
        <div style={{
          display: 'flex',
          justifyContent: screenSize.isMobile ? 'center' : 'space-around',
          alignItems: 'flex-start',
          marginBottom: '1.5rem',
          flexWrap: screenSize.isMobile ? 'wrap' : 'nowrap',
          gap: screenSize.isMobile ? '1.5rem' : '2rem'
        }}>
          <div style={{ 
            minWidth: screenSize.isMobile ? '100%' : '200px',
            textAlign: screenSize.isMobile ? 'center' : 'left'
          }}>
            <h3 style={{ 
              fontSize: screenSize.isMobile ? '0.875rem' : '1rem', 
              fontWeight: '600', 
              margin: '0 0 0.75rem 0', 
              color: '#f7fafc' 
            }}>
              📊 TaskFlow Pro
            </h3>
            <p style={{ 
              fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
              color: '#94a3b8', 
              margin: '0', 
              lineHeight: '1.5' 
            }}>
              Sistema profissional de gerenciamento de tarefas baseado no método Kanban para otimizar sua produtividade.
            </p>
          </div>
          
          <div style={{ 
            minWidth: screenSize.isMobile ? '100%' : '200px',
            textAlign: screenSize.isMobile ? 'center' : 'left'
          }}>
            <h3 style={{ 
              fontSize: screenSize.isMobile ? '0.875rem' : '1rem', 
              fontWeight: '600', 
              margin: '0 0 0.75rem 0', 
              color: '#f7fafc' 
            }}>
              🚀 Funcionalidades
            </h3>
            <ul style={{ 
              fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
              color: '#94a3b8', 
              margin: '0', 
              padding: '0', 
              listStyle: 'none', 
              lineHeight: '1.5' 
            }}>
              <li>✅ Gestão de Tarefas</li>
              <li>📋 Quadro Kanban</li>
              <li>🎯 Sistema de Prioridades</li>
              <li>📝 Descrições Detalhadas</li>
              <li>⚡ Edição em Tempo Real</li>
            </ul>
          </div>
          
          <div style={{ 
            minWidth: screenSize.isMobile ? '100%' : '200px',
            textAlign: screenSize.isMobile ? 'center' : 'left'
          }}>
            <h3 style={{ 
              fontSize: screenSize.isMobile ? '0.875rem' : '1rem', 
              fontWeight: '600', 
              margin: '0 0 0.75rem 0', 
              color: '#f7fafc' 
            }}>
              🛠️ Tecnologias
            </h3>
            <ul style={{ 
              fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
              color: '#94a3b8', 
              margin: '0', 
              padding: '0', 
              listStyle: 'none', 
              lineHeight: '1.5' 
            }}>
              <li>⚛️ React 18</li>
              <li>🟢 Node.js</li>
              <li>🔌 Socket.io</li>
              <li>🚀 Vite</li>
              <li>📘 TypeScript</li>
            </ul>
          </div>
          
          <div style={{ 
            minWidth: screenSize.isMobile ? '100%' : '200px',
            textAlign: screenSize.isMobile ? 'center' : 'left'
          }}>
            <h3 style={{ 
              fontSize: screenSize.isMobile ? '0.875rem' : '1rem', 
              fontWeight: '600', 
              margin: '0 0 0.75rem 0', 
              color: '#f7fafc' 
            }}>
              📈 Estatísticas
            </h3>
            <div style={{ 
              fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
              color: '#94a3b8', 
              lineHeight: '1.5' 
            }}>
              <div>📋 <strong style={{ color: '#f59e0b' }}>{todoTasks.length}</strong> To Do</div>
              <div>⚙️ <strong style={{ color: '#3b82f6' }}>{doingTasks.length}</strong> Doing</div>
              <div>✅ <strong style={{ color: '#10b981' }}>{doneTasks.length}</strong> Done</div>
              <div>📊 <strong style={{ color: '#f7fafc' }}>{tasks.length}</strong> Total</div>
            </div>
          </div>
        </div>
        
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid #475569',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: screenSize.isMobile ? 'wrap' : 'nowrap',
          gap: '1rem',
          textAlign: screenSize.isMobile ? 'center' : 'left'
        }}>
          <div style={{ 
            fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem', 
            color: '#64748b',
            flex: screenSize.isMobile ? '1' : 'auto'
          }}>
            © 2026 TaskFlow Pro. Versão 1.1.0 | Desenvolvido por Manoela Harrison
          </div>
          
          <div style={{ 
            display: 'flex', 
            gap: '0.5rem', 
            fontSize: screenSize.isMobile ? '0.75rem' : '0.875rem',
            flexWrap: screenSize.isMobile ? 'wrap' : 'nowrap',
            justifyContent: screenSize.isMobile ? 'center' : 'flex-end'
          }}>
            <button
              onClick={() => {
                if (window.confirm('Deseja limpar todas as tarefas? Esta ação não pode ser desfeita.')) {
                  setTasks([]);
                }
              }}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: 'rgba(239, 68, 68, 0.2)',
                color: '#ef4444',
                border: '1px solid #ef4444',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              🗑️ Limpar Tudo
            </button>
            
            <button
              onClick={() => {
                const taskData = JSON.stringify(tasks, null, 2);
                const blob = new Blob([taskData], { type: 'application/json' });
                const url = URL.createObjectURL(blob);
                const a = document.createElement('a');
                a.href = url;
                a.download = `taskflow-backup-${new Date().toISOString().split('T')[0]}.json`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: 'rgba(59, 130, 246, 0.2)',
                color: '#3b82f6',
                border: '1px solid #3b82f6',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              💾 Backup
            </button>
            
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.accept = '.json';
                input.onchange = (e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) {
                    const reader = new FileReader();
                    reader.onload = (e) => {
                      try {
                        const importedTasks = JSON.parse(e.target?.result as string);
                        if (Array.isArray(importedTasks)) {
                          setTasks(importedTasks);
                          alert('Tarefas importadas com sucesso!');
                        }
                      } catch (error) {
                        alert('Erro ao importar arquivo. Verifique o formato.');
                      }
                    };
                    reader.readAsText(file);
                  }
                };
                input.click();
              }}
              style={{
                padding: screenSize.isMobile ? '0.375rem 0.75rem' : '0.5rem 1rem',
                background: 'rgba(16, 185, 129, 0.2)',
                color: '#10b981',
                border: '1px solid #10b981',
                borderRadius: '0.375rem',
                cursor: 'pointer',
                fontSize: screenSize.isMobile ? '0.625rem' : '0.75rem',
                transition: 'all 0.2s ease'
              }}
            >
              📥 Importar
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
};
