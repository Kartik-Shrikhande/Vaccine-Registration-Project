const adminModel = require('../models/adminModel')
const timeslotModel = require('../models/timeslotModel')
const userModel = require('../models/userModel')
//----------------------------Admin Login API -----------------------------------------------------------//

const adminLogin = async (req, res) => {
  try {
    const { username, password } = req.body;
    if (Object.keys(req.body).length == 0) return res.status(400).send({ message: 'enter required Data' });
    if (!username) return res.status(400).send({ message: 'enter username' });
    if (!password) return res.status(400).send({ message: 'enter password' });
    // Find the admin by username and password
    const admin = await adminModel.findOne({ username: username, password: password });
    if (!admin) return res.status(400).send({ message: 'Enter valid username and password' })
    // Authentication successful
    return res.status(200).send({ message: 'successful' });
  } catch (error) {
    return res.status(500).send({ message: error.message });
  }
}
//----------------------------Total Register API -----------------------------------------------------------//

const totalRegisteredUsers = async (req, res) => {
  try {
    const registeredUsers = await userModel.find()
    if (registeredUsers.length == 0) return res.status(404).send({ status: false, message: `No registered users found.` })
    return res.status(200).send({ status: true, message: 'Total registered Users List', total: registeredUsers.length, registeredUsers })
  } catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}

//----------------------------get Register slots API -----------------------------------------------------------//

const getRegisteredSlots = async (req, res) => {
  try {
    let { date } = req.query
    const newdate = new Date(date)
    if (!date) return res.status(400).send({ message: 'Enter date in query' });
    const slots = await timeslotModel.find({ date: newdate, availableDoses:{ $gt: 0 , $lt: 10 } })
    if (!slots) return res.status(400).send({ message: 'slots not available for given time' });
    return res.status(200).send({ message: 'Available slots', data: slots });
  }
  catch (err) {
    return res.status(500).send({ status: false, message: err.message })
  }
}
//----------------------------------------------------------------------------------------------//

module.exports = { adminLogin, getRegisteredSlots, totalRegisteredUsers }
