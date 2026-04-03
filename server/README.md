# 🎯 TaskFlow Pro

**Gerenciador de Tarefas em Tempo Real com Drag-and-Drop e Sincronização Instantânea**

Sistema profissional de gerenciamento ágil com comunicação WebSocket, persistência MongoDB e integração Slack.

---

## 🎬 Demo & Principais Diferenciais

### 1. **Sincronização em Tempo Real** 🔄
- Quando um usuário move um card em sua abra, **todos os outros veem instantaneamente** a mudança
- Powered by **Socket.io** + **WebSocket**
- Teste abrindo 2 abas do navegador lado-a-lado!

### 2. **Integração Slack** 📲
```
Quando uma tarefa entra na coluna "Feito" → Notificação automática no Slack
Quando uma tarefa é movida → Log de atividade no Slack
```

### 3. **TypeScript Estrito** 🛡️
- Interfaces bem definidas previnem bugs de tipo
- Segurança de dados entre frontend e backend
- Auditoria completa com timestamps e IDs de usuário

### 4. **Persistência com MongoDB** 💾
- Histórico completo de movimentações
- Auditoria: quem moveu, quando e para onde
- Recuperação de dados em caso de crash

---

## 🏗️ Arquitetura

```
TaskFlow Pro/
│
├── 📦 server/              # Backend Node.js + Socket.io
│   ├── src/
│   │   ├── server.ts       # Entry point com Socket.io
│   │   ├── handlers/
│   │   │   └── socketHandlers.ts    # Lógica dos sockets
│   │   ├── models/
│   │   │   └── Task.ts     # Schema MongoDB
│   │   └── services/
│   │       └── SlackService.ts      # Integração Slack
│   ├── package.json
│   └── tsconfig.json
│
├── 💻 client/              # Frontend React + dnd-kit
│   ├── src/
│   │   ├── components/
│   │   │   ├── KanbanBoard.tsx      # Componente principal
│   │   │   ├── Column.tsx           # Coluna do Kanban
│   │   │   └── Card.tsx             # Card de tarefa
│   │   ├── styles/         # CSS moderno com gradientes
│   │   ├── types.ts        # Tipos TypeScript
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── index.html
│   ├── vite.config.ts
│   ├── package.json
│   └── tsconfig.json
│
└── 📋 README.md            # Este arquivo
```

---

## ⚡ Quick Start

### 1️⃣ **Clonar & Instalar**

```bash
# Backend
cd server
npm install

# Frontend
cd client
npm install
```

### 2️⃣ **Configurar Variáveis de Ambiente**

**server/.env**
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/taskflow-pro
NODE_ENV=development
SLACK_WEBHOOK_URL=https://hooks.slack.com/services/YOUR/WEBHOOK/URL
CORS_ORIGIN=http://localhost:5173
```

**client/.env**
```env
VITE_API_URL=http://localhost:5000
```

### 3️⃣ **Iniciar MongoDB** (Local)

```bash
# Se tiver MongoDB instalado localmente:
mongod

# Ou usar Docker:
docker run -d -p 27017:27017 --name mongodb mongo
```

### 4️⃣ **Rodar Backend**

```bash
cd server
npm run dev
```

Você verá:
```
╔════════════════════════════════════════╗
║    🚀 TaskFlow Pro Server Running     ║
║          Porta: 5000                  ║
║     Socket.io: Ativo e Pronto         ║
║     MongoDB: Conectado                ║
╚════════════════════════════════════════╝
```

### 5️⃣ **Rodar Frontend** (em outro terminal)

```bash
cd client
npm run dev
```

Acesse: `http://localhost:5173`

---

## 🎮 Como Usar

1. **Criar Tarefa**
   - Digite o conteúdo na caixa "Adicionar nova tarefa..."
   - Pressione `Enter` ou clique "+ Adicionar"

2. **Mover Tarefa (Drag-and-Drop)**
   - Clique e arraste um card para outra coluna
   - Todos os outros usuários verão a mudança **instantaneamente**

3. **Deletar Tarefa**
   - Clique no botão ✕ no canto superior direito do card

4. **Observar Sincronização**
   - Abra 2 abas do navegador
   - Mova um card em uma aba
   - Veja a atualização simultânea na outra aba

---

## 📡 Socket.io Events

### Cliente → Servidor

```javascript
// Tarefa movida
socket.emit('task_moved', {
  taskId: string,
  newStatus: 'todo' | 'doing' | 'done',
  userId: string,
  taskContent: string,
  oldStatus: string
});

// Tarefa criada
socket.emit('task_created', {
  id: string,
  content: string,
  userId: string
});

// Tarefa deletada
socket.emit('task_deleted', {
  taskId: string,
  userId: string
});

// Carregar todas as tarefas
socket.emit('load_tasks');
```

### Servidor → Cliente

```javascript
// Tarefa foi atualizada (broadcast)
socket.on('task_updated', (data) => {
  // { taskId, newStatus, userId, timestamp, taskContent }
});

// Nova tarefa foi criada (broadcast)
socket.on('task_created', (data) => {
  // { id, content, status: 'todo', userId, timestamp }
});

// Tarefa foi deletada (broadcast)
socket.on('task_deleted', (data) => {
  // { taskId, userId, timestamp }
});

// Tarefas carregadas inicialmente
socket.on('tasks_loaded', (tasks) => {
  // Array de todas as tarefas do banco
});
```

---

## 🔌 Integração Slack

### Configurar Webhook

1. Acesse: [Slack API - Incoming Webhooks](https://api.slack.com/apps)
2. Crie uma nova App → Ative "Incoming Webhooks"
3. Crie um novo webhook e copie a URL
4. Cole em `server/.env`:
   ```env
   SLACK_WEBHOOK_URL=https://hooks.slack.com/services/XXX/YYY/ZZZ
   ```

### Notificações Automáticas

- **Quando tarefa vai para "Feito"**: Notificação rich em bloco no Slack
- **Quando tarefa é movida**: Log da ação com antes/depois

---

## 🛡️ TypeScript & Type Safety

Todos os tipos estão bem definidos em `client/src/types.ts`:

```typescript
export interface Task {
  id: string;
  content: string;
  status: 'todo' | 'doing' | 'done';
  userId: string;
  createdAt?: Date;
  movedBy?: string;
  movedAt?: Date;
}
```

Backend também com tipos MongoDB:

```typescript
export interface ITask extends Document {
  id: string;
  content: string;
  status: 'todo' | 'doing' | 'done';
  userId: string;
  movedBy: string;
  movedAt: Date;
}
```

---

## 📊 Banco de Dados (MongoDB)

### Exemplo de Documento

```json
{
  "_id": "ObjectId",
  "id": "uuid-1234",
  "content": "Implementar frontend do Kanban",
  "status": "doing",
  "userId": "User-abc123",
  "movedBy": "User-xyz789",
  "movedAt": "2026-04-02T10:30:00Z",
  "createdAt": "2026-04-02T08:00:00Z",
  "updatedAt": "2026-04-02T10:30:00Z"
}
```

---

## 🚀 Deploy

### Local com Docker

```bash
# Backend + MongoDB
docker-compose up
```

### Produção

#### Backend (Heroku)
```bash
cd server
npm run build
git push heroku main
```

#### Frontend (Vercel)
```bash
cd client
npm run build
# Deploy para Vercel
```

---

## 📚 Tecnologias

### Frontend
- **React 18** - UI Component Library
- **TypeScript** - Type Safety
- **@dnd-kit** - Modern Drag-and-Drop
- **Socket.io Client** - WebSocket
- **Vite** - Ultra-fast Build Tool
- **CSS3** - Gradients & Animations

### Backend
- **Node.js** - Runtime
- **Express.js** - HTTP Framework
- **Socket.io** - Real-time Communication
- **MongoDB** - NoSQL Database
- **Mongoose** - ODM
- **TypeScript** - Type Safety
- **Axios** - HTTP Client

---

## 🎓 Conceitos Importantes

### Optimistic UI
O frontend atualiza a UI **antes** de receber confirmação do servidor, proporcionando melhor UX.

### Broadcast com Socket.io
```javascript
// Envia apenas para outros usuários (não inclui o remetente)
socket.broadcast.emit('task_updated', data);
```

### Auditoria
Cada movimento é registrado no MongoDB com `movedBy` e `movedAt`, permitindo ratrear quem fez o quê e quando.

### CORS Seguro
Configurado para aceitar apenas o frontend específico:
```env
CORS_ORIGIN=http://localhost:5173
```

---

## 🐛 Troubleshooting

### "Não consigo conectar ao servidor"
- Verifique se o backend está rodando na porta 5000
- Confirme a URL em `client/.env`

### "Mongo connection failed"
- Instale MongoDB localmente ou use Docker
- Verifique `MONGODB_URI` em `server/.env`

### "WebSocket connection failed"
- Certifique-se de que CORS está configurado corretamente
- Verifique `CORS_ORIGIN` em `server/.env`

---

## 📈 Próximas Features

- [ ] Autenticação com JWT
- [ ] Permissões de usuário (editar/deletar apenas suas tarefas)
- [ ] Tags/Labels nas tarefas
- [ ] Filtros avançados
- [ ] Histórico completo de atividades
- [ ] Notificações em tempo real (Toast)
- [ ] Temas claro/escuro
- [ ] PWA (Offline support)
- [ ] Integração com GitHub Issues

---

## 📝 License

MIT

## 👨‍💻 Author

**Manoela** - Desenvolvida para demonstrar excelência em Full-Stack Development

---

**💡 Dica para Apresentação:**
Abra dois navegadores lado-a-lado e mova cards para impressionar com a sincronização instantânea! 🎉
