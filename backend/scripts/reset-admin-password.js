require('dotenv').config();
const bcrypt = require('bcryptjs');
const { sequelize, User } = require('../src/models');

async function resetAdminPassword() {
  try {
    console.log('🔄 Resetting admin password...\n');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Find admin user
    const admin = await User.findOne({ where: { email: 'admin@quizmaster.com' } });
    
    if (!admin) {
      console.error('❌ Admin user not found');
      process.exit(1);
    }

    // Hash new password
    const newPassword = 'Admin123!';
    const hashedPassword = await bcrypt.hash(newPassword, 12);

    // Update admin user
    await admin.update({
      password: hashedPassword,
      isActive: true,
      isEmailVerified: true
    });

    console.log('\n✅ Admin password reset successfully!');
    console.log('\n📧 Email: admin@quizmaster.com');
    console.log('🔑 Password: Admin123!');
    console.log('\n✅ Account is now active and verified\n');

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

resetAdminPassword();
