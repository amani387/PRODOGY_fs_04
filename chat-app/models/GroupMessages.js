const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  room: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', index: true },
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  message: String,
  timestamp: { type: Date, default: Date.now, index: true },
  edited: { type: Boolean, default: false },
  isSystemMessage: { type: Boolean, default: false },
  reactions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  readBy: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }]
});

module.exports = mongoose.model('Message', messageSchema);


