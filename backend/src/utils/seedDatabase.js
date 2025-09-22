const { sequelize, User, Quiz, Question, QuizAttempt } = require('../models');

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Clear existing data in development
    if (process.env.NODE_ENV !== 'production') {
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 0');
      await QuizAttempt.destroy({ where: {}, force: true });
      await Question.destroy({ where: {}, force: true });
      await Quiz.destroy({ where: {}, force: true });
      await User.destroy({ where: {}, force: true });
      await sequelize.query('SET FOREIGN_KEY_CHECKS = 1');
      console.log('🗑️  Cleared existing data');
    }

    // Create users
    console.log('👥 Creating users...');

    const users = await User.bulkCreate([
      {
        email: 'admin@quizmaster.com',
        password: 'admin123',
        firstName: 'Admin',
        lastName: 'User',
        role: 'admin',
        totalPoints: 0
      },
      {
        email: 'trainer@quizmaster.com',
        password: 'trainer123',
        firstName: 'John',
        lastName: 'Trainer',
        role: 'trainer',
        totalPoints: 0
      },
      {
        email: 'trainer2@quizmaster.com',
        password: 'trainer123',
        firstName: 'Sarah',
        lastName: 'Wilson',
        role: 'trainer',
        totalPoints: 0
      },
      {
        email: 'user1@quizmaster.com',
        password: 'user123',
        firstName: 'Alice',
        lastName: 'Johnson',
        role: 'user',
        totalPoints: 85
      },
      {
        email: 'user2@quizmaster.com',
        password: 'user123',
        firstName: 'Bob',
        lastName: 'Smith',
        role: 'user',
        totalPoints: 120
      },
      {
        email: 'user3@quizmaster.com',
        password: 'user123',
        firstName: 'Emma',
        lastName: 'Davis',
        role: 'user',
        totalPoints: 95
      },
      {
        email: 'user4@quizmaster.com',
        password: 'user123',
        firstName: 'Mike',
        lastName: 'Brown',
        role: 'user',
        totalPoints: 200
      },
      {
        email: 'user5@quizmaster.com',
        password: 'user123',
        firstName: 'Lisa',
        lastName: 'Taylor',
        role: 'user',
        totalPoints: 150
      }
    ], { individualHooks: true });

    console.log(`✅ Created ${users.length} users`);

    // Create quizzes
    console.log('📚 Creating quizzes...');

    const quizzes = await Quiz.bulkCreate([
      {
        title: 'JavaScript Fundamentals',
        description: 'Test your knowledge of JavaScript basics including variables, functions, and data types.',
        category: 'Programming',
        difficulty: 'easy',
        timeLimit: 30,
        creatorId: users[1].id, // John Trainer
        isPublished: true
      },
      {
        title: 'Advanced JavaScript Concepts',
        description: 'Dive deep into closures, prototypes, async/await, and advanced JavaScript patterns.',
        category: 'Programming',
        difficulty: 'hard',
        timeLimit: 45,
        creatorId: users[1].id, // John Trainer
        isPublished: true
      },
      {
        title: 'React.js Essentials',
        description: 'Learn the fundamentals of React including components, state, props, and hooks.',
        category: 'Frontend',
        difficulty: 'medium',
        timeLimit: 40,
        creatorId: users[2].id, // Sarah Wilson
        isPublished: true
      },
      {
        title: 'Database Design Principles',
        description: 'Understanding relational databases, normalization, and SQL fundamentals.',
        category: 'Database',
        difficulty: 'medium',
        timeLimit: 35,
        creatorId: users[2].id, // Sarah Wilson
        isPublished: true
      },
      {
        title: 'Node.js Backend Development',
        description: 'Server-side JavaScript with Express.js, APIs, and database integration.',
        category: 'Backend',
        difficulty: 'hard',
        timeLimit: 50,
        creatorId: users[1].id, // John Trainer
        isPublished: false
      },
      {
        title: 'HTML & CSS Basics',
        description: 'Foundation of web development with semantic HTML and modern CSS.',
        category: 'Frontend',
        difficulty: 'easy',
        timeLimit: 25,
        creatorId: users[2].id, // Sarah Wilson
        isPublished: true
      }
    ]);

    console.log(`✅ Created ${quizzes.length} quizzes`);

    // Create questions for each quiz
    console.log('❓ Creating questions...');

    const questionsData = [
      // JavaScript Fundamentals Quiz Questions
      {
        quizId: quizzes[0].id,
        text: 'What is the correct way to declare a variable in JavaScript?',
        type: 'multiple_choice',
        optionA: 'variable x = 5;',
        optionB: 'var x = 5;',
        optionC: 'v x = 5;',
        optionD: 'declare x = 5;',
        correctAnswer: 'B',
        points: 10,
        explanation: 'The "var" keyword is used to declare variables in JavaScript.',
        order: 1
      },
      {
        quizId: quizzes[0].id,
        text: 'Which of the following is NOT a primitive data type in JavaScript?',
        type: 'multiple_choice',
        optionA: 'string',
        optionB: 'number',
        optionC: 'array',
        optionD: 'boolean',
        correctAnswer: 'C',
        points: 10,
        explanation: 'Array is an object type, not a primitive data type.',
        order: 2
      },
      {
        quizId: quizzes[0].id,
        text: 'What does the "typeof" operator return for null in JavaScript?',
        type: 'multiple_choice',
        optionA: 'null',
        optionB: 'undefined',
        optionC: 'object',
        optionD: 'number',
        correctAnswer: 'C',
        points: 15,
        explanation: 'This is a well-known quirk in JavaScript - typeof null returns "object".',
        order: 3
      },
      {
        quizId: quizzes[0].id,
        text: 'Functions in JavaScript are first-class objects.',
        type: 'true_false',
        optionA: 'True',
        optionB: 'False',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        points: 10,
        explanation: 'JavaScript functions are first-class objects, meaning they can be stored in variables, passed as arguments, and returned from other functions.',
        order: 4
      },
      {
        quizId: quizzes[0].id,
        text: 'Which method is used to add an element to the end of an array?',
        type: 'multiple_choice',
        optionA: 'append()',
        optionB: 'add()',
        optionC: 'push()',
        optionD: 'insert()',
        correctAnswer: 'C',
        points: 10,
        explanation: 'The push() method adds one or more elements to the end of an array.',
        order: 5
      },

      // Advanced JavaScript Concepts Quiz Questions
      {
        quizId: quizzes[1].id,
        text: 'What is a closure in JavaScript?',
        type: 'multiple_choice',
        optionA: 'A function that has access to variables in its outer scope',
        optionB: 'A way to close a program',
        optionC: 'A type of loop',
        optionD: 'A method to hide variables',
        correctAnswer: 'A',
        points: 15,
        explanation: 'A closure is a function that has access to variables in its outer (enclosing) scope even after the outer function has returned.',
        order: 1
      },
      {
        quizId: quizzes[1].id,
        text: 'What does "async/await" help with in JavaScript?',
        type: 'multiple_choice',
        optionA: 'Making code run faster',
        optionB: 'Handling asynchronous operations',
        optionC: 'Creating loops',
        optionD: 'Declaring variables',
        correctAnswer: 'B',
        points: 15,
        explanation: 'async/await is syntactic sugar for handling Promises and asynchronous operations in a more readable way.',
        order: 2
      },
      {
        quizId: quizzes[1].id,
        text: 'In JavaScript, "this" keyword always refers to the global object.',
        type: 'true_false',
        optionA: 'True',
        optionB: 'False',
        optionC: '',
        optionD: '',
        correctAnswer: 'B',
        points: 20,
        explanation: 'The value of "this" depends on how a function is called, not where it is defined.',
        order: 3
      },

      // React.js Essentials Quiz Questions
      {
        quizId: quizzes[2].id,
        text: 'What is JSX in React?',
        type: 'multiple_choice',
        optionA: 'A JavaScript library',
        optionB: 'A syntax extension for JavaScript',
        optionC: 'A CSS framework',
        optionD: 'A database query language',
        correctAnswer: 'B',
        points: 10,
        explanation: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
        order: 1
      },
      {
        quizId: quizzes[2].id,
        text: 'Which hook is used for state management in functional components?',
        type: 'multiple_choice',
        optionA: 'useEffect',
        optionB: 'useContext',
        optionC: 'useState',
        optionD: 'useReducer',
        correctAnswer: 'C',
        points: 10,
        explanation: 'useState is the primary hook for managing state in React functional components.',
        order: 2
      },
      {
        quizId: quizzes[2].id,
        text: 'Props in React are mutable.',
        type: 'true_false',
        optionA: 'True',
        optionB: 'False',
        optionC: '',
        optionD: '',
        correctAnswer: 'B',
        points: 15,
        explanation: 'Props are read-only and should not be modified by the component that receives them.',
        order: 3
      },

      // Database Design Principles Quiz Questions
      {
        quizId: quizzes[3].id,
        text: 'What is the primary purpose of database normalization?',
        type: 'multiple_choice',
        optionA: 'To increase database size',
        optionB: 'To reduce data redundancy',
        optionC: 'To make queries slower',
        optionD: 'To add more tables',
        correctAnswer: 'B',
        points: 15,
        explanation: 'Normalization reduces data redundancy and improves data integrity.',
        order: 1
      },
      {
        quizId: quizzes[3].id,
        text: 'What does SQL stand for?',
        type: 'multiple_choice',
        optionA: 'Structured Query Language',
        optionB: 'Simple Query Language',
        optionC: 'Standard Query Language',
        optionD: 'System Query Language',
        correctAnswer: 'A',
        points: 10,
        explanation: 'SQL stands for Structured Query Language.',
        order: 2
      },

      // HTML & CSS Basics Quiz Questions
      {
        quizId: quizzes[5].id,
        text: 'What does HTML stand for?',
        type: 'multiple_choice',
        optionA: 'Hyper Text Markup Language',
        optionB: 'Home Tool Markup Language',
        optionC: 'Hyperlinks and Text Markup Language',
        optionD: 'Hyper Text Making Language',
        correctAnswer: 'A',
        points: 10,
        explanation: 'HTML stands for Hyper Text Markup Language.',
        order: 1
      },
      {
        quizId: quizzes[5].id,
        text: 'Which CSS property is used to change the text color?',
        type: 'multiple_choice',
        optionA: 'text-color',
        optionB: 'font-color',
        optionC: 'color',
        optionD: 'text-style',
        correctAnswer: 'C',
        points: 10,
        explanation: 'The "color" property is used to set the color of text.',
        order: 2
      },
      {
        quizId: quizzes[5].id,
        text: 'CSS stands for Cascading Style Sheets.',
        type: 'true_false',
        optionA: 'True',
        optionB: 'False',
        optionC: '',
        optionD: '',
        correctAnswer: 'A',
        points: 10,
        explanation: 'CSS indeed stands for Cascading Style Sheets.',
        order: 3
      }
    ];

    const questions = await Question.bulkCreate(questionsData);
    console.log(`✅ Created ${questions.length} questions`);

    // Update quiz totals
    console.log('📊 Updating quiz statistics...');
    for (const quiz of quizzes) {
      const quizQuestions = questions.filter(q => q.quizId === quiz.id);
      const totalQuestions = quizQuestions.length;
      const totalPoints = quizQuestions.reduce((sum, q) => sum + q.points, 0);

      await Quiz.update(
        { totalQuestions, totalPoints },
        { where: { id: quiz.id } }
      );
    }

    // Create quiz attempts
    console.log('🎯 Creating quiz attempts...');

    const attempts = await QuizAttempt.bulkCreate([
      {
        userId: users[3].id, // Alice
        quizId: quizzes[0].id, // JavaScript Fundamentals
        score: 45,
        totalQuestions: 5,
        correctAnswers: 3,
        timeTaken: 1200, // 20 minutes
        answers: { "1": "B", "2": "C", "3": "C", "4": "A", "5": "C" },
        completedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000) // 2 days ago
      },
      {
        userId: users[4].id, // Bob
        quizId: quizzes[0].id, // JavaScript Fundamentals
        score: 55,
        totalQuestions: 5,
        correctAnswers: 4,
        timeTaken: 900, // 15 minutes
        answers: { "1": "B", "2": "C", "3": "C", "4": "A", "5": "C" },
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: users[5].id, // Emma
        quizId: quizzes[2].id, // React.js Essentials
        score: 35,
        totalQuestions: 3,
        correctAnswers: 3,
        timeTaken: 1500, // 25 minutes
        answers: { "9": "B", "10": "C", "11": "B" },
        completedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000) // 3 days ago
      },
      {
        userId: users[6].id, // Mike
        quizId: quizzes[0].id, // JavaScript Fundamentals
        score: 55,
        totalQuestions: 5,
        correctAnswers: 4,
        timeTaken: 800, // 13 minutes
        answers: { "1": "B", "2": "C", "3": "C", "4": "A", "5": "C" },
        completedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000) // 1 day ago
      },
      {
        userId: users[6].id, // Mike
        quizId: quizzes[2].id, // React.js Essentials
        score: 35,
        totalQuestions: 3,
        correctAnswers: 3,
        timeTaken: 1200, // 20 minutes
        answers: { "9": "B", "10": "C", "11": "B" },
        completedAt: new Date()
      },
      {
        userId: users[7].id, // Lisa
        quizId: quizzes[5].id, // HTML & CSS Basics
        score: 30,
        totalQuestions: 3,
        correctAnswers: 3,
        timeTaken: 600, // 10 minutes
        answers: { "16": "A", "17": "C", "18": "A" },
        completedAt: new Date(Date.now() - 1 * 60 * 60 * 1000) // 1 hour ago
      },
      {
        userId: users[3].id, // Alice
        quizId: quizzes[5].id, // HTML & CSS Basics
        score: 20,
        totalQuestions: 3,
        correctAnswers: 2,
        timeTaken: 800, // 13 minutes
        answers: { "16": "A", "17": "A", "18": "A" },
        completedAt: new Date(Date.now() - 2 * 60 * 60 * 1000) // 2 hours ago
      }
    ]);

    console.log(`✅ Created ${attempts.length} quiz attempts`);

    console.log('\n🎉 Database seeding completed successfully!');
    console.log('\n📋 Seeded data summary:');
    console.log(`   👥 Users: ${users.length} (1 admin, 2 trainers, 5 regular users)`);
    console.log(`   📚 Quizzes: ${quizzes.length} (5 published, 1 draft)`);
    console.log(`   ❓ Questions: ${questions.length}`);
    console.log(`   🎯 Quiz Attempts: ${attempts.length}`);

    console.log('\n🔐 Test accounts:');
    console.log('   Admin: admin@quizmaster.com / admin123');
    console.log('   Trainer: trainer@quizmaster.com / trainer123');
    console.log('   User: user1@quizmaster.com / user123');
    console.log('   (More users available with similar pattern)');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  }
};

// Run seeding if this file is executed directly
if (require.main === module) {
  const run = async () => {
    try {
      await seedDatabase();
      process.exit(0);
    } catch (error) {
      console.error('Failed to seed database:', error);
      process.exit(1);
    }
  };

  run();
}

module.exports = { seedDatabase };