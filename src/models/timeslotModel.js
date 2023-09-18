const mongoose = require('mongoose');

// Schema for Vaccine Slot
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
})

module.exports = mongoose.model('timeslot', vaccineSlotSchema);



