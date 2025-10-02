# Slides Backend QuizMaster - Slides 23 à 26

## Slide 23 : Modèles Sequelize & Base de données

### Architecture des données

**8 modèles Sequelize avec relations complexes** :

1. **User** - Utilisateurs (user, trainer, admin)
2. **Quiz** - Quiz créés par les trainers
3. **Question** - Questions associées aux quiz
4. **QuizAttempt** - Tentatives/résultats des quiz
5. **Badge** - Badges de gamification
6. **UserBadge** - Attribution des badges aux users
7. **UserStats** - Statistiques utilisateurs
8. **Subscription** - Abonnements Stripe (Free/Premium)

### Exemple : Modèle User.js

```javascript
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const bcrypt = require('bcryptjs');

const User = sequelize.define('User', {
  id: { type: DataTypes.INTEGER, primaryKey: true, autoIncrement: true },
  email: {
    type: DataTypes.STRING(255),
    allowNull: false,
    unique: true,
    validate: { isEmail: true }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false,
    validate: { len: [6, 255] }
  },
  firstName: { type: DataTypes.STRING(100), allowNull: false },
  lastName: { type: DataTypes.STRING(100), allowNull: false },
  role: {
    type: DataTypes.ENUM('user', 'trainer', 'admin'),
    allowNull: false,
    defaultValue: 'user'
  },
  totalPoints: { type: DataTypes.INTEGER, defaultValue: 0 },
  plan: {
    type: DataTypes.ENUM('free', 'premium'),
    defaultValue: 'free'
  },
  isEmailVerified: { type: DataTypes.BOOLEAN, defaultValue: false },
  verificationCode: { type: DataTypes.STRING(6) },
  verificationCodeExpires: { type: DataTypes.DATE }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        const salt = await bcrypt.genSalt(12);
        user.password = await bcrypt.hash(user.password, salt);
      }
    }
  }
});

// Méthode d'instance pour vérifier le mot de passe
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};
```

### Relations Sequelize (associations)

```javascript
// Dans models/index.js
User.hasMany(Quiz, { foreignKey: 'creatorId', as: 'quizzes' });
Quiz.belongsTo(User, { foreignKey: 'creatorId', as: 'creator' });

User.hasMany(QuizAttempt, { foreignKey: 'userId', as: 'attempts' });
QuizAttempt.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Quiz.hasMany(Question, { foreignKey: 'quizId', as: 'questions' });
Question.belongsTo(Quiz, { foreignKey: 'quizId', as: 'quiz' });

User.hasOne(Subscription, { foreignKey: 'userId', as: 'subscription' });
Subscription.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.belongsToMany(Badge, {
  through: UserBadge,
  foreignKey: 'userId',
  as: 'badges'
});
```

### Migrations & Seeders

- **Migrations Sequelize** : Gestion du schéma de base de données
  - `db:migrate` pour appliquer les migrations
  - Versionnement des modifications de structure
- **Seeders** : Données initiales (admin, quiz de démo)
  - Script `seedDatabase.js` pour peupler la BDD
  - Comptes de test avec rôles pré-définis

---

## Slide 24 : Tests Backend

### Stack de test

**Jest 29.7.0 + Supertest 6.3.3**

```json
{
  "devDependencies": {
    "jest": "^29.7.0",
    "supertest": "^6.3.3"
  },
  "scripts": {
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage"
  }
}
```

### Test auth.test.js (251 lignes)

**Tests de sécurité JWT & RBAC complets** :

```javascript
describe('Authentication Middleware', () => {

  describe('authenticateToken', () => {
    // ✅ Authentification avec token valide
    it('should authenticate valid token and attach user to request', async () => {
      const mockUser = {
        id: 1, email: 'test@example.com', role: 'user', isActive: true
      };

      mockRequest.headers.authorization = 'Bearer valid-token';
      jwt.verify.mockReturnValue({ userId: 1 });
      User.findByPk.mockResolvedValue(mockUser);

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockRequest.user).toEqual(mockUser);
      expect(mockNext).toHaveBeenCalled();
    });

    // ❌ Rejet sans token
    it('should reject request when no token provided', async () => {
      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. No token provided.'
      });
    });

    // ❌ Token expiré
    it('should reject request when token is expired', async () => {
      jwt.verify.mockImplementation(() => {
        const error = new Error('Token expired');
        error.name = 'TokenExpiredError';
        throw error;
      });

      await authenticateToken(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(401);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Token expired.'
      });
    });
  });

  describe('authorizeRoles', () => {
    // ✅ Contrôle d'accès RBAC (Role-Based Access Control)
    it('should allow access when user has authorized role', () => {
      mockRequest.user = { role: 'admin' };
      const middleware = authorizeRoles('admin', 'trainer');

      middleware(mockRequest, mockResponse, mockNext);

      expect(mockNext).toHaveBeenCalled();
    });

    // ❌ Refus d'accès - rôle insuffisant
    it('should deny access when user role is not authorized', () => {
      mockRequest.user = { role: 'user' };
      const middleware = authorizeRoles('admin', 'trainer');

      middleware(mockRequest, mockResponse, mockNext);

      expect(mockResponse.status).toHaveBeenCalledWith(403);
      expect(mockResponse.json).toHaveBeenCalledWith({
        success: false,
        message: 'Access denied. Insufficient permissions.'
      });
    });
  });
});
```

### Test stripeService.test.js (207 lignes)

**Mock complet du Stripe SDK** :

```javascript
// Mock Stripe SDK
jest.mock('stripe', () => {
  return jest.fn(() => ({
    customers: { create: jest.fn() },
    checkout: { sessions: { create: jest.fn() } },
    billingPortal: { sessions: { create: jest.fn() } },
    subscriptions: { retrieve: jest.fn(), update: jest.fn() }
  }));
});

describe('StripeService', () => {
  it('should create a Stripe customer', async () => {
    const mockUser = {
      id: 1, email: 'test@example.com',
      firstName: 'John', lastName: 'Doe'
    };

    const mockCustomer = {
      id: 'cus_123', email: 'test@example.com', name: 'John Doe'
    };

    stripe.customers.create.mockResolvedValue(mockCustomer);

    const result = await StripeService.createCustomer(mockUser);

    expect(stripe.customers.create).toHaveBeenCalledWith({
      email: mockUser.email,
      name: `${mockUser.firstName} ${mockUser.lastName}`,
      metadata: { userId: mockUser.id.toString() }
    });
    expect(result).toEqual(mockCustomer);
  });

  it('should return subscription status for premium user', async () => {
    const mockUser = {
      id: 1, role: 'trainer',
      subscription: {
        plan: 'premium', status: 'active',
        currentPeriodEnd: new Date('2025-12-31'),
        cancelAtPeriodEnd: false
      }
    };

    User.findByPk.mockResolvedValue(mockUser);

    const result = await StripeService.getUserSubscriptionStatus(1);

    expect(result).toMatchObject({
      plan: 'premium', status: 'active',
      isActive: true, canCreateQuiz: true
    });
  });
});
```

### Méthode de mock

- **Sequelize** : `jest.mock('../../models')`
- **JWT** : `jest.mock('jsonwebtoken')`
- **Stripe SDK** : Mock complet de l'API Stripe
- **Isolation** : Chaque test est indépendant avec `beforeEach()`

---

## Slide 25 : Intégration Stripe Backend

### Service stripeService.js

**Service complet pour la monétisation** (284 lignes) :

```javascript
const Stripe = require('stripe');
const { User, Subscription } = require('../models');

const stripe = process.env.STRIPE_SECRET_KEY
  ? Stripe(process.env.STRIPE_SECRET_KEY)
  : null;

class StripeService {

  // 🛒 Création d'une session de paiement Checkout
  static async createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
    try {
      const user = await User.findByPk(userId, {
        include: ['subscription']
      });

      if (!user) {
        throw new Error('User not found');
      }

      // Créer ou récupérer le customer Stripe
      let customerId = user.subscription?.stripeCustomerId;

      if (!customerId) {
        const customer = await this.createCustomer(user);
        customerId = customer.id;

        await Subscription.upsert({
          userId: user.id,
          stripeCustomerId: customerId,
          plan: 'free'
        });
      }

      // Créer la session Checkout
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,  // Prix mensuel/annuel défini dans Stripe
            quantity: 1,
          },
        ],
        mode: 'subscription',
        allow_promotion_codes: true,
        billing_address_collection: 'auto',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: {
          userId: userId.toString()
        }
      });

      return session;
    } catch (error) {
      console.error('Error creating checkout session:', error);
      throw error;
    }
  }

  // 🔄 Traitement des webhooks Stripe
  static async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;

        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.payment_failed':
          await this.handlePaymentFailed(event.data.object);
          break;

        default:
          console.log(`Unhandled event type: ${event.type}`);
      }
    } catch (error) {
      console.error('Error handling webhook:', error);
      throw error;
    }
  }

  // ✅ Activation de l'abonnement Premium
  static async handleCheckoutSessionCompleted(session) {
    const customerId = session.customer;
    const subscriptionId = session.subscription;

    const subscription = await stripe.subscriptions.retrieve(subscriptionId);

    const userSubscription = await Subscription.findOne({
      where: { stripeCustomerId: customerId }
    });

    if (userSubscription) {
      await userSubscription.update({
        stripeSubscriptionId: subscriptionId,
        stripePriceId: subscription.items.data[0].price.id,
        plan: 'premium',
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      });

      // Mettre à jour le plan utilisateur
      await User.update(
        { plan: 'premium' },
        { where: { id: userSubscription.userId } }
      );
    }
  }

  // 👤 Portail de gestion client
  static async createBillingPortalSession(customerId, returnUrl) {
    try {
      const session = await stripe.billingPortal.sessions.create({
        customer: customerId,
        return_url: returnUrl,
      });
      return session;
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      throw error;
    }
  }
}

module.exports = StripeService;
```

### Points clés de l'intégration

**🔐 Conformité PCI DSS** :
- Aucune donnée bancaire stockée côté serveur
- Utilisation de Stripe Checkout (hosted)
- Validation des webhooks avec signature

**💳 Customer Portal** :
- Gestion complète par l'utilisateur (facturation, annulation)
- Accès via `stripe.billingPortal.sessions.create()`

**📊 Plans Free/Premium** :
- **Free** : 5 quiz max pour trainers
- **Premium** : Quiz illimités + analytics avancés
- Gestion via webhooks Stripe (temps réel)

---

## Slide 26 : CI/CD & DevOps Backend

### Pipeline GitHub Actions

**Fichier `.github/workflows/ci.yml`** :

```yaml
name: CI/CD Pipeline

on:
  push:
    branches: [ main, master, develop ]
  pull_request:
    branches: [ main, master ]

env:
  NODE_VERSION: '18'

jobs:
  # ✅ Tests unitaires backend avec MySQL
  backend-test:
    name: Backend Unit Tests
    runs-on: ubuntu-latest

    # Service MySQL conteneurisé pour les tests
    services:
      mysql:
        image: mysql:8.0
        env:
          MYSQL_ROOT_PASSWORD: root
          MYSQL_DATABASE: quizmaster_test
          MYSQL_USER: test_user
          MYSQL_PASSWORD: test_password
        ports:
          - 3306:3306
        options: >-
          --health-cmd="mysqladmin ping"
          --health-interval=10s
          --health-timeout=5s
          --health-retries=3

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}
        cache: 'npm'

    - name: Install dependencies
      working-directory: ./backend
      run: npm ci

    - name: Wait for MySQL
      run: |
        for i in {1..30}; do
          if mysqladmin ping -h 127.0.0.1 -u root -proot --silent; then
            echo "MySQL is ready"
            break
          fi
          echo "Waiting for MySQL... ($i/30)"
          sleep 2
        done

    - name: Run unit tests with coverage
      working-directory: ./backend
      env:
        NODE_ENV: test
        DB_HOST: 127.0.0.1
        DB_PORT: 3306
        DB_NAME: quizmaster_test
        DB_USER: root
        DB_PASSWORD: root
        JWT_SECRET: test-secret-key-for-ci
        BCRYPT_ROUNDS: 4
      run: npm test

  # 🛡️ Scan de sécurité
  security-audit:
    name: Security Audit
    runs-on: ubuntu-latest

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Setup Node.js
      uses: actions/setup-node@v4
      with:
        node-version: ${{ env.NODE_VERSION }}

    - name: Audit backend dependencies
      working-directory: ./backend
      run: npm audit --audit-level=moderate

  # 🐳 Build Docker images
  docker-build:
    name: Docker Build Test
    runs-on: ubuntu-latest
    needs: [backend-test]

    steps:
    - name: Checkout code
      uses: actions/checkout@v4

    - name: Set up Docker Buildx
      uses: docker/setup-buildx-action@v3

    - name: Build backend Docker image
      uses: docker/build-push-action@v5
      with:
        context: ./backend
        push: false
        tags: quizmaster-backend:test
        cache-from: type=gha
        cache-to: type=gha,mode=max
```

### Docker multi-stage avec health checks

**Dockerfile backend** :

```dockerfile
# Multi-stage build pour optimiser la taille de l'image
FROM node:18-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .

# Stage de production
FROM node:18-alpine AS production

# Installation de dumb-init et curl pour les signaux et health checks
RUN apk add --no-cache dumb-init curl

# Création d'un utilisateur non-root (sécurité)
RUN addgroup -g 1001 -S nodejs && \
    adduser -S quizmaster -u 1001

WORKDIR /app

# Installation des dépendances de production uniquement
COPY package*.json ./
RUN npm ci --only=production && npm cache clean --force

# Copie de l'application
COPY --from=builder --chown=quizmaster:nodejs /app .

# Permissions
RUN mkdir -p logs && chown quizmaster:nodejs logs

# Switch vers utilisateur non-root
USER quizmaster

EXPOSE 5000

# Health check pour Docker Swarm / Kubernetes
HEALTHCHECK --interval=30s --timeout=10s --start-period=60s --retries=3 \
  CMD curl -f http://localhost:5000/health || exit 1

# Gestion des signaux avec dumb-init
ENTRYPOINT ["dumb-init", "--"]

CMD ["node", "src/server.js"]
```

### Avantages DevOps

**🔄 CI/CD automatisé** :
- Tests automatiques sur chaque push/PR
- Validation de la sécurité (npm audit)
- Build Docker optimisé

**🏗️ Multi-stage build** :
- Image finale allégée (Alpine Linux)
- Séparat dependencies build/runtime
- Cache des layers Docker

**🔒 Sécurité** :
- Utilisateur non-root dans le conteneur
- Health checks pour orchestration
- Scan des vulnérabilités automatique

**📊 Monitoring** :
- Health endpoint (`/health`)
- Logs structurés
- Prêt pour Kubernetes/Docker Swarm
