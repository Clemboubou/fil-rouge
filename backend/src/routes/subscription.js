const express = require('express');
const SubscriptionController = require('../controllers/subscriptionController');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Protected routes (require authentication)
router.post('/create-checkout-session', authenticateToken, SubscriptionController.createCheckoutSession);
router.post('/create-billing-portal-session', authenticateToken, SubscriptionController.createBillingPortalSession);
router.get('/status', authenticateToken, SubscriptionController.getSubscriptionStatus);
router.post('/cancel', authenticateToken, SubscriptionController.cancelSubscription);
router.post('/reactivate', authenticateToken, SubscriptionController.reactivateSubscription);
router.get('/prices', SubscriptionController.getPrices);

// Webhook route (no authentication required, verified by Stripe signature)
router.post('/webhook', express.raw({ type: 'application/json' }), SubscriptionController.handleWebhook);

module.exports = router;