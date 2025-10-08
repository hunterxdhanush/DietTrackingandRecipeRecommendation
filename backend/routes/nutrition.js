const express = require('express');
const pool = require('../config/database');
const { authenticateToken } = require('../middleware/auth');

const router = express.Router();

// Get daily goals
router.get('/goals', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM daily_goals WHERE user_id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Goals not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching goals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update daily goals
router.put('/goals', authenticateToken, async (req, res) => {
  try {
    const { calories, protein, carbs, fat } = req.body;

    const result = await pool.query(
      `UPDATE daily_goals 
       SET calories = $1, protein = $2, carbs = $3, fat = $4, updated_at = CURRENT_TIMESTAMP
       WHERE user_id = $5
       RETURNING *`,
      [calories, protein, carbs, fat, req.user.id]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating goals:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Log food
router.post('/log', authenticateToken, async (req, res) => {
  try {
    const { food_name, calories, protein, carbs, fat, meal_type } = req.body;

    if (!food_name || calories === undefined || protein === undefined || carbs === undefined || fat === undefined) {
      return res.status(400).json({ error: 'All nutrition fields are required' });
    }

    const result = await pool.query(
      `INSERT INTO food_logs (user_id, food_name, calories, protein, carbs, fat, meal_type)
       VALUES ($1, $2, $3, $4, $5, $6, $7)
       RETURNING *`,
      [req.user.id, food_name, calories, protein, carbs, fat, meal_type || 'other']
    );

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error logging food:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get today's food logs
router.get('/logs/today', authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM food_logs 
       WHERE user_id = $1 AND log_date = CURRENT_DATE
       ORDER BY created_at DESC`,
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching logs:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get daily progress
router.get('/progress/today', authenticateToken, async (req, res) => {
  try {
    // Get goals
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

    // Calculate percentages
    const progress = {
      goals: {
        calories: goals.calories,
        protein: goals.protein,
        carbs: goals.carbs,
        fat: goals.fat
      },
      consumed: {
        calories: parseInt(totals.total_calories),
        protein: parseInt(totals.total_protein),
        carbs: parseInt(totals.total_carbs),
        fat: parseInt(totals.total_fat)
      },
      remaining: {
        calories: goals.calories - parseInt(totals.total_calories),
        protein: goals.protein - parseInt(totals.total_protein),
        carbs: goals.carbs - parseInt(totals.total_carbs),
        fat: goals.fat - parseInt(totals.total_fat)
      },
      percentages: {
        calories: Math.round((parseInt(totals.total_calories) / goals.calories) * 100),
        protein: Math.round((parseInt(totals.total_protein) / goals.protein) * 100),
        carbs: Math.round((parseInt(totals.total_carbs) / goals.carbs) * 100),
        fat: Math.round((parseInt(totals.total_fat) / goals.fat) * 100)
      }
    };

    res.json(progress);
  } catch (error) {
    console.error('Error fetching progress:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Delete food log
router.delete('/log/:id', authenticateToken, async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      'DELETE FROM food_logs WHERE id = $1 AND user_id = $2 RETURNING *',
      [id, req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Food log not found' });
    }

    res.json({ message: 'Food log deleted successfully' });
  } catch (error) {
    console.error('Error deleting food log:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
