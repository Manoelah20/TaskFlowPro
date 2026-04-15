// ***********************************************
// Comandos personalizados para TaskFlow Pro
// Este arquivo contém comandos customizados para facilitar os testes
// ***********************************************

declare namespace Cypress {
  interface Chainable {
    /**
     * Comando para criar uma nova tarefa
     * @param title - Título da tarefa
     * @param description - Descrição da tarefa (opcional)
     * @param priority - Prioridade da tarefa (opcional)
     * @param tags - Tags da tarefa (opcional)
     */
    createTask(
      title: string,
      description?: string,
      priority?: 'low' | 'medium' | 'high',
      tags?: string[]
    ): void;

    /**
     * Comando para mover uma tarefa para um status específico
     * @param taskTitle - Título da tarefa
     * @param newStatus - Novo status da tarefa
     */
    moveTask(
      taskTitle: string,
      newStatus: 'todo' | 'doing' | 'done'
    ): void;

    /**
     * Comando para adicionar comentário a uma tarefa
     * @param taskTitle - Título da tarefa
     * @param comment - Conteúdo do comentário
     */
    addComment(
      taskTitle: string,
      comment: string
    ): void;

    /**
     * Comando para filtrar tarefas por tag
     * @param tag - Tag para filtrar
     */
    filterByTag(tag: string): void;

    /**
     * Comando para filtrar tarefas por usuário
     * @param userId - ID do usuário
     */
    filterByUser(userId: string): void;

    /**
     * Comando para iniciar timer de uma tarefa
     * @param taskTitle - Título da tarefa
     */
    startTimer(taskTitle: string): void;

    /**
     * Comando para parar timer de uma tarefa
     * @param taskTitle - Título da tarefa
     */
    stopTimer(taskTitle: string): void;

    /**
     * Comando para verificar se tarefa existe
     * @param taskTitle - Título da tarefa
     */
    taskExists(taskTitle: string): void;

    /**
     * Comando para abrir painel de analytics
     */
    openAnalytics(): void;

    /**
     * Comando para abrir painel de calendário
     */
    openCalendar(): void;

    /**
     * Comando para abrir painel de automações
     */
    openAutomations(): void;

    /**
     * Comando para abrir painel de templates
     */
    openTemplates(): void;

    /**
     * Comando para login simulado
     * @param username - Nome de usuário
     * @param password - Senha
     */
    login(username: string, password: string): void;
  }
}

// -- Comando para criar tarefa --
Cypress.Commands.add('createTask', (title, description = '', priority = 'medium', tags = []) => {
  cy.contains('button', /nova tarefa/i).click();
  cy.get('input[placeholder*="título"]').type(title);
  
  if (description) {
    cy.get('textarea[placeholder*="descrição"]').type(description);
  }
  
  if (priority !== 'medium') {
    cy.get('select').select(priority);
  }
  
  if (tags.length > 0) {
    cy.get('input[placeholder*="tags"]').type(tags.join(','));
  }
  
  cy.contains('button', /adicionar/i).click();
});

// -- Comando para mover tarefa --
Cypress.Commands.add('moveTask', (taskTitle, newStatus) => {
  const buttonText = newStatus === 'todo' ? /a fazer/i : 
                    newStatus === 'doing' ? /em progresso/i : 
                    /concluído/i;
  
  cy.contains(taskTitle)
    .parents('[data-testid="task-card"]')
    .within(() => {
      cy.contains('button', buttonText).click();
    });
});

// -- Comando para adicionar comentário --
Cypress.Commands.add('addComment', (taskTitle, comment) => {
  cy.contains(taskTitle)
    .parents('[data-testid="task-card"]')
    .within(() => {
      cy.contains('button', /comentar/i).click();
      cy.get('textarea').type(comment);
      cy.contains('button', /enviar/i).click();
    });
});

// -- Comando para filtrar por tag --
Cypress.Commands.add('filterByTag', (tag) => {
  cy.get('[data-testid="tag-filter"]').select(tag);
});

// -- Comando para filtrar por usuário --
Cypress.Commands.add('filterByUser', (userId) => {
  cy.get('[data-testid="user-filter"]').select(userId);
});

// -- Comando para iniciar timer --
Cypress.Commands.add('startTimer', (taskTitle) => {
  cy.contains(taskTitle)
    .parents('[data-testid="task-card"]')
    .within(() => {
      cy.contains('button', /▶️/i).click();
    });
});

// -- Comando para parar timer --
Cypress.Commands.add('stopTimer', (taskTitle) => {
  cy.contains(taskTitle)
    .parents('[data-testid="task-card"]')
    .within(() => {
      cy.contains('button', /⏸️/i).click();
    });
});

// -- Comando para verificar se tarefa existe --
Cypress.Commands.add('taskExists', (taskTitle) => {
  cy.contains(taskTitle).should('be.visible');
});

// -- Comando para abrir analytics --
Cypress.Commands.add('openAnalytics', () => {
  cy.contains('button', /analytics/i).click();
});

// -- Comando para abrir calendário --
Cypress.Commands.add('openCalendar', () => {
  cy.contains('button', /calendário/i).click();
});

// -- Comando para abrir automações --
Cypress.Commands.add('openAutomations', () => {
  cy.contains('button', /automações/i).click();
});

// -- Comando para abrir templates --
Cypress.Commands.add('openTemplates', () => {
  cy.contains('button', /templates/i).click();
});

// -- Comando para login simulado --
Cypress.Commands.add('login', (username, password) => {
  // Como o sistema atual não tem login real, este comando é um placeholder
  // para quando o sistema de autenticação for implementado
  cy.log(`Login simulado com usuário: ${username}`);
});
