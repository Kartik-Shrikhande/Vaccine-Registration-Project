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

This project is about Registration of Vaccine , an user can create a account and book slot for him on given date if slosts time and date matches so user can register himself for perticular time to get vaccinize also user can get his dose accorrding to his vaccination status if user has taken none then he will get registered automatically for first dose of vaccine,if user has taken first dose of vaccine then he will get registered automatically for second dose of vaccine,if user has taken all two doses then he cant register himself for any dose

## Vaccination Details

- **Vaccination Period**: The vaccination drive is scheduled from June 1st, 2021, to June 30th, 2021.

- **Vaccination Timings**:slots are available every day from 10:00 AM to 5:00 PM.

- **Slot Duration**: Each vaccine slot has a duration of 30 minutes. Slots are scheduled as follows:
- 10:00 AM to 10:30 AM
- 10:30 AM to 11:00 AM etc. till 05:00 PM

- **Vaccine Doses**:10 vaccine doses available in each slot. These doses are the same for both the first and second doses.

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

3. **see Available Slots**: Users can view available vaccine slots for a given day.

4. **Book Vaccine Slot**: Users can register for a vaccine slot first or second dose on a specified date and time. They can only book a second dose after completing their first dose.

### For Admins

1. **Admin Login**: Admins can log in using their credentials, which are manually created in the database.

2. **Total Registered Users**: Admins can check the total number of registered users

3. **Registered Vaccine Slots**: Admins can view the number of registered vaccine slots on a given day.

## API Endpoints

### User APIs

1. **Register User**: Register a new user with required details.

- Endpoint: `POST /register`

- Request Body:
```json

{
  "name": "John Doe1",
  "phoneNumber": "12345678904",
   "password": "password123",
  "age": 30,
  "pincode": "123456",
  "aadharNo": "1234567890123"
}
```

- Response (Success):
```json
{
    "message": "User registered successfully",
    "data": {
        "name": "John Doe1",
        "phoneNumber": "12345678904",
        "password": "password123",
        "age": 30,
        "pincode": "123456",
        "aadharNo": "1234567890123",
        "vaccinationStatus": "none",
        "_id": "6507d4ad4917e34101081305",
        "__v": 0
    }
}
```

2. **User Login**: User login with phone number and password.

- Endpoint: `POST /login`

- Request Body:
```json
{
  "phoneNumber": "1234567890",
  "password": "password123"
}
```

- Response (Success):

```json
{
    "message": "Login successful"
}
```


3. **Get Available Slots**:Get available vaccine slots for a given date .



- Endpoint: `GET /slots/`



- Request Query Parameters:

- `date` (required): Date in the format "YYYY-MM-DD"



- Response (Success):

```json

{
    "message": "Available slots",
    "data": [
        {
            "_id": "6506bfb4bfe95c0a267495e8",
            "date": "2021-06-30T00:00:00.000Z",
            "startTime": "04:30  PM",
            "endTime": "05:00 PM",
            "availableDoses": 6,
            "__v": 0
        },

// More available slots...

]

}

```

4. **Book Vaccine Slot**: Book a vaccine slot for the first or second dose.



- Endpoint: `POST /slotBook/:userId



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
    "message": "you have successfully booked your slot"
}
```

### Admin APIs

1. **Admin Login**: Admin login using admin credentials.


- Endpoint: `POST /admin`

- Request Body:

```json

{
    "username":"admin2",
    "password":"1234"
}

```

- Response (Success):

```json

{
    "message": "successful"
}

```


2. **Total Registered Users**: Check the total number of registered users


- Endpoint: `GET /totalRegisterUsers`

- Response (Success):

```json
{
    "status": true,
    "message": "Total registered Users List",
    "total": 4,
    "registeredUsers": 
        {
            "_id": "65058482c4fa3a52a85e539b",
            "name": "John Doe",
            "phoneNumber": "1234567890",
            "password": "password123",
            "age": 30,
            "pincode": "123456",
            "aadharNo": "123456789012",
            "vaccinationStatus": "firstDose",
            "__v": 0
        },
}
// More user objects...

```

3. **Registered Vaccine Slots**: View the number of registered vaccine slots total on a given day.

- Endpoint: `GET /registeredSlots`

- Request Query Parameter:

- `date` (required): Date in the format "YYYY-MM-DD"

- Response (Success):

```json
{
    "message": "Available slots",
    "data": 
        {
            "_id": "6506bfb4bfe95c0a267495e8",
            "date": "2021-06-30T00:00:00.000Z",
            "startTime": "04:30  PM",
            "endTime": "05:00 PM",
            "availableDoses": 6,
            "__v": 0
        },

}
...more


```

## Database Models

### User Model

- `name`: User's name.

- `phoneNumber`: User's phone number (unique).

- `password`: User's password.

- `age`: User's age.

- `pincode`: User's pincode.

- `aadharNumber`: User's Aadhar number (unique).

- `vaccinationStatus`: User's vaccination status ("none", "first_dose", "second_dose").


### time Slot Model

- `date`: Date of the vaccine slot.

- `startTime`: Start time of the slot.

- `endTime`: End time of the slot.

- `availableDoses`: Number of available vaccine doses.


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

---
