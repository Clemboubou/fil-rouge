# 🌍 Guide d'utilisation du système de traduction

## ✅ Ce qui est déjà traduit

### Navigation (App.vue)
- ✅ Tableau de bord / Dashboard
- ✅ Premium
- ✅ Administration / Admin
- ✅ Connexion / Login
- ✅ Inscription / Register
- ✅ Déconnexion / Logout
- ✅ Chargement / Loading

### Bouton de changement de langue
- 🇫🇷 / 🇬🇧 dans la navigation (cliquez pour changer)

## 📝 Comment traduire une page

### Dans le template (HTML)

**Avant :**
```vue
<h1>Choisissez votre plan</h1>
<p>Créez des quiz illimités</p>
```

**Après :**
```vue
<h1>{{ $t('subscription.choosePlan') }}</h1>
<p>{{ $t('subscription.premiumFeatures.unlimited') }}</p>
```

### Dans le script (JavaScript)

**Avec Composition API :**
```vue
<script setup>
import { useLanguageStore } from '@/stores/language'

const languageStore = useLanguageStore()

// Utiliser dans les fonctions
const message = languageStore.t('common.loading')
alert(languageStore.t('subscription.demoMode'))
</script>
```

**Avec Options API :**
```vue
<script>
export default {
  methods: {
    showMessage() {
      alert(this.$t('common.success'))
    }
  }
}
</script>
```

## 📚 Clés de traduction disponibles

### Navigation (`nav.`)
- `nav.dashboard` → Tableau de bord / Dashboard
- `nav.premium` → Premium
- `nav.admin` → Administration / Admin
- `nav.login` → Connexion / Login
- `nav.register` → Inscription / Register
- `nav.logout` → Déconnexion / Logout

### Commun (`common.`)
- `common.loading` → Chargement... / Loading...
- `common.save` → Enregistrer / Save
- `common.cancel` → Annuler / Cancel
- `common.delete` → Supprimer / Delete
- `common.edit` → Modifier / Edit
- `common.search` → Rechercher / Search
- `common.submit` → Soumettre / Submit

### Authentification (`auth.`)
- `auth.loginTitle` → Connexion / Login
- `auth.registerTitle` → Inscription / Register
- `auth.email` → Email
- `auth.password` → Mot de passe / Password
- `auth.firstName` → Prénom / First Name
- `auth.lastName` → Nom / Last Name

### Abonnement (`subscription.`)
- `subscription.title` → Abonnement / Subscription
- `subscription.choosePlan` → Choisissez votre plan / Choose your plan
- `subscription.currentPlan` → Plan actuel / Current Plan
- `subscription.upgradeToPremium` → Passer au Premium / Upgrade to Premium
- `subscription.free` → Gratuit / Free
- `subscription.premium` → Premium
- `subscription.demoMode` → Message de démo complet

### Quiz (`quiz.`)
- `quiz.title` → Quiz
- `quiz.create` → Créer un quiz / Create Quiz
- `quiz.start` → Commencer / Start
- `quiz.submit` → Soumettre / Submit
- `quiz.score` → Score
- `quiz.questions` → Questions

### Admin (`admin.`)
- `admin.title` → Administration / Administration
- `admin.users` → Utilisateurs / Users
- `admin.quizzes` → Quiz / Quizzes
- `admin.statistics` → Statistiques / Statistics

## 🎯 Exemple complet : Page Login

**AVANT :**
```vue
<template>
  <div>
    <h1>Connexion</h1>
    <form>
      <label>Email</label>
      <input type="email" />

      <label>Mot de passe</label>
      <input type="password" />

      <button>Se connecter</button>
    </form>
  </div>
</template>
```

**APRÈS :**
```vue
<template>
  <div>
    <h1>{{ $t('auth.loginTitle') }}</h1>
    <form>
      <label>{{ $t('auth.email') }}</label>
      <input type="email" />

      <label>{{ $t('auth.password') }}</label>
      <input type="password" />

      <button>{{ $t('nav.login') }}</button>
    </form>
  </div>
</template>
```

## 🔧 Ajouter de nouvelles traductions

### 1. Ajouter dans `src/i18n/translations.js`

```javascript
export const translations = {
  fr: {
    maNouvellePage: {
      titre: 'Mon titre en français',
      description: 'Ma description'
    }
  },
  en: {
    maNouvellePage: {
      titre: 'My title in English',
      description: 'My description'
    }
  }
}
```

### 2. Utiliser dans le composant

```vue
<h1>{{ $t('maNouvellePage.titre') }}</h1>
<p>{{ $t('maNouvellePage.description') }}</p>
```

## 🚀 Test rapide

1. Allez sur l'application
2. Cliquez sur le drapeau 🇫🇷 en haut à gauche
3. La navigation change en anglais !
4. Recliquez pour revenir en français

## 💡 Astuce

Pour voir toutes les clés disponibles, consultez :
`frontend/src/i18n/translations.js`

Le système est **réactif** : quand vous changez de langue, TOUT se met à jour automatiquement !