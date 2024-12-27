require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const { verifyToken } = require('./routes/auth');

const app = express();
app.use(express.json());

// CONNECT TO MONGODB
mongoose.connect(process.env.DB_CONNECTOR)
  .then(() => console.log('Connected to MongoDB successfully'))
  .catch(err => console.error('MongoDB connection error:', err));

// ROUTES
app.use('/api/auth', require('./routes/auth').router);
app.use('/api/posts', require('./routes/posts'));

// START THE SERVER
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// FOR TESTING IN BROWSER
app.get('/', (req, res) => {
  res.send('Welcome to Piazza API! Made by Andrey Hodotovics (ahodot01@student.bbk.ac.uk)');
});