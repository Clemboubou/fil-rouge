# 🔑 Identifiants de Démonstration - QuizMaster

## 📋 Comptes de Test Disponibles

### 👨‍💼 Compte Administrateur

```
Email: admin@quizmaster.com
Password: admin123
Rôle: Administrateur
```

**Accès :**
- ✅ Dashboard
- ✅ Panel Administration
- ✅ Gestion des utilisateurs
- ✅ Gestion des quiz
- ✅ Statistiques complètes
- ✅ Toutes les fonctionnalités

---

### 👨‍🏫 Compte Formateur (Trainer)

```
Email: trainer@quizmaster.com
Password: trainer123
Rôle: Formateur
```

**Accès :**
- ✅ Dashboard
- ✅ Création de quiz (limité à 5 en mode gratuit)
- ✅ Gestion de ses propres quiz
- ✅ Vue des statistiques de ses quiz
- ✅ Analytics des étudiants
- ❌ Panel Administration (BLOQUÉ)

---

### 👨‍🎓 Compte Étudiant (Student)

```
Email: user1@quizmaster.com
Password: user123
Rôle: Étudiant
```

**Accès :**
- ✅ Dashboard
- ✅ Participation aux quiz
- ✅ Vue de ses résultats
- ✅ Leaderboard
- ✅ Badges et points
- ❌ Création de quiz (BLOQUÉ)
- ❌ Panel Administration (BLOQUÉ)

---

## 🎯 Scénarios de Démonstration

### Scénario 1 : Vue Administrateur
1. Se connecter avec `admin@quizmaster.com` / `admin123`
2. Accéder au **Panel Administration** (bouton visible dans la navbar)
3. Montrer la gestion des utilisateurs
4. Montrer la possibilité de changer les rôles
5. Montrer les statistiques globales

### Scénario 2 : Vue Formateur
1. Se connecter avec `trainer@quizmaster.com` / `trainer123`
2. Vérifier que le bouton **Admin** n'apparaît PAS
3. Créer un nouveau quiz
4. Voir les statistiques de ses quiz
5. Essayer d'accéder à `/admin` → Redirection avec erreur ✅

### Scénario 3 : Vue Étudiant
1. Se connecter avec `user1@quizmaster.com` / `user123`
2. Vérifier que les boutons **Admin** et **Créer Quiz** n'apparaissent PAS
3. Participer à un quiz
4. Voir son profil et ses badges
5. Consulter le leaderboard

### Scénario 4 : Sécurité
1. Se connecter avec `user1@quizmaster.com`
2. Essayer d'accéder manuellement à `http://localhost:3000/admin`
3. **Résultat attendu** : Redirection vers `/dashboard` + message d'erreur ✅
4. Montrer que le bouton Admin n'est pas visible dans la navbar

---

## 🔐 Tests de Sécurité Rapides

### Test Frontend

```javascript
// Ouvrir la console du navigateur
const user = JSON.parse(localStorage.getItem('user'))
console.log('Role:', user.role)

// Si role === 'admin' → Bouton Admin visible
// Si role === 'trainer' ou 'user' → Bouton Admin invisible
```

### Test Backend (avec cURL)

```bash
# 1. Se connecter en tant que student
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"user1@quizmaster.com","password":"user123"}'

# 2. Copier le token reçu

# 3. Essayer d'accéder aux routes admin
curl -H "Authorization: Bearer <TOKEN_STUDENT>" \
     http://localhost:5000/api/users

# Résultat attendu : 403 Forbidden ✅
```

---

## 🎨 Interface par Rôle

### Navbar Admin
```
[Logo] Dashboard | Premium | Administration | [User Menu] | 🇫🇷
                              ^^^^^^^^^^^^
                           VISIBLE SEULEMENT
                              POUR ADMIN
```

### Navbar Trainer
```
[Logo] Dashboard | Premium | [User Menu] | 🇫🇷
                    (pas de bouton Admin)
```

### Navbar Student
```
[Logo] Dashboard | Premium | [User Menu] | 🇫🇷
                    (pas de bouton Admin)
```

---

## 📊 Données de Test

### Quiz Disponibles
- Quiz de démonstration créés par trainer@quizmaster.com (John Trainer)
- Différentes catégories et difficultés
- Utilisables pour tester la participation

### Utilisateurs dans la Base
- **Admin** : admin@quizmaster.com
- **Trainers** : trainer@quizmaster.com, trainer2@quizmaster.com
- **Students** : user1@quizmaster.com, user2@quizmaster.com, user3@quizmaster.com, user4@quizmaster.com, user5@quizmaster.com

---

## 🚀 Démarrage Rapide pour Démo

### Option 1 : Démo Admin (Toutes fonctionnalités)
```bash
Email: admin@quizmaster.com
Password: admin123
```
→ Accès complet à toutes les fonctionnalités

### Option 2 : Démo Formateur (Création de contenu)
```bash
Email: trainer@quizmaster.com
Password: trainer123
```
→ Démonstration de la création de quiz

### Option 3 : Démo Étudiant (Gamification)
```bash
Email: user1@quizmaster.com
Password: user123
```
→ Démonstration de la participation et gamification

---

## ⚠️ Notes Importantes

### Emails de Vérification
Pour tester l'inscription avec vérification email :
1. Configurer SendGrid (voir `SENDGRID_CONFIGURATION.md`)
2. Utiliser une vraie adresse email
3. Recevoir le code à 6 chiffres
4. Valider le compte

### Reset des Données
Si vous voulez réinitialiser les données de test :
```bash
cd backend
npm run db:reset
```
Cela recréera les utilisateurs de test.

### Création de Nouveaux Comptes
Pour créer un nouveau compte admin :
```bash
# Dans phpMyAdmin ou MySQL
UPDATE users SET role='admin' WHERE email='votre@email.com';
```

---

## 🎭 Présentation au Jury

### Ordre Suggéré
1. **Connexion Admin** → Montrer panel administration
2. **Sécurité** → Se déconnecter, reconnecter en Student, montrer que Admin est bloqué
3. **Formateur** → Se connecter en Trainer, créer un quiz
4. **Étudiant** → Se connecter en Student, participer au quiz
5. **Multilangue** → Montrer le changement FR/EN avec le bouton 🇫🇷

### Points à Souligner
- ✅ Système de rôles robuste (3 niveaux)
- ✅ Protection backend ET frontend
- ✅ Interface adaptée à chaque rôle
- ✅ Vérification email en 2 étapes
- ✅ Système premium avec Stripe (demo)
- ✅ Gamification (points, badges, leaderboard)
- ✅ Multilingue (FR/EN)

---

## 🔗 URLs Utiles

- **Frontend** : http://localhost:3000
- **Backend API** : http://localhost:5000
- **API Health** : http://localhost:5000/health
- **API Docs** : http://localhost:5000/api
- **phpMyAdmin** : http://localhost:8080
  - Serveur : `quizmaster_mysql`
  - User : `quizmaster_user`
  - Password : `quizmaster_password`

---

## 📞 Support

En cas de problème avec les credentials :
1. Vérifier que la base de données est lancée : `docker ps`
2. Vérifier les logs : `docker logs quizmaster_api`
3. Réinitialiser la DB si nécessaire : `npm run db:reset`

---

**Dernière mise à jour** : 2025-10-01
**Version** : 1.0.0