// server.js
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const fs = require('fs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(bodyParser.json());
app.use(cors());

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// Read user data from JSON file
const userData = JSON.parse(fs.readFileSync('userData.json', 'utf-8'));

// Routes
app.get('/api/users', (req, res) => {
  // Pagination logic
  const page = parseInt(req.query.page) || 1;
  const pageSize = 20;
  const startIndex = (page - 1) * pageSize;
  const endIndex = page * pageSize;

  const paginatedUsers = userData.slice(startIndex, endIndex);
  
  res.json(paginatedUsers);
});

app.get('/api/users/:id', (req, res) => {
  const userId = parseInt(req.params.id);
  const user = userData.find(user => user.id === userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }
  res.json(user);
  console.log(user);
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
