# Quick Start Guide

## Your Diet Tracking Website is Now Ready! 🎉

### Application URLs

- **Frontend**: http://localhost:3001
- **Backend API**: http://localhost:5000
- **Database**: Connected to Neon PostgreSQL

### Current Status

✅ Backend server running on port 5000
✅ Frontend React app running on port 3001  
✅ Database initialized with all tables
✅ All dependencies installed

### How to Use

1. **Open your browser** and go to: http://localhost:3001

2. **Sign Up**:
   - Click "Sign up" 
   - Enter your name, email, and password
   - You'll be automatically logged in and redirected to the dashboard

3. **Dashboard Features**:
   - View your daily nutrition goals (Calories, Protein, Carbs, Fat)
   - See progress bars showing how much you've consumed vs your goal
   - Click "Log Food" to add meals
   - Click "Get Recipe Recommendations" for AI-powered suggestions

4. **Log Food**:
   - Enter food name (e.g., "Grilled Chicken Breast")
   - Add nutrition values (calories, protein, carbs, fat)
   - Select meal type (breakfast, lunch, dinner, snack)
   - Click "Log Food" to save

5. **Recipe Recommendations**:
   - Shows your remaining daily nutrition goals
   - Displays 3 recommended recipes
   - Each recipe includes nutrition info and cooking instructions
   - Currently using smart fallback recipes (add AI_API_KEY to .env for AI-powered recommendations)

### Default Goals

When you sign up, you automatically get these daily goals:
- **Calories**: 2000 kcal
- **Protein**: 150g
- **Carbs**: 250g
- **Fat**: 65g

### Adding AI-Powered Recipe Recommendations

To enable real AI recipe recommendations:

1. Get an API key from OpenAI or similar service
2. Open `.env` file in the root directory
3. Uncomment and add your API key:
   ```
   AI_API_KEY=your-actual-api-key-here
   AI_API_URL=https://api.openai.com/v1/chat/completions
   ```
4. Restart the backend server

### Stopping the Servers

- Backend: Press Ctrl+C in the terminal running the backend
- Frontend: Press Ctrl+C in the terminal running the frontend

### Restarting the Application

**Backend:**
```bash
cd backend
npm start
```

**Frontend:**
```bash
cd frontend
npm start
```

### Database Connection

Your application is connected to Neon PostgreSQL with these credentials:
- Host: ep-plain-tooth-a1padp2r-pooler.ap-southeast-1.aws.neon.tech
- Database: neondb
- User: neondb_owner

### Troubleshooting

**If ports are in use:**
- Backend uses port 5000
- Frontend uses port 3001 (or next available port)
- Check if other applications are using these ports

**If database connection fails:**
- Verify your Neon database is active
- Check `.env` credentials are correct
- Ensure SSL is configured properly

**If frontend can't connect to backend:**
- Make sure backend is running on port 5000
- Check `frontend/src/services/api.js` has correct API_URL

### Features Summary

✨ **Authentication**: Secure login/signup with JWT tokens
📊 **Nutrition Tracking**: Log meals and track macros in real-time
🎯 **Goal Monitoring**: Visual progress bars with color indicators
🍽️ **Food Logging**: Detailed nutritional information for each meal
🤖 **Smart Recipes**: AI-powered or intelligent fallback recommendations
📱 **Responsive Design**: Beautiful Tailwind CSS interface
🔒 **Data Security**: Password hashing with bcrypt
💾 **Persistent Storage**: PostgreSQL database with Neon

### Next Steps

1. Create your account and start logging food
2. Explore the recipe recommendations
3. Monitor your progress throughout the day
4. Customize your daily goals as needed

Enjoy tracking your diet! 🥗💪
