describe('Quiz Flow', () => {
  describe('Quiz Creation (Trainer)', () => {
    beforeEach(() => {
      cy.loginAsTrainer()
    })

    it('should create a quiz successfully', () => {
      const quiz = {
        title: 'Test Quiz Cypress',
        description: 'Quiz créé pour les tests E2E',
        category: 'Programming',
        difficulty: 'medium',
        timeLimit: 15
      }

      cy.visit('/create-quiz')

      // Fill quiz details
      cy.get('[data-cy=quiz-title]').type(quiz.title)
      cy.get('[data-cy=quiz-description]').type(quiz.description)
      cy.get('[data-cy=quiz-category]').select(quiz.category)
      cy.get('[data-cy=quiz-difficulty]').select(quiz.difficulty)
      cy.get('[data-cy=quiz-time-limit]').clear().type(quiz.timeLimit.toString())

      // Add first question
      cy.get('[data-cy=question-text-0]').type('Quelle est la syntaxe correcte pour déclarer une variable en JavaScript ?')
      cy.get('[data-cy=question-option-0-0]').type('var myVar = value;')
      cy.get('[data-cy=question-option-0-1]').type('let myVar = value;')
      cy.get('[data-cy=question-option-0-2]').type('const myVar = value;')
      cy.get('[data-cy=question-option-0-3]').type('Toutes les réponses ci-dessus')
      cy.get('[data-cy=correct-answer-0]').select('3')
      cy.get('[data-cy=question-explanation-0]').type('En JavaScript, var, let et const sont toutes des façons valides de déclarer des variables.')

      // Add second question
      cy.get('[data-cy=add-question]').click()
      cy.get('[data-cy=question-text-1]').type('Que signifie API ?')
      cy.get('[data-cy=question-option-1-0]').type('Application Programming Interface')
      cy.get('[data-cy=question-option-1-1]').type('Automated Program Integration')
      cy.get('[data-cy=question-option-1-2]').type('Advanced Programming Implementation')
      cy.get('[data-cy=question-option-1-3]').type('Application Process Integration')
      cy.get('[data-cy=correct-answer-1]').select('0')

      // Save quiz
      cy.get('[data-cy=save-quiz]').click()

      // Verify success
      cy.get('[data-cy=success-message]').should('contain', 'Quiz créé avec succès')
      cy.url().should('include', '/dashboard')
    })

    it('should validate required fields', () => {
      cy.visit('/create-quiz')

      cy.get('[data-cy=save-quiz]').click()

      cy.get('[data-cy=title-error]').should('be.visible')
      cy.get('[data-cy=description-error]').should('be.visible')
    })

    it('should enforce quiz creation limits for free users', () => {
      // This test would check the freemium model
      // Create 5 quizzes then try to create a 6th
      cy.visit('/create-quiz')

      // Mock having reached the limit
      cy.window().then((win) => {
        win.localStorage.setItem('quizCount', '5')
        win.localStorage.setItem('userPlan', 'free')
      })

      cy.reload()

      // Should show upgrade message
      cy.get('[data-cy=upgrade-banner]').should('be.visible')
      cy.get('[data-cy=upgrade-banner]').should('contain', 'limite atteinte')
    })
  })

  describe('Quiz Taking (Student)', () => {
    let createdQuiz

    before(() => {
      // Create a test quiz via API
      cy.apiLogin('trainer@quizmaster.com', 'trainer123').then((trainerData) => {
        const quizData = {
          title: 'Quiz E2E Test',
          description: 'Quiz pour tester la prise de quiz',
          category: 'Programming',
          difficulty: 'easy',
          timeLimit: 5,
          isPublished: true,
          questions: [
            {
              question: 'Combien font 2 + 2 ?',
              options: ['3', '4', '5', '6'],
              correctAnswer: 1,
              explanation: '2 + 2 = 4'
            },
            {
              question: 'Quelle est la couleur du ciel ?',
              options: ['Rouge', 'Vert', 'Bleu', 'Jaune'],
              correctAnswer: 2,
              explanation: 'Le ciel est généralement bleu.'
            }
          ]
        }

        cy.apiCreateQuiz(quizData, trainerData.token).then((quiz) => {
          createdQuiz = quiz
        })
      })
    })

    beforeEach(() => {
      cy.login('student@quizmaster.com', 'student123')
    })

    it('should display available quizzes on dashboard', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=quiz-list]').should('be.visible')
      cy.get('[data-cy=quiz-card]').should('have.length.greaterThan', 0)
    })

    it('should start and complete a quiz', () => {
      cy.visit('/dashboard')

      // Find and click on our test quiz
      cy.get('[data-cy=quiz-card]').contains('Quiz E2E Test').click()

      // Should be on quiz taking page
      cy.url().should('include', '/quiz/')
      cy.get('[data-cy=quiz-title]').should('contain', 'Quiz E2E Test')

      // Start quiz
      cy.get('[data-cy=start-quiz]').click()

      // Answer first question
      cy.get('[data-cy=question-title]').should('contain', 'Combien font 2 + 2')
      cy.get('[data-cy=option-1]').click() // Answer "4"
      cy.get('[data-cy=next-question]').click()

      // Answer second question
      cy.get('[data-cy=question-title]').should('contain', 'couleur du ciel')
      cy.get('[data-cy=option-2]').click() // Answer "Bleu"
      cy.get('[data-cy=submit-quiz]').click()

      // Verify results
      cy.get('[data-cy=quiz-results]').should('be.visible')
      cy.get('[data-cy=score]').should('contain', '100%') // Both answers correct
      cy.get('[data-cy=points-earned]').should('be.visible')
      cy.get('[data-cy=new-badges]').should('exist') // Might have new badges
    })

    it('should handle quiz timer', () => {
      cy.visit(`/quiz/${createdQuiz.id}`)

      cy.get('[data-cy=start-quiz]').click()

      // Timer should be visible and counting down
      cy.get('[data-cy=timer]').should('be.visible')
      cy.get('[data-cy=timer]').should('contain', '04:')

      // Wait for some time
      cy.wait(2000)

      // Timer should have decreased
      cy.get('[data-cy=timer]').should('not.contain', '05:00')
    })

    it('should auto-submit when time runs out', () => {
      // This would require mocking the timer or using a very short time limit
      cy.visit(`/quiz/${createdQuiz.id}`)

      // Mock timer running out
      cy.window().then((win) => {
        win.postMessage({ type: 'TIMER_EXPIRED' }, '*')
      })

      // Should auto-submit and show results
      cy.get('[data-cy=quiz-results]').should('be.visible')
      cy.get('[data-cy=timeout-message]').should('contain', 'temps écoulé')
    })
  })

  describe('Quiz Statistics and Gamification', () => {
    beforeEach(() => {
      cy.login('student@quizmaster.com', 'student123')
    })

    it('should display user progress and badges', () => {
      cy.visit('/dashboard')

      // Check user progress section
      cy.get('[data-cy=user-progress]').should('be.visible')
      cy.get('[data-cy=user-level]').should('be.visible')
      cy.get('[data-cy=total-points]').should('be.visible')
      cy.get('[data-cy=progress-bar]').should('be.visible')

      // Check badges section
      cy.get('[data-cy=user-badges]').should('be.visible')
    })

    it('should show leaderboards', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=leaderboard-tab]').click()

      cy.get('[data-cy=global-leaderboard]').should('be.visible')
      cy.get('[data-cy=leaderboard-entry]').should('have.length.greaterThan', 0)

      // Test category filter
      cy.get('[data-cy=category-filter]').select('Programming')
      cy.get('[data-cy=category-leaderboard]').should('be.visible')
    })

    it('should award points and badges after quiz completion', () => {
      // Get initial points
      cy.visit('/dashboard')
      cy.get('[data-cy=total-points]').then(($points) => {
        const initialPoints = parseInt($points.text())

        // Take a quiz
        cy.get('[data-cy=quiz-card]').first().click()
        cy.get('[data-cy=start-quiz]').click()

        // Complete quiz quickly for speed bonus
        cy.get('[data-cy=option-0]').click()
        cy.get('[data-cy=next-question]').click()
        cy.get('[data-cy=option-0]').click()
        cy.get('[data-cy=submit-quiz]').click()

        // Check if points increased
        cy.get('[data-cy=points-earned]').should('be.visible')
        cy.get('[data-cy=points-earned]').should('not.contain', '0')

        // Check for potential new badges
        cy.get('[data-cy=new-badges]').should('exist')
      })
    })
  })

  describe('Quiz Management (Trainer)', () => {
    beforeEach(() => {
      cy.loginAsTrainer()
    })

    it('should edit existing quiz', () => {
      cy.visit('/dashboard')

      // Find a quiz to edit
      cy.get('[data-cy=my-quizzes]').should('be.visible')
      cy.get('[data-cy=edit-quiz]').first().click()

      // Should be on edit page
      cy.url().should('include', '/edit-quiz/')

      // Modify quiz
      cy.get('[data-cy=quiz-title]').clear().type('Quiz Modifié E2E')
      cy.get('[data-cy=quiz-description]').clear().type('Description modifiée')

      cy.get('[data-cy=save-quiz]').click()

      cy.get('[data-cy=success-message]').should('contain', 'Quiz mis à jour')
    })

    it('should delete quiz', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=my-quizzes]').should('be.visible')

      // Count initial quizzes
      cy.get('[data-cy=quiz-card]').then(($quizzes) => {
        const initialCount = $quizzes.length

        // Delete first quiz
        cy.get('[data-cy=delete-quiz]').first().click()
        cy.get('[data-cy=confirm-delete]').click()

        // Should have one less quiz
        cy.get('[data-cy=quiz-card]').should('have.length', initialCount - 1)
        cy.get('[data-cy=success-message]').should('contain', 'Quiz supprimé')
      })
    })

    it('should view quiz analytics', () => {
      cy.visit('/dashboard')

      cy.get('[data-cy=quiz-analytics]').first().click()

      // Should show analytics page
      cy.get('[data-cy=analytics-dashboard]').should('be.visible')
      cy.get('[data-cy=participation-stats]').should('be.visible')
      cy.get('[data-cy=success-rate]').should('be.visible')
      cy.get('[data-cy=average-time]').should('be.visible')
    })
  })
})