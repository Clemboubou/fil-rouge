const StripeService = require('../stripeService');
const { User, Subscription } = require('../../models');

// Mock Stripe
jest.mock('stripe', () => {
  return jest.fn(() => ({
    customers: {
      create: jest.fn()
    },
    checkout: {
      sessions: {
        create: jest.fn()
      }
    },
    billingPortal: {
      sessions: {
        create: jest.fn()
      }
    },
    subscriptions: {
      retrieve: jest.fn(),
      update: jest.fn()
    }
  }));
});

// Mock models
jest.mock('../../models');

describe('StripeService', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    process.env.STRIPE_SECRET_KEY = 'sk_test_123';
  });

  describe('createCustomer', () => {
    it('should create a Stripe customer', async () => {
      const mockUser = {
        id: 1,
        email: 'test@example.com',
        firstName: 'John',
        lastName: 'Doe'
      };

      const mockCustomer = {
        id: 'cus_123',
        email: 'test@example.com',
        name: 'John Doe'
      };

      const stripe = require('stripe')();
      stripe.customers.create.mockResolvedValue(mockCustomer);

      const result = await StripeService.createCustomer(mockUser);

      expect(stripe.customers.create).toHaveBeenCalledWith({
        email: mockUser.email,
        name: `${mockUser.firstName} ${mockUser.lastName}`,
        metadata: {
          userId: mockUser.id.toString()
        }
      });
      expect(result).toEqual(mockCustomer);
    });

    it('should throw error when Stripe is not configured', async () => {
      delete process.env.STRIPE_SECRET_KEY;
      // Need to reload module to pick up env change
      jest.resetModules();
      const StripeService = require('../stripeService');

      const mockUser = { id: 1, email: 'test@example.com' };

      await expect(StripeService.createCustomer(mockUser))
        .rejects.toThrow('Stripe is not configured');
    });
  });

  describe('getPrices', () => {
    it('should return price IDs from environment', () => {
      process.env.STRIPE_PREMIUM_MONTHLY_PRICE_ID = 'price_monthly_123';
      process.env.STRIPE_PREMIUM_YEARLY_PRICE_ID = 'price_yearly_123';

      const prices = StripeService.getPrices();

      expect(prices).toEqual({
        premium_monthly: 'price_monthly_123',
        premium_yearly: 'price_yearly_123'
      });
    });
  });

  describe('getUserSubscriptionStatus', () => {
    it('should return free plan status when no subscription exists', async () => {
      const mockUser = {
        id: 1,
        role: 'user',
        subscription: null
      };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await StripeService.getUserSubscriptionStatus(1);

      expect(result).toEqual({
        plan: 'free',
        status: 'active',
        isActive: true,
        canCreateQuiz: false
      });
    });

    it('should return subscription status for trainer with premium', async () => {
      const mockUser = {
        id: 1,
        role: 'trainer',
        subscription: {
          plan: 'premium',
          status: 'active',
          currentPeriodEnd: new Date('2025-12-31'),
          cancelAtPeriodEnd: false
        }
      };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await StripeService.getUserSubscriptionStatus(1);

      expect(result).toMatchObject({
        plan: 'premium',
        status: 'active',
        isActive: true,
        canCreateQuiz: true
      });
    });

    it('should return false for isActive when subscription is canceled', async () => {
      const mockUser = {
        id: 1,
        role: 'trainer',
        subscription: {
          plan: 'free',
          status: 'canceled'
        }
      };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await StripeService.getUserSubscriptionStatus(1);

      expect(result.isActive).toBe(false);
    });

    it('should allow trainer to create limited quizzes on free plan', async () => {
      const mockUser = {
        id: 1,
        role: 'trainer',
        quizCreatedCount: 3,
        subscription: null
      };

      User.findByPk.mockResolvedValue(mockUser);

      const result = await StripeService.getUserSubscriptionStatus(1);

      expect(result.canCreateQuiz).toBe(true); // Less than 5 quizzes
    });
  });

  describe('cancelSubscription', () => {
    it('should cancel subscription at period end', async () => {
      const stripe = require('stripe')();
      const mockSubscription = {
        id: 'sub_123',
        cancel_at_period_end: true
      };

      stripe.subscriptions.update.mockResolvedValue(mockSubscription);

      const result = await StripeService.cancelSubscription('sub_123');

      expect(stripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: true
      });
      expect(result.cancel_at_period_end).toBe(true);
    });
  });

  describe('reactivateSubscription', () => {
    it('should reactivate canceled subscription', async () => {
      const stripe = require('stripe')();
      const mockSubscription = {
        id: 'sub_123',
        cancel_at_period_end: false
      };

      stripe.subscriptions.update.mockResolvedValue(mockSubscription);

      const result = await StripeService.reactivateSubscription('sub_123');

      expect(stripe.subscriptions.update).toHaveBeenCalledWith('sub_123', {
        cancel_at_period_end: false
      });
      expect(result.cancel_at_period_end).toBe(false);
    });
  });
});
