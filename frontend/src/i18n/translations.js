// Système de traduction pour QuizMaster
export const translations = {
  fr: {
    // Navigation
    nav: {
      dashboard: 'Tableau de bord',
      premium: 'Premium',
      admin: 'Administration',
      login: 'Connexion',
      register: 'Inscription',
      logout: 'Déconnexion',
      user: 'Utilisateur'
    },

    // Messages communs
    common: {
      loading: 'Chargement...',
      save: 'Enregistrer',
      cancel: 'Annuler',
      delete: 'Supprimer',
      edit: 'Modifier',
      close: 'Fermer',
      confirm: 'Confirmer',
      yes: 'Oui',
      no: 'Non',
      search: 'Rechercher',
      filter: 'Filtrer',
      sort: 'Trier',
      actions: 'Actions',
      details: 'Détails',
      back: 'Retour',
      next: 'Suivant',
      previous: 'Précédent',
      submit: 'Soumettre',
      error: 'Erreur',
      success: 'Succès',
      warning: 'Attention',
      info: 'Information'
    },

    // Authentification
    auth: {
      loginTitle: 'Connexion',
      registerTitle: 'Inscription',
      email: 'Email',
      password: 'Mot de passe',
      confirmPassword: 'Confirmer le mot de passe',
      firstName: 'Prénom',
      lastName: 'Nom',
      rememberMe: 'Se souvenir de moi',
      forgotPassword: 'Mot de passe oublié ?',
      noAccount: 'Pas de compte ?',
      alreadyHaveAccount: 'Déjà un compte ?',
      loginSuccess: 'Connexion réussie',
      logoutSuccess: 'Déconnexion réussie',
      registerSuccess: 'Inscription réussie',
      loginError: 'Erreur de connexion',
      logoutError: 'Erreur de déconnexion',
      registerError: 'Erreur d\'inscription'
    },

    // Dashboard
    dashboard: {
      title: 'Tableau de bord',
      welcome: 'Bienvenue',
      stats: 'Statistiques',
      recentQuizzes: 'Quiz récents',
      myQuizzes: 'Mes quiz',
      myProgress: 'Ma progression',
      leaderboard: 'Classement',
      badges: 'Badges',
      points: 'Points',
      quizzesTaken: 'Quiz effectués',
      quizzesCreated: 'Quiz créés',
      averageScore: 'Score moyen'
    },

    // Quiz
    quiz: {
      title: 'Quiz',
      create: 'Créer un quiz',
      edit: 'Modifier le quiz',
      delete: 'Supprimer le quiz',
      start: 'Commencer',
      continue: 'Continuer',
      finish: 'Terminer',
      submit: 'Soumettre',
      questions: 'Questions',
      question: 'Question',
      answer: 'Réponse',
      answers: 'Réponses',
      correctAnswer: 'Bonne réponse',
      wrongAnswer: 'Mauvaise réponse',
      score: 'Score',
      time: 'Temps',
      difficulty: 'Difficulté',
      category: 'Catégorie',
      description: 'Description',
      noQuizzes: 'Aucun quiz disponible',
      loading: 'Chargement du quiz...',
      error: 'Erreur lors du chargement du quiz'
    },

    // Subscription
    subscription: {
      title: 'Abonnement',
      choosePlan: 'Choisissez votre plan',
      currentPlan: 'Plan actuel',
      upgradeToPremium: 'Passer au Premium',
      manageSub: 'Gérer l\'abonnement',
      cancel: 'Annuler',
      reactivate: 'Réactiver',
      free: 'Gratuit',
      premium: 'Premium',
      monthly: 'Mensuel',
      yearly: 'Annuel',
      features: 'Fonctionnalités',
      unlimited: 'Illimité',
      limited: 'Limité',
      pricing: 'Tarifs',
      perMonth: '/mois',
      perYear: '/an',
      activateSuccess: 'Abonnement activé avec succès',
      cancelSuccess: 'Abonnement annulé avec succès',
      cancelledOn: 'Sera annulé le',
      expiresOn: 'Expire le',
      freeFeatures: {
        limit: '5 quiz maximum (formateurs)',
        access: 'Accès à tous les quiz',
        gamification: 'Système de points et badges',
        leaderboards: 'Classements basiques'
      },
      premiumFeatures: {
        unlimited: 'Quiz illimités',
        analytics: 'Analytics avancés',
        export: 'Export de données (CSV, PDF)',
        support: 'Support prioritaire',
        branding: 'Branding personnalisé'
      },
      comparison: 'Comparaison détaillée',
      faq: 'Questions fréquentes',
      demoMode: 'Mode démo : Cette fonctionnalité afficherait normalement le formulaire de paiement Stripe.\n\nPour activer le vrai système de paiement, configurez votre clé Stripe dans .env',
      error: 'Erreur lors de la gestion de l\'abonnement'
    },

    // Admin
    admin: {
      title: 'Administration',
      users: 'Utilisateurs',
      quizzes: 'Quiz',
      statistics: 'Statistiques',
      settings: 'Paramètres',
      userManagement: 'Gestion des utilisateurs',
      quizManagement: 'Gestion des quiz',
      role: 'Rôle',
      status: 'Statut',
      active: 'Actif',
      inactive: 'Inactif',
      totalUsers: 'Total utilisateurs',
      totalQuizzes: 'Total quiz',
      totalAttempts: 'Total tentatives'
    },

    // Toasts & Notifications
    notifications: {
      errorOccurred: 'Une erreur est survenue',
      somethingWrong: 'Quelque chose s\'est mal passé',
      tryAgain: 'Veuillez réessayer',
      noInternet: 'Pas de connexion Internet',
      timeout: 'Délai d\'attente dépassé',
      unauthorized: 'Non autorisé',
      forbidden: 'Accès refusé',
      notFound: 'Non trouvé',
      serverError: 'Erreur serveur'
    }
  },

  en: {
    // Navigation
    nav: {
      dashboard: 'Dashboard',
      premium: 'Premium',
      admin: 'Admin',
      login: 'Login',
      register: 'Register',
      logout: 'Logout',
      user: 'User'
    },

    // Common messages
    common: {
      loading: 'Loading...',
      save: 'Save',
      cancel: 'Cancel',
      delete: 'Delete',
      edit: 'Edit',
      close: 'Close',
      confirm: 'Confirm',
      yes: 'Yes',
      no: 'No',
      search: 'Search',
      filter: 'Filter',
      sort: 'Sort',
      actions: 'Actions',
      details: 'Details',
      back: 'Back',
      next: 'Next',
      previous: 'Previous',
      submit: 'Submit',
      error: 'Error',
      success: 'Success',
      warning: 'Warning',
      info: 'Information'
    },

    // Authentication
    auth: {
      loginTitle: 'Login',
      registerTitle: 'Register',
      email: 'Email',
      password: 'Password',
      confirmPassword: 'Confirm Password',
      firstName: 'First Name',
      lastName: 'Last Name',
      rememberMe: 'Remember me',
      forgotPassword: 'Forgot password?',
      noAccount: 'No account?',
      alreadyHaveAccount: 'Already have an account?',
      loginSuccess: 'Login successful',
      logoutSuccess: 'Logout successful',
      registerSuccess: 'Registration successful',
      loginError: 'Login error',
      logoutError: 'Logout error',
      registerError: 'Registration error'
    },

    // Dashboard
    dashboard: {
      title: 'Dashboard',
      welcome: 'Welcome',
      stats: 'Statistics',
      recentQuizzes: 'Recent Quizzes',
      myQuizzes: 'My Quizzes',
      myProgress: 'My Progress',
      leaderboard: 'Leaderboard',
      badges: 'Badges',
      points: 'Points',
      quizzesTaken: 'Quizzes Taken',
      quizzesCreated: 'Quizzes Created',
      averageScore: 'Average Score'
    },

    // Quiz
    quiz: {
      title: 'Quiz',
      create: 'Create Quiz',
      edit: 'Edit Quiz',
      delete: 'Delete Quiz',
      start: 'Start',
      continue: 'Continue',
      finish: 'Finish',
      submit: 'Submit',
      questions: 'Questions',
      question: 'Question',
      answer: 'Answer',
      answers: 'Answers',
      correctAnswer: 'Correct Answer',
      wrongAnswer: 'Wrong Answer',
      score: 'Score',
      time: 'Time',
      difficulty: 'Difficulty',
      category: 'Category',
      description: 'Description',
      noQuizzes: 'No quizzes available',
      loading: 'Loading quiz...',
      error: 'Error loading quiz'
    },

    // Subscription
    subscription: {
      title: 'Subscription',
      currentPlan: 'Current Plan',
      upgradeToPremium: 'Upgrade to Premium',
      manageSub: 'Manage Subscription',
      cancel: 'Cancel',
      reactivate: 'Reactivate',
      free: 'Free',
      premium: 'Premium',
      monthly: 'Monthly',
      yearly: 'Yearly',
      features: 'Features',
      unlimited: 'Unlimited',
      limited: 'Limited',
      pricing: 'Pricing',
      perMonth: '/month',
      perYear: '/year',
      activateSuccess: 'Subscription activated successfully',
      cancelSuccess: 'Subscription cancelled successfully',
      error: 'Error managing subscription'
    },

    // Admin
    admin: {
      title: 'Administration',
      users: 'Users',
      quizzes: 'Quizzes',
      statistics: 'Statistics',
      settings: 'Settings',
      userManagement: 'User Management',
      quizManagement: 'Quiz Management',
      role: 'Role',
      status: 'Status',
      active: 'Active',
      inactive: 'Inactive',
      totalUsers: 'Total Users',
      totalQuizzes: 'Total Quizzes',
      totalAttempts: 'Total Attempts'
    },

    // Toasts & Notifications
    notifications: {
      errorOccurred: 'An error occurred',
      somethingWrong: 'Something went wrong',
      tryAgain: 'Please try again',
      noInternet: 'No internet connection',
      timeout: 'Request timeout',
      unauthorized: 'Unauthorized',
      forbidden: 'Access denied',
      notFound: 'Not found',
      serverError: 'Server error'
    }
  }
}

// Langue par défaut
export const defaultLanguage = 'fr'