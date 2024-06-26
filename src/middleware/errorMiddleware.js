const { check, validationResult } = require('express-validator');

//------------------------ Validation Midddleware for user Login -------------------------//

const validateUserLogin = [
    check('phoneNumber')
        .notEmpty().withMessage('Please Enter Phone Number')
        .isMobilePhone().withMessage('Please Enter Valid Phone Number'),
    check('password')
        .notEmpty().withMessage('Please Enter Password'),

    // Handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }];

//------------------------ Validation Middleware for user Registration  -------------------------//


const validateUserRegistration = [
    check('name').notEmpty().withMessage('Please Enter Name'),
    check('phoneNumber').notEmpty().withMessage('Please Enter Phone Number')
        .isMobilePhone().withMessage('Please Enter Valid Phone Number'),
    check('password').notEmpty().withMessage('Please Enter Password'),
    check('age').notEmpty().withMessage('Please Enter Age')
        .isInt({ min: 0, max: 150 }).withMessage('Enter Valid Age'),
    check('pincode').notEmpty().withMessage('Please Enter Pincode')
        .isPostalCode('IN').withMessage('Please Enter valid Indian Pincode'),
    check('aadharNo').notEmpty().withMessage('Please Enter Aadhar Number')
        .isLength({ min: 12, max: 12 }).withMessage('Aadhar Number Must Be 12 Digits')
        .isNumeric().withMessage('Aadhar Number Must Be Numeric'),

    // Handle validation errors
    (req, res, next) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        next();
    }];

//---------------------------------------------------------------------------//

module.exports = { validateUserRegistration, validateUserLogin }