const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const timeSlotModel = require('../models/timeslotModel')

//---------------------------------user Registration API -----------------------------------------------------------//
const registerUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { name, phoneNumber, password, age, pincode, aadharNo } = req.body;
    if (Object.keys(req.body).length == 0) return res.status(400).send({ message: 'enter required Data'})
    if (!name) return res.status(400).send({ status: false, message: "Please enter name" })
    if (!phoneNumber) return res.status(400).send({ status: false, message: "Please enter phoneNumber"})
    if (!password) return res.status(400).send({ status: false, message: "Please enter password"})
    if (!age) return res.status(400).send({ status: false, message: "Please enter age"})
    if (!pincode) return res.status(400).send({ status: false, message: "Please enter pincode"})
    if (!aadharNo) return res.status(400).send({ status: false, message: "Please enter aadharNo"})
    // Check if the user with the given phone number or Aadhar number already exists
    const existingUser = await userModel.findOne({ $or: [{ phoneNumber }, { aadharNo }] });
    if (existingUser) return res.status(400).send({ message: 'User already exists with the provided phone number or Aadhar number' })
    const newUser = await userModel.create(req.body)
    return res.status(201).send({ message: 'User registered successfully', data: newUser });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

//----------------------------login API -----------------------------------------------------------//

const loginUser = async (req, res) => {
  try {
    // Extract phone number and password from the request body
    const { phoneNumber, password } = req.body;
    if (Object.keys(req.body).length == 0) return res.status(400).send({ message: 'enter required Data'})
    if (!phoneNumber) return res.status(400).send({ status: false, message: "Please enter phoneNumber"})
    if (!password) return res.status(400).send({ status: false, message: "Please enter password"})
    // Check if the user with the provided phone number exists
    const user = await userModel.findOne({ phoneNumber });
    if (!user) return res.status(401).send({ message: 'Invalid phone number ' })
    // Compare the provided password with the stored password (without hashing)
    if (user.password !== password) return res.status(401).send({ message: 'Invalid phone number or password.' })
    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    // Set the JWT token in the response headers
    res.setHeader('Authorization', `Bearer ${token}`)
    return res.status(200).send({ message: 'Login successful' });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
//----------------------------Book slot API -----------------------------------------------------------//

const bookSlot = async (req, res) => {
  try {
    let { userId } = req.params
    if (!userId) return res.status(400).send({ status: false, message: "Please enter valid userId" })
    const exitsUser = await userModel.findById({ _id: userId })
    if (!exitsUser) return res.status(404).send({ status: false, message: "User not found. Please enter valid userId" })
    let { date, startTime } = req.body;
    //making sure user ust enter some data in body
    if (Object.keys(req.body).length == 0) return res.status(400).send({ message: 'enter required Data' });
    if (!date) return res.status(400).send({ message: 'Enter date' });
    const datePattern = /^(?:\d{4})-(?:0[1-9]|1\d|2\d|30)-(?:0[1-9]|1\d|2\d|3\d)$/;
    if (!date || !date.match(datePattern)) {
      return res.status(400).send({ message: 'Invalid date format. Please use YYYY-MM-DD format.' })
    }
    const parsedDate = new Date(date)
    const startDate = new Date('2021-06-01')
    const endDate = new Date('2021-06-30')
    //validating dates from 1-6-2021 to 30-06-2021
    if (parsedDate < startDate || parsedDate > endDate)
      return res.status(400).send({ message: 'Invalid date. Dates are only allowed from 1-6-2021 to 30-6-2021.' })
    date = parsedDate

    if (!startTime) return res.status(400).send({ message: 'Enter startTime' });
    //if available doses are 0 then timeslot is not available
    let bookSlot = await timeSlotModel.findOne({ date: date, startTime: startTime, availableDoses: { $gt: 0 } })
    if (!bookSlot) return res.status(400).send({ message: 'Date or Timeslot is not available for entered data' });
    //if user has taken second dose then he cant register for dose anymore
    if (exitsUser.vaccinationStatus == 'secondDose') return res.status(400).send({ status: false, message: "You have already completed your doses" })
    let forFirstDose = exitsUser.vaccinationStatus == 'none'
    if (forFirstDose) await userModel.findOneAndUpdate({ _id: exitsUser }, { $set: { vaccinationStatus: 'firstDose' } })
    //automatically setting user doses according to user vaccinationStatus
    let forSecondDose = exitsUser.vaccinationStatus == 'firstDose'
    if (forSecondDose) await userModel.findOneAndUpdate({ _id: exitsUser }, { $set: { vaccinationStatus: 'secondDose' } })
    //on successfully booking of each slot ,available doses will be remove by 1 untill 0
    await timeSlotModel.findOneAndUpdate({ _id: bookSlot._id }, { $inc: { availableDoses: -1 } })
    return res.status(201).send({ message: 'you have successfully booked your slot'});
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

//----------------------------getSlot API -----------------------------------------------------------//

const getSlots = async (req, res) => {
  try {
    let { date } = req.query
    const newdate = new Date(date)
    if (!date) return res.status(400).send({ message: 'Enter date in query' });
    const slots = await timeSlotModel.find({ date: newdate, availableDoses: { $gt: 0 } })
    if (!slots) return res.status(400).send({ message: 'slots not available for given time' });
    return res.status(200).send({ message: 'Available slots', data: slots });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//----------------------------------------------------------------------------------------------------------//

module.exports = { registerUser, loginUser, bookSlot, getSlots }
