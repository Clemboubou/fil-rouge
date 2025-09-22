const bcrypt = require('bcryptjs');

async function hashPassword() {
  const password = 'trainer123';
  const salt = await bcrypt.genSalt(12);
  const hashedPassword = await bcrypt.hash(password, salt);
  console.log('Hashed password for trainer123:', hashedPassword);
}

hashPassword().catch(console.error);
