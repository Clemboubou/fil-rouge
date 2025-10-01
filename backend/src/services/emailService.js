const sgMail = require('@sendgrid/mail');

// Initialize SendGrid with API key
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

/**
 * Send verification code email to new user
 * @param {Object} user - User object with email, firstName, lastName
 * @param {string} verificationCode - 6-digit verification code
 */
const sendVerificationEmail = async (user, verificationCode) => {
  try {
    const msg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: 'Code de vérification QuizMaster - ' + verificationCode,
      text: `
Bonjour ${user.firstName} ${user.lastName},

Merci de vous inscrire sur QuizMaster !

Votre code de vérification est : ${verificationCode}

Ce code expire dans 15 minutes.

Si vous n'avez pas demandé cette inscription, ignorez cet email.

L'équipe QuizMaster
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
    }
    .content {
      padding: 40px 30px;
      text-align: center;
    }
    .code-box {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      font-size: 48px;
      font-weight: bold;
      letter-spacing: 10px;
      padding: 30px;
      margin: 30px 0;
      border-radius: 10px;
      box-shadow: 0 4px 15px rgba(102, 126, 234, 0.3);
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
      text-align: left;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔐 QuizMaster</h1>
      <p>Code de vérification</p>
    </div>

    <div class="content">
      <h2>Bonjour ${user.firstName} ${user.lastName} ! 👋</h2>

      <p>Merci de vous inscrire sur <strong>QuizMaster</strong> !</p>

      <p>Voici votre code de vérification :</p>

      <div class="code-box">
        ${verificationCode}
      </div>

      <div class="warning">
        <strong>⚠️ Important :</strong>
        <ul>
          <li>Ce code expire dans <strong>15 minutes</strong></li>
          <li>Ne partagez ce code avec personne</li>
          <li>Si vous n'avez pas demandé cette inscription, ignorez cet email</li>
        </ul>
      </div>

      <p>Entrez ce code sur la page d'inscription pour activer votre compte.</p>
    </div>

    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>© ${new Date().getFullYear()} QuizMaster - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Verification email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending verification email:', error.message);
    throw error;
  }
};

/**
 * Send welcome email to verified user
 * @param {Object} user - User object with email, firstName, lastName
 */
const sendWelcomeEmail = async (user) => {
  try {
    const msg = {
      to: user.email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: 'Bienvenue sur QuizMaster ! 🎉',
      text: `
Bonjour ${user.firstName} ${user.lastName},

Bienvenue sur QuizMaster, la plateforme de quiz gamifiée !

Nous sommes ravis de vous compter parmi nous. Vous pouvez maintenant :
${user.role === 'trainer' ? '- Créer vos propres quiz\n- Suivre les progrès de vos étudiants' : '- Participer à des quiz passionnants\n- Gagner des points et des badges'}
- Consulter le classement
- Débloquer des récompenses

Connectez-vous dès maintenant pour commencer votre aventure !

À bientôt sur QuizMaster,
L'équipe QuizMaster
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
      margin: 0;
      padding: 0;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .header h1 {
      margin: 0;
      font-size: 32px;
    }
    .header p {
      margin: 10px 0 0 0;
      font-size: 18px;
      opacity: 0.9;
    }
    .content {
      padding: 40px 30px;
    }
    .content h2 {
      color: #667eea;
      font-size: 24px;
      margin-top: 0;
    }
    .features {
      background-color: #f8f9fa;
      border-left: 4px solid #667eea;
      padding: 20px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .features ul {
      margin: 10px 0;
      padding-left: 20px;
    }
    .features li {
      margin: 8px 0;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🎓 QuizMaster</h1>
      <p>La plateforme de quiz gamifiée</p>
    </div>

    <div class="content">
      <h2>Bonjour ${user.firstName} ${user.lastName} ! 👋</h2>

      <p>Nous sommes ravis de vous accueillir sur <strong>QuizMaster</strong>, votre nouvelle plateforme d'apprentissage gamifiée !</p>

      <div class="features">
        <h3>🚀 Ce que vous pouvez faire :</h3>
        <ul>
          ${user.role === 'trainer'
            ? '<li>✏️ Créer vos propres quiz interactifs</li><li>📊 Suivre les progrès de vos étudiants</li><li>📈 Analyser les performances</li>'
            : '<li>🎮 Participer à des quiz passionnants</li><li>🏆 Gagner des points et des badges</li><li>📈 Suivre votre progression</li>'
          }
          <li>🎯 Consulter le classement</li>
          <li>⭐ Débloquer des récompenses</li>
        </ul>
      </div>

      <p>Prêt à commencer votre aventure ? Connectez-vous dès maintenant !</p>

      <center>
        <a href="${process.env.CORS_ORIGIN || 'http://localhost:3000'}/login" class="button">
          Se connecter à QuizMaster
        </a>
      </center>

      <p style="margin-top: 30px;">À très bientôt,<br><strong>L'équipe QuizMaster</strong></p>
    </div>

    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>© ${new Date().getFullYear()} QuizMaster - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Welcome email sent to ${user.email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending welcome email:', error.message);
    // Don't throw error - we don't want to fail registration if email fails
    return { success: false, error: error.message };
  }
};

/**
 * Send password reset email
 * @param {string} email - User email
 * @param {string} resetToken - Password reset token
 */
const sendPasswordResetEmail = async (email, resetToken) => {
  try {
    const resetUrl = `${process.env.CORS_ORIGIN || 'http://localhost:3000'}/reset-password?token=${resetToken}`;

    const msg = {
      to: email,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: 'Réinitialisation de votre mot de passe - QuizMaster',
      text: `
Vous avez demandé à réinitialiser votre mot de passe QuizMaster.

Cliquez sur le lien suivant pour réinitialiser votre mot de passe :
${resetUrl}

Ce lien expirera dans 1 heure.

Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.

L'équipe QuizMaster
      `,
      html: `
<!DOCTYPE html>
<html>
<head>
  <style>
    body {
      font-family: 'Arial', sans-serif;
      line-height: 1.6;
      color: #333;
      background-color: #f4f4f4;
    }
    .container {
      max-width: 600px;
      margin: 20px auto;
      background-color: #ffffff;
      border-radius: 10px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .header {
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 40px 20px;
      text-align: center;
    }
    .content {
      padding: 40px 30px;
    }
    .button {
      display: inline-block;
      background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
      color: white;
      padding: 15px 40px;
      text-decoration: none;
      border-radius: 5px;
      font-weight: bold;
      margin: 20px 0;
    }
    .warning {
      background-color: #fff3cd;
      border-left: 4px solid #ffc107;
      padding: 15px;
      margin: 20px 0;
      border-radius: 5px;
    }
    .footer {
      background-color: #f8f9fa;
      padding: 20px;
      text-align: center;
      color: #666;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>🔒 QuizMaster</h1>
      <p>Réinitialisation de mot de passe</p>
    </div>

    <div class="content">
      <h2>Réinitialisation de votre mot de passe</h2>

      <p>Vous avez demandé à réinitialiser votre mot de passe QuizMaster.</p>

      <center>
        <a href="${resetUrl}" class="button">
          Réinitialiser mon mot de passe
        </a>
      </center>

      <div class="warning">
        <strong>⚠️ Important :</strong>
        <ul>
          <li>Ce lien expire dans <strong>1 heure</strong></li>
          <li>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email</li>
          <li>Votre mot de passe actuel reste valide tant que vous n'en créez pas un nouveau</li>
        </ul>
      </div>

      <p>L'équipe QuizMaster</p>
    </div>

    <div class="footer">
      <p>Cet email a été envoyé automatiquement, merci de ne pas y répondre.</p>
      <p>© ${new Date().getFullYear()} QuizMaster - Tous droits réservés</p>
    </div>
  </div>
</body>
</html>
      `
    };

    await sgMail.send(msg);
    console.log(`✅ Password reset email sent to ${email}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending password reset email:', error.message);
    throw error;
  }
};

/**
 * Send test email
 * @param {string} toEmail - Recipient email
 */
const sendTestEmail = async (toEmail) => {
  try {
    const msg = {
      to: toEmail,
      from: {
        email: process.env.SENDGRID_FROM_EMAIL,
        name: process.env.SENDGRID_FROM_NAME
      },
      subject: 'Test Email - QuizMaster',
      text: 'Ceci est un email de test de QuizMaster. Si vous recevez cet email, la configuration SendGrid fonctionne correctement !',
      html: '<strong>Ceci est un email de test de QuizMaster.</strong><p>Si vous recevez cet email, la configuration SendGrid fonctionne correctement ! ✅</p>',
    };

    await sgMail.send(msg);
    console.log(`✅ Test email sent to ${toEmail}`);
    return { success: true };
  } catch (error) {
    console.error('❌ Error sending test email:', error.message);
    throw error;
  }
};

module.exports = {
  sendVerificationEmail,
  sendWelcomeEmail,
  sendPasswordResetEmail,
  sendTestEmail
};
