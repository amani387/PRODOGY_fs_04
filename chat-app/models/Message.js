const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Message', messageSchema);
