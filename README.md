# Diet Tracking and Recipe Recommendation Website

A full-stack web application for tracking daily nutrition intake and getting AI-powered recipe recommendations based on your dietary goals.

## Features

- 🔐 **User Authentication**: Secure signup and login with JWT
- 📊 **Daily Nutrition Tracking**: Track calories, protein, carbs, and fat
- 🎯 **Goal Setting**: Set and monitor your daily nutrition goals
- 📝 **Food Logging**: Log meals with detailed nutritional information
- 🤖 **AI Recipe Recommendations**: Get personalized recipe suggestions based on remaining daily goals
- 📈 **Progress Visualization**: Visual progress bars showing goal completion
- 💾 **PostgreSQL Database**: Robust data storage with Neon

## Tech Stack

### Frontend
- React 18
- Tailwind CSS
- React Router v6
- Axios

### Backend
- Node.js
- Express
- PostgreSQL (Neon)
- JWT Authentication
- bcrypt

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- PostgreSQL database (Neon account)

## Installation

### 1. Clone the repository
```bash
cd DietTrackingandRecipeRecommendation
```

### 2. Install Backend Dependencies
```bash
cd backend
npm install
```

### 3. Install Frontend Dependencies
```bash
cd ../frontend
npm install
```

### 4. Environment Configuration

The `.env` file is already configured with your Neon database credentials. If you want to use AI-powered recipe recommendations:

1. Sign up for an AI API (OpenAI, Anthropic, etc.)
2. Add your API key to `.env`:
```env
AI_API_KEY='your-api-key-here'
AI_API_URL='https://api.openai.com/v1/chat/completions'
```

**Note**: The app will work without an AI API key by providing mock recipe recommendations.

### 5. Initialize Database

```bash
cd backend
node init-db.js
```

This will create the necessary tables:
- `users` - User accounts
- `daily_goals` - User nutrition goals
- `food_logs` - Daily food entries

## Running the Application

### Start Backend Server
```bash
cd backend
npm run dev
# or
npm start
```
Backend will run on `http://localhost:3000`

### Start Frontend Development Server
```bash
cd frontend
npm start
```
Frontend will run on `http://localhost:3000` (or next available port if 3000 is taken)

## Usage

1. **Sign Up**: Create a new account with your email and password
2. **Set Goals**: Default goals are set (2000 cal, 150g protein, 250g carbs, 65g fat)
3. **Log Food**: Add meals throughout the day with nutritional information
4. **Track Progress**: Monitor your daily intake with visual progress bars
5. **Get Recipes**: Click "Get Recipe Recommendations" to see AI-suggested recipes based on your remaining daily goals

## API Endpoints

### Authentication
- `POST /api/auth/signup` - Create new user
- `POST /api/auth/login` - Login user

### Nutrition
- `GET /api/nutrition/goals` - Get user's daily goals
- `PUT /api/nutrition/goals` - Update daily goals
- `POST /api/nutrition/log` - Log food entry
- `GET /api/nutrition/logs/today` - Get today's food logs
- `GET /api/nutrition/progress/today` - Get today's progress
- `DELETE /api/nutrition/log/:id` - Delete food log

### Recipes
- `POST /api/recipes/recommendations` - Get recipe recommendations

## Database Schema

### users
- id (SERIAL PRIMARY KEY)
- email (VARCHAR UNIQUE)
- password (VARCHAR - hashed)
- name (VARCHAR)
- created_at (TIMESTAMP)

### daily_goals
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- calories (INTEGER)
- protein (INTEGER)
- carbs (INTEGER)
- fat (INTEGER)
- updated_at (TIMESTAMP)

### food_logs
- id (SERIAL PRIMARY KEY)
- user_id (INTEGER FK)
- food_name (VARCHAR)
- calories (INTEGER)
- protein (INTEGER)
- carbs (INTEGER)
- fat (INTEGER)
- meal_type (VARCHAR)
- log_date (DATE)
- created_at (TIMESTAMP)

## Project Structure

```
DietTrackingandRecipeRecommendation/
├── backend/
│   ├── config/
│   │   ├── database.js
│   │   └── schema.js
│   ├── middleware/
│   │   └── auth.js
│   ├── routes/
│   │   ├── auth.js
│   │   ├── nutrition.js
│   │   └── recipes.js
│   ├── init-db.js
│   ├── server.js
│   └── package.json
├── frontend/
│   ├── public/
│   │   └── index.html
│   ├── src/
│   │   ├── components/
│   │   │   ├── FoodLogForm.js
│   │   │   ├── FoodLogList.js
│   │   │   ├── NutritionTracker.js
│   │   │   └── RecipeRecommendations.js
│   │   ├── context/
│   │   │   └── AuthContext.js
│   │   ├── pages/
│   │   │   ├── Dashboard.js
│   │   │   ├── Login.js
│   │   │   └── Signup.js
│   │   ├── services/
│   │   │   └── api.js
│   │   ├── App.js
│   │   ├── index.css
│   │   └── index.js
│   ├── package.json
│   ├── tailwind.config.js
│   └── postcss.config.js
├── .env
└── README.md
```

## Features in Detail

### Nutrition Tracking
- Add meals with detailed macro information
- Categorize by meal type (breakfast, lunch, dinner, snack)
- View all logged foods for the current day
- Delete entries if needed

### Progress Monitoring
- Visual progress bars for each macro
- Color-coded indicators (blue < 75%, yellow 75-99%, green ≥100%)
- Shows consumed, remaining, and goal values
- Real-time updates as you log food

### Recipe Recommendations
- AI-powered suggestions based on remaining macros
- Detailed nutrition information per recipe
- Step-by-step cooking instructions
- Fallback to mock recipes if AI API is not configured

## Security

- Passwords hashed with bcrypt
- JWT token-based authentication
- Protected API routes
- SSL connection to PostgreSQL database

## Contributing

Feel free to fork this project and submit pull requests for any improvements.

## License

MIT

## Support

For issues or questions, please create an issue in the repository.
