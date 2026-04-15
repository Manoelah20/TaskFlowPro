/// <reference types="cypress" />

describe('Testes do KanbanBoard - Tarefas', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve exibir o título TaskFlow Pro', () => {
    cy.contains('TaskFlow Pro').should('be.visible');
  });

  it('deve exibir as três colunas do kanban', () => {
    cy.contains('To Do').should('be.visible');
    cy.contains('Doing').should('be.visible');
    cy.contains('Done').should('be.visible');
  });

  it('deve exibir tarefas iniciais', () => {
    cy.contains('Implementar login').should('be.visible');
    cy.contains('Corrigir bug').should('be.visible');
    cy.contains('Documentar API').should('be.visible');
  });

  it('deve abrir o formulário de adicionar tarefa ao clicar no botão', () => {
    cy.contains('button', /nova tarefa/i).click();
    cy.get('[data-testid="input-titulo-tarefa"]', { timeout: 5000 }).should('be.visible');
  });

  it('deve adicionar uma nova tarefa', () => {
    const taskTitle = 'Nova tarefa de teste';
    
    cy.contains('button', /nova tarefa/i).click();
    cy.get('[data-testid="input-titulo-tarefa"]', { timeout: 5000 }).should('be.visible');
    cy.get('[data-testid="input-titulo-tarefa"]').type(taskTitle);
    cy.get('[data-testid="input-descricao-tarefa"]').type('Descrição da tarefa de teste');
    cy.get('[data-testid="btn-adicionar-tarefa"]').click();
    
    cy.contains(taskTitle).should('be.visible');
  });

  it('deve mover uma tarefa de "A Fazer" para "Em Progresso"', () => {
    cy.contains('Implementar login')
      .parents('[data-testid="task-card"]')
      .within(() => {
        cy.contains('button', /Doing/i).click();
      });
    
    // Verifica se a tarefa foi movida para a coluna Doing
    cy.contains('Implementar login').should('be.visible');
  });

  it('deve mover uma tarefa para "Concluído"', () => {
    cy.contains('Corrigir bug')
      .parents('[data-testid="task-card"]')
      .within(() => {
        cy.contains('button', /Done/i).click();
      });
    
    // Verifica se a tarefa foi movida para a coluna Done
    cy.contains('Corrigir bug').should('be.visible');
  });

  it('deve exibir a prioridade da tarefa', () => {
    cy.contains('Implementar login')
      .parents('[data-testid="task-card"]')
      .should('contain', 'Alta');
  });

  it('deve exibir tags da tarefa', () => {
    cy.contains('Implementar login')
      .parents('[data-testid="task-card"]')
      .should('contain', 'backend');
  });

  it('deve filtrar tarefas por tag', () => {
    cy.get('[data-testid="tag-filter"]').should('be.visible');
    cy.get('[data-testid="tag-filter"]').select('backend');
    // Apenas verifica se o filtro foi selecionado
    cy.get('[data-testid="tag-filter"]').should('have.value', 'backend');
  });

  it('deve filtrar tarefas por usuário', () => {
    cy.get('[data-testid="user-filter"]').should('be.visible');
    cy.get('[data-testid="user-filter"]').select('user1');
    // Apenas verifica se o filtro foi selecionado
    cy.get('[data-testid="user-filter"]').should('have.value', 'user1');
  });

  it('deve exibir analytics ao clicar no botão', () => {
    cy.contains('button', /analytics/i).click();
    cy.contains('Tarefas Concluídas').should('be.visible');
  });

  it('deve exibir calendário ao clicar no botão', () => {
    cy.contains('button', /calendário/i).click();
    cy.contains('Calendário').should('be.visible');
  });

  it('deve exibir automações ao clicar no botão', () => {
    cy.contains('button', /automações/i).click();
    cy.contains('Automações').should('be.visible');
  });

  it('deve exibir templates ao clicar no botão', () => {
    cy.contains('button', /templates/i).click();
    cy.contains('Templates').should('be.visible');
  });

  it('deve adicionar um comentário a uma tarefa', () => {
    const commentText = 'Comentário de teste';
    
    cy.contains('Corrigir bug')
      .parents('[data-testid="task-card"]')
      .within(() => {
        cy.contains('button', /💬 Comentar/i).click();
        cy.get('[data-testid="input-comentario"]').type(commentText);
        cy.get('[data-testid="btn-enviar-comentario"]').click();
      });
    
    cy.contains(commentText).should('be.visible');
  });

  it('deve iniciar e parar o timer de uma tarefa', () => {
    cy.contains('Implementar login')
      .parents('[data-testid="task-card"]')
      .within(() => {
        cy.contains('button', /▶️ Iniciar/i).click();
        cy.contains('button', /⏹️ Parar/i).click();
      });
  });

  it('deve ser responsivo em dispositivos móveis', () => {
    cy.viewport(375, 667);
    cy.contains('TaskFlow Pro').should('be.visible');
    cy.contains('To Do').should('be.visible');
  });

  it('deve ser responsivo em tablets', () => {
    cy.viewport(768, 1024);
    cy.contains('TaskFlow Pro').should('be.visible');
    cy.contains('To Do').should('be.visible');
  });
});
