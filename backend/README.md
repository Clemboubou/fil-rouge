# QuizMaster Backend API

A complete Node.js backend for the QuizMaster gamified quiz platform, built with Express.js, MySQL, and Docker.

## Features

- **User Management**: Registration, authentication, profile management, and role-based access control
- **Quiz Management**: Create, update, delete quizzes with questions and categories
- **Question Management**: Add, edit, delete questions with multiple choice and true/false types
- **Quiz Attempts**: Submit quiz attempts, track scores, and view attempt history
- **Leaderboards**: Global and time-based leaderboards with user rankings
- **Statistics**: Comprehensive user and quiz statistics
- **Security**: JWT authentication, bcrypt password hashing, rate limiting, and input validation
- **Docker Support**: Complete containerization with MySQL database

## Tech Stack

- **Runtime**: Node.js 18+
- **Framework**: Express.js
- **Database**: MySQL 8.0 with Sequelize ORM
- **Authentication**: JWT with bcrypt
- **Validation**: Joi
- **Security**: Helmet, CORS, Rate Limiting
- **Containerization**: Docker & Docker Compose

## Quick Start

### Using Docker (Recommended)

1. **Clone and navigate to the project**:
   ```bash
   cd backend
   ```

2. **Start the application**:
   ```bash
   docker-compose up -d
   ```

3. **Seed the database** (optional but recommended):
   ```bash
   docker-compose exec api npm run seed
   ```

4. **Access the API**:
   - API: http://localhost:3000
   - Health Check: http://localhost:3000/health
   - API Documentation: http://localhost:3000/api
   - PhpMyAdmin: http://localhost:8080 (development only)

### Manual Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Set up environment**:
   ```bash
   cp .env.example .env
   # Edit .env with your database credentials
   ```

3. **Start MySQL database** (ensure MySQL 8.0 is running)

4. **Run the application**:
   ```bash
   npm run dev  # Development
   npm start    # Production
   ```

5. **Seed the database**:
   ```bash
   npm run seed
   ```

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (requires auth)
- `PUT /api/auth/profile` - Update profile (requires auth)
- `PUT /api/auth/change-password` - Change password (requires auth)
- `POST /api/auth/refresh-token` - Refresh JWT token (requires auth)

### Users
- `GET /api/users` - Get all users (admin only)
- `GET /api/users/:id` - Get user by ID (admin only)
- `GET /api/users/stats/:id?` - Get user statistics
- `GET /api/users/leaderboard` - Get leaderboard
- `PUT /api/users/:id/role` - Update user role (admin only)
- `PUT /api/users/:id/deactivate` - Deactivate user (admin only)
- `PUT /api/users/:id/reactivate` - Reactivate user (admin only)

### Quizzes
- `GET /api/quizzes` - Get all quizzes with filters
- `GET /api/quizzes/:id` - Get quiz by ID with questions
- `POST /api/quizzes` - Create new quiz (trainer/admin only)
- `PUT /api/quizzes/:id` - Update quiz (creator/admin only)
- `DELETE /api/quizzes/:id` - Delete quiz (creator/admin only)

### Questions
- `POST /api/quizzes/:id/questions` - Add question to quiz (creator/admin only)
- `PUT /api/quizzes/:id/questions/:questionId` - Update question (creator/admin only)
- `DELETE /api/quizzes/:id/questions/:questionId` - Delete question (creator/admin only)

### Quiz Attempts
- `POST /api/quizzes/:id/attempts` - Submit quiz attempt (requires auth)
- `GET /api/quizzes/:id/attempts` - Get quiz attempts (creator/admin only)
- `GET /api/quizzes/attempts/my` - Get user's quiz attempts (requires auth)

## Data Models

### User
- `id`: Primary key
- `email`: Unique email address
- `password`: Hashed password (bcrypt)
- `firstName`, `lastName`: User names
- `role`: 'user', 'trainer', or 'admin'
- `totalPoints`: Accumulated points from quiz attempts
- `isActive`: Account status

### Quiz
- `id`: Primary key
- `title`: Quiz title
- `description`: Quiz description
- `category`: Quiz category
- `difficulty`: 'easy', 'medium', or 'hard'
- `timeLimit`: Time limit in minutes
- `creatorId`: Foreign key to User
- `isPublished`: Publication status
- `totalQuestions`: Calculated question count
- `totalPoints`: Calculated total points

### Question
- `id`: Primary key
- `quizId`: Foreign key to Quiz
- `text`: Question text
- `type`: 'multiple_choice' or 'true_false'
- `optionA`, `optionB`, `optionC`, `optionD`: Answer options
- `correctAnswer`: 'A', 'B', 'C', or 'D'
- `points`: Points awarded for correct answer
- `explanation`: Optional explanation
- `order`: Question order in quiz

### QuizAttempt
- `id`: Primary key
- `userId`: Foreign key to User
- `quizId`: Foreign key to Quiz
- `score`: Total points scored
- `totalQuestions`: Number of questions in quiz
- `correctAnswers`: Number of correct answers
- `timeTaken`: Time taken in seconds
- `answers`: JSON object with user's answers
- `completedAt`: Completion timestamp

## Security Features

- **JWT Authentication**: 24-hour token expiration
- **Password Hashing**: bcrypt with 12 rounds
- **Rate Limiting**: 100 requests per 15 minutes per IP
- **Input Validation**: Joi schemas for all endpoints
- **CORS Protection**: Configurable origins
- **Security Headers**: Helmet middleware
- **Role-based Access**: User, trainer, and admin roles

## Environment Variables

```env
NODE_ENV=development
PORT=3000
DB_HOST=localhost
DB_PORT=3306
DB_NAME=quizmaster_db
DB_USER=quizmaster_user
DB_PASSWORD=quizmaster_password
JWT_SECRET=your-super-secret-jwt-key
JWT_EXPIRES_IN=24h
CORS_ORIGIN=http://localhost:3000
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
BCRYPT_ROUNDS=12
```

## Test Accounts

After seeding the database, you can use these test accounts:

- **Admin**: admin@quizmaster.com / admin123
- **Trainer**: trainer@quizmaster.com / trainer123
- **User**: user1@quizmaster.com / user123

Additional users (user2-user5) follow the same pattern.

## Development

### Available Scripts

- `npm start` - Start production server
- `npm run dev` - Start development server with nodemon
- `npm run seed` - Seed database with test data
- `npm test` - Run tests
- `npm run db:create` - Create database
- `npm run db:migrate` - Run migrations
- `npm run db:reset` - Reset database and seed

### Database Management

**With Docker:**
```bash
# Reset database and seed
docker-compose exec api npm run db:reset

# Access MySQL CLI
docker-compose exec mysql mysql -u quizmaster_user -pquizmaster_password quizmaster_db

# View logs
docker-compose logs api
docker-compose logs mysql
```

**Manual:**
```bash
# Reset and seed database
npm run db:reset

# Just seed data
npm run seed
```

## Production Deployment

1. **Set environment variables**:
   ```bash
   NODE_ENV=production
   JWT_SECRET=your-very-secure-secret-key
   DB_PASSWORD=your-secure-database-password
   ```

2. **Use Docker Compose**:
   ```bash
   docker-compose -f docker-compose.yml up -d
   ```

3. **Configure reverse proxy** (nginx/Apache) for SSL termination

4. **Set up monitoring** and log aggregation

## Error Handling

The API includes comprehensive error handling:

- **Validation Errors**: 400 with detailed field errors
- **Authentication Errors**: 401 with clear messages
- **Authorization Errors**: 403 for insufficient permissions
- **Not Found Errors**: 404 for missing resources
- **Server Errors**: 500 with sanitized messages in production

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## License

MIT License - see LICENSE file for details.

## Support

For issues and questions:
1. Check the API documentation at `/api` endpoint
2. Review this README
3. Check Docker logs: `docker-compose logs api`
4. Open an issue in the repository