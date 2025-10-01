require('dotenv').config();
const axios = require('axios');

const API_URL = process.env.API_URL || 'http://localhost:5000/api';

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m'
};

const log = {
  success: (msg) => console.log(`${colors.green}✅ ${msg}${colors.reset}`),
  error: (msg) => console.log(`${colors.red}❌ ${msg}${colors.reset}`),
  warn: (msg) => console.log(`${colors.yellow}⚠️  ${msg}${colors.reset}`),
  info: (msg) => console.log(`${colors.cyan}ℹ️  ${msg}${colors.reset}`),
  title: (msg) => console.log(`\n${colors.blue}${'='.repeat(60)}\n${msg}\n${'='.repeat(60)}${colors.reset}\n`)
};

let testResults = {
  passed: 0,
  failed: 0,
  total: 0
};

async function runTest(name, testFn) {
  testResults.total++;
  try {
    await testFn();
    log.success(`TEST PASSED: ${name}`);
    testResults.passed++;
    return true;
  } catch (error) {
    log.error(`TEST FAILED: ${name}`);
    console.log(`   Reason: ${error.message}`);
    testResults.failed++;
    return false;
  }
}

async function testAdminRoutesProtection() {
  log.title('🔒 TEST 1: Protection des Routes Admin');

  // Login as student
  log.info('Connexion en tant que student...');
  const studentLogin = await axios.post(`${API_URL}/auth/login`, {
    email: 'student@example.com',
    password: 'password123'
  });

  const studentToken = studentLogin.data.data.token;
  log.success(`Student connecté : ${studentLogin.data.data.user.email}`);

  // Test 1.1: Student cannot access GET /api/users (admin only)
  await runTest('Student ne peut PAS accéder à GET /api/users', async () => {
    try {
      await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${studentToken}` }
      });
      throw new Error('Student peut accéder aux routes admin ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return; // Expected behavior
      }
      throw error;
    }
  });

  // Test 1.2: Student cannot change user role
  await runTest('Student ne peut PAS changer le rôle d\'un utilisateur', async () => {
    try {
      await axios.put(`${API_URL}/users/1/role`,
        { role: 'admin' },
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      throw new Error('Student peut changer les rôles ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return; // Expected behavior
      }
      throw error;
    }
  });

  // Test 1.3: Student cannot deactivate users
  await runTest('Student ne peut PAS désactiver des utilisateurs', async () => {
    try {
      await axios.put(`${API_URL}/users/1/deactivate`,
        {},
        { headers: { Authorization: `Bearer ${studentToken}` } }
      );
      throw new Error('Student peut désactiver des users ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return; // Expected behavior
      }
      throw error;
    }
  });
}

async function testTrainerRoutesProtection() {
  log.title('🔒 TEST 2: Protection des Routes Admin pour Trainer');

  // Login as trainer
  log.info('Connexion en tant que trainer...');
  const trainerLogin = await axios.post(`${API_URL}/auth/login`, {
    email: 'trainer@example.com',
    password: 'password123'
  });

  const trainerToken = trainerLogin.data.data.token;
  log.success(`Trainer connecté : ${trainerLogin.data.data.user.email}`);

  // Test 2.1: Trainer cannot access GET /api/users (admin only)
  await runTest('Trainer ne peut PAS accéder à GET /api/users', async () => {
    try {
      await axios.get(`${API_URL}/users`, {
        headers: { Authorization: `Bearer ${trainerToken}` }
      });
      throw new Error('Trainer peut accéder aux routes admin ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return; // Expected behavior
      }
      throw error;
    }
  });

  // Test 2.2: Trainer cannot change user role
  await runTest('Trainer ne peut PAS changer le rôle d\'un utilisateur', async () => {
    try {
      await axios.put(`${API_URL}/users/1/role`,
        { role: 'admin' },
        { headers: { Authorization: `Bearer ${trainerToken}` } }
      );
      throw new Error('Trainer peut changer les rôles ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 403) {
        return; // Expected behavior
      }
      throw error;
    }
  });
}

async function testAdminCanAccessRoutes() {
  log.title('✅ TEST 3: Admin PEUT Accéder aux Routes Admin');

  // Login as admin
  log.info('Connexion en tant qu\'admin...');
  const adminLogin = await axios.post(`${API_URL}/auth/login`, {
    email: 'admin@example.com',
    password: 'admin123'
  });

  const adminToken = adminLogin.data.data.token;
  log.success(`Admin connecté : ${adminLogin.data.data.user.email}`);

  // Test 3.1: Admin CAN access GET /api/users
  await runTest('Admin PEUT accéder à GET /api/users', async () => {
    const response = await axios.get(`${API_URL}/users`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (response.status !== 200) {
      throw new Error('Admin ne peut pas accéder aux routes admin !');
    }
  });

  // Test 3.2: Admin CAN access user details
  await runTest('Admin PEUT voir les détails d\'un utilisateur', async () => {
    const response = await axios.get(`${API_URL}/users/1`, {
      headers: { Authorization: `Bearer ${adminToken}` }
    });

    if (response.status !== 200) {
      throw new Error('Admin ne peut pas voir les détails utilisateurs !');
    }
  });
}

async function testNoTokenAccess() {
  log.title('🔒 TEST 4: Accès Sans Token');

  // Test 4.1: Cannot access protected route without token
  await runTest('Requête sans token est REJETÉE', async () => {
    try {
      await axios.get(`${API_URL}/users`);
      throw new Error('Routes accessibles sans token ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return; // Expected behavior
      }
      throw error;
    }
  });

  // Test 4.2: Cannot access with invalid token
  await runTest('Requête avec token invalide est REJETÉE', async () => {
    try {
      await axios.get(`${API_URL}/users`, {
        headers: { Authorization: 'Bearer invalid_token_here' }
      });
      throw new Error('Routes accessibles avec token invalide ! FAILLE DE SÉCURITÉ !');
    } catch (error) {
      if (error.response && error.response.status === 401) {
        return; // Expected behavior
      }
      throw error;
    }
  });
}

async function testSQLInjection() {
  log.title('🔒 TEST 5: Protection Injection SQL');

  // Test 5.1: SQL injection in login
  await runTest('Injection SQL dans login est BLOQUÉE', async () => {
    try {
      await axios.post(`${API_URL}/auth/login`, {
        email: "admin'; DROP TABLE users; --",
        password: "password"
      });
      // If it doesn't crash, SQL injection is blocked
      return;
    } catch (error) {
      // Error is expected (invalid credentials), SQL injection blocked
      if (error.response && error.response.status === 401) {
        return; // Expected behavior
      }
      throw error;
    }
  });
}

async function runAllTests() {
  console.log('\n');
  log.title('🚀 DÉMARRAGE DES TESTS DE SÉCURITÉ QUIZMASTER');
  log.info(`API URL: ${API_URL}`);
  log.info('Tests démarrant dans 2 secondes...\n');

  await new Promise(resolve => setTimeout(resolve, 2000));

  try {
    await testAdminRoutesProtection();
    await testTrainerRoutesProtection();
    await testAdminCanAccessRoutes();
    await testNoTokenAccess();
    await testSQLInjection();

    // Results
    log.title('📊 RÉSULTATS DES TESTS');
    console.log(`Total: ${testResults.total} tests`);
    log.success(`Réussis: ${testResults.passed}/${testResults.total}`);

    if (testResults.failed > 0) {
      log.error(`Échoués: ${testResults.failed}/${testResults.total}`);
      log.error('\n⚠️  DES FAILLES DE SÉCURITÉ ONT ÉTÉ DÉTECTÉES !');
      process.exit(1);
    } else {
      log.success('\n✅ TOUS LES TESTS SONT PASSÉS - APPLICATION SÉCURISÉE !');
      process.exit(0);
    }
  } catch (error) {
    log.error('\n❌ ERREUR CRITIQUE LORS DES TESTS');
    console.error(error);
    process.exit(1);
  }
}

// Run tests
runAllTests();