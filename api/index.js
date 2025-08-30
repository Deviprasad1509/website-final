const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', message: 'Backend is running' });
});

// Auth endpoints
app.post('/api/auth/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    // This would integrate with Supabase auth
    res.json({ message: 'Signup endpoint working', user: { email, name } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post('/api/auth/signin', async (req, res) => {
  try {
    const { email, password } = req.body;
    // This would integrate with Supabase auth
    res.json({ message: 'Signin endpoint working', user: { email } });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Books endpoints
app.get('/api/books', async (req, res) => {
  try {
    // This would fetch from Supabase
    res.json({ message: 'Books endpoint working', books: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Orders endpoints
app.get('/api/orders', async (req, res) => {
  try {
    // This would fetch user orders from Supabase
    res.json({ message: 'Orders endpoint working', orders: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Library endpoints
app.get('/api/library', async (req, res) => {
  try {
    // This would fetch user library from Supabase
    res.json({ message: 'Library endpoint working', books: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Reviews endpoints
app.get('/api/reviews', async (req, res) => {
  try {
    // This would fetch reviews from Supabase
    res.json({ message: 'Reviews endpoint working', reviews: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Categories endpoints
app.get('/api/categories', async (req, res) => {
  try {
    // This would fetch categories from Supabase
    res.json({ message: 'Categories endpoint working', categories: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Authors endpoints
app.get('/api/authors', async (req, res) => {
  try {
    // This would fetch authors from Supabase
    res.json({ message: 'Authors endpoint working', authors: [] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = app;