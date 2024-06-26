const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const timeslot = require('../controller/timeslotController')
const authenticationMid = require('../middleware/middleware')
const validationMid = require('../middleware/errorMiddleware')

//------------------------ Users APT's-------------------------------------------------------------------//
router.post('/register', validationMid.validateUserRegistration, userController.registerUser)
router.post('/login', validationMid.validateUserLogin, userController.loginUser)
router.get('/slots',authenticationMid.Authentication, userController.getSlots)
router.post('/slot-book/:userId',authenticationMid.Authentication,authenticationMid.Authorization, userController.bookSlot)

//------------------------ admins API-------------------------------------------------------------------//
router.post('/admin', adminController.adminLogin)
router.get('/total-Registered-Users', adminController.totalRegisteredUsers)
router.get('/registered-slots', adminController.getRegisteredSlotsforVaccine)

//------------------------ Create slot API-------------------------------------------------------------------//
router.post('/create-slots', timeslot.createVaccineSlots)

//-----------------Handling Invalid HTTP req-----------------------------------------//
router.all('/*', (req, res) => {
    res.status(404).send({ message: 'URL path Not Found, Enter valid URL path' })
})

//-------------------------------------------------------------------------------------------//
module.exports = router;