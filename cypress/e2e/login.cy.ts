/// <reference types="cypress" />

describe('Fluxo de Login', () => {
  it('Deve carregar a página inicial do TaskFlow Pro', () => {
    // Usa o baseUrl configurado no cypress.config.js (http://localhost:5173)
    cy.visit('/')
    
    // Verifica se o título do aplicativo aparece
    cy.contains('TaskFlow Pro').should('be.visible')
    cy.contains('Gerenciamento de Tarefas').should('be.visible')
  })
})
