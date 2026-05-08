###  Frontend (Aishat - 3135224):
- Built React frontend using Vite
- Implemented client-side routing using react-router-dom

- Created core pages:
  - Home (landing page with features and navigation)
  - Login (with validation, API integration, and error handling)
  - Register (multi-field form with advanced validation and API integration)

- Designed responsive UI using CSS and Material UI components

- Implemented Navbar with:
  - Navigation links (Home, Login, Register)
  - Responsive hamburger menu for mobile view
  - Theme-aware styling for light and dark modes

- Added client-side validation:
  - Required field checks
  - Email format validation
  - Password strength validation
  - Password confirmation matching
  - Full name format validation
  - Dropdown-based validation for course and academic year

- Implemented dynamic form handling using React state hooks

- Added dropdown selection fields for:
  - Course options (Law, Computing Science, Business)
  - Academic year selection

- Integrated frontend with backend authentication API using fetch requests
- Configured environment variables for local and Render deployment support
- Implemented success and error feedback messages for authentication flows
- Added loading state handling during form submission
- Styled pages with separate CSS files
- Implemented custom themed dropdown styling for light and dark modes
- Ensured responsive design across different screen sizes
- Added smooth scroll navigation from Footer links to Home page sections
- Created reusable ScrollToHash component for section-based navigation
- Prepared frontend architecture for future protected routes and dashboard integration


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

### Frontend (Michelle - 3135990):
 
- Built Study Groups page with:
  - Available groups list displaying module, member count, and next session
  - Join/leave toggle with live member count update
  - "My Groups" section showing only joined groups with a Joined badge
  - Create Study Group form with full client-side validation:
    - Group name required
    - Module required
    - Next session required
- Built Reminders page with:
  - Upcoming reminders list with due dates
  - Add Reminder form with client-side validation:
    - Title required
    - Due date required
    - Due date cannot be in the past
  - Mark complete toggle with strikethrough styling on completed tasks
  - Random motivational message displayed on task completion
  - Delete functionality to remove reminders
  - Completed reminders moved to a separate Completed section

##  Frontend Setup Instructions

1. Navigate to frontend folder:
cd studysphere-client

2. Install dependencies:
npm install

3. Run the development server:
npm run dev

4. Open in browser:
http://localhost:5173