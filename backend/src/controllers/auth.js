const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { pgPool } = require('../config/db');
const env = require('../config/env');

const register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    if (!['employer', 'candidate'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role. Must be employer or candidate.' });
    }

    // Check if user exists
    const userCheck = await pgPool.query('SELECT id FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'User already exists with this email.' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Insert user into PostgreSQL
    const result = await pgPool.query(
      'INSERT INTO users (name, email, password_hash, role) VALUES ($1, $2, $3, $4) RETURNING id, name, email, role, created_at',
      [name, email, passwordHash, role]
    );

    const newUser = result.rows[0];

    // Generate JWT
    const token = jwt.sign(
      { id: newUser.id, role: newUser.role, email: newUser.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    res.status(201).json({ user: newUser, token });
  } catch (error) {
    console.error('Registration Error:', error);
    res.status(500).json({ error: 'Internal server error during registration.' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Fetch user
    const result = await pgPool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    const user = result.rows[0];

    // Compare passwords
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials.' });
    }

    // Generate JWT
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      env.jwtSecret,
      { expiresIn: '7d' }
    );

    // Remove password hash from response
    delete user.password_hash;

    res.json({ user, token });
  } catch (error) {
    console.error('Login Error:', error);
    res.status(500).json({ error: 'Internal server error during login.' });
  }
};

module.exports = {
  register,
  login,
};
