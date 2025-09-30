const Stripe = require('stripe');
require('dotenv').config();

const stripe = Stripe(process.env.STRIPE_SECRET_KEY);

async function createStripeProducts() {
  try {
    console.log('🚀 Création des produits et prix Stripe...\n');

    // Créer le produit Premium
    const product = await stripe.products.create({
      name: 'QuizMaster Premium',
      description: 'Accès premium à QuizMaster avec toutes les fonctionnalités avancées',
      metadata: {
        type: 'subscription'
      }
    });

    console.log('✅ Produit créé:', product.id);

    // Créer le prix mensuel
    const monthlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 999, // 9.99€
      currency: 'eur',
      recurring: {
        interval: 'month'
      },
      metadata: {
        type: 'premium_monthly'
      }
    });

    console.log('✅ Prix mensuel créé:', monthlyPrice.id);

    // Créer le prix annuel (avec réduction)
    const yearlyPrice = await stripe.prices.create({
      product: product.id,
      unit_amount: 9999, // 99.99€ (économie de ~17%)
      currency: 'eur',
      recurring: {
        interval: 'year'
      },
      metadata: {
        type: 'premium_yearly'
      }
    });

    console.log('✅ Prix annuel créé:', yearlyPrice.id);

    console.log('\n📋 Configuration à ajouter dans votre .env:');
    console.log(`STRIPE_PREMIUM_MONTHLY_PRICE_ID=${monthlyPrice.id}`);
    console.log(`STRIPE_PREMIUM_YEARLY_PRICE_ID=${yearlyPrice.id}`);

    console.log('\n🎉 Produits Stripe créés avec succès !');
    console.log('\n📝 Prochaines étapes:');
    console.log('1. Ajoutez les IDs de prix dans votre fichier .env');
    console.log('2. Configurez votre webhook Stripe');
    console.log('3. Testez le processus de paiement');

  } catch (error) {
    console.error('❌ Erreur lors de la création des produits:', error.message);
    process.exit(1);
  }
}

// Exécuter le script
createStripeProducts();