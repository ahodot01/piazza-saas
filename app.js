require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');

const app = express();
app.use(express.json());

// CONNECT TO MONGODB
mongoose.connect(process.env.DB_CONNECTOR)
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error('MongoDB connection error:', err));

// ROUTES
app.use('/api/auth', require('./routes/auth'));
app.use('/api/posts', require('./routes/posts'));

// START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));