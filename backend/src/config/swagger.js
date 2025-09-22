const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuizMaster API',
      version: '1.0.0',
      description: `
        API complète pour la plateforme QuizMaster - Une solution gamifiée de quiz et d'évaluation.

        ## Fonctionnalités principales :
        - 🎯 **Gamification** : Système de points, badges et niveaux
        - 🔒 **Authentification** : JWT avec rôles (user, trainer, admin)
        - 📊 **Analytics** : Métriques détaillées pour formateurs
        - 💰 **Monetisation** : Intégration Stripe avec plans freemium
        - 📱 **RGPD** : Conformité complète avec gestion des consentements

        ## Utilisation :
        1. Créer un compte avec \`POST /auth/register\`
        2. Se connecter avec \`POST /auth/login\`
        3. Utiliser le token JWT dans l'header \`Authorization: Bearer <token>\`
        4. Explorer les quiz avec \`GET /quizzes\`
        5. Participer aux quiz avec \`POST /quizzes/{id}/attempts\`

        ## Codes de statut :
        - **200** : Succès
        - **201** : Créé avec succès
        - **400** : Erreur de validation
        - **401** : Non authentifié
        - **403** : Accès refusé
        - **404** : Ressource non trouvée
        - **429** : Trop de requêtes (rate limiting)
        - **500** : Erreur serveur
      `,
      contact: {
        name: 'Support QuizMaster',
        email: 'support@quizmaster.com',
        url: 'https://quizmaster.com/support'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:5000/api',
        description: 'Serveur de développement'
      },
      {
        url: 'https://staging-api.quizmaster.com/api',
        description: 'Serveur de staging'
      },
      {
        url: 'https://api.quizmaster.com/api',
        description: 'Serveur de production'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
          description: 'Token JWT obtenu via l\'endpoint de login'
        }
      },
      schemas: {
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Identifiant unique de l\'utilisateur'
            },
            email: {
              type: 'string',
              format: 'email',
              description: 'Adresse email de l\'utilisateur'
            },
            firstName: {
              type: 'string',
              description: 'Prénom de l\'utilisateur'
            },
            lastName: {
              type: 'string',
              description: 'Nom de famille de l\'utilisateur'
            },
            role: {
              type: 'string',
              enum: ['user', 'trainer', 'admin'],
              description: 'Rôle de l\'utilisateur dans le système'
            },
            totalPoints: {
              type: 'integer',
              description: 'Total des points accumulés'
            },
            plan: {
              type: 'string',
              enum: ['free', 'premium'],
              description: 'Plan d\'abonnement de l\'utilisateur'
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              description: 'Date de création du compte'
            }
          }
        },
        Quiz: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              description: 'Identifiant unique du quiz'
            },
            title: {
              type: 'string',
              description: 'Titre du quiz'
            },
            description: {
              type: 'string',
              description: 'Description détaillée du quiz'
            },
            category: {
              type: 'string',
              enum: ['Programming', 'Frontend', 'Backend', 'DevOps', 'Design', 'Marketing'],
              description: 'Catégorie du quiz'
            },
            difficulty: {
              type: 'string',
              enum: ['easy', 'medium', 'hard'],
              description: 'Niveau de difficulté'
            },
            timeLimit: {
              type: 'integer',
              description: 'Limite de temps en minutes'
            },
            isPublished: {
              type: 'boolean',
              description: 'Statut de publication du quiz'
            },
            creatorId: {
              type: 'integer',
              description: 'ID du créateur du quiz'
            },
            questionCount: {
              type: 'integer',
              description: 'Nombre de questions dans le quiz'
            },
            createdAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Question: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            question: {
              type: 'string',
              description: 'Texte de la question'
            },
            options: {
              type: 'array',
              items: {
                type: 'string'
              },
              description: 'Liste des options de réponse'
            },
            correctAnswer: {
              type: 'integer',
              description: 'Index de la réponse correcte (0-3)'
            },
            explanation: {
              type: 'string',
              description: 'Explication de la réponse correcte'
            },
            points: {
              type: 'integer',
              description: 'Points attribués pour cette question'
            }
          }
        },
        QuizAttempt: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            },
            quizId: {
              type: 'integer'
            },
            answers: {
              type: 'array',
              items: {
                type: 'integer'
              },
              description: 'Réponses données par l\'utilisateur'
            },
            score: {
              type: 'number',
              format: 'float',
              description: 'Score obtenu (0-100)'
            },
            pointsEarned: {
              type: 'integer',
              description: 'Points gagnés pour cette tentative'
            },
            timeTaken: {
              type: 'integer',
              description: 'Temps pris en secondes'
            },
            completedAt: {
              type: 'string',
              format: 'date-time'
            }
          }
        },
        Badge: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            name: {
              type: 'string',
              description: 'Nom du badge'
            },
            description: {
              type: 'string',
              description: 'Description du badge'
            },
            icon: {
              type: 'string',
              description: 'Icône du badge (emoji)'
            },
            condition: {
              type: 'string',
              description: 'Condition pour obtenir le badge'
            }
          }
        },
        Subscription: {
          type: 'object',
          properties: {
            id: {
              type: 'integer'
            },
            userId: {
              type: 'integer'
            },
            plan: {
              type: 'string',
              enum: ['free', 'premium']
            },
            status: {
              type: 'string',
              enum: ['active', 'canceled', 'past_due', 'unpaid', 'trialing']
            },
            currentPeriodEnd: {
              type: 'string',
              format: 'date-time'
            },
            cancelAtPeriodEnd: {
              type: 'boolean'
            }
          }
        },
        ApiResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              description: 'Indique si la requête a réussi'
            },
            message: {
              type: 'string',
              description: 'Message descriptif'
            },
            data: {
              type: 'object',
              description: 'Données de la réponse'
            }
          }
        },
        ApiError: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            message: {
              type: 'string',
              description: 'Message d\'erreur'
            },
            error: {
              type: 'object',
              description: 'Détails de l\'erreur'
            }
          }
        },
        PaginatedResponse: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: true
            },
            data: {
              type: 'object',
              properties: {
                items: {
                  type: 'array',
                  description: 'Liste des éléments'
                },
                pagination: {
                  type: 'object',
                  properties: {
                    page: {
                      type: 'integer',
                      description: 'Page actuelle'
                    },
                    limit: {
                      type: 'integer',
                      description: 'Nombre d\'éléments par page'
                    },
                    total: {
                      type: 'integer',
                      description: 'Nombre total d\'éléments'
                    },
                    pages: {
                      type: 'integer',
                      description: 'Nombre total de pages'
                    }
                  }
                }
              }
            }
          }
        }
      },
      parameters: {
        PageParam: {
          name: 'page',
          in: 'query',
          description: 'Numéro de page (défaut: 1)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            default: 1
          }
        },
        LimitParam: {
          name: 'limit',
          in: 'query',
          description: 'Nombre d\'éléments par page (défaut: 10, max: 100)',
          required: false,
          schema: {
            type: 'integer',
            minimum: 1,
            maximum: 100,
            default: 10
          }
        },
        CategoryParam: {
          name: 'category',
          in: 'query',
          description: 'Filtrer par catégorie',
          required: false,
          schema: {
            type: 'string',
            enum: ['Programming', 'Frontend', 'Backend', 'DevOps', 'Design', 'Marketing']
          }
        },
        DifficultyParam: {
          name: 'difficulty',
          in: 'query',
          description: 'Filtrer par difficulté',
          required: false,
          schema: {
            type: 'string',
            enum: ['easy', 'medium', 'hard']
          }
        }
      }
    },
    security: [
      {
        bearerAuth: []
      }
    ],
    tags: [
      {
        name: 'Authentication',
        description: '🔐 Gestion de l\'authentification et des comptes utilisateurs'
      },
      {
        name: 'Quizzes',
        description: '📝 Gestion des quiz et questions'
      },
      {
        name: 'Gamification',
        description: '🎯 Système de points, badges et classements'
      },
      {
        name: 'Analytics',
        description: '📊 Statistiques et analytics pour formateurs'
      },
      {
        name: 'Subscription',
        description: '💰 Gestion des abonnements et paiements Stripe'
      },
      {
        name: 'Users',
        description: '👥 Gestion des utilisateurs (admin)'
      },
      {
        name: 'Statistics',
        description: '📈 Statistiques globales et personnelles'
      }
    ]
  },
  apis: [
    './src/routes/*.js',
    './src/controllers/*.js',
    './src/models/*.js'
  ],
};

const specs = swaggerJsdoc(options);

const swaggerConfig = {
  swaggerDefinition: specs,
  customCss: `
    .swagger-ui .topbar { display: none; }
    .swagger-ui .info { margin: 50px 0; }
    .swagger-ui .info .title { color: #2563eb; }
    .swagger-ui .scheme-container { background: #f8fafc; padding: 15px; border-radius: 5px; }
  `,
  customSiteTitle: 'QuizMaster API Documentation',
  customfavIcon: '🎯'
};

module.exports = {
  specs,
  swaggerUi,
  swaggerConfig
};