const Stripe = require('stripe');
const { User, Subscription } = require('../models');

const stripe = process.env.STRIPE_SECRET_KEY ? Stripe(process.env.STRIPE_SECRET_KEY) : null;

class StripeService {
  static checkStripeInitialized() {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
  }

  static async createCustomer(user) {
    this.checkStripeInitialized();
    try {
      const customer = await stripe.customers.create({
        email: user.email,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          userId: user.id.toString()
        }
      });

      return customer;
    } catch (error) {
      console.error('Error creating Stripe customer:', error);
      throw error;
    }
  }

  static async createCheckoutSession(userId, priceId, successUrl, cancelUrl) {
    try {
      const user = await User.findByPk(userId, {
        include: ['subscription']
      });

      if (!user) {
        throw new Error('User not found');
      }

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

      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
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

  static async handleWebhook(event) {
    try {
      switch (event.type) {
        case 'checkout.session.completed':
          await this.handleCheckoutSessionCompleted(event.data.object);
          break;

        case 'customer.subscription.created':
        case 'customer.subscription.updated':
          await this.handleSubscriptionUpdate(event.data.object);
          break;

        case 'customer.subscription.deleted':
          await this.handleSubscriptionDeleted(event.data.object);
          break;

        case 'invoice.payment_succeeded':
          await this.handlePaymentSucceeded(event.data.object);
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
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null
      });

      await User.update(
        { plan: 'premium' },
        { where: { id: userSubscription.userId } }
      );
    }
  }

  static async handleSubscriptionUpdate(subscription) {
    const userSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (userSubscription) {
      const plan = subscription.status === 'active' ? 'premium' : 'free';

      await userSubscription.update({
        stripePriceId: subscription.items.data[0].price.id,
        plan: plan,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        trialEnd: subscription.trial_end ? new Date(subscription.trial_end * 1000) : null,
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      });

      await User.update(
        { plan: plan },
        { where: { id: userSubscription.userId } }
      );
    }
  }

  static async handleSubscriptionDeleted(subscription) {
    const userSubscription = await Subscription.findOne({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (userSubscription) {
      await userSubscription.update({
        plan: 'free',
        status: 'canceled',
        stripeSubscriptionId: null,
        stripePriceId: null
      });

      await User.update(
        { plan: 'free' },
        { where: { id: userSubscription.userId } }
      );
    }
  }

  static async handlePaymentSucceeded(invoice) {
    console.log('Payment succeeded for invoice:', invoice.id);
  }

  static async handlePaymentFailed(invoice) {
    const userSubscription = await Subscription.findOne({
      where: { stripeCustomerId: invoice.customer }
    });

    if (userSubscription) {
      await userSubscription.update({
        status: 'past_due'
      });
    }

    console.log('Payment failed for invoice:', invoice.id);
  }

  static async cancelSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: true
      });

      return subscription;
    } catch (error) {
      console.error('Error canceling subscription:', error);
      throw error;
    }
  }

  static async reactivateSubscription(subscriptionId) {
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });

      return subscription;
    } catch (error) {
      console.error('Error reactivating subscription:', error);
      throw error;
    }
  }

  static getPrices() {
    return {
      premium_monthly: process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID,
      premium_yearly: process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID
    };
  }

  static async getUserSubscriptionStatus(userId) {
    try {
      const user = await User.findByPk(userId, {
        include: ['subscription']
      });

      if (!user || !user.subscription) {
        return {
          plan: 'free',
          status: 'active',
          isActive: true,
          canCreateQuiz: user?.role === 'trainer' ? user.quizCreatedCount < 5 : false
        };
      }

      const subscription = user.subscription;
      const isActive = ['active', 'trialing'].includes(subscription.status);

      return {
        plan: subscription.plan,
        status: subscription.status,
        isActive: isActive,
        currentPeriodEnd: subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscription.cancelAtPeriodEnd,
        canCreateQuiz: user.role === 'trainer' ? (subscription.plan === 'premium' || user.quizCreatedCount < 5) : false
      };
    } catch (error) {
      console.error('Error getting user subscription status:', error);
      throw error;
    }
  }
}

module.exports = StripeService;