const express = require('express')
const router = express.Router()
const userController = require('../controller/userController')
const adminController = require('../controller/adminController')
const timeslot = require('../controller/timeslotController')
const mid = require('../middleware/middleware')

//------------------------ Users APT's-------------------------------------------------------------------//
router.post('/register', userController.registerUser)
router.post('/login', userController.loginUser)
router.get('/slots', mid.Authentication, userController.getSlots)
router.post('/slotBook/:userId', mid.Authentication, mid.Authorization, userController.bookSlot)

//------------------------ admins API-------------------------------------------------------------------//
router.post('/admin', adminController.adminLogin)
router.get('/totalRegisterUsers',adminController.totalRegisteredUsers)
router.get('/registerSlots',adminController.getRegisteredSlots)
//------------------------ Create slot API-------------------------------------------------------------------//
router.post('/create-slots', timeslot.createVaccineSlots)

//-----------------Handling Invalid HTTP req-----------------------------------------//
router.all('/*', (req, res) => {
    res.status(404).send({ message: 'URL path Not Found, Enter valid URL path' })
})

//-------------------------------------------------------------------------------------------//
module.exports = router;