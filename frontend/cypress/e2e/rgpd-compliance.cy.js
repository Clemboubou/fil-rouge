describe('RGPD Compliance', () => {
  describe('Cookie Banner', () => {
    beforeEach(() => {
      cy.clearCookies()
      cy.clearLocalStorage()
    })

    it('should display cookie banner on first visit', () => {
      cy.visit('/')

      cy.get('[data-cy=cookie-banner]').should('be.visible')
      cy.get('[data-cy=cookie-banner]').should('contain', 'cookies')
      cy.get('[data-cy=accept-cookies]').should('be.visible')
      cy.get('[data-cy=essential-only]').should('be.visible')
    })

    it('should accept all cookies', () => {
      cy.visit('/')

      cy.get('[data-cy=cookie-banner]').should('be.visible')
      cy.get('[data-cy=accept-cookies]').click()

      // Banner should disappear
      cy.get('[data-cy=cookie-banner]').should('not.exist')

      // Cookies should be set
      cy.getCookie('cookie_consent').should('exist')
      cy.getCookie('cookie_preferences').should('exist')
    })

    it('should accept essential cookies only', () => {
      cy.visit('/')

      cy.get('[data-cy=cookie-banner]').should('be.visible')
      cy.get('[data-cy=essential-only]').click()

      // Banner should disappear
      cy.get('[data-cy=cookie-banner]').should('not.exist')

      // Only essential cookies should be allowed
      cy.getCookie('cookie_consent').should('exist')
      cy.window().then((win) => {
        const prefs = JSON.parse(win.localStorage.getItem('cookie_preferences') || '{}')
        expect(prefs.analytics).to.be.false
        expect(prefs.marketing).to.be.false
      })
    })

    it('should show detailed cookie settings', () => {
      cy.visit('/')

      cy.get('[data-cy=cookie-banner]').should('be.visible')
      cy.get('[data-cy=cookie-details]').click()

      // Should show detailed settings
      cy.get('[data-cy=analytics-toggle]').should('be.visible')
      cy.get('[data-cy=marketing-toggle]').should('be.visible')
      cy.get('[data-cy=essential-info]').should('contain', 'Toujours actifs')
    })

    it('should customize cookie preferences', () => {
      cy.visit('/')

      cy.get('[data-cy=cookie-banner]').should('be.visible')
      cy.get('[data-cy=cookie-details]').click()

      // Disable analytics, enable marketing
      cy.get('[data-cy=analytics-toggle]').uncheck()
      cy.get('[data-cy=marketing-toggle]').check()

      cy.get('[data-cy=accept-selected]').click()

      // Banner should disappear
      cy.get('[data-cy=cookie-banner]').should('not.exist')

      // Preferences should be saved
      cy.window().then((win) => {
        const prefs = JSON.parse(win.localStorage.getItem('cookie_preferences') || '{}')
        expect(prefs.analytics).to.be.false
        expect(prefs.marketing).to.be.true
      })
    })

    it('should not show banner on subsequent visits if consent given', () => {
      cy.visit('/')
      cy.acceptCookies()

      // Reload page
      cy.reload()

      // Banner should not appear
      cy.get('[data-cy=cookie-banner]').should('not.exist')
    })
  })

  describe('Privacy Policy Page', () => {
    it('should display comprehensive privacy policy', () => {
      cy.visit('/privacy')

      // Check main sections
      cy.get('h1').should('contain', 'Politique de Confidentialité')
      cy.get('[data-cy=last-updated]').should('be.visible')

      // Check navigation menu
      cy.get('[data-cy=privacy-nav]').should('be.visible')
      cy.get('[data-cy=nav-data-collection]').should('be.visible')
      cy.get('[data-cy=nav-your-rights]').should('be.visible')

      // Check sections exist
      cy.get('#data-collection').should('exist')
      cy.get('#data-usage').should('exist')
      cy.get('#cookies').should('exist')
      cy.get('#your-rights').should('exist')
      cy.get('#contact').should('exist')
    })

    it('should allow cookie preferences management', () => {
      cy.visit('/privacy')

      cy.get('[data-cy=manage-cookies]').click()

      // Should trigger cookie banner
      cy.get('[data-cy=cookie-banner]').should('be.visible')
    })

    it('should provide GDPR rights exercise options', () => {
      cy.visit('/privacy')

      // Check data access request
      cy.get('[data-cy=request-data-access]').should('be.visible')
      cy.get('[data-cy=request-data-access]').click()

      cy.get('[data-cy=confirmation-modal]').should('be.visible')
      cy.get('[data-cy=confirmation-modal]').should('contain', 'données personnelles')
      cy.get('[data-cy=confirm-request]').click()

      cy.get('[data-cy=success-message]').should('contain', '48h')
    })

    it('should handle data export request', () => {
      cy.login('student@quizmaster.com', 'student123')
      cy.visit('/privacy')

      cy.get('[data-cy=request-data-export]').click()

      cy.get('[data-cy=confirmation-modal]').should('be.visible')
      cy.get('[data-cy=confirm-request]').click()

      cy.get('[data-cy=success-message]').should('contain', 'export')
    })

    it('should handle data deletion request', () => {
      cy.login('student@quizmaster.com', 'student123')
      cy.visit('/privacy')

      cy.get('[data-cy=request-data-deletion]').click()

      cy.get('[data-cy=confirmation-modal]').should('be.visible')
      cy.get('[data-cy=confirmation-modal]').should('contain', 'irréversible')
      cy.get('[data-cy=confirm-request]').click()

      cy.get('[data-cy=success-message]').should('contain', 'suppression')
    })
  })

  describe('Data Processing Transparency', () => {
    it('should clearly explain data collection during registration', () => {
      cy.visit('/register')

      // Should have link to privacy policy
      cy.get('[data-cy=privacy-link]').should('be.visible')
      cy.get('[data-cy=privacy-link]').should('have.attr', 'href', '/privacy')

      // Should have clear terms acceptance
      cy.get('[data-cy=terms-checkbox]').should('be.visible')
      cy.get('[data-cy=terms-text]').should('contain', 'Politique de Confidentialité')
    })

    it('should show data processing notice on quiz taking', () => {
      cy.login('student@quizmaster.com', 'student123')
      cy.visit('/dashboard')

      cy.get('[data-cy=quiz-card]').first().click()

      // Should inform about data processing for quiz results
      cy.get('[data-cy=data-processing-notice]').should('be.visible')
      cy.get('[data-cy=data-processing-notice]').should('contain', 'résultats')
    })

    it('should provide clear contact information for DPO', () => {
      cy.visit('/privacy')

      cy.get('[data-cy=dpo-contact]').should('be.visible')
      cy.get('[data-cy=dpo-email]').should('contain', 'dpo@quizmaster.com')
      cy.get('[data-cy=cnil-info]').should('be.visible')
    })
  })

  describe('Cookie Management', () => {
    beforeEach(() => {
      cy.login('student@quizmaster.com', 'student123')
    })

    it('should allow revoking consent from privacy page', () => {
      // First accept cookies
      cy.acceptCookies()

      cy.visit('/privacy')
      cy.get('[data-cy=revoke-consent]').click()

      cy.get('[data-cy=confirmation-modal]').should('be.visible')
      cy.get('[data-cy=confirm-request]').click()

      // Cookie banner should appear again
      cy.get('[data-cy=cookie-banner]').should('be.visible')
    })

    it('should allow updating cookie preferences', () => {
      cy.acceptCookies()

      cy.visit('/privacy')
      cy.get('[data-cy=manage-cookies]').click()

      // Change preferences
      cy.get('[data-cy=analytics-toggle]').uncheck()
      cy.get('[data-cy=accept-selected]').click()

      // Preferences should be updated
      cy.window().then((win) => {
        const prefs = JSON.parse(win.localStorage.getItem('cookie_preferences') || '{}')
        expect(prefs.analytics).to.be.false
      })
    })
  })

  describe('Accessibility Compliance', () => {
    it('should meet basic accessibility standards', () => {
      cy.visit('/privacy')

      // Check basic accessibility
      cy.checkAccessibility()

      // Check keyboard navigation
      cy.get('body').tab()
      cy.focused().should('be.visible')

      // Check skip link
      cy.get('[data-cy=skip-to-main]').should('exist')

      // Check heading structure
      cy.get('h1').should('have.length', 1)
      cy.get('h2').should('have.length.greaterThan', 0)
    })

    it('should be responsive across devices', () => {
      cy.visit('/privacy')

      cy.checkResponsive()
    })
  })

  describe('Legal Compliance', () => {
    it('should display required legal information', () => {
      cy.visit('/privacy')

      // Check required GDPR elements
      cy.get('[data-cy=data-controller]').should('be.visible')
      cy.get('[data-cy=legal-basis]').should('be.visible')
      cy.get('[data-cy=retention-period]').should('be.visible')
      cy.get('[data-cy=data-protection-officer]').should('be.visible')
      cy.get('[data-cy=supervisory-authority]').should('be.visible')
    })

    it('should provide audit trail for consent', () => {
      cy.visit('/')

      // Accept cookies
      cy.get('[data-cy=accept-cookies]').click()

      // Check if consent is logged
      cy.window().then((win) => {
        // Check if consent event was fired
        cy.wrap(win).should('have.property', 'consentLogged', true)
      })
    })
  })
})