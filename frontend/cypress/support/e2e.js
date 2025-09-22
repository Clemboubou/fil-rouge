// ***********************************************************
// This example support/e2e.js is processed and
// loaded automatically before your test files.
//
// This is a great place to put global configuration and
// behavior that modifies Cypress.
//
// You can change the location of this file or turn off
// automatically serving support files with the
// 'supportFile' configuration option.
//
// You can read more here:
// https://on.cypress.io/configuration
// ***********************************************************

// Import commands.js using ES2015 syntax:
import './commands'

// Alternatively you can use CommonJS syntax:
// require('./commands')

// Add custom commands for QuizMaster
Cypress.Commands.add('login', (email = 'student@quizmaster.com', password = 'student123') => {
  cy.visit('/login')
  cy.get('[data-cy=email-input]').type(email)
  cy.get('[data-cy=password-input]').type(password)
  cy.get('[data-cy=login-button]').click()
  cy.url().should('include', '/dashboard')
  cy.get('[data-cy=user-menu]').should('be.visible')
})

Cypress.Commands.add('loginAsTrainer', () => {
  cy.login('trainer@quizmaster.com', 'trainer123')
})

Cypress.Commands.add('loginAsAdmin', () => {
  cy.login('admin@quizmaster.com', 'admin123')
})

Cypress.Commands.add('logout', () => {
  cy.get('[data-cy=user-menu]').click()
  cy.get('[data-cy=logout-button]').click()
  cy.url().should('eq', Cypress.config().baseUrl + '/')
})

Cypress.Commands.add('acceptCookies', () => {
  cy.get('[data-cy=cookie-banner]').should('be.visible')
  cy.get('[data-cy=accept-cookies]').click()
  cy.get('[data-cy=cookie-banner]').should('not.exist')
})

Cypress.Commands.add('createTestQuiz', (quizData = {}) => {
  const defaultQuiz = {
    title: 'Test Quiz E2E',
    description: 'Quiz créé pour les tests automatisés',
    category: 'Programming',
    difficulty: 'medium',
    timeLimit: 10,
    questions: [
      {
        question: 'Quelle est la capital de la France ?',
        options: ['Paris', 'Londres', 'Berlin', 'Madrid'],
        correctAnswer: 0,
        explanation: 'Paris est la capitale de la France'
      }
    ]
  }

  const quiz = { ...defaultQuiz, ...quizData }

  cy.visit('/create-quiz')
  cy.get('[data-cy=quiz-title]').type(quiz.title)
  cy.get('[data-cy=quiz-description]').type(quiz.description)
  cy.get('[data-cy=quiz-category]').select(quiz.category)
  cy.get('[data-cy=quiz-difficulty]').select(quiz.difficulty)
  cy.get('[data-cy=quiz-time-limit]').clear().type(quiz.timeLimit.toString())

  quiz.questions.forEach((question, index) => {
    if (index > 0) {
      cy.get('[data-cy=add-question]').click()
    }

    cy.get(`[data-cy=question-text-${index}]`).type(question.question)
    question.options.forEach((option, optionIndex) => {
      cy.get(`[data-cy=question-option-${index}-${optionIndex}]`).type(option)
    })
    cy.get(`[data-cy=correct-answer-${index}]`).select(question.correctAnswer.toString())
    if (question.explanation) {
      cy.get(`[data-cy=question-explanation-${index}]`).type(question.explanation)
    }
  })

  cy.get('[data-cy=save-quiz]').click()
  cy.get('[data-cy=success-message]').should('contain', 'Quiz créé avec succès')

  return cy.wrap(quiz)
})

// Global error handling
Cypress.on('uncaught:exception', (err, runnable) => {
  // Ignore specific errors that don't affect test functionality
  if (err.message.includes('ResizeObserver loop limit exceeded')) {
    return false
  }

  if (err.message.includes('Non-Error promise rejection captured')) {
    return false
  }

  // Let other errors fail the test
  return true
})

// Before each test, clear cookies and localStorage
beforeEach(() => {
  cy.clearCookies()
  cy.clearLocalStorage()

  // Set up test environment
  cy.window().then((win) => {
    win.localStorage.setItem('cypress-test', 'true')
  })
})