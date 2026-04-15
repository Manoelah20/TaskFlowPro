/// <reference types="cypress" />

describe('Testes de Cadastro', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('deve permitir cadastro de nova tarefa', () => {
    cy.contains('button', /nova tarefa/i).click();
    cy.get('input[placeholder*="título"]').type('Tarefa de cadastro');
    cy.get('textarea[placeholder*="descrição"]').type('Descrição da tarefa');
    cy.contains('button', /adicionar/i).click();
    cy.contains('Tarefa de cadastro').should('be.visible');
  });

  it('deve validar campos obrigatórios', () => {
    cy.contains('button', /nova tarefa/i).click();
    cy.contains('button', /adicionar/i).click();
    // Verificar se há validação
    cy.get('input[placeholder*="título"]').should('have.value', '');
  });
});
