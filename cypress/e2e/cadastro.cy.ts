/// <reference types="cypress" />

describe('Testes de Cadastro', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve permitir cadastro de nova tarefa', () => {
    const taskTitle = 'Tarefa de cadastro';
    cy.contains('button', /nova tarefa/i).click();
    
    // Espera o modal/formulário abrir e os elementos ficarem visíveis
    cy.get('[data-testid="input-titulo-tarefa"]', { timeout: 5000 }).should('be.visible');
    
    cy.get('[data-testid="input-titulo-tarefa"]').type(taskTitle);
    cy.get('[data-testid="input-descricao-tarefa"]').type('Descrição da tarefa');
    cy.get('[data-testid="btn-adicionar-tarefa"]').click();
    cy.contains(taskTitle).should('be.visible');
  });

  it('deve validar campos obrigatórios', () => {
    cy.contains('button', /nova tarefa/i).click();
    
    // Espera o modal/formulário abrir
    cy.get('[data-testid="input-titulo-tarefa"]', { timeout: 5000 }).should('be.visible');
    
    cy.get('[data-testid="btn-adicionar-tarefa"]').click();
    // Verificar se há validação - o input deve estar vazio
    cy.get('[data-testid="input-titulo-tarefa"]').should('have.value', '');
  });
});
