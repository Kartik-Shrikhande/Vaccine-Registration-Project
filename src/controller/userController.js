const userModel = require('../models/userModel')
const jwt = require('jsonwebtoken')
require('dotenv').config({ path: '.env' })
const timeSlotModel = require('../models/timeslotModel')
const bcrypt = require('bcrypt')

//---------------------------------user Registration API -----------------------------------------------------------//

const registerUser = async (req, res) => {
  try {
    // Extract user data from the request body
    const { name, phoneNumber, password, age, pincode, aadharNo } = req.body;
    const existingphone = await userModel.findOne({ phoneNumber });
    if (existingphone) return res.status(400).send({ message: 'User Already Exists With The Provided Phone Number' })

    const existingaadhar = await userModel.findOne({ aadharNo });
    if (existingaadhar) return res.status(400).send({ message: 'User Already Exists With The Provided Aadhar Number' })

    req.body.password = await bcrypt.hash(password, 10)

    const newUser = await userModel.create(req.body)
    return res.status(201).send({ message: 'User Registered Successfully', data: newUser });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

//----------------------------login API -----------------------------------------------------------//

const loginUser = async (req, res) => {
  try {
    const { phoneNumber, password } = req.body;
    // Check if the user with the provided phone number exists
    const user = await userModel.findOne({ phoneNumber });
    if (!user) return res.status(401).send({ message: 'Invalid Phone Number ' })

    // Compare the provided password with the stored password (without hashing)
    const pass = bcrypt.compareSync(password, user.password)
    if (!pass) return res.status(400).send({ status: false, message: "Entered Wrong Password" })

    // Generate a JSON Web Token (JWT) for authentication
    const token = jwt.sign({ userId: user._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
    // Set the JWT token in the response headers
    res.setHeader('Authorization', `Bearer ${token}`)
    return res.status(200).send({ message: 'Login Successful' });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

//----------------------------Book slot API -----------------------------------------------------------//

const bookSlot = async (req, res) => {
  try {
    let { userId } = req.params;
    const existsUser = await userModel.findById({ _id: userId });
    if (!existsUser) return res.status(404).send({ status: false, message: "User Not Found. Please Enter Valid UserId" });

    let { date, startTime } = req.body;
    if (Object.keys(req.body).length === 0) return res.status(400).send({ message: 'Enter Required Data' });
    if (!date) return res.status(400).send({ message: 'Enter date' });

    const datePattern = /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
    if (!date.match(datePattern)) {
      return res.status(400).send({ message: 'Invalid Date Format. Please Use YYYY-MM-DD Format.' });
    }
    const parsedDate = new Date(date);
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-30');

    if (parsedDate < startDate || parsedDate > endDate) {
      return res.status(400).send({ message: 'Invalid Date. Dates Are Only Allowed From 2024-01-01 To 2024-01-30.' });
    }
    date = parsedDate.toISOString().split('T')[0]; // Ensure date format is YYYY-MM-DD

    if (!startTime) return res.status(400).send({ message: 'Enter Start Time' });

    const timePattern = /^([01]\d|2[0-3]):([0-5]\d)$/;
    if (!startTime.match(timePattern)) {
      return res.status(400).send({ message: 'Invalid Time Format. Please Use HH:MM Format in 24-Hour Format.' });
    }
    // If available doses are 0 then timeslot is not available
    let bookSlot = await timeSlotModel.findOne({ date: date, startTime: startTime, availableDoses: { $gt: 0 } });
    if (!bookSlot) return res.status(400).send({ message: 'Timeslot is Fully Booked For The Enterd Time' });

    if (existsUser.vaccinationStatus === 'Done') return res.status(400).send({ status: false, message: "You Have Already Completed Your Dose" });

    //setting vaccination status done if user have not taken before
    let vaccineDose = existsUser.vaccinationStatus === 'None';
    if (vaccineDose) await userModel.findOneAndUpdate({ _id: existsUser._id }, { $set: { vaccinationStatus: 'Done' } });

    // On successfully booking of each slot, available doses will be reduced by 1 until 0
    await timeSlotModel.findOneAndUpdate(
      { _id: bookSlot._id },
      { $inc: { availableDoses: -1 }, $push: { registeredUsers: userId } }
    );

    return res.status(201).send({ message: 'You Have Successfully Booked Your Slot' });

  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//----------------------------getSlot API -----------------------------------------------------------//

const getSlots = async (req, res) => {
  try {
    let { date } = req.query
    const newdate = new Date(date)

    // if(!date < 1 && !date <=30 ) return res.status(400).send({message:'Invalid Date'})
    const datePattern = /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
    if (!date.match(datePattern)) {
      return res.status(400).send({ message: 'Invalid Date Format. Please Use YYYY-MM-DD Format.' });
    }
    const validDate = await timeSlotModel.findOne({ date: newdate })
    if (!validDate) return res.status(400).send({ message: 'Enter Valid Date Between 2024-01-01 To 2024-01-30' })
    if (!date) return res.status(400).send({ message: 'Enter Date in Query' });

    const slots = await timeSlotModel.find({ date: newdate, availableDoses: { $gt: 0 } }).select('-registeredUsers')
    if (!slots) return res.status(400).send({ message: 'Slots Not Available for Given Time' });
    return res.status(200).send({ message: 'Available Slots',totalSlots:slots.length, data: slots });
  }
  catch (error) {
    return res.status(500).send({ message: error.message });
  }
};

//----------------------------------------------------------------------------------------------------------//

module.exports = { registerUser, loginUser, bookSlot, getSlots }
