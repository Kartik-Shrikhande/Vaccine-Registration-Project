<h1 align="center">Vaccine Registration Project</h1>

<p align="center">
</p>

<p align="center">
 Vaccine Registration App
</p>


---
## Table of Contents
- [Overview](#overview)
- [Project Details](#Vaccination-Details)
- [Tech Stack](#tech-stack)
- [Use Cases](#use-cases)
- [API Endpoints](#api-endpoints)
- [Database Models](#database-models)
- [Getting Started](#getting-started)


## Overview

This project is about Registration for Vaccination,a user can create a account and book slot for given date if slosts time and date matches so user can register himself for perticular time to get vaccinize also user can get his dose accorrding to his vaccination status if user has taken none then he will get registered automatically for first dose of vaccine,if user has taken first dose of vaccine then he will get registered automatically for second dose of vaccine,if user has taken all two doses then he cant register himself for any dose

## Vaccination Details

- **Vaccination Period**: The vaccination drive is scheduled from Jan 1st, 2024, to Jan 30th, 2024.

- **Vaccination Timings**:slots are available every day from 10:00 AM to 5:00 PM.

- **Slot Duration**: Each vaccine slot has a duration of 30 minutes. Slots are scheduled as follows:
- 10:00 AM to 10:30 AM
- 10:30 AM to 11:00 AM etc. till 05:00 PM

- **Vaccine Doses**:10 vaccine doses available in each slot.

- **Total Number of Vaccine Doses**: With 30 days of vaccination and 14 slots each day, there are a total of 4,200 vaccine doses available during the entire vaccination drive.

## Tech Stack
- Node.js
- Express.js
- MongoDB
- JWT for authentication

## Use Cases

### For Users

1. **Register User**: Users can register by providing mandatory information such as Name, Phone Number, Age, Pincode, and Aadhar Number.

2. **User Login**: Registered users can log in using their phone number and password.

3. **see Available Slots**: Users can see available vaccine slots for a specific day and timings.

4. **Book Vaccine Slot**: Users can register for a vaccine dose on a specific dates and timings.

### For Admins

1. **Admin Login**: Admins can log in using their credentials, which are manually created in the database.

2. **Total Registered Users**: Admins can check the total number of registered users

3. **Registered Vaccine Slots**: Admins can view the number of registered vaccine slots on a given day.

## API Endpoints

## Database Models

### User Model

- `name`: User's name.

- `phoneNumber`: User's phone number (unique).

- `password`: User's password.

- `age`: User's age.

- `pincode`: User's pincode.

- `aadharNumber`: User's Aadhar number (unique).

- `vaccinationStatus`: User's vaccination status ("None", "Done").


### time Slot Model

- `date`: Date of the vaccine slot.

- `startTime`: Start time of the slot.

- `endTime`: End time of the slot.

- `availableDoses`: Number of available vaccine doses.


### User APIs

1. **Register User**: Register a new user with required details.

- Endpoint: `POST /register`

- Request Body:
```json

{
  "name": "John Doe",
  "phoneNumber": "0123456789",
  "password": "password123",
  "age": 30,
  "pincode": "123456",
  "aadharNo": "123456789021"
}
```

- Response (Success):
```json
{
    "message": "User Registered Successfully",
    "data": {
        "name": "John Doe",
        "phoneNumber": "0123456789",
        "password": "$2b$10$X5C4XDOlJldKnFKnzERCQ.T8SYFQfbYLBcAlydLuLO6zRfGVWL2Pq",
        "age": 30,
        "pincode": "123456",
        "aadharNo": "123456789021",
        "vaccinationStatus": "None",
        "userType": "user",
        "_id": "667bbd3417d80a5ad4a7a8ca",
        "createdAt": "2024-06-26T07:03:16.110Z",
        "updatedAt": "2024-06-26T07:03:16.110Z",
        "__v": 0
    }
}

```

2. **User Login**: User login with phone number and password.

- Endpoint: `POST /login`

- Request Body:
```json
{
  "phoneNumber": "0123456789",
  "password": "password123"
}
```

- Response (Success):

```json
{
    "message": "Login Successful"
}
```


3. **Get Available Slots**:Get available vaccine slots for a given date .



- Endpoint: `GET /slots/`



- Request Query Parameters:

- `date` (required): Date in the format "YYYY-MM-DD"

- Response (Success):

```json

{
    "message": "Available Slots",
    "totalSlots": 14,
    "data": [
        {
            "_id": "667a6d7692fcbffc2caa8900",
            "date": "2024-01-30T00:00:00.000Z",
            "startTime": "15:30",
            "endTime": "16:00",
            "availableDoses": 10,
            "__v": 0
        },

// More available slots...

]

}

```

4. **Book Vaccine Slot**: Book a vaccine slot for the first or second dose.



- Endpoint: `POST /slot-book/:userId



- Request Parameters:

- `userId`: UserId for authentication



- Request Body:

```json

{
    "date":"2021-06-30",
    "startTime":"11:00 AM"
}

```



- Response (Success):

```json
{
    "message": "You Have Successfully Booked Your Slot"
}
```

### Admin APIs

1. **Admin Login**: Admin login using admin credentials.


- Endpoint: `POST /admin`

- Request Body:

```json

{
    "name":"admin",
    "password":"1234"
}

```

- Response (Success):

```json

{
    "message": "Successfully Login"
}

```


2. **Total Registered Users**: Check the total number of registered users


- Endpoint: `GET /total-Registered-Users`

- Response (Success):

```json
{
    "status": true,
    "message": "Total Registered Users List",
    "total": 10,
    "registeredUsers": [
        {
            "_id": "667bbd3417d80a5ad4a7a8ca",
            "name": "John Doe",
            "phoneNumber": "0123456789",
            "password": "$2b$10$X5C4XDOlJldKnFKnzERCQ.T8SYFQfbYLBcAlydLuLO6zRfGVWL2Pq",
            "age": 30,
            "pincode": "123456",
            "aadharNo": "123456789021",
            "vaccinationStatus": "Done",
            "userType": "user",
            "createdAt": "2024-06-26T07:03:16.110Z",
            "updatedAt": "2024-06-26T08:59:32.659Z",
            "__v": 0
        }
    ]
}
// More user objects...

```

3. **Registered Vaccine Slots**: View the number of registered vaccine slots total on a given day.

- Endpoint: `GET /registered-slots`

- Request Query Parameter:

- `date` (required): Date in the format "YYYY-MM-DD"

- Response (Success):

```json
{
    "message": "Registered Slots",
    "total": 5,
    "data": [
        {
            "_id": "667a6d7592fcbffc2caa874f",
            "date": "2024-01-01T00:00:00.000Z",
            "startTime": "16:30",
            "endTime": "17:00",
            "availableDoses": 9,
            "registeredUsers": [
                "667a9560fd69a4e4448e7f03"
            ],
            "__v": 0
        },
        {
            "_id": "667a6d7592fcbffc2caa8747",
            "date": "2024-01-01T00:00:00.000Z",
            "startTime": "12:30",
            "endTime": "13:00",
            "availableDoses": 9,
            "registeredUsers": [
                "667bbd3417d80a5ad4a7a8ca"
            ],
            "__v": 0,
        }
    ]}
...more


```


## Getting Started

1. Clone the repository:



```bash

git clone https://github.com/Kartik-Shrikhande/Vaccine-Registration-Project.git
```



2. Install dependencies:



```bash

npm install

```



3. Set up environment variables by creating a `.env` file with your configuration.



4. Start the application:



```bash

npm start

```
## License

This project is licensed under the MIT License. ![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)
---
