require('dotenv').config();
const { sendTestEmail, sendVerificationEmail, sendWelcomeEmail } = require('../src/services/emailService');

/**
 * Test SendGrid integration
 * This script tests all email functions to ensure SendGrid is properly configured
 */
async function testSendGrid() {
  console.log('🧪 Testing SendGrid Integration...\n');
  
  // Check environment variables
  console.log('📋 Checking configuration:');
  console.log(`   SENDGRID_API_KEY: ${process.env.SENDGRID_API_KEY ? '✅ Set' : '❌ Missing'}`);
  console.log(`   SENDGRID_FROM_EMAIL: ${process.env.SENDGRID_FROM_EMAIL || '❌ Missing'}`);
  console.log(`   SENDGRID_FROM_NAME: ${process.env.SENDGRID_FROM_NAME || '❌ Missing'}`);
  console.log('');

  if (!process.env.SENDGRID_API_KEY) {
    console.error('❌ SENDGRID_API_KEY is not set in .env file');
    process.exit(1);
  }

  if (!process.env.SENDGRID_FROM_EMAIL) {
    console.error('❌ SENDGRID_FROM_EMAIL is not set in .env file');
    process.exit(1);
  }

  // Get test email from command line or use default
  const testEmail = process.argv[2] || process.env.SENDGRID_FROM_EMAIL;
  console.log(`📧 Sending test emails to: ${testEmail}\n`);

  try {
    // Test 1: Simple test email
    console.log('1️⃣  Testing simple email...');
    await sendTestEmail(testEmail);
    console.log('   ✅ Simple test email sent successfully!\n');

    // Test 2: Verification code email
    console.log('2️⃣  Testing verification code email...');
    const testUser = {
      email: testEmail,
      firstName: 'Test',
      lastName: 'User'
    };
    await sendVerificationEmail(testUser, '123456');
    console.log('   ✅ Verification email sent successfully!\n');

    // Test 3: Welcome email
    console.log('3️⃣  Testing welcome email...');
    const welcomeUser = {
      email: testEmail,
      firstName: 'Test',
      lastName: 'User',
      role: 'student'
    };
    await sendWelcomeEmail(welcomeUser);
    console.log('   ✅ Welcome email sent successfully!\n');

    console.log('🎉 All tests passed! SendGrid is properly configured.');
    console.log('\n📬 Check your inbox at:', testEmail);
    console.log('💡 Tip: Check spam folder if you don\'t see the emails\n');
    
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error during testing:');
    console.error('   Message:', error.message);
    if (error.response) {
      console.error('   Status:', error.response.status);
      console.error('   Body:', JSON.stringify(error.response.body, null, 2));
    }
    console.log('\n🔍 Troubleshooting:');
    console.log('   1. Verify your SendGrid API key is correct');
    console.log('   2. Ensure your sender email is verified in SendGrid');
    console.log('   3. Check SendGrid dashboard for more details');
    console.log('   4. See SENDGRID_CONFIGURATION.md for setup instructions\n');
    process.exit(1);
  }
}

// Run the test
testSendGrid();
