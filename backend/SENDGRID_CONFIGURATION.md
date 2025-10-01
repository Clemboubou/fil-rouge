# 📧 Configuration SendGrid pour QuizMaster

## 📋 Vue d'ensemble

QuizMaster utilise SendGrid pour envoyer des emails automatiques :
- ✉️ Email de bienvenue lors de l'inscription
- 🔒 Email de réinitialisation de mot de passe (préparé pour future implémentation)
- 📨 Emails de test pour vérifier la configuration

## 🚀 Étapes de configuration

### 1. Créer un compte SendGrid

1. Allez sur [SendGrid](https://sendgrid.com)
2. Créez un compte gratuit (100 emails/jour)
3. Vérifiez votre email

### 2. Configurer l'expéditeur (Sender Authentication)

1. Dans SendGrid, allez dans **Settings** > **Sender Authentication**
2. Cliquez sur **Verify a Single Sender**
3. Remplissez les informations :
   - **From Name** : QuizMaster
   - **From Email Address** : clement.bou57@outlook.com
   - **Reply To** : clement.bou57@outlook.com
   - **Company Address** : Votre adresse
   - **City**, **Country**, etc.
4. Cliquez sur **Create**
5. **Important** : Allez sur votre boîte Outlook (clement.bou57@outlook.com)
6. Cherchez l'email de SendGrid (vérifiez les spams)
7. Cliquez sur le lien de vérification
8. Attendez la confirmation "Sender verified"

### 3. Créer une clé API

1. Dans SendGrid, allez dans **Settings** > **API Keys**
2. Cliquez sur **Create API Key**
3. Donnez un nom : `QuizMaster-Production` ou `ProjetEcole`
4. Sélectionnez **Full Access** (ou **Restricted Access** avec permissions Mail Send)
5. Cliquez sur **Create & View**
6. **⚠️ IMPORTANT** : Copiez immédiatement la clé (elle commence par `SG.`)
7. Vous ne pourrez plus la voir après !

### 4. Configurer le projet

1. Ouvrez le fichier `backend/.env`
2. Remplacez la clé API :
   ```env
   SENDGRID_API_KEY=SG.votre_vraie_cle_api_ici
   SENDGRID_FROM_EMAIL=clement.bou57@outlook.com
   SENDGRID_FROM_NAME=QuizMaster
   ```
3. Sauvegardez le fichier

### 5. Redémarrer le backend

```bash
# Arrêter Docker
docker-compose down

# Redémarrer avec la nouvelle configuration
docker-compose up -d
```

## 🧪 Tester l'envoi d'emails

### Option 1 : Créer un nouveau compte

1. Allez sur la page d'inscription : http://localhost:3000/register
2. Créez un nouveau compte avec votre email Outlook
3. Vérifiez votre boîte Outlook pour l'email de bienvenue

### Option 2 : Utiliser le script de test

Créez un fichier `backend/test-email.js` :

```javascript
require('dotenv').config();
const { sendTestEmail } = require('./src/services/emailService');

sendTestEmail('clement.bou57@outlook.com')
  .then(() => {
    console.log('✅ Email de test envoyé avec succès !');
    process.exit(0);
  })
  .catch(error => {
    console.error('❌ Erreur:', error.message);
    process.exit(1);
  });
```

Puis exécutez :
```bash
cd backend
node test-email.js
```

## 📊 Vérifier les emails envoyés

1. Dans SendGrid, allez dans **Activity** > **Email Activity**
2. Vous verrez tous les emails envoyés avec leur statut :
   - ✅ Delivered : Email reçu
   - 📬 Processed : Email en cours de traitement
   - ❌ Bounced : Email rejeté
   - 🚫 Dropped : Email bloqué

## 🔍 Dépannage

### Erreur : "Unauthorized"
- Vérifiez que la clé API est correcte dans `.env`
- Vérifiez que la clé a les bonnes permissions (Mail Send)

### Erreur : "The from email does not match a verified sender"
- Assurez-vous que `clement.bou57@outlook.com` est vérifié dans SendGrid
- Vérifiez votre boîte Outlook pour le lien de vérification

### Email non reçu
- Vérifiez les spams/courrier indésirable
- Vérifiez l'Activity dans SendGrid pour voir le statut
- Attendez quelques minutes (peut prendre jusqu'à 5 minutes)

### L'email est dans les spams
- Normal pour les nouveaux expéditeurs
- Au fil du temps, votre réputation s'améliore
- Pour la production, configurez SPF, DKIM et DMARC

## 📝 Structure du code

### Service Email
`backend/src/services/emailService.js` contient :
- `sendWelcomeEmail(user)` : Email de bienvenue
- `sendPasswordResetEmail(email, token)` : Réinitialisation de mot de passe
- `sendTestEmail(email)` : Email de test

### Intégration dans le contrôleur
`backend/src/controllers/authController.js` :
```javascript
// Après création de l'utilisateur
sendWelcomeEmail({
  email: user.email,
  firstName: user.firstName,
  lastName: user.lastName,
  role: user.role
}).catch(error => {
  console.error('Failed to send welcome email:', error.message);
});
```

L'envoi est **non-bloquant** : l'inscription réussit même si l'email échoue.

## 🎨 Templates d'emails

Les emails incluent :
- Design responsive (HTML + fallback texte)
- Logo et branding QuizMaster
- Boutons CTA stylisés
- Footer avec informations légales
- Contenu adapté au rôle (trainer/student)

## 📈 Limites du plan gratuit

- **100 emails/jour**
- Parfait pour développement et démonstration
- Pour production : upgrade vers plan payant

## 🔒 Sécurité

- ✅ La clé API est dans `.env` (non versionné)
- ✅ `.env` est dans `.gitignore`
- ❌ Ne jamais commiter la clé API
- ✅ Utilisez des variables d'environnement en production

## 💡 Pour la démo au jury

1. Montrez l'inscription d'un nouveau compte
2. Ouvrez Outlook en temps réel
3. Montrez l'email de bienvenue reçu
4. Expliquez :
   - SendGrid = service professionnel d'envoi d'emails
   - API key sécurisée
   - Templates HTML personnalisés
   - Gestion asynchrone (non-bloquant)

## 📚 Ressources

- [Documentation SendGrid](https://docs.sendgrid.com/)
- [SendGrid Node.js Library](https://github.com/sendgrid/sendgrid-nodejs)
- [Email Best Practices](https://sendgrid.com/blog/email-best-practices/)

---

**Auteur** : QuizMaster Team
**Date** : 2025
**Version** : 1.0