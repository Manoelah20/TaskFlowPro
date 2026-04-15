// ***********************************************************
// Setup global para testes E2E do TaskFlow Pro
// Este arquivo é carregado automaticamente antes dos testes
// ***********************************************************

// Importar comandos personalizados
import './commands';

// Configurações globais
beforeEach(() => {
  // Limpar localStorage antes de cada teste
  cy.clearLocalStorage();
  
  // Limpar cookies antes de cada teste
  cy.clearCookies();
});

// Ignorar erros de exceções não relacionados ao teste
Cypress.on('uncaught:exception', (err, runnable) => {
  // Retornar false para impedir que o Cypress falhe no teste
  // Ajustar conforme necessário para seu aplicativo
  if (err.message.includes('ResizeObserver')) {
    return false;
  }
  
  if (err.message.includes('Script error')) {
    return false;
  }
  
  return true;
});

// Configurar viewport padrão
Cypress.config('viewportWidth', 1280);
Cypress.config('viewportHeight', 720);

// Configurar timeout padrão para comandos
Cypress.config('defaultCommandTimeout', 10000);

// Configurar timeout para page load
Cypress.config('pageLoadTimeout', 60000);
