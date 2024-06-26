const timeslotModel = require('../models/timeslotModel')
const userModel = require('../models/userModel')
const bcrypt = require('bcrypt')

//------------------------------Admin Login API -----------------------------------------------------------//

const adminLogin = async (req, res) => {
  try {
    const { name, password } = req.body;
    if (Object.keys(req.body).length == 0) return res.status(400).send({ message: 'Enter Required Data' });
    if (!name) return res.status(400).send({ message: 'Enter Username' });
    if (!password) return res.status(400).send({ message: 'Enter Password' });

    // Find the admin by username and password
    const admin = await userModel.findOne({ name: name, userType: "Admin" });
    if (!admin) return res.status(400).send({ message: 'Enter Valid Username' })

    const pass = bcrypt.compareSync(password, admin.password)
    if (!pass) return res.status(400).send({ status: false, message: "Entered Wrong Password" })

    // Authentication successful
    return res.status(200).send({ message: 'Successfully Login' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}

//---------------------------------Total Register API ------------------------------------------------------//

const totalRegisteredUsers = async (req, res) => {
  try {
    const { age, pincode, vaccinationStatus } = req.query
    const data = {}
    if (age) { data.age = age }
    if (pincode) { data.pincode = pincode }
    if (vaccinationStatus) { data.vaccinationStatus = vaccinationStatus }
    const registeredUsers = await userModel.find({ userType: 'user', ...data })
    if (registeredUsers.length == 0) return res.status(404).send({ status: false, message: `No Registered Users Found.` })
    return res.status(200).send({ status: true, message: 'Total Registered Users List', total: registeredUsers.length, registeredUsers })
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

//------------------------------get Register slots API --------------------------------------------------------//

const getRegisteredSlotsforVaccine = async (req, res) => {
  try {
    let { date } = req.query
    const newdate = new Date(date)
    if (!date) return res.status(400).send({ message: 'Enter Date in Query' });

    const datePattern = /^(?:\d{4})-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/;
    if (!date.match(datePattern)) {
      return res.status(400).send({ message: 'Invalid Date Format. Please Use YYYY-MM-DD Format.' });
    }
    const slots = await timeslotModel.find({ date: newdate, availableDoses: { $gt: 0, $lt: 10 } })
    if (!slots) return res.status(400).send({ message: 'Slots Not Available for Given Time' });
    return res.status(200).send({ message: 'Registered Slots', total: slots.length, data: slots });
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

//----------------------------------------------------------------------------------------------//

module.exports = { adminLogin, totalRegisteredUsers, getRegisteredSlotsforVaccine }
