describe('Basic Functionality Test', () => {
  it('should load the homepage', () => {
    cy.visit('/')
    cy.title().should('contain', 'QuizMaster')
  })

  it('should navigate to register page', () => {
    cy.visit('/register')
    cy.get('[data-cy=first-name-input]').should('be.visible')
    cy.get('[data-cy=last-name-input]').should('be.visible')
    cy.get('[data-cy=email-input]').should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
    cy.get('[data-cy=register-button]').should('be.visible')
  })

  it('should navigate to login page', () => {
    cy.visit('/login')
    cy.get('[data-cy=email-input]').should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
    cy.get('[data-cy=login-button]').should('be.visible')
  })
})