const express = require('express');
const axios = require('axios');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get recipe recommendations based on goals
router.post('/recommendations', authenticateToken, async (req, res) => {
  try {
    // Get user's goals and today's progress
    const goalsResult = await pool.query(
      'SELECT * FROM daily_goals WHERE user_id = $1',
      [req.user.id]
    );

    if (goalsResult.rows.length === 0) {
      return res.status(404).json({ error: 'Goals not found' });
    }

    const goals = goalsResult.rows[0];

    // Get today's totals
    const totalsResult = await pool.query(
      `SELECT 
        COALESCE(SUM(calories), 0) as total_calories,
        COALESCE(SUM(protein), 0) as total_protein,
        COALESCE(SUM(carbs), 0) as total_carbs,
        COALESCE(SUM(fat), 0) as total_fat
       FROM food_logs
       WHERE user_id = $1 AND log_date = CURRENT_DATE`,
      [req.user.id]
    );

    const totals = totalsResult.rows[0];

    // Calculate remaining macros
    const remaining = {
      calories: goals.calories - parseInt(totals.total_calories),
      protein: goals.protein - parseInt(totals.total_protein),
      carbs: goals.carbs - parseInt(totals.total_carbs),
      fat: goals.fat - parseInt(totals.total_fat)
    };

    // Prepare prompt for AI
    const prompt = `You are a nutrition expert. Based on the following remaining daily nutrition goals, suggest 3 healthy recipe recommendations:

Remaining Goals:
- Calories: ${remaining.calories} kcal
- Protein: ${remaining.protein}g
- Carbohydrates: ${remaining.carbs}g
- Fat: ${remaining.fat}g

Please provide 3 recipe suggestions that would help meet these remaining goals. For each recipe, include:
1. Recipe name
2. Brief description
3. Estimated nutrition values (calories, protein, carbs, fat)
4. Simple preparation instructions

Format your response as a JSON array of recipes with the following structure:
[
  {
    "name": "Recipe Name",
    "description": "Brief description",
    "nutrition": {
      "calories": 500,
      "protein": 30,
      "carbs": 40,
      "fat": 15
    },
    "instructions": ["Step 1", "Step 2", "Step 3"]
  }
]`;

    // Note: You'll need to add your AI API key to .env
    // Example for OpenAI (you can use any AI API)
    const AI_API_KEY = process.env.AI_API_KEY;
    const AI_API_URL = process.env.AI_API_URL || 'https://api.openai.com/v1/chat/completions';

    if (!AI_API_KEY) {
      // Return mock data if no API key is configured
      const mockRecipes = [
        {
          name: "Grilled Chicken Salad",
          description: "A high-protein, low-carb salad with grilled chicken breast, mixed greens, and light vinaigrette",
          nutrition: {
            calories: Math.max(400, Math.floor(remaining.calories * 0.3)),
            protein: Math.max(35, Math.floor(remaining.protein * 0.4)),
            carbs: Math.max(20, Math.floor(remaining.carbs * 0.2)),
            fat: Math.max(15, Math.floor(remaining.fat * 0.3))
          },
          instructions: [
            "Season chicken breast with salt, pepper, and herbs",
            "Grill chicken for 6-8 minutes per side until cooked through",
            "Mix salad greens, cherry tomatoes, cucumber",
            "Slice chicken and place on salad",
            "Drizzle with olive oil and balsamic vinegar"
          ]
        },
        {
          name: "Salmon with Quinoa",
          description: "Omega-3 rich salmon with protein-packed quinoa and roasted vegetables",
          nutrition: {
            calories: Math.max(450, Math.floor(remaining.calories * 0.35)),
            protein: Math.max(40, Math.floor(remaining.protein * 0.45)),
            carbs: Math.max(35, Math.floor(remaining.carbs * 0.25)),
            fat: Math.max(18, Math.floor(remaining.fat * 0.35))
          },
          instructions: [
            "Cook quinoa according to package directions",
            "Season salmon with lemon, garlic, and dill",
            "Bake salmon at 400°F for 12-15 minutes",
            "Roast vegetables (broccoli, bell peppers) at 425°F for 20 minutes",
            "Serve salmon over quinoa with vegetables"
          ]
        },
        {
          name: "Greek Yogurt Protein Bowl",
          description: "High-protein breakfast or snack with Greek yogurt, berries, and nuts",
          nutrition: {
            calories: Math.max(300, Math.floor(remaining.calories * 0.2)),
            protein: Math.max(25, Math.floor(remaining.protein * 0.3)),
            carbs: Math.max(30, Math.floor(remaining.carbs * 0.2)),
            fat: Math.max(10, Math.floor(remaining.fat * 0.2))
          },
          instructions: [
            "Add 1 cup Greek yogurt to a bowl",
            "Top with mixed berries (strawberries, blueberries)",
            "Add a handful of almonds or walnuts",
            "Drizzle with honey (optional)",
            "Sprinkle with chia seeds for extra nutrition"
          ]
        }
      ];

      return res.json({
        recipes: mockRecipes,
        remaining: remaining,
        note: "Configure AI_API_KEY in .env for AI-generated recommendations"
      });
    }

    // Call AI API (Groq uses OpenAI-compatible format)
    try {
      const aiResponse = await axios.post(
        AI_API_URL,
        {
          model: "llama-3.3-70b-versatile", // Current Groq model (as of 2025)
          messages: [
            {
              role: "system",
              content: "You are a helpful nutrition expert that provides recipe recommendations in JSON format."
            },
            {
              role: "user",
              content: prompt
            }
          ],
          temperature: 0.7
        },
        {
          headers: {
            'Authorization': `Bearer ${AI_API_KEY}`,
            'Content-Type': 'application/json'
          }
        }
      );

      const aiContent = aiResponse.data.choices[0].message.content;
      
      // Try to extract JSON from the response
      let recipes;
      try {
        // Sometimes AI wraps JSON in markdown code blocks
        const jsonMatch = aiContent.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          recipes = JSON.parse(jsonMatch[0]);
        } else {
          recipes = JSON.parse(aiContent);
        }
      } catch (parseError) {
        console.error('Failed to parse AI response:', parseError);
        throw new Error('Invalid JSON response from AI');
      }

      res.json({
        recipes: recipes,
        remaining: remaining
      });
    } catch (aiError) {
      console.error('AI API Error:', aiError.response?.data || aiError.message);
      // Fallback to mock data if AI API fails
      const mockRecipes = [
        {
          name: "Grilled Chicken Salad",
          description: "A high-protein, low-carb salad with grilled chicken breast",
          nutrition: {
            calories: Math.floor(remaining.calories * 0.3),
            protein: Math.floor(remaining.protein * 0.4),
            carbs: Math.floor(remaining.carbs * 0.2),
            fat: Math.floor(remaining.fat * 0.3)
          },
          instructions: ["Grill chicken", "Mix salad", "Add dressing"]
        }
      ];
      res.json({
        recipes: mockRecipes,
        remaining: remaining,
        note: "Using fallback recommendations. Check AI API configuration."
      });
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
