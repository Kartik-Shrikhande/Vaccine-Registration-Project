// Assuming you have a VaccineSlot model

const timeslotModel = require('../models/timeslotModel');

//----------------------------create slot API -----------------------------------------------------------//
const createVaccineSlots = async (req, res) => {
  try {
    let { date, startTime, endTime } = req.body;
    if (Object.keys(req.body).length == 0) return res.status(400).send({ message: 'enter required Data' });
    if (!date) return res.status(400).send({ status: false, message: "Please enter valid date" })
    if (!startTime) return res.status(400).send({ status: false, message: "Please enter valid startTime" })
    if (!endTime) return res.status(400).send({ status: false, message: "Please enter valid endTime" })

    // Validate the date format
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
    //checking if slot for given date and time already exist
    let check = await timeslotModel.findOne({ date: date, startTime: startTime, endTime: endTime })
    //start and end time of slot should not be same 
    if (startTime == endTime) return res.status(400).send({ message: 'startTime and Endtime should not be same,and keep 30 min of slotTime' });
    if (check) return res.status(400).send({ message: 'slots already exist for entered date or time, change date or timing' });
    // Create a new vaccine slot
    const newSlot = await timeslotModel.create(req.body);
    return res.status(201).send({ message: 'Vaccine slot created successfully', data: newSlot });
  }
  catch (error) {
    return res.status(500).send({ message: 'Slot creation failed' });
  }
};
//---------------------------------------------------------------------------------------------------//
module.exports = { createVaccineSlots }