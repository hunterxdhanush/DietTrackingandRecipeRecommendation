const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const pool = require('../config/database');
const { JWT_SECRET } = require('../middleware/auth');

const router = express.Router();

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name, country, age, gender, height, weight } = req.body;

    // Validate input
    if (!email || !password || !name || !country || !age || !gender || !height || !weight) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    // Validate numeric fields
    if (age < 1 || age > 150) {
      return res.status(400).json({ error: 'Invalid age' });
    }
    if (height < 50 || height > 300) {
      return res.status(400).json({ error: 'Invalid height (cm)' });
    }
    if (weight < 20 || weight > 500) {
      return res.status(400).json({ error: 'Invalid weight (kg)' });
    }

    // Check if user exists
    const existingUser = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Calculate BMI: weight (kg) / (height (m))^2
    const heightInMeters = height / 100;
    const bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const result = await pool.query(
      'INSERT INTO users (email, password, name, country, age, gender, height, weight, bmi) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id, email, name, country, age, gender, height, weight, bmi',
      [email, hashedPassword, name, country, parseInt(age), gender, parseFloat(height), parseFloat(weight), parseFloat(bmi)]
    );

    const user = result.rows[0];

    // Create default daily goals (2000 calories, 150g protein, 250g carbs, 65g fat)
    await pool.query(
      'INSERT INTO daily_goals (user_id, calories, protein, carbs, fat) VALUES ($1, $2, $3, $4, $5)',
      [user.id, 2000, 150, 250, 65]
    );

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.status(201).json({
      message: 'User created successfully',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ error: 'Server error during signup' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Validate input
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    // Find user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const user = result.rows[0];

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!isValidPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: '7d'
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Server error during login' });
  }
});

// Get user profile
router.get('/profile', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT id, email, name, country, age, gender, height, weight, bmi FROM users WHERE id = $1',
      [req.user.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Profile fetch error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update user profile
router.put('/profile', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const { name, country, age, gender, height, weight } = req.body;

    // Validate numeric fields
    if (age && (age < 1 || age > 150)) {
      return res.status(400).json({ error: 'Invalid age' });
    }
    if (height && (height < 50 || height > 300)) {
      return res.status(400).json({ error: 'Invalid height (cm)' });
    }
    if (weight && (weight < 20 || weight > 500)) {
      return res.status(400).json({ error: 'Invalid weight (kg)' });
    }

    // Calculate BMI if height and weight are provided
    let bmi = null;
    if (height && weight) {
      const heightInMeters = height / 100;
      bmi = (weight / (heightInMeters * heightInMeters)).toFixed(2);
    }

    // Build update query dynamically
    const updates = [];
    const values = [];
    let paramCount = 1;

    if (name) {
      updates.push(`name = $${paramCount++}`);
      values.push(name);
    }
    if (country) {
      updates.push(`country = $${paramCount++}`);
      values.push(country);
    }
    if (age) {
      updates.push(`age = $${paramCount++}`);
      values.push(parseInt(age));
    }
    if (gender) {
      updates.push(`gender = $${paramCount++}`);
      values.push(gender);
    }
    if (height) {
      updates.push(`height = $${paramCount++}`);
      values.push(parseFloat(height));
    }
    if (weight) {
      updates.push(`weight = $${paramCount++}`);
      values.push(parseFloat(weight));
    }
    if (bmi) {
      updates.push(`bmi = $${paramCount++}`);
      values.push(parseFloat(bmi));
    }

    values.push(req.user.id);

    const result = await pool.query(
      `UPDATE users SET ${updates.join(', ')} WHERE id = $${paramCount} RETURNING id, email, name, country, age, gender, height, weight, bmi`,
      values
    );

    // Save BMI history if height, weight, and bmi were updated
    if (height && weight && bmi) {
      await pool.query(
        'INSERT INTO bmi_history (user_id, height, weight, bmi) VALUES ($1, $2, $3, $4)',
        [req.user.id, parseFloat(height), parseFloat(weight), parseFloat(bmi)]
      );
    }

    res.json({
      message: 'Profile updated successfully',
      user: result.rows[0]
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Get BMI history
router.get('/bmi-history', require('../middleware/auth').authenticateToken, async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT height, weight, bmi, recorded_at FROM bmi_history WHERE user_id = $1 ORDER BY recorded_at DESC LIMIT 30',
      [req.user.id]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching BMI history:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
