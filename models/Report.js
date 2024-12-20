const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  postId: { type: mongoose.Schema.Types.ObjectId, ref: 'Post', required: true }, // LINK TO POST
  reportedBy: { type: String, required: true }, // USER
  reason: { type: String, required: true }, // REASON
  timestamp: { type: Date, default: Date.now }, // DATE
});

module.exports = mongoose.model('Report', reportSchema);