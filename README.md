# SkillForge LMS

SkillForge is a complete, modern, full-stack Learning Management System built with React 18, TypeScript, Tailwind CSS, Spring Boot 3, and MongoDB.

## Features
- **Role-Based Access Control**: Separate views and permissions for Admin, Instructor, and Student.
- **JWT Authentication**: Secure login and registration.
- **Course Management**: Instructors can create courses, and students can browse the catalog and enroll.
- **Modern UI**: Built with React Router v6, Lucide React icons, and standard Tailwind UI.
- **Fully Responsive**: Works on both desktop and mobile devices.

## Technology Stack
- **Frontend**: React (Vite), TypeScript, Tailwind CSS v4, Zustand, Axios, React Router.
- **Backend**: Spring Boot 3 (Java 21), Spring Security, Spring Data MongoDB.
- **Database**: MongoDB.

## Prerequisites
- Java 17+
- Node.js (v18+)
- MongoDB running locally on `localhost:27017`
- Maven

## How to Run Locally

You can use the provided scripts to build and run the entire application with one command:

### On Windows (PowerShell)
```powershell
.\build-and-run.ps1
```

### On Linux/macOS
```bash
./build-and-run.sh
```

Alternatively, you can run them manually:
1. **Start Backend**: `cd backend && mvn spring-boot:run` (Runs on port 8080)
2. **Start Frontend**: `cd frontend && npm install && npm run dev` (Runs on port 5173)

## Environment Variables
Check `.env.example` to see the default configuration. You can change the MongoDB URI or JWT Secret by creating an `application-dev.properties` or passing environment variables.
