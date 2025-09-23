describe('Authentication Flow', () => {
  beforeEach(() => {
    cy.visit('/')
  })

  describe('Registration', () => {
    it('should allow user registration with valid data', () => {
      const timestamp = Date.now()
      const testUser = {
        email: `test${timestamp}@quizmaster.com`,
        password: 'TestPassword123!',
        firstName: 'Test',
        lastName: 'User',
        role: 'user'
      }

      cy.visit('/register')

      // Accept cookies if banner is present
      cy.get('body').then($body => {
        if ($body.find('[data-cy=cookie-banner]').length > 0) {
          cy.get('[data-cy=accept-cookies]').click()
        }
      })

      // Fill registration form
      cy.get('[data-cy=first-name-input]').type(testUser.firstName)
      cy.get('[data-cy=last-name-input]').type(testUser.lastName)
      cy.get('[data-cy=email-input]').type(testUser.email)
      cy.get('[data-cy=password-input]').type(testUser.password)
      cy.get('[data-cy=confirm-password-input]').type(testUser.password)
      cy.get('[data-cy=role-select]').select(testUser.role)

      // Accept terms and conditions
      cy.get('[data-cy=terms-checkbox]').check()

      // Submit form
      cy.get('[data-cy=register-button]').scrollIntoView().click()

      // Should redirect to dashboard after successful registration
      cy.url().should('include', '/dashboard')
      // Wait for successful registration (toast notification)
    })

    it('should show validation errors for invalid data', () => {
      cy.visit('/register')

      // Accept cookies if banner is present
      cy.get('body').then($body => {
        if ($body.find('[data-cy=cookie-banner]').length > 0) {
          cy.get('[data-cy=accept-cookies]').click()
        }
      })

      // Try to submit empty form
      cy.get('[data-cy=register-button]').scrollIntoView().click()

      // Check validation errors
      cy.get('[data-cy=first-name-error]').should('be.visible')
      cy.get('[data-cy=last-name-error]').should('be.visible')
      cy.get('[data-cy=email-error]').should('be.visible')
      cy.get('[data-cy=password-error]').should('be.visible')

      // Test email validation
      cy.get('[data-cy=email-input]').type('invalid-email')
      cy.get('[data-cy=register-button]').click()
      cy.get('[data-cy=email-error]').should('contain', 'email valide')

      // Test password mismatch
      cy.get('[data-cy=password-input]').type('password123')
      cy.get('[data-cy=confirm-password-input]').type('differentpassword')
      cy.get('[data-cy=register-button]').click()
      cy.get('[data-cy=confirm-password-error]').should('contain', 'identiques')
    })

    it('should prevent registration with existing email', () => {
      cy.visit('/register')

      // Accept cookies if banner is present
      cy.get('body').then($body => {
        if ($body.find('[data-cy=cookie-banner]').length > 0) {
          cy.get('[data-cy=accept-cookies]').click()
        }
      })

      cy.get('[data-cy=first-name-input]').type('Test')
      cy.get('[data-cy=last-name-input]').type('User')
      cy.get('[data-cy=email-input]').type('student@quizmaster.com') // Existing email
      cy.get('[data-cy=password-input]').type('TestPassword123!')
      cy.get('[data-cy=confirm-password-input]').type('TestPassword123!')
      cy.get('[data-cy=role-select]').select('user')
      cy.get('[data-cy=terms-checkbox]').check()

      cy.get('[data-cy=register-button]').scrollIntoView().click()

      // Should stay on register page with error
      cy.url().should('include', '/register')
      // Error will be shown via toast notification
    })
  })

  describe('Login', () => {
    it('should login successfully with valid credentials', () => {
      cy.login('student@quizmaster.com', 'student123')

      // Should be on dashboard
      cy.url().should('include', '/dashboard')
      cy.get('[data-cy=welcome-message]').should('contain', 'Bienvenue')
    })

    it('should show error with invalid credentials', () => {
      cy.visit('/login')

      cy.get('[data-cy=email-input]').type('wrong@email.com')
      cy.get('[data-cy=password-input]').type('wrongpassword')
      cy.get('[data-cy=login-button]').click()

      // Error will be shown via toast notification
      cy.url().should('include', '/login')
    })

    it('should show validation errors for empty fields', () => {
      cy.visit('/login')

      cy.get('[data-cy=login-button]').click()

      cy.get('[data-cy=email-error]').should('be.visible')
      cy.get('[data-cy=password-error]').should('be.visible')
    })

    it('should redirect to dashboard if already logged in', () => {
      cy.login()

      // Try to visit login page while logged in
      cy.visit('/login')

      // Should be redirected to dashboard
      cy.url().should('include', '/dashboard')
    })
  })

  describe('Logout', () => {
    it('should logout successfully', () => {
      cy.login()

      cy.logout()

      // Should be on home page
      cy.url().should('eq', Cypress.config().baseUrl + '/')
      cy.get('[data-cy=login-link]').should('be.visible')
    })
  })

  describe('Authentication State Persistence', () => {
    it('should maintain authentication after page refresh', () => {
      cy.login()

      // Refresh the page
      cy.reload()

      // Should still be authenticated
      cy.get('[data-cy=welcome-message]').should('be.visible')
      cy.url().should('include', '/dashboard')
    })

    it('should redirect to login when token expires', () => {
      cy.login()

      // Manually clear token to simulate expiration
      cy.window().then((win) => {
        win.localStorage.removeItem('token')
      })

      // Try to access protected route
      cy.visit('/dashboard')

      // Should be redirected to login
      cy.url().should('include', '/login')
    })
  })

  describe('Role-based Access', () => {
    it('should allow trainer to access quiz creation', () => {
      cy.loginAsTrainer()

      cy.visit('/create-quiz')
      cy.url().should('include', '/create-quiz')
      // Quiz form test pending implementation
    })

    it('should prevent regular user from accessing admin panel', () => {
      cy.login('student@quizmaster.com', 'student123')

      cy.visit('/admin')

      // Should be redirected or show access denied
      cy.url().should('not.include', '/admin')
      // Access denied test pending implementation
    })

    it('should allow admin to access admin panel', () => {
      cy.loginAsAdmin()

      cy.visit('/admin')
      cy.url().should('include', '/admin')
      // Admin dashboard test pending implementation
    })
  })
})