# StudySphere API

Backend API for user authentication, resource management, study groups, and reminders.

---

## Features
 - Work evenly divided

###  Authentication (Aishat - 3135224)
- User Registration
- User Login
- User Logout
- Session-based Authentication
- Protected Routes using middleware
- Secure password hashing with bcrypt
- MongoDB integration for user storage



###  Resources (Aisha - 3127257)
- Full CRUD operations for resources:
  - Create resources
  - View resources
  - Update resources
  - Delete resources
- Search functionality using query parameters (title and module)
- Save/Bookmark feature for users
- Server-side validation for required fields



## study Groups &  Reminders (Michelle - 3135990)
- Study Group creation and viewing
- Reminder creation and viewing
- MongoDB models for groups and reminders
- Protected routes (only logged-in users can access)
- Basic error handling
- Tested endpoints using Bruno



##  Tech Stack

- Node.js
- Express.js
- MongoDB (Mongoose)
- express-session
- bcrypt
- connect-mongo



##  Setup Instructions

1. Clone the repo Terminal: git clone https://github.com/aishataminu90-sys/studysphere.git
2. Navigate to the API folder Terminal: cd api 
3. Install dependencies Terminal: npm install 
4. Create a .env file in the root of the API folder and add: MONGO_URI=your_mongodb_connection_string SESSION_SECRET=your_secret_key PORT= 3000 
5. Start the server Terminal: npm start 
6. Open your browser or API testing tool ( Bruno) and go to: http://localhost:3000 Bruno to test every endpoint 
7. Render link :  https://studysphere-pb0g.onrender.com
