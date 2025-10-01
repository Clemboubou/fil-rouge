
const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function testStripeIntegration() {
  console.log('🧪 Test de l\'intégration Stripe\n');
  console.log('━'.repeat(50));

  try {
    // Test 1: Vérifier la connexion Stripe
    console.log('\n✓ Test 1: Connexion à Stripe');
    const account = await stripe.accounts.retrieve();
    console.log(`  ✅ Compte connecté: ${account.id}`);
    console.log(`  📧 Email: ${account.email || 'Non disponible'}`);
    console.log(`  🏢 Type: ${account.type}`);

    // Test 2: Lister les produits
    console.log('\n✓ Test 2: Vérification des produits');
    const products = await stripe.products.list({ limit: 10 });
    console.log(`  📦 Produits trouvés: ${products.data.length}`);

    if (products.data.length > 0) {
      products.data.forEach(product => {
        console.log(`  - ${product.name} (${product.id})`);
      });
    } else {
      console.log('  ⚠️  Aucun produit trouvé. Exécutez: npm run create-stripe-products');
    }

    // Test 3: Lister les prix
    console.log('\n✓ Test 3: Vérification des prix');
    const prices = await stripe.prices.list({ limit: 10 });
    console.log(`  💰 Prix trouvés: ${prices.data.length}`);

    if (prices.data.length > 0) {
      prices.data.forEach(price => {
        const amount = (price.unit_amount / 100).toFixed(2);
        const interval = price.recurring?.interval || 'one-time';
        console.log(`  - ${amount} ${price.currency.toUpperCase()}/${interval} (${price.id})`);
      });
    } else {
      console.log('  ⚠️  Aucun prix trouvé. Exécutez: npm run create-stripe-products');
    }

    // Test 4: Vérifier les variables d'environnement
    console.log('\n✓ Test 4: Variables d\'environnement');
    const envVars = [
      'STRIPE_SECRET_KEY',
      'STRIPE_WEBHOOK_SECRET',
      'STRIPE_PREMIUM_MONTHLY_PRICE_ID',
      'STRIPE_PREMIUM_YEARLY_PRICE_ID'
    ];

    envVars.forEach(varName => {
      if (process.env[varName]) {
        const value = process.env[varName];
        const masked = value.substring(0, 10) + '...' + value.substring(value.length - 4);
        console.log(`  ✅ ${varName}: ${masked}`);
      } else {
        console.log(`  ❌ ${varName}: Non défini`);
      }
    });

    // Test 5: Vérifier les webhooks
    console.log('\n✓ Test 5: Endpoints webhook');
    const webhooks = await stripe.webhookEndpoints.list({ limit: 10 });
    console.log(`  🔗 Webhooks configurés: ${webhooks.data.length}`);

    if (webhooks.data.length > 0) {
      webhooks.data.forEach(webhook => {
        console.log(`  - ${webhook.url}`);
        console.log(`    Status: ${webhook.status}`);
        console.log(`    Événements: ${webhook.enabled_events.length}`);
      });
    } else {
      console.log('  ⚠️  Aucun webhook configuré');
      console.log('     Configurez un webhook dans le dashboard Stripe');
    }

    // Test 6: Vérifier les clients (optionnel)
    console.log('\n✓ Test 6: Aperçu des clients');
    const customers = await stripe.customers.list({ limit: 5 });
    console.log(`  👥 Clients enregistrés: ${customers.data.length}`);

    if (customers.data.length > 0) {
      customers.data.forEach(customer => {
        console.log(`  - ${customer.email || customer.id}`);
      });
    }

    // Test 7: Cartes de test recommandées
    console.log('\n✓ Test 7: Cartes de test disponibles');
    console.log('  🎴 Paiement réussi: 4242 4242 4242 4242');
    console.log('  🎴 Paiement refusé: 4000 0000 0000 0002');
    console.log('  🎴 3D Secure: 4000 0025 0000 3155');

    // Résumé final
    console.log('\n' + '━'.repeat(50));
    console.log('\n✅ RÉSUMÉ DES TESTS');
    console.log('━'.repeat(50));

    const hasProducts = products.data.length > 0;
    const hasPrices = prices.data.length > 0;
    const hasWebhooks = webhooks.data.length > 0;
    const hasEnvVars = envVars.every(v => process.env[v]);

    if (hasProducts && hasPrices && hasWebhooks && hasEnvVars) {
      console.log('\n🎉 Configuration Stripe complète et fonctionnelle !');
      console.log('\n📋 Prochaines étapes:');
      console.log('  1. Testez un paiement depuis l\'interface frontend');
      console.log('  2. Vérifiez que les webhooks sont bien reçus');
      console.log('  3. Surveillez les logs pour les erreurs');
    } else {
      console.log('\n⚠️  Configuration incomplète:');
      if (!hasProducts || !hasPrices) {
        console.log('  ❌ Créez les produits: npm run create-stripe-products');
      }
      if (!hasWebhooks) {
        console.log('  ❌ Configurez les webhooks dans le dashboard Stripe');
      }
      if (!hasEnvVars) {
        console.log('  ❌ Définissez toutes les variables d\'environnement');
      }
    }

    console.log('\n━'.repeat(50));

  } catch (error) {
    console.error('\n❌ Erreur lors du test:', error.message);

    if (error.type === 'StripeAuthenticationError') {
      console.error('\n💡 Solution: Vérifiez votre STRIPE_SECRET_KEY dans le fichier .env');
    } else if (error.type === 'StripeAPIError') {
      console.error('\n💡 Solution: Vérifiez votre connexion internet et les permissions Stripe');
    }

    process.exit(1);
  }
}

// Exécuter les tests
console.log('🚀 Démarrage des tests d\'intégration Stripe...\n');
testStripeIntegration();