# Job Application Tracker

A web application for managing and tracking job applications. Built with React, TypeScript, and JSON Server.

## What It Does

This application allows you to track your job applications in one place. You can add new job applications, update their status, search and filter them, and delete unsuccessful applications.

### Features

- User registration and authentication
- Add, edit, and delete job applications
- Track application status (Applied, Interviewed, Rejected)
- Search by company name or job role
- Filter by application status
- Sort applications by date
- Persistent data storage with JSON Server

## Technologies Used

- React 19
- TypeScript
- Tailwind CSS
- Axios for HTTP requests
- React Router for navigation
- JSON Server for backend API
- React Hook Form for form handling

## Requirements

- Node.js version 14 or higher
- npm or yarn package manager

## Installation

Clone the repository:

```bash
git clone https://github.com/OrineaTovhakale/JobApplication-Tracker-App.git
```

Navigate to the project directory:

```bash
cd JobApplication-Tracker-App
```

Install dependencies:

```bash
npm install
```

## Running the Application

You need to run both the frontend and backend servers.

### Start the JSON Server (Backend)

In one terminal window:

```bash
npm run server
```

The server will run on http://localhost:3001

### Start the React App (Frontend)

In another terminal window:

```bash
npm run dev
```

The application will open in your browser at http://localhost:5173

## Usage

### Registration and Login

1. Open the application in your browser
2. Click "Register" to create a new account
3. Enter a username (minimum 3 characters) and password (minimum 6 characters)
4. After registration, login with your credentials

### Managing Job Applications

1. Click "Add New Job" to create a new application entry
2. Fill in the required fields:
   - Company name (required)
   - Job role (required)
   - Application status (Applied, Interviewed, or Rejected)
   - Date applied (required)
   - Extra details (optional)
3. Click "Save Job" to add the application

### Viewing and Editing

- All your job applications are displayed on the home page
- Click "Edit" on any job card to modify the details
- Click "Delete" to remove an application (you will be asked to confirm)

### Searching

1. Click "Search Jobs"
2. Enter a company name or job role to filter results
3. Optionally select a status to filter by application stage
4. Click "Search" to see filtered results
5. Click "Clear" to reset filters

## Project Structure

```
src/
├── components/       React components (Button, Input, JobCard, etc.)
├── pages/           Page components (Home, Login, Registration, etc.)
├── services/        API service layer for backend calls
├── utils/           Utility functions (validation, authentication)
├── constants/       Application constants and messages
├── types/           TypeScript type definitions
└── App.tsx          Main application component
```

## Data Storage

All data is stored using JSON Server in the db.json file. Each user's job applications are isolated by username.

## Browser Support

Works on all modern browsers including Chrome, Firefox, Safari, and Edge.

## License

MIT License

## Author

Orinea Tovhakale