# 🔧 Guide de Dépannage QuizMaster

## Problèmes Courants et Solutions

### 1. Erreur CSP (Content Security Policy)

**Symptôme:**
```
Refused to load the stylesheet 'https://fonts.googleapis.com/...'
because it violates CSP directive
```

**Solution:**
Le CSP dans `frontend/index.html` est commenté pour le développement.

Pour la production, décommenter et ajuster:
```html
<meta http-equiv="Content-Security-Policy" content="
  default-src 'self';
  script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com;
  style-src 'self' 'unsafe-inline' https://fonts.googleapis.com;
  font-src 'self' data: https://fonts.gstatic.com;
  connect-src 'self' http://localhost:5000 https://api.stripe.com;
  frame-src https://js.stripe.com;
" />
```

---

### 2. Network Error / Connexion API

**Symptôme:**
```
Login error: AxiosError {message: 'Network Error'}
```

**Causes possibles:**

#### A. Backend pas démarré

**Vérifier:**
```bash
curl http://localhost:5000/health
```

**Démarrer le backend:**
```bash
# Avec Docker
docker-compose up -d

# Ou manuellement
cd backend
npm run dev
```

#### B. Mauvaise URL API

**Vérifier `frontend/.env`:**
```env
VITE_API_URL=http://localhost:5000/api
```

**Vérifier `frontend/src/services/api.js`:**
```javascript
baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

#### C. CORS bloqué

**Vérifier `backend/src/server.js`:**
```javascript
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  credentials: true
}));
```

**Vérifier `backend/.env`:**
```env
CORS_ORIGIN=http://localhost:3000
```

---

### 3. Port déjà utilisé

**Symptôme:**
```
Error: Port 3000 is already in use
Error: Port 5000 is already in use
```

**Solution Windows:**
```bash
# Trouver le processus
netstat -ano | findstr :3000
netstat -ano | findstr :5000

# Tuer le processus (remplacer PID)
taskkill /PID <PID> /F
```

**Ou changer les ports:**
```env
# frontend/.env
VITE_PORT=3001

# backend/.env
PORT=5001
```

---

### 4. Base de données non accessible

**Symptôme:**
```
SequelizeConnectionError: Access denied for user
```

**Solution:**

#### A. Avec Docker
```bash
# Vérifier que MySQL tourne
docker-compose ps

# Restart MySQL
docker-compose restart mysql

# Vérifier les logs
docker-compose logs mysql
```

#### B. Manuel
```bash
# Vérifier connexion
mysql -h localhost -P 3307 -u quizmaster_user -p

# Si erreur, recréer la DB
cd backend
npm run db:create
npm run db:migrate
npm run seed
```

---

### 5. Token JWT expiré

**Symptôme:**
```
401 Unauthorized: Token expired
```

**Solution:**
```javascript
// Dans la console du navigateur
localStorage.removeItem('token');
localStorage.removeItem('user');

// Puis se reconnecter
```

---

### 6. Stripe webhook ne fonctionne pas

**Symptôme:**
```
Webhook signature verification failed
```

**Solution:**

En développement, utiliser Stripe CLI:
```bash
# Installer Stripe CLI
# https://stripe.com/docs/stripe-cli

# Écouter les webhooks
stripe listen --forward-to localhost:5000/api/subscription/webhook

# Récupérer le webhook secret
stripe listen --print-secret

# Ajouter à backend/.env
STRIPE_WEBHOOK_SECRET=whsec_...
```

---

### 7. Emails SendGrid non envoyés

**Symptôme:**
```
Error sending verification email
```

**Solution:**

1. Vérifier la clé API SendGrid dans `backend/.env`:
```env
SENDGRID_API_KEY=SG.votre_cle_api
SENDGRID_FROM_EMAIL=votre-email-verifie@example.com
```

2. Vérifier l'email expéditeur est vérifié sur SendGrid

3. Tester l'envoi:
```bash
cd backend
npm run test-sendgrid
```

---

### 8. Docker Compose ne démarre pas

**Symptôme:**
```
Error: Cannot connect to Docker daemon
```

**Solution:**

1. **Vérifier Docker Desktop est lancé**

2. **Rebuild les images:**
```bash
docker-compose down
docker-compose build --no-cache
docker-compose up -d
```

3. **Vérifier les logs:**
```bash
docker-compose logs -f
```

---

### 9. Tests Cypress échouent

**Symptôme:**
```
Timed out waiting for element
```

**Solution:**

1. **Vérifier l'application tourne:**
```bash
# Frontend
npm run dev  # http://localhost:3000

# Backend
npm run dev  # http://localhost:5000
```

2. **Lancer Cypress en mode interactif:**
```bash
cd frontend
npm run cypress:open
```

3. **Vérifier les sélecteurs data-cy:**
```vue
<button data-cy="login-button">Login</button>
```

---

### 10. Build Vite échoue

**Symptôme:**
```
Error: Cannot find module ...
```

**Solution:**

1. **Nettoyer et réinstaller:**
```bash
cd frontend
rm -rf node_modules package-lock.json
npm install
```

2. **Vérifier les imports:**
```javascript
// Utiliser @ pour src/
import Component from '@/components/Component.vue'
```

3. **Build:**
```bash
npm run build
```

---

## Commandes Utiles

### Démarrage Complet

```bash
# Avec Docker (recommandé)
docker-compose up -d
# Frontend: http://localhost:3000
# Backend: http://localhost:5000
# PhpMyAdmin: http://localhost:8080

# Manuel
# Terminal 1 - Backend
cd backend
npm run dev

# Terminal 2 - Frontend
cd frontend
npm run dev
```

### Réinitialisation Complète

```bash
# Arrêter tout
docker-compose down -v

# Nettoyer
rm -rf frontend/node_modules backend/node_modules
rm -rf frontend/dist backend/dist

# Réinstaller
cd frontend && npm install
cd ../backend && npm install

# Redémarrer
docker-compose up -d
```

### Logs

```bash
# Docker
docker-compose logs -f api
docker-compose logs -f mysql

# Backend manuel
cd backend
npm run dev  # Logs en temps réel
```

### Tests

```bash
# Frontend unitaires
cd frontend
npm run test

# Frontend E2E
npm run cypress:open  # Mode interactif
npm run cypress:run   # Mode headless

# Backend
cd backend
npm test
```

---

## Variables d'Environnement Requises

### Backend `.env`
```env
NODE_ENV=development
PORT=5000
DB_HOST=localhost
DB_PORT=3307
DB_NAME=quizmaster_db
DB_USER=quizmaster_user
DB_PASSWORD=quizmaster_password
JWT_SECRET=your-secret-key
CORS_ORIGIN=http://localhost:3000
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG....
```

### Frontend `.env`
```env
VITE_API_URL=http://localhost:5000/api
VITE_APP_NAME=QuizMaster
```

---

## Comptes de Test

Voir `DEMO_CREDENTIALS.md` pour les identifiants.

---

## Support

Si le problème persiste:
1. Vérifier les logs: `docker-compose logs`
2. Vérifier la console navigateur (F12)
3. Consulter la documentation: `README.md`
4. Vérifier le rapport: `RAPPORT_SOUTENANCE.md`
