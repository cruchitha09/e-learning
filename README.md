# E-Learning Platform (Full Stack Web Application)

## Overview
This project is a full-stack e-learning platform built to demonstrate
frontend development, backend API integration, and optional mobile
application support. The system allows users to access learning content
through a modern web interface backed by a server-side API.

## Tech Stack
- Frontend: HTML, CSS, JavaScript, React (Vite)
- Backend: Node.js, Express.js
- Database: MySQL / MongoDB (as configured)
- Mobile Application: Flutter (optional module)

## Project Structure

e-learning/  
├── web/            — React frontend (Vite)  
├── server/         — Node.js + Express backend  
├── mobile/         — Flutter mobile application  
├── legacy-html/    — Initial static HTML prototype  
├── js/             — Shared JavaScript utilities  
├── images/         — Static assets  
└── README.md  

## Folder Details

### Web (Frontend)
- Built using React with Vite  
- Entry point: `web/src/main.jsx`  
- Routing logic: `web/src/App.jsx`  
- Handles UI rendering and user interactions  

### Server (Backend)
- Built using Node.js and Express.js  
- Entry point: `server/src/app.js`  
- Manages authentication, API routes, and database operations  
- Exposes RESTful APIs consumed by web and mobile clients  

### Mobile (Optional)
- Flutter application skeleton  
- Entry point: `mobile/lib/main.dart`  
- Communicates with backend APIs  

### Legacy HTML
- Contains early static HTML pages created before migrating to React  
- Kept for reference and documentation purposes  

## Features
- User authentication (login and registration)  
- Course listing and access functionality  
- RESTful API architecture  
- Responsive user interface  
- Modular monorepo-style project structure  

## How to Run the Project Locally

### Backend
```bash
cd server
npm install
npm start

##Frontend
cd web
npm install
npm run dev

##Mobile (Optional)
cd mobile
flutter pub get
flutter run
