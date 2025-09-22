# Configuration Stripe pour QuizMaster

## 📋 Vue d'ensemble

Ce guide explique comment configurer Stripe pour le système de paiement de QuizMaster, incluant la création des produits, prix, et webhooks.

## 🔑 Configuration des clés API

### 1. Récupérer les clés Stripe

1. Connectez-vous à votre [Dashboard Stripe](https://dashboard.stripe.com)
2. Allez dans **Développeurs > Clés API**
3. Récupérez :
   - **Clé publique** (pk_test_...)
   - **Clé secrète** (sk_test_...)

### 2. Configuration Backend (.env)

```bash
# Stripe Configuration
STRIPE_SECRET_KEY=sk_test_votre_clé_secrète_ici
STRIPE_PUBLISHABLE_KEY=pk_test_votre_clé_publique_ici
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_ici
STRIPE_PREMIUM_MONTHLY_PRICE_ID=price_premium_monthly_id
STRIPE_PREMIUM_YEARLY_PRICE_ID=price_premium_yearly_id
```

### 3. Configuration Frontend (.env)

```bash
# Stripe Configuration
VITE_STRIPE_PUBLISHABLE_KEY=pk_test_votre_clé_publique_ici
```

## 🛍️ Création des produits et prix

### 1. Créer le produit Premium

```bash
curl https://api.stripe.com/v1/products \
  -u sk_test_votre_clé_secrète: \
  -d name="QuizMaster Premium" \
  -d description="Accès illimité aux fonctionnalités avancées de QuizMaster"
```

### 2. Créer les prix

**Prix mensuel (9,99€) :**
```bash
curl https://api.stripe.com/v1/prices \
  -u sk_test_votre_clé_secrète: \
  -d product=prod_VOTRE_PRODUCT_ID \
  -d unit_amount=999 \
  -d currency=eur \
  -d "recurring[interval]=month"
```

**Prix annuel (99,99€) :**
```bash
curl https://api.stripe.com/v1/prices \
  -u sk_test_votre_clé_secrète: \
  -d product=prod_VOTRE_PRODUCT_ID \
  -d unit_amount=9999 \
  -d currency=eur \
  -d "recurring[interval]=year"
```

## 🔗 Configuration des Webhooks

### 1. Créer un endpoint webhook

1. Dans le Dashboard Stripe, allez dans **Développeurs > Webhooks**
2. Cliquez sur **Ajouter un endpoint**
3. URL de l'endpoint : `https://votre-domaine.com/api/subscription/webhook`
4. Sélectionnez les événements suivants :

```
✅ checkout.session.completed
✅ customer.subscription.created
✅ customer.subscription.updated
✅ customer.subscription.deleted
✅ invoice.payment_succeeded
✅ invoice.payment_failed
```

### 2. Récupérer le secret du webhook

1. Après création, cliquez sur votre webhook
2. Copiez le **Secret de signature** (whsec_...)
3. Ajoutez-le dans votre fichier `.env` backend

## 🧪 Tests avec les cartes de test Stripe

### Cartes de test pour les paiements

```
# Paiement réussi
4242 4242 4242 4242

# Paiement refusé
4000 0000 0000 0002

# 3D Secure requis
4000 0025 0000 3155

# Date d'expiration : n'importe quelle date future
# CVC : n'importe quel 3 chiffres
```

## 🚀 Déploiement en production

### 1. Passer en mode live

1. Dans le Dashboard Stripe, basculez vers le mode **Live**
2. Récupérez les nouvelles clés de production
3. Mettez à jour vos variables d'environnement

### 2. Variables de production

```bash
# Production
STRIPE_SECRET_KEY=sk_live_votre_clé_secrète_live
STRIPE_PUBLISHABLE_KEY=pk_live_votre_clé_publique_live
STRIPE_WEBHOOK_SECRET=whsec_votre_secret_webhook_live
```

## 📊 Monitoring et analytics

### Événements importants à surveiller

1. **Abonnements créés** : Nouveaux clients Premium
2. **Paiements échoués** : Nécessitent un suivi client
3. **Annulations** : Analyser les raisons de churn
4. **Renouvellements** : Tracker la rétention

### Dashboard Stripe

Surveillez régulièrement :
- Volume des transactions
- Taux de réussite des paiements
- Disputes et remboursements
- Métriques d'abonnement (MRR, churn rate)

## 🔧 Fonctionnalités implémentées

### Backend

- ✅ Modèle `Subscription` avec statuts
- ✅ Service Stripe complet avec webhooks
- ✅ Contrôleur d'abonnement avec toutes les actions
- ✅ Middleware de vérification des limites freemium
- ✅ Gestion automatique des changements de plan

### Frontend

- ✅ Page d'abonnement avec comparaison des plans
- ✅ Intégration Stripe Checkout
- ✅ Portail de facturation pour gérer l'abonnement
- ✅ Page de succès après paiement
- ✅ Affichage du statut d'abonnement

### Sécurité

- ✅ Vérification des signatures webhook
- ✅ Validation des événements Stripe
- ✅ Gestion des erreurs de paiement
- ✅ Protection contre les abus (rate limiting)

## 🆘 Dépannage

### Erreurs courantes

1. **Webhook signature failed**
   - Vérifiez que `STRIPE_WEBHOOK_SECRET` est correct
   - Assurez-vous que le body de la requête n'est pas modifié

2. **Price ID not found**
   - Vérifiez que les `PRICE_ID` dans `.env` correspondent aux prix créés
   - Assurez-vous d'être sur le bon environnement (test/live)

3. **Customer not found**
   - Le customer est créé automatiquement lors du premier paiement
   - Vérifiez que l'utilisateur existe dans votre base de données

### Logs utiles

```bash
# Backend logs
docker-compose logs backend | grep -i stripe

# Webhooks dans Stripe Dashboard
Développeurs > Webhooks > Votre endpoint > Tentatives récentes
```

## 📞 Support

Pour toute question sur l'implémentation Stripe :

1. **Documentation Stripe** : https://stripe.com/docs
2. **Support Stripe** : Via le dashboard Stripe
3. **Logs de l'application** : Vérifiez les logs backend pour les erreurs

---

*Cette configuration suit les meilleures pratiques Stripe pour une application SaaS B2B avec modèle freemium.*