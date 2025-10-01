# 🔐 Guide de Vérification Email - QuizMaster

## 📋 Vue d'ensemble

QuizMaster utilise maintenant un système de vérification par email en **2 étapes** pour sécuriser les inscriptions :

1. **Étape 1** : L'utilisateur remplit le formulaire d'inscription
2. **Étape 2** : Un code à 6 chiffres est envoyé par email que l'utilisateur doit saisir pour activer son compte

## 🎯 Fonctionnalités

✅ Code à 6 chiffres généré aléatoirement
✅ Expiration automatique après 15 minutes
✅ Possibilité de renvoyer le code (cooldown de 60 secondes)
✅ Email HTML professionnel avec design responsive
✅ Compte inactif tant que l'email n'est pas vérifié
✅ Email de bienvenue envoyé après vérification réussie

## 🔧 Architecture Technique

### Backend

#### 1. Modèle User (`backend/src/models/User.js`)

Nouvelles colonnes ajoutées :

```javascript
{
  isEmailVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  verificationCode: {
    type: DataTypes.STRING(6),
    allowNull: true
  },
  verificationCodeExpires: {
    type: DataTypes.DATE,
    allowNull: true
  }
}
```

#### 2. Générateur de Code (`backend/src/utils/codeGenerator.js`)

```javascript
generateVerificationCode()       // Génère un code 6 chiffres
getVerificationCodeExpiry()      // Retourne expiration (15 min)
isVerificationCodeExpired(date)  // Vérifie si code expiré
```

#### 3. Service Email (`backend/src/services/emailService.js`)

**sendVerificationEmail(user, code)**
- Envoie un email HTML avec le code de vérification
- Template professionnel avec design gradient
- Code affiché en grand format (48px)
- Warnings sur l'expiration et la sécurité

**sendWelcomeEmail(user)**
- Envoyé après vérification réussie
- Contenu adapté au rôle (trainer/student)

#### 4. Contrôleur Auth (`backend/src/controllers/authController.js`)

**register(req, res)**
- Crée un utilisateur avec `isActive: false`
- Génère et stocke le code de vérification
- Envoie l'email de vérification
- Retourne `requiresVerification: true`
- Si l'email échoue, supprime l'utilisateur créé

**verifyEmail(req, res)**
- Vérifie le code et l'email
- Vérifie que le code n'est pas expiré
- Active le compte (`isActive: true`, `isEmailVerified: true`)
- Génère le token JWT
- Envoie l'email de bienvenue
- Retourne user + token

**resendVerificationCode(req, res)**
- Génère un nouveau code
- Met à jour l'expiration
- Renvoie l'email

#### 5. Routes (`backend/src/routes/auth.js`)

```javascript
POST /api/auth/register          // Inscription (étape 1)
POST /api/auth/verify-email      // Vérification code (étape 2)
POST /api/auth/resend-verification  // Renvoyer le code
```

### Frontend

#### Page Register.vue

**Étape 1 : Formulaire d'inscription**
- Champs : firstName, lastName, email, password, confirmPassword, role
- Validation complète
- Soumission → API `/auth/register`
- Si succès : affiche étape 2

**Étape 2 : Vérification du code**
- Champ de saisie du code (6 chiffres, numérique uniquement)
- Bouton "Vérifier le code"
- Bouton "Renvoyer le code" avec cooldown de 60s
- Bouton "Retour au formulaire"
- Soumission → API `/auth/verify-email`
- Si succès : stocke token + user, redirige vers dashboard

## 📧 Format de l'Email de Vérification

**Sujet** : `Code de vérification QuizMaster - [CODE]`

**Contenu** :
- Header avec logo QuizMaster
- Salutation personnalisée
- Code affiché en grand format dans une box colorée
- Warnings :
  - Expiration dans 15 minutes
  - Ne pas partager le code
  - Ignorer si pas demandé
- Footer avec informations légales

## 🔒 Sécurité

1. **Code aléatoire** : 6 chiffres générés aléatoirement (100 000 à 999 999)
2. **Expiration** : Le code expire après 15 minutes
3. **Compte inactif** : Le compte ne peut pas se connecter tant que l'email n'est pas vérifié
4. **Cooldown** : 60 secondes entre chaque renvoi de code
5. **Validation** : Le code doit correspondre exactement (case-sensitive pour l'email)

## 🧪 Test du Système

### Prérequis

1. **Configurer SendGrid** (voir `SENDGRID_CONFIGURATION.md`)
2. Vérifier que `SENDGRID_API_KEY` est dans `.env`
3. Vérifier que l'expéditeur est vérifié dans SendGrid

### Scénario de Test Complet

#### Test 1 : Inscription Normale

1. Aller sur `/register`
2. Remplir le formulaire avec votre email Outlook
3. Cliquer sur "Créer mon compte"
4. Vérifier que la page affiche "📧 Vérification Email"
5. Ouvrir votre boîte Outlook
6. Copier le code à 6 chiffres
7. Coller le code dans le champ de vérification
8. Cliquer sur "Vérifier le code"
9. Vérifier la redirection vers `/dashboard`
10. Vérifier la réception de l'email de bienvenue

#### Test 2 : Code Expiré

1. S'inscrire avec un email
2. Attendre 15 minutes
3. Essayer de vérifier avec le code
4. Vérifier l'erreur "Code expiré"
5. Cliquer sur "Renvoyer le code"
6. Vérifier le nouveau code dans l'email
7. Vérifier avec le nouveau code

#### Test 3 : Mauvais Code

1. S'inscrire avec un email
2. Entrer un code incorrect (ex: 123456)
3. Vérifier l'erreur "Code invalide"
4. Entrer le bon code
5. Vérifier le succès

#### Test 4 : Renvoyer le Code

1. S'inscrire avec un email
2. Cliquer sur "Renvoyer le code"
3. Vérifier le cooldown de 60s
4. Vérifier la réception du nouveau code
5. Vérifier avec le nouveau code

## 📊 Flux de Données

```
┌─────────────┐
│   Frontend  │
│  Register   │
└──────┬──────┘
       │ POST /auth/register
       │ { email, password, firstName, lastName, role }
       ▼
┌─────────────────────────────┐
│    Backend Controller       │
│  1. Créer user (inactive)   │
│  2. Générer code (6 digits) │
│  3. Sauver code + expiry    │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────────────────────┐
│    Email Service            │
│  SendGrid envoie email      │
│  avec code de vérification  │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│  User Email │  ← Code: 123456
└──────┬──────┘
       │ Utilisateur copie le code
       ▼
┌─────────────┐
│   Frontend  │
│ Verification│
└──────┬──────┘
       │ POST /auth/verify-email
       │ { email, code: "123456" }
       ▼
┌─────────────────────────────┐
│    Backend Controller       │
│  1. Vérifier code           │
│  2. Vérifier expiration     │
│  3. Activer compte          │
│  4. Générer JWT token       │
│  5. Envoyer email bienvenue │
└──────┬──────────────────────┘
       │
       ▼
┌─────────────┐
│   Frontend  │
│  Dashboard  │  ← User connecté !
└─────────────┘
```

## 🗄️ Structure de la Base de Données

**Table `users`** - Nouvelles colonnes :

| Colonne | Type | Défaut | Description |
|---------|------|--------|-------------|
| `isEmailVerified` | BOOLEAN | false | Email vérifié ou non |
| `verificationCode` | VARCHAR(6) | NULL | Code temporaire |
| `verificationCodeExpires` | DATETIME | NULL | Date d'expiration du code |

## 🚀 Déploiement en Production

### Checklist

- [ ] Configurer SendGrid avec un vrai domaine (pas de free tier)
- [ ] Configurer SPF, DKIM, DMARC pour éviter les spams
- [ ] Utiliser un expéditeur vérifié professionnel (ex: noreply@votredomaine.com)
- [ ] Augmenter le quota d'emails SendGrid
- [ ] Configurer les logs d'emails
- [ ] Mettre en place monitoring des emails non délivrés
- [ ] Tester avec différents fournisseurs email (Gmail, Outlook, Yahoo)
- [ ] Configurer rate limiting sur `/auth/verify-email` et `/auth/resend-verification`

### Variables d'Environnement Production

```env
# SendGrid
SENDGRID_API_KEY=SG.votre_cle_production
SENDGRID_FROM_EMAIL=noreply@votredomaine.com
SENDGRID_FROM_NAME=QuizMaster

# Frontend URL (pour les emails)
CORS_ORIGIN=https://votredomaine.com
```

## 🐛 Dépannage

### Problème : Email non reçu

**Solutions** :
1. Vérifier les spams/courrier indésirable
2. Vérifier que l'expéditeur est vérifié dans SendGrid
3. Vérifier SendGrid Activity pour voir le statut
4. Vérifier que `SENDGRID_API_KEY` est correcte
5. Vérifier les logs backend pour erreurs d'envoi

### Problème : "Code invalide"

**Solutions** :
1. Vérifier que le code n'est pas expiré (15 min)
2. Vérifier qu'il n'y a pas d'espaces avant/après le code
3. Vérifier que c'est bien le dernier code envoyé
4. Essayer de renvoyer un nouveau code

### Problème : "Code expiré"

**Solutions** :
1. Cliquer sur "Renvoyer le code"
2. Utiliser le nouveau code reçu par email

### Problème : Compte créé mais pas d'email

**Solutions** :
1. Vérifier les logs backend
2. L'utilisateur a été supprimé si l'email a échoué (voir code controller)
3. Réessayer l'inscription

## 💡 Pour la Démo au Jury

### Points à présenter

1. **Sécurité renforcée**
   - Vérification email obligatoire
   - Protection contre les faux comptes
   - Code temporaire avec expiration

2. **UX optimale**
   - Interface en 2 étapes claire
   - Feedback visuel (cooldown, erreurs)
   - Possibilité de renvoyer le code
   - Design professionnel des emails

3. **Architecture professionnelle**
   - Séparation des responsabilités
   - Service email réutilisable
   - Gestion d'erreurs robuste
   - Code expirable pour sécurité

4. **Démo en direct**
   - Montrer l'inscription
   - Ouvrir Outlook en temps réel
   - Montrer l'email de vérification
   - Entrer le code
   - Montrer l'email de bienvenue
   - Afficher le dashboard

### Script de Démo

```
"Notre application utilise un système de vérification par email en 2 étapes
pour sécuriser les inscriptions.

[Ouvrir /register]
Lorsqu'un utilisateur s'inscrit...
[Remplir le formulaire]

Il reçoit immédiatement un code à 6 chiffres par email...
[Montrer l'email dans Outlook]

Le code est affiché de manière claire et professionnelle.
Il expire après 15 minutes pour des raisons de sécurité.

[Copier le code]
L'utilisateur entre simplement le code...
[Entrer le code]

Et son compte est activé !
[Montrer le dashboard]

Il reçoit ensuite un email de bienvenue personnalisé.
[Montrer l'email de bienvenue]

Si le code expire, pas de problème : un simple clic permet
d'en recevoir un nouveau, avec un cooldown de 60 secondes
pour éviter les abus.
"
```

## 📚 Ressources

- [SendGrid Email API](https://docs.sendgrid.com/api-reference/mail-send/mail-send)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)
- [OWASP Email Verification](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html)

---

**Auteur** : QuizMaster Team
**Date** : 2025
**Version** : 1.0