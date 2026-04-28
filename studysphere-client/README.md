###  Frontend (Aishat - 3135224):

- Built React frontend using Vite
- Implemented client-side routing using react-router-dom
- Created core pages:
  - Home (landing page with features and navigation)
  - Login (with validation and error handling)
  - Register (multi-field form with full validation)
- Designed responsive UI using CSS and Material UI components
- Implemented Navbar with:
  - Navigation links (Home, Login, Register)
  - Responsive hamburger menu for mobile view
- Added client-side validation:
  - Required field checks
  - Email format validation
  - Password length validation
  - Password match validation
- Styled pages with separate CSS files (as required)
- Ensured responsive design across different screen sizes
- Prepared frontend for API integration using environment variables

### Frontend (Aisha - 3127257):

- Built Dashboard page with Moodle-inspired layout including:
  - Course-style cards for recent resources and study groups
  - Upcoming reminders timeline
  - Quick stats block
- Built Resources page with:
  - Live search bar filtering by title
  - Module and tag dropdown filters
  - Save/unsave toggle functionality
  - Empty state handling when no results found
- Built Upload Resource page with:
  - Multi-field form (title, module, type, description, file upload)
  - Full client-side validation with error messages
  - Success banner and redirect on valid submission
  - Upload Tips sidebar card
- Built Sidebar component with:
  - Active page highlighting using NavLink
  - Links to all pages (Dashboard, Resources, Upload, Study Groups, Reminders)
  - Responsive mobile layout
- Integrated dark/light theme system across all pages matching Aishat's glass/campus design
- Ensured responsive design across different screen sizes


##  Frontend Setup Instructions

1. Navigate to frontend folder:
cd studysphere-client

2. Install dependencies:
npm install

3. Run the development server:
npm run dev

4. Open in browser:
http://localhost:5173