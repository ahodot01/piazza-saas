const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  title: String,
  topic: { type: String, enum: ['Politics', 'Health', 'Sport', 'Tech'] },
  body: String,
  owner: String,
  timestamp: { type: Date, default: Date.now },
  expiration: Date,
  status: { type: String, default: 'Live' },
  likes: { type: Number, default: 0 },
  dislikes: { type: Number, default: 0 },
  comments: [
    {
      user: String,
      message: String,
      timestamp: { type: Date, default: Date.now }, // TIMESTAMP
    }
  ],
  views: { type: Number, default: 0 }, // VIEWS
  tags: [String], // TAGS
  reportedCount: { type: Number, default: 0 }, // REPORT/S AMOUNT
});

module.exports = mongoose.model('Post', postSchema);