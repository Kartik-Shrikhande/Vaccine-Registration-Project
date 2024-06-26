const timeslotModel = require('../models/timeslotModel');

//----------------------------create slot API -----------------------------------------------------------//
//On hitting of this API  all the slots gets created fo whole month

const createVaccineSlots = async (req, res) => {
  try {
    const startDate = new Date('2024-01-01');
    const endDate = new Date('2024-01-30');
    const slots = [];
    for (let currentDate = startDate; currentDate <= endDate; currentDate.setDate(currentDate.getDate() + 1)) {
      const date = currentDate.toISOString().split('T')[0];

      // Check if slots already exist for the current date
      const existingSlots = await timeslotModel.find({ date });
      if (existingSlots.length > 0) {
        continue; // Skip if slots already exist for the date
      }

      // Create slots for the day (10 AM to 5 PM, every 30 minutes)
      for (let hour = 10; hour < 17; hour++) {
        for (let minute = 0; minute < 60; minute += 30) {
          const startTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
          const endTime = new Date(startTime);
          endTime.setMinutes(startTime.getMinutes() + 30);
          const timeSlot = new timeslotModel({
            date,
            startTime: startTime.toISOString().split('T')[1].substr(0, 5),
            endTime: endTime.toISOString().split('T')[1].substr(0, 5),
          });
          slots.push(timeSlot);
        }
      }
    }
    // Insert all slots for the month at once
    await timeslotModel.insertMany(slots);
    return res.status(201).json({ message: 'Slots Created Successfully', total: slots.length, data: slots });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

//---------------------------- API to create slots datewise-----------------------------------------------------------//

// const createVaccineSlots = async (req, res) => {
//   const { date } = req.body;  // Expecting the date in YYYY-MM-DD format
//   try {
//     const startDate = new Date('2024-01-01');
//     const endDate = new Date('2024-01-30');
//     const currentDate = new Date(date);
//     if (currentDate < startDate || currentDate > endDate) {
//       return res.status(400).json({ message: 'Invalid date. Slots can only be created between January 1, 2024, and January 30, 2024.' });
//     }
//     const slots = [];
//     const existingSlots = await timeslotModel.find({ date });
//     if (existingSlots.length > 0) {
//       return res.status(400).json({ message: 'Slots already exist for the given date' });
//     }
//     for (let hour = 10; hour < 17; hour++) {
//       for (let minute = 0; minute < 60; minute += 30) {
//         const startTime = new Date(`${date}T${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}:00Z`);
//         const endTime = new Date(startTime);
//         endTime.setMinutes(startTime.getMinutes() + 30);

//         const timeSlot = new timeslotModel({
//           date,
//           startTime: startTime.toISOString().split('T')[1].substr(0, 5),
//           endTime: endTime.toISOString().split('T')[1].substr(0, 5),
//         });
//         slots.push(timeSlot);
//       }
//     }
//     await timeslotModel.insertMany(slots);
//     return res.status(201).json({ message: 'Slots created successfully', total :slots.length,data:slots });
//   } 
//   catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

//---------------------------------------------------------------------------------------------------//

module.exports = {createVaccineSlots}