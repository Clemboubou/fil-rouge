describe('Registration Flow', () => {
  beforeEach(() => {
    cy.visit('/register')

    // Handle cookie banner if present
    cy.get('body').then($body => {
      if ($body.find('[data-cy=cookie-banner]').length > 0) {
        cy.get('[data-cy=accept-cookies]').click()
        cy.wait(500) // Wait for banner to disappear
      }
    })
  })

  it('should display all registration form fields', () => {
    cy.get('[data-cy=first-name-input]').should('be.visible')
    cy.get('[data-cy=last-name-input]').should('be.visible')
    cy.get('[data-cy=email-input]').should('be.visible')
    cy.get('[data-cy=password-input]').should('be.visible')
    cy.get('[data-cy=confirm-password-input]').should('be.visible')
    cy.get('[data-cy=role-select]').should('be.visible')
    cy.get('[data-cy=terms-checkbox]').should('be.visible')
    cy.get('[data-cy=register-button]').should('be.visible')
  })

  it('should show validation errors for invalid data', () => {
    // Fill with invalid data to trigger custom validation
    cy.get('[data-cy=email-input]').type('invalid-email')
    cy.get('[data-cy=password-input]').type('weak')
    cy.get('[data-cy=confirm-password-input]').type('different')

    // Try to submit form with invalid data
    cy.get('[data-cy=register-button]').scrollIntoView().click({ force: true })

    // Check that we stay on the register page
    cy.url().should('include', '/register')

    // Check if validation errors appear (they should be visible after submission attempt)
    cy.get('[data-cy=email-error]').should('be.visible')
    cy.get('[data-cy=password-error]').should('be.visible')
    cy.get('[data-cy=confirm-password-error]').should('be.visible')
  })

  it('should allow valid registration', () => {
    const timestamp = Date.now()
    const testUser = {
      email: `cypress${timestamp}@test.com`,
      password: 'TestPassword123!',
      firstName: 'Cypress',
      lastName: 'Test',
      role: 'user'
    }

    // Fill all required fields
    cy.get('[data-cy=first-name-input]').type(testUser.firstName)
    cy.get('[data-cy=last-name-input]').type(testUser.lastName)
    cy.get('[data-cy=email-input]').type(testUser.email)
    cy.get('[data-cy=password-input]').type(testUser.password)
    cy.get('[data-cy=confirm-password-input]').type(testUser.password)
    cy.get('[data-cy=role-select]').select(testUser.role)
    cy.get('[data-cy=terms-checkbox]').check()

    // Submit form
    cy.get('[data-cy=register-button]').scrollIntoView().click({ force: true })

    // Should redirect to dashboard on success
    cy.url().should('include', '/dashboard', { timeout: 10000 })
    cy.get('[data-cy=welcome-message]').should('contain', 'Bienvenue')
  })
})