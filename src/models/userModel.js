const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({

  name: {
    type: String,
    required: true,
  },
  phoneNumber: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  age: {
    type: Number,
    required: true,
  },
  pincode: {
    type: String,
    required: true,
  },
  aadharNo: {
    type: String,
    required: true,
    unique: true,
  },
  vaccinationStatus: {
    type: String,
    enum: ['none', 'firstDose', 'secondDose'],
    default: 'none',
  },
});

module.exports = mongoose.model('User', userSchema);

