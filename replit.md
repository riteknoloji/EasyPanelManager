# RandevuSistem - Professional Appointment Management System

## Overview

RandevuSistem is a modern, professional appointment booking web application built with a full-stack architecture. The system provides a user-friendly interface for customers to book appointments and an admin panel for managing bookings. The application is designed with Turkish language support and focuses on simplicity and efficiency.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: Tailwind CSS with shadcn/ui component library
- **Routing**: Wouter for client-side routing
- **State Management**: TanStack Query (React Query) for server state management
- **Form Handling**: React Hook Form with Zod validation
- **UI Components**: Comprehensive set of Radix UI primitives wrapped in custom components

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with JSON responses
- **Development**: Vite for development server and build tooling
- **Error Handling**: Centralized error handling middleware

### Data Storage
- **Database**: PostgreSQL with Drizzle ORM
- **Development Storage**: In-memory storage for rapid prototyping
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **Schema Management**: Drizzle Kit for migrations and schema management

## Key Components

### User-Facing Features
1. **Appointment Booking Form**: Comprehensive form with validation for creating new appointments
2. **Appointment Management**: View and manage existing appointments by email
3. **Responsive Design**: Mobile-first approach with Tailwind CSS
4. **Turkish Localization**: Complete Turkish language support throughout the interface

### Admin Features
1. **Admin Dashboard**: Secure admin panel with authentication
2. **Appointment Management**: Full CRUD operations for appointments
3. **Status Management**: Update appointment statuses (pending, confirmed, cancelled)
4. **Statistics**: Basic appointment statistics and reporting

### Technical Components
1. **Form Validation**: Zod schemas for both frontend and backend validation
2. **Toast Notifications**: User feedback system using Radix UI Toast
3. **Loading States**: Proper loading indicators and error handling
4. **Responsive Layout**: Header, footer, and main content areas

## Data Flow

### Appointment Creation Flow
1. User fills appointment form on homepage
2. Frontend validates data using Zod schema
3. Data sent to `/api/appointments` POST endpoint
4. Backend validates and stores appointment
5. Success/error feedback displayed to user

### Appointment Management Flow
1. User enters email on appointments page
2. System fetches appointments for that email
3. User can view, edit, or cancel appointments
4. Changes are reflected in real-time via React Query

### Admin Flow
1. Admin authenticates via login form
2. Access to admin dashboard with appointment overview
3. Full appointment management capabilities
4. Real-time updates via React Query

## External Dependencies

### Core Dependencies
- **React Ecosystem**: React, React DOM, React Hook Form
- **UI Library**: Radix UI primitives, Lucide React icons
- **Database**: Drizzle ORM, Neon Database client
- **Validation**: Zod for schema validation
- **HTTP Client**: TanStack Query for API management
- **Build Tools**: Vite, TypeScript, ESBuild

### Development Dependencies
- **Replit Integration**: Vite plugins for Replit development environment
- **Code Quality**: TypeScript for type safety
- **Styling**: Tailwind CSS, PostCSS, Autoprefixer

## Deployment Strategy

### Build Process
1. **Frontend Build**: Vite builds React application to `dist/public`
2. **Backend Build**: ESBuild bundles server code to `dist/index.js`
3. **Database Setup**: Drizzle migrations applied via `db:push` command

### Environment Setup
- **Development**: `npm run dev` starts both frontend and backend
- **Production**: `npm run build` followed by `npm start`
- **Database**: PostgreSQL connection via `DATABASE_URL` environment variable

### Platform Compatibility
- **EasyPanel**: Compatible deployment configuration
- **Nixpacks**: Automatic build detection and deployment
- **Replit**: Native development environment support

## Changelog

```
Changelog:
- July 03, 2025. Initial setup
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```