# 🏗 Architecture QuizMaster - Guide Technique

## Table des Matières
1. [Vue d'Ensemble](#vue-densemble)
2. [Architecture Globale](#architecture-globale)
3. [Frontend Architecture](#frontend-architecture)
4. [Backend Architecture](#backend-architecture)
5. [Base de Données](#base-de-données)
6. [Patterns & Bonnes Pratiques](#patterns--bonnes-pratiques)
7. [Flux de Données](#flux-de-données)
8. [Sécurité](#sécurité)

---

## Vue d'Ensemble

QuizMaster suit une **architecture client-serveur** moderne avec séparation complète du frontend et backend.

### Stack Technique

```
┌─────────────────────────────────────────┐
│           PRESENTATION LAYER            │
│   Vue 3 + Vite + Tailwind + Pinia      │
└────────────────┬────────────────────────┘
                 │ HTTP/REST
                 │ (Axios)
┌────────────────┴────────────────────────┐
│          APPLICATION LAYER              │
│      Express.js + Middleware            │
└────────────────┬────────────────────────┘
                 │ ORM
                 │ (Sequelize)
┌────────────────┴────────────────────────┐
│            DATA LAYER                   │
│            MySQL 8.0                    │
└─────────────────────────────────────────┘
```

### Principes de Conception

✅ **Separation of Concerns** - Séparation claire des responsabilités
✅ **DRY** - Don't Repeat Yourself
✅ **SOLID** - Principes orientés objet
✅ **RESTful API** - Standard d'API
✅ **Stateless** - Backend sans état (JWT)
✅ **Scalable** - Architecture modulaire évolutive

---

## Architecture Globale

### Diagramme de Composants

```
┌───────────────────────────────────────────────────────────┐
│                     CLIENT (Browser)                       │
│  ┌───────────────────────────────────────────────────┐   │
│  │              Vue.js SPA                            │   │
│  │  ┌─────────┐  ┌─────────┐  ┌──────────┐         │   │
│  │  │ Views   │  │ Stores  │  │ Services │         │   │
│  │  └────┬────┘  └────┬────┘  └─────┬────┘         │   │
│  │       │            │              │               │   │
│  │       └────────────┴──────────────┘               │   │
│  │                    │                               │   │
│  │              Vue Router                            │   │
│  └───────────────────┼────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │
                  HTTP/REST
                  (port 3000)
                     │
┌────────────────────┼──────────────────────────────────────┐
│                EXPRESS API SERVER (port 5000)             │
│  ┌──────────────────────────────────────────────────┐    │
│  │            Middleware Layer                       │    │
│  │  ┌────────┐ ┌────────┐ ┌────────┐ ┌────────┐   │    │
│  │  │ Auth   │ │ CORS   │ │ Helmet │ │ Rate   │   │    │
│  │  │        │ │        │ │        │ │ Limit  │   │    │
│  │  └────────┘ └────────┘ └────────┘ └────────┘   │    │
│  └──────────────────┬────────────────────────────────┘    │
│                     │                                      │
│  ┌──────────────────┴────────────────────────────────┐   │
│  │              Routes                                │   │
│  │  /api/auth  /api/quizzes  /api/subscription      │   │
│  └──────────────────┬────────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────┴────────────────────────────────┐   │
│  │             Controllers                            │   │
│  │  Handle business logic & HTTP responses           │   │
│  └──────────────────┬────────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────┴────────────────────────────────┐   │
│  │              Services                              │   │
│  │  EmailService  StripeService  GamificationService │   │
│  └──────────────────┬────────────────────────────────┘   │
│                     │                                      │
│  ┌──────────────────┴────────────────────────────────┐   │
│  │              Models (ORM)                          │   │
│  │  User  Quiz  Question  Badge  Subscription        │   │
│  └──────────────────┬────────────────────────────────┘   │
└────────────────────┼──────────────────────────────────────┘
                     │
              Sequelize ORM
                     │
┌────────────────────┼──────────────────────────────────────┐
│                  MYSQL 8.0                                 │
│                (port 3307)                                 │
└────────────────────────────────────────────────────────────┘

      ┌──────────────────────────────────┐
      │   EXTERNAL SERVICES               │
      │  ┌────────┐  ┌────────┐          │
      │  │ Stripe │  │SendGrid│          │
      │  └────────┘  └────────┘          │
      └──────────────────────────────────┘
```

---

## Frontend Architecture

### Structure des Dossiers

```
frontend/src/
├── assets/              # Ressources statiques
│   ├── css/            # Styles globaux
│   ├── images/         # Images
│   └── locales/        # Fichiers de traduction (i18n)
│       ├── en.json
│       └── fr.json
│
├── components/          # Composants réutilisables
│   ├── AnalyticsCharts.vue
│   ├── BadgeDisplay.vue
│   ├── CookieBanner.vue
│   ├── Leaderboard.vue
│   ├── QuestionForm.vue
│   ├── QuizCard.vue
│   ├── QuizList.vue
│   └── UserProgress.vue
│
├── directives/          # Directives Vue personnalisées
│   └── tooltip.js
│
├── i18n/               # Configuration i18n
│   └── index.js
│
├── plugins/            # Plugins Vue
│   └── toast.js
│
├── router/             # Configuration routing
│   └── index.js        # Routes + Guards
│
├── services/           # Services API
│   └── api.js          # Axios instance + Endpoints
│
├── stores/             # Pinia stores (State Management)
│   ├── auth.js         # Authentication state
│   ├── language.js     # i18n state
│   └── theme.js        # Theme state
│
├── views/              # Pages/Vues
│   ├── Home.vue
│   ├── Login.vue
│   ├── Register.vue
│   ├── Dashboard.vue
│   ├── QuizTaking.vue
│   ├── QuizCreation.vue
│   ├── AdminDashboard.vue
│   └── ...
│
├── App.vue             # Composant racine
└── main.js             # Point d'entrée
```

### Architecture par Couches

#### 1. **Presentation Layer** (Views)
- Composants Vue responsables du rendu UI
- Utilisent les composants réutilisables
- S'abonnent aux stores Pinia

```vue
<template>
  <div class="dashboard">
    <UserProgress :user="authStore.user" />
    <QuizList :quizzes="quizzes" />
  </div>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth'
const authStore = useAuthStore()
</script>
```

#### 2. **State Management** (Pinia Stores)
- Gestion centralisée de l'état
- Pattern Composition API
- Computed properties réactives

```javascript
// stores/auth.js
export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(null)

  const isAuthenticated = computed(() => !!token.value)

  const login = async (credentials) => { /* ... */ }

  return { user, token, isAuthenticated, login }
})
```

#### 3. **Services Layer**
- Communication avec le backend
- Gestion des requêtes HTTP (Axios)
- Interception et gestion d'erreurs

```javascript
// services/api.js
export const quizAPI = {
  getAll: () => axios.get('/api/quizzes'),
  getById: (id) => axios.get(`/api/quizzes/${id}`),
  create: (data) => axios.post('/api/quizzes', data),
}
```

### Routing & Navigation Guards

```javascript
router.beforeEach((to, from, next) => {
  const authStore = useAuthStore()

  // Vérifier l'authentification
  if (to.meta.requiresAuth && !authStore.isAuthenticated) {
    next('/login')
    return
  }

  // Vérifier les permissions de rôle
  if (to.meta.requiresAdmin && !authStore.isAdmin) {
    next('/dashboard')
    return
  }

  next()
})
```

---

## Backend Architecture

### Structure des Dossiers

```
backend/src/
├── config/                 # Configuration
│   ├── database.js        # Sequelize config
│   └── swagger.js         # Swagger/OpenAPI config
│
├── controllers/            # Contrôleurs
│   ├── authController.js
│   ├── quizController.js
│   ├── userController.js
│   ├── adminController.js
│   ├── subscriptionController.js
│   ├── analyticsController.js
│   └── statsController.js
│
├── middleware/             # Middleware Express
│   ├── auth.js            # Authentication
│   ├── validation.js      # Input validation
│   ├── subscription.js    # Plan checks
│   └── errorHandler.js    # Error handling
│
├── models/                 # Modèles Sequelize
│   ├── index.js           # Associations
│   ├── User.js
│   ├── Quiz.js
│   ├── Question.js
│   ├── QuizAttempt.js
│   ├── Badge.js
│   ├── UserBadge.js
│   ├── UserStats.js
│   └── Subscription.js
│
├── routes/                 # Routes Express
│   ├── auth.js
│   ├── quizzes.js
│   ├── users.js
│   ├── admin.js
│   ├── gamification.js
│   ├── analytics.js
│   ├── subscription.js
│   └── stats.js
│
├── services/               # Services métier
│   ├── emailService.js
│   ├── stripeService.js
│   └── gamificationService.js
│
├── seeds/                  # Seeders
│   └── badgeSeeder.js
│
├── utils/                  # Utilitaires
│   ├── seedDatabase.js
│   └── codeGenerator.js
│
└── server.js               # Point d'entrée
```

### Architecture MVC

#### 1. **Routes**
Définissent les endpoints et les middlewares

```javascript
// routes/quizzes.js
router.post('/',
  authenticateToken,              // Auth middleware
  authorizeRoles('trainer'),      // Role middleware
  validateQuizCreation,           // Validation middleware
  quizController.createQuiz       // Controller
);
```

#### 2. **Controllers**
Gèrent la logique HTTP et les réponses

```javascript
// controllers/quizController.js
const createQuiz = async (req, res, next) => {
  try {
    const quiz = await Quiz.create({
      ...req.body,
      createdBy: req.user.id
    });

    res.status(201).json({
      success: true,
      data: quiz
    });
  } catch (error) {
    next(error);
  }
};
```

#### 3. **Models**
Définissent la structure des données

```javascript
// models/Quiz.js
const Quiz = sequelize.define('Quiz', {
  title: { type: DataTypes.STRING, allowNull: false },
  description: DataTypes.TEXT,
  difficulty: DataTypes.ENUM('easy', 'medium', 'hard'),
  // ...
});
```

#### 4. **Services**
Logique métier complexe

```javascript
// services/stripeService.js
class StripeService {
  static async createCheckoutSession(userId, priceId) {
    // Business logic for payment
  }
}
```

### Middleware Pipeline

```
Request
   ↓
[Helmet] → Sécurité headers
   ↓
[CORS] → Cross-Origin
   ↓
[Rate Limiter] → Anti-DDoS
   ↓
[Body Parser] → Parse JSON
   ↓
[Auth] → JWT validation
   ↓
[Authorization] → Role check
   ↓
[Validation] → Input validation
   ↓
[Controller] → Business logic
   ↓
[Response] → JSON response
   ↓
[Error Handler] → Catch errors
```

---

## Base de Données

### Schéma ER (Entity-Relationship)

```
┌─────────────┐         ┌─────────────┐
│    User     │         │    Badge    │
├─────────────┤         ├─────────────┤
│ id (PK)     │         │ id (PK)     │
│ email       │         │ name        │
│ password    │         │ description │
│ firstName   │         │ icon        │
│ lastName    │         │ points      │
│ role        │         └─────────────┘
│ isActive    │               ↑
│ plan        │               │ M:N
└──────┬──────┘               │
       │                ┌─────┴──────┐
       │                │ UserBadge  │
       │                ├────────────┤
       │                │ userId(FK) │
       │                │ badgeId(FK)│
       │                │ earnedAt   │
       │                └────────────┘
       │
       │ 1:N
       │
┌──────┴──────┐         ┌─────────────────┐
│    Quiz     │    1:N  │   Question      │
├─────────────┤─────────├─────────────────┤
│ id (PK)     │         │ id (PK)         │
│ title       │         │ quizId (FK)     │
│ description │         │ questionText    │
│ difficulty  │         │ options (JSON)  │
│ createdBy   │←┐       │ correctAnswer   │
│ isPublished │ │       │ points          │
└─────────────┘ │       └─────────────────┘
                │
                │ 1:N
                │
         ┌──────┴──────────┐
         │  QuizAttempt    │
         ├─────────────────┤
         │ id (PK)         │
         │ userId (FK)     │
         │ quizId (FK)     │
         │ score           │
         │ answers (JSON)  │
         │ completedAt     │
         └─────────────────┘

┌────────────────┐
│ Subscription   │
├────────────────┤
│ id (PK)        │
│ userId (FK)    │←─── 1:1 avec User
│ plan           │
│ status         │
│ stripeId       │
│ currentPeriod  │
└────────────────┘
```

### Associations Sequelize

```javascript
// models/index.js

// User → Quiz (1:N)
User.hasMany(Quiz, { foreignKey: 'createdBy' });
Quiz.belongsTo(User, { foreignKey: 'createdBy' });

// Quiz → Question (1:N)
Quiz.hasMany(Question, { foreignKey: 'quizId' });
Question.belongsTo(Quiz, { foreignKey: 'quizId' });

// User → QuizAttempt (1:N)
User.hasMany(QuizAttempt);
QuizAttempt.belongsTo(User);

// Quiz → QuizAttempt (1:N)
Quiz.hasMany(QuizAttempt);
QuizAttempt.belongsTo(Quiz);

// User ← → Badge (M:N via UserBadge)
User.belongsToMany(Badge, { through: UserBadge });
Badge.belongsToMany(User, { through: UserBadge });

// User → Subscription (1:1)
User.hasOne(Subscription);
Subscription.belongsTo(User);
```

---

## Patterns & Bonnes Pratiques

### 1. **Repository Pattern** (Implicite avec Sequelize)

```javascript
// Sequelize agit comme repository
const users = await User.findAll({ where: { isActive: true } });
```

### 2. **Service Pattern**

```javascript
// Service pour logique métier complexe
class GamificationService {
  static async awardBadge(userId, badgeId) {
    // Complex business logic
  }
}
```

### 3. **Middleware Pattern**

```javascript
// Chaînage de middlewares
app.use(helmet());
app.use(cors());
app.use(authenticateToken);
```

### 4. **Error Handling Pattern**

```javascript
// Custom Error Class
class AppError extends Error {
  constructor(message, statusCode) {
    super(message);
    this.statusCode = statusCode;
  }
}

// Global Error Handler
app.use((err, req, res, next) => {
  const { statusCode = 500, message } = err;
  res.status(statusCode).json({ success: false, message });
});
```

### 5. **Validation Pattern**

```javascript
// Input validation avec express-validator
const validateQuiz = [
  body('title').trim().isLength({ min: 3, max: 200 }),
  body('difficulty').isIn(['easy', 'medium', 'hard']),
  // ...
];
```

### 6. **Composition API** (Vue 3)

```javascript
// Réutilisabilité via composables
export function useQuizzes() {
  const quizzes = ref([]);
  const loading = ref(false);

  const fetchQuizzes = async () => {
    loading.value = true;
    quizzes.value = await quizAPI.getAll();
    loading.value = false;
  };

  return { quizzes, loading, fetchQuizzes };
}
```

---

## Flux de Données

### Exemple: Soumettre un Quiz

```
1. USER ACTION
   QuizTaking.vue
   ↓ submitQuiz()

2. STORE ACTION
   quizStore.submitAttempt(answers)
   ↓ commit mutation

3. API CALL
   api.post('/api/quizzes/123/attempts', { answers })
   ↓ HTTP Request

4. BACKEND MIDDLEWARE
   authenticateToken → authorizeRoles → validate
   ↓

5. CONTROLLER
   quizController.submitAttempt()
   ↓ Business logic

6. SERVICE (optional)
   gamificationService.checkBadges()
   ↓

7. MODEL
   QuizAttempt.create({ userId, quizId, score, answers })
   ↓ Sequelize ORM

8. DATABASE
   INSERT INTO quiz_attempts ...
   ↓ SQL Query

9. RESPONSE
   { success: true, data: { score: 85, badges: [...] } }
   ↓ JSON

10. FRONTEND UPDATE
    Store updates state → Vue reactivity → UI update
```

---

## Sécurité

### Couches de Sécurité

```
┌────────────────────────────────────────┐
│  1. Transport Layer (HTTPS/TLS)       │
└───────────────┬────────────────────────┘
                │
┌───────────────┴────────────────────────┐
│  2. Application Layer                  │
│     - Helmet (Security Headers)        │
│     - CORS (Cross-Origin)              │
│     - Rate Limiting                    │
└───────────────┬────────────────────────┘
                │
┌───────────────┴────────────────────────┐
│  3. Authentication Layer               │
│     - JWT Tokens                       │
│     - Password Hashing (bcrypt)        │
└───────────────┬────────────────────────┘
                │
┌───────────────┴────────────────────────┐
│  4. Authorization Layer                │
│     - Role-Based Access Control        │
│     - Permission Checks                │
└───────────────┬────────────────────────┘
                │
┌───────────────┴────────────────────────┐
│  5. Data Layer                         │
│     - Input Validation                 │
│     - SQL Injection Prevention (ORM)   │
│     - XSS Protection                   │
└────────────────────────────────────────┘
```

### Authentification Flow

```
┌────────┐                                    ┌────────┐
│ Client │                                    │ Server │
└───┬────┘                                    └───┬────┘
    │                                             │
    │  POST /api/auth/login                      │
    │  { email, password }                       │
    ├──────────────────────────────────────────→ │
    │                                             │
    │                                    Verify credentials
    │                                    bcrypt.compare()
    │                                             │
    │                                    Generate JWT
    │                                    jwt.sign({ userId })
    │                                             │
    │  { token, user }                           │
    │ ←──────────────────────────────────────────┤
    │                                             │
    │  Store token (localStorage)                │
    │                                             │
    │  GET /api/quizzes                          │
    │  Authorization: Bearer <token>             │
    ├──────────────────────────────────────────→ │
    │                                             │
    │                                    Verify JWT
    │                                    jwt.verify(token)
    │                                             │
    │                                    Load user
    │                                    User.findByPk()
    │                                             │
    │  { data: [...quizzes] }                    │
    │ ←──────────────────────────────────────────┤
    │                                             │
```

---

## Scalabilité

### Stratégies de Mise à l'Échelle

1. **Horizontal Scaling** - Load Balancer + Multiple instances
2. **Caching** - Redis pour sessions/tokens
3. **CDN** - Assets statiques
4. **Database Replication** - Read replicas
5. **Microservices** - Séparation des services (future)

### Performance Optimizations

- **Frontend**: Code splitting, Lazy loading, Compression
- **Backend**: Database indexes, Query optimization, Connection pooling
- **Infrastructure**: Docker, Kubernetes, CI/CD

---

## Conclusion

L'architecture de QuizMaster est conçue pour être :
- ✅ **Maintenable** - Code organisé et documenté
- ✅ **Scalable** - Architecture modulaire
- ✅ **Secure** - Multiples couches de sécurité
- ✅ **Testable** - Tests unitaires et E2E
- ✅ **Performante** - Optimisations multiples

Pour plus de détails techniques, consultez:
- [README.md](README.md) - Guide complet
- [API Documentation](http://localhost:5000/api-docs) - Swagger
- [SECURITY_AUDIT_REPORT.md](SECURITY_AUDIT_REPORT.md) - Audit sécurité
