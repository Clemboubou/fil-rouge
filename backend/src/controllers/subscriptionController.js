const StripeService = require('../services/stripeService');
const { User, Subscription } = require('../models');

class SubscriptionController {
  static async createCheckoutSession(req, res) {
    try {
      const { priceId } = req.body;
      const userId = req.user.id;

      if (!priceId) {
        return res.status(400).json({
          success: false,
          message: 'Price ID is required'
        });
      }

      const successUrl = `${req.headers.origin}/subscription/success?session_id={CHECKOUT_SESSION_ID}`;
      const cancelUrl = `${req.headers.origin}/subscription/cancel`;

      const session = await StripeService.createCheckoutSession(
        userId,
        priceId,
        successUrl,
        cancelUrl
      );

      res.json({
        success: true,
        data: {
          sessionId: session.id,
          url: session.url
        }
      });
    } catch (error) {
      console.error('Error creating checkout session:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la session de paiement'
      });
    }
  }

  static async createBillingPortalSession(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: ['subscription']
      });

      if (!user?.subscription?.stripeCustomerId) {
        return res.status(400).json({
          success: false,
          message: 'Aucun abonnement trouvé'
        });
      }

      const returnUrl = `${req.headers.origin}/dashboard`;

      const session = await StripeService.createBillingPortalSession(
        user.subscription.stripeCustomerId,
        returnUrl
      );

      res.json({
        success: true,
        data: {
          url: session.url
        }
      });
    } catch (error) {
      console.error('Error creating billing portal session:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la création de la session de facturation'
      });
    }
  }

  static async getSubscriptionStatus(req, res) {
    try {
      const userId = req.user.id;

      const status = await StripeService.getUserSubscriptionStatus(userId);

      res.json({
        success: true,
        data: status
      });
    } catch (error) {
      console.error('Error getting subscription status:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération du statut d\'abonnement'
      });
    }
  }

  static async cancelSubscription(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: ['subscription']
      });

      if (!user?.subscription?.stripeSubscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Aucun abonnement actif trouvé'
        });
      }

      await StripeService.cancelSubscription(user.subscription.stripeSubscriptionId);

      res.json({
        success: true,
        message: 'Abonnement annulé. Il restera actif jusqu\'à la fin de la période de facturation actuelle.'
      });
    } catch (error) {
      console.error('Error canceling subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de l\'annulation de l\'abonnement'
      });
    }
  }

  static async reactivateSubscription(req, res) {
    try {
      const userId = req.user.id;

      const user = await User.findByPk(userId, {
        include: ['subscription']
      });

      if (!user?.subscription?.stripeSubscriptionId) {
        return res.status(400).json({
          success: false,
          message: 'Aucun abonnement trouvé'
        });
      }

      await StripeService.reactivateSubscription(user.subscription.stripeSubscriptionId);

      res.json({
        success: true,
        message: 'Abonnement réactivé avec succès'
      });
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la réactivation de l\'abonnement'
      });
    }
  }

  static async handleWebhook(req, res) {
    try {
      const sig = req.headers['stripe-signature'];
      const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

      let event;

      try {
        event = require('stripe').webhooks.constructEvent(req.body, sig, endpointSecret);
      } catch (err) {
        console.error('Webhook signature verification failed:', err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
      }

      await StripeService.handleWebhook(event);

      res.json({ received: true });
    } catch (error) {
      console.error('Error handling webhook:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors du traitement du webhook'
      });
    }
  }

  static async getPrices(req, res) {
    try {
      const prices = StripeService.getPrices();

      res.json({
        success: true,
        data: {
          prices: {
            monthly: {
              id: prices.premium_monthly,
              amount: 999, // 9.99€
              currency: 'eur',
              interval: 'month'
            },
            yearly: {
              id: prices.premium_yearly,
              amount: 9999, // 99.99€
              currency: 'eur',
              interval: 'year'
            }
          }
        }
      });
    } catch (error) {
      console.error('Error getting prices:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la récupération des prix'
      });
    }
  }
}

module.exports = SubscriptionController;