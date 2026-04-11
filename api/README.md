# StudySphere API

Backend API for user authentication and profile management

---

## Features

- User Registration
- User Login
- User Logout
- Session-based Authentication
- Protected Routes
- MongoDB Database Integration

---

##  Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- express-session
- bcrypt

---

## Setup Instructions

1. Clone the repo
Terminal: 
 git clone <repo-link>

2. Navigate to the API folder
Terminal: 
cd api

3. Install dependencies
Terminal: 
npm install

4. Create a .env file in the root of the API folder and add:

MONGO_URI=your_mongodb_connection_string
SESSION_SECRET=your_secret_key
PORT= 3000

5. Start the server
Terminal:  npm start

6. Open your browser or API testing tool ( Bruno) and go to:
http://localhost:3000

Bruno to test every endpoint :
Register → POST /auth/register
Login → POST /auth/login
Logout → POST /auth/logout
Get user → GET /users (requires login)
