# QuizMaster Frontend

A modern Vue.js 3 frontend application for the QuizMaster gamified learning platform.

## Features

- **Modern Stack**: Vue 3 with Composition API, Pinia state management, Vue Router 4
- **Responsive Design**: Tailwind CSS with mobile-first approach
- **Authentication**: JWT-based authentication with role-based access control
- **Quiz Management**: Create, edit, and take interactive quizzes with timer functionality
- **Real-time Features**: Live leaderboards and progress tracking
- **User Roles**: Support for both student and trainer accounts
- **Interactive UI**: Smooth animations and transitions with loading states

## Technology Stack

- **Framework**: Vue.js 3 with Composition API
- **Build Tool**: Vite
- **State Management**: Pinia
- **Routing**: Vue Router 4
- **HTTP Client**: Axios with interceptors
- **Styling**: Tailwind CSS
- **Icons**: Heroicons

## Project Structure

```
frontend/
├── src/
│   ├── components/          # Reusable Vue components
│   │   ├── QuizCard.vue
│   │   ├── QuestionForm.vue
│   │   └── Leaderboard.vue
│   ├── views/               # Page components
│   │   ├── Home.vue
│   │   ├── Login.vue
│   │   ├── Register.vue
│   │   ├── Dashboard.vue
│   │   ├── QuizTaking.vue
│   │   └── QuizCreation.vue
│   ├── stores/              # Pinia stores
│   │   ├── auth.js
│   │   └── quiz.js
│   ├── router/              # Vue Router configuration
│   │   └── index.js
│   ├── services/            # API service layer
│   │   └── api.js
│   ├── assets/              # Static assets
│   │   └── css/
│   │       └── main.css
│   ├── App.vue              # Root component
│   └── main.js              # Application entry point
├── package.json
├── vite.config.js
├── tailwind.config.js
└── index.html
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository and navigate to the frontend directory:
```bash
cd frontend
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
```

4. Update the `.env` file with your backend API URL:
```env
VITE_API_URL=http://localhost:5000/api
```

### Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

## API Integration

The frontend expects a REST API backend with the following endpoints:

### Authentication
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/auth/profile` - Get user profile

### Quizzes
- `GET /api/quizzes` - Get all quizzes
- `POST /api/quizzes` - Create new quiz (trainer only)
- `GET /api/quizzes/:id` - Get quiz by ID
- `PUT /api/quizzes/:id` - Update quiz (trainer only)
- `DELETE /api/quizzes/:id` - Delete quiz (trainer only)
- `GET /api/quizzes/:id/questions` - Get quiz questions for taking
- `POST /api/quizzes/:id/submit` - Submit quiz answers

### Statistics & Leaderboard
- `GET /api/stats/dashboard` - Get dashboard statistics
- `GET /api/quizzes/:id/leaderboard` - Get quiz leaderboard
- `GET /api/leaderboard` - Get global leaderboard

## User Roles

### Students
- Take quizzes with timer functionality
- View progress and scores
- Access leaderboards
- Track personal statistics

### Trainers
- Create and manage quizzes
- Edit quiz questions and settings
- View quiz statistics and analytics
- Manage quiz publication status

## Features in Detail

### Quiz Taking Experience
- 30-second timer per question (configurable)
- Real-time progress tracking
- Instant feedback on completion
- Prevention of accidental navigation during quiz

### Quiz Creation (Trainers)
- Intuitive question builder
- Multiple choice and true/false questions
- Draft and publish workflow
- Question explanation support

### Responsive Design
- Mobile-first approach with Tailwind CSS
- Optimized for all screen sizes
- Touch-friendly interfaces
- Accessible components

### State Management
- Centralized state with Pinia
- Persistent authentication
- Real-time data synchronization
- Optimistic UI updates

## Environment Variables

- `VITE_API_URL`: Backend API base URL
- `VITE_APP_NAME`: Application name
- `VITE_APP_VERSION`: Application version

## Contributing

1. Follow Vue.js best practices and style guide
2. Use Composition API for all new components
3. Ensure responsive design with Tailwind CSS
4. Add proper error handling and loading states
5. Write clear commit messages

## License

This project is part of the QuizMaster learning platform.