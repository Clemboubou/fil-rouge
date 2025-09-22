const StripeService = require('../services/stripeService');

const checkQuizCreationLimit = async (req, res, next) => {
  try {
    if (req.user.role !== 'trainer') {
      return next(); // Skip check for non-trainers
    }

    const subscriptionStatus = await StripeService.getUserSubscriptionStatus(req.user.id);

    if (!subscriptionStatus.canCreateQuiz) {
      return res.status(403).json({
        success: false,
        message: 'Limite de création de quiz atteinte. Passez au plan Premium pour créer des quiz illimités.',
        data: {
          plan: subscriptionStatus.plan,
          limitReached: true,
          upgradeRequired: true
        }
      });
    }

    next();
  } catch (error) {
    console.error('Error checking quiz creation limit:', error);
    res.status(500).json({
      success: false,
      message: 'Erreur lors de la vérification des limites'
    });
  }
};

const checkPremiumFeature = (featureName) => {
  return async (req, res, next) => {
    try {
      const subscriptionStatus = await StripeService.getUserSubscriptionStatus(req.user.id);

      if (subscriptionStatus.plan !== 'premium' || !subscriptionStatus.isActive) {
        return res.status(403).json({
          success: false,
          message: `Cette fonctionnalité (${featureName}) est réservée aux utilisateurs Premium.`,
          data: {
            feature: featureName,
            plan: subscriptionStatus.plan,
            premiumRequired: true
          }
        });
      }

      next();
    } catch (error) {
      console.error('Error checking premium feature access:', error);
      res.status(500).json({
        success: false,
        message: 'Erreur lors de la vérification des droits d\'accès'
      });
    }
  };
};

module.exports = {
  checkQuizCreationLimit,
  checkPremiumFeature
};