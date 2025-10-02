const express = require('express');
const { body } = require('express-validator');
const { authenticateToken } = require('../middleware/auth');
const authController = require('../controllers/authController');

const router = express.Router();

/**
 * @swagger
 * /auth/register:
 *   post:
 *     summary: Créer un nouveau compte utilisateur
 *     description: |
 *       Permet à un nouvel utilisateur de créer un compte sur la plateforme QuizMaster.
 *       Un email de confirmation sera envoyé (en développement, l'account est directement activé).
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - firstName
 *               - lastName
 *               - role
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email unique
 *                 example: "jean.dupont@example.com"
 *               password:
 *                 type: string
 *                 minLength: 6
 *                 description: Mot de passe (minimum 6 caractères)
 *                 example: "MotDePasse123!"
 *               firstName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Prénom
 *                 example: "Jean"
 *               lastName:
 *                 type: string
 *                 minLength: 2
 *                 maxLength: 100
 *                 description: Nom de famille
 *                 example: "Dupont"
 *               role:
 *                 type: string
 *                 enum: [user, trainer]
 *                 description: |
 *                   Rôle dans le système:
 *                   - **user**: Peut participer aux quiz
 *                   - **trainer**: Peut créer et gérer des quiz
 *                 example: "user"
 *     responses:
 *       201:
 *         description: Compte créé avec succès
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Compte créé avec succès"
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: Erreur de validation
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiError'
 */
router.post('/register',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').isLength({ min: 6 }),
    body('firstName').trim().isLength({ min: 2, max: 100 }),
    body('lastName').trim().isLength({ min: 2, max: 100 }),
    body('role').isIn(['user', 'trainer'])
  ],
  authController.register
);

/**
 * @swagger
 * /auth/verify-email:
 *   post:
 *     summary: Vérifier l'adresse email
 *     description: Vérifier l'adresse email avec le code de confirmation reçu par email
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - code
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *               code:
 *                 type: string
 *                 minLength: 6
 *                 maxLength: 6
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: Email vérifié avec succès
 *       400:
 *         description: Code invalide ou expiré
 */
router.post('/verify-email',
  [
    body('email').isEmail().normalizeEmail(),
    body('code').isLength({ min: 6, max: 6 })
  ],
  authController.verifyEmail
);

/**
 * @swagger
 * /auth/resend-verification:
 *   post:
 *     summary: Renvoyer le code de vérification
 *     description: Renvoie un nouveau code de vérification par email
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "jean.dupont@example.com"
 *     responses:
 *       200:
 *         description: Code renvoyé avec succès
 *       400:
 *         description: Erreur lors de l'envoi
 */
router.post('/resend-verification',
  [
    body('email').isEmail().normalizeEmail()
  ],
  authController.resendVerificationCode
);

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Se connecter à son compte
 *     description: |
 *       Authentifie un utilisateur et retourne un token JWT pour accéder aux endpoints protégés.
 *       Le token doit être inclus dans l'header `Authorization: Bearer <token>` pour les requêtes suivantes.
 *     tags: [Authentication]
 *     security: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *                 description: Adresse email du compte
 *                 example: "jean.dupont@example.com"
 *               password:
 *                 type: string
 *                 description: Mot de passe du compte
 *                 example: "MotDePasse123!"
 *     responses:
 *       200:
 *         description: Connexion réussie
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 message:
 *                   type: string
 *                   example: "Connexion réussie"
 *                 data:
 *                   type: object
 *                   properties:
 *                     token:
 *                       type: string
 *                       description: Token JWT à utiliser pour l'authentification
 *                       example: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       401:
 *         description: Identifiants invalides
 */
router.post('/login',
  [
    body('email').isEmail().normalizeEmail(),
    body('password').notEmpty()
  ],
  authController.login
);

/**
 * @swagger
 * /auth/profile:
 *   get:
 *     summary: Récupérer le profil utilisateur
 *     description: Retourne les informations détaillées du profil de l'utilisateur authentifié
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Profil récupéré avec succès
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       401:
 *         description: Non authentifié
 *   put:
 *     summary: Mettre à jour le profil
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               firstName:
 *                 type: string
 *               lastName:
 *                 type: string
 *               email:
 *                 type: string
 *                 format: email
 *     responses:
 *       200:
 *         description: Profil mis à jour
 */
router.get('/profile', authenticateToken, authController.getProfile);
router.put('/profile',
  authenticateToken,
  [
    body('firstName').optional().trim().isLength({ min: 2, max: 100 }),
    body('lastName').optional().trim().isLength({ min: 2, max: 100 }),
    body('email').optional().isEmail().normalizeEmail()
  ],
  authController.updateProfile
);

/**
 * @swagger
 * /auth/change-password:
 *   put:
 *     summary: Changer le mot de passe
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - currentPassword
 *               - newPassword
 *             properties:
 *               currentPassword:
 *                 type: string
 *               newPassword:
 *                 type: string
 *                 minLength: 6
 *     responses:
 *       200:
 *         description: Mot de passe changé avec succès
 *       400:
 *         description: Mot de passe actuel incorrect
 */
router.put('/change-password',
  authenticateToken,
  [
    body('currentPassword').notEmpty(),
    body('newPassword').isLength({ min: 6 })
  ],
  authController.changePassword
);

/**
 * @swagger
 * /auth/refresh-token:
 *   post:
 *     summary: Renouveler le token JWT
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Token renouvelé avec succès
 */
router.post('/refresh-token', authenticateToken, authController.refreshToken);

/**
 * @swagger
 * /auth/logout:
 *   post:
 *     summary: Se déconnecter
 *     tags: [Authentication]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Déconnexion réussie
 */
router.post('/logout', authenticateToken, authController.logout);

module.exports = router;