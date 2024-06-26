const mongoose = require('mongoose');

const vaccineSlotSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true,
  },
  startTime: {
    type: String,
    required: true,
  },
  endTime: {
    type: String,
    required: true,
  },
  availableDoses: {
    type: Number,
    required: true,
    default: 10, // Initially, each slot has 10 available doses
  },
  registeredUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }]

}, { timestamps: true })

module.exports = mongoose.model('timeslot', vaccineSlotSchema);



