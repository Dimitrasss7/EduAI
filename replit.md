# E-Learning Platform - replit.md

## Overview

This is a comprehensive e-learning platform built with React, Node.js, and PostgreSQL. The platform provides online courses, AI-powered tutoring, and educational content management specifically designed for exam preparation (ЕГЭ/ОГЭ). It features a modern full-stack architecture with AI integration using Google's Gemini API.

## System Architecture

The application follows a monorepo structure with clear separation between client, server, and shared components:

- **Frontend**: React with TypeScript, using Vite for build tooling
- **Backend**: Express.js with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **AI Integration**: Google Gemini API for educational assistance
- **UI Framework**: Radix UI components with Tailwind CSS
- **State Management**: TanStack Query for server state management

## Key Components

### Database Schema
- **Users**: Student, teacher, and admin roles with authentication
- **Courses**: Subject-based courses with pricing and metadata
- **Lessons**: Video content with progress tracking
- **Quizzes**: Assessment system with attempts tracking
- **Enrollments**: Course subscription management
- **AI Chat Sessions**: Conversation history for AI tutoring
- **Leads**: Marketing lead capture system

### Authentication System
- JWT-based authentication with role-based access control
- Protected routes for different user types (student/teacher/admin)
- Session management with token storage

### AI Integration
- Google Gemini API for educational content generation
- Personalized tutoring and homework assistance
- Progress analysis and score prediction
- Quiz question generation based on curriculum

### Course Management
- Video-based lessons with progress tracking
- Interactive quizzes and assessments
- Subject categorization (Mathematics, Russian, Physics, etc.)
- Difficulty levels (Beginner, Intermediate, Advanced)

## Data Flow

1. **User Authentication**: Login/register → JWT token → Role-based access
2. **Course Access**: Enrollment → Lesson viewing → Progress tracking
3. **AI Interaction**: User question → Gemini API → Educational response
4. **Assessment**: Quiz attempt → Score calculation → Progress update
5. **Admin Management**: User/course/lead management through admin panel

## External Dependencies

### Core Dependencies
- **@google/genai**: AI tutoring capabilities
- **@neondatabase/serverless**: PostgreSQL database connection
- **drizzle-orm**: Type-safe database queries
- **@tanstack/react-query**: Server state management
- **@radix-ui/react-***: Accessible UI components
- **jwt**: Authentication tokens
- **bcrypt**: Password hashing

### Development Tools
- **Vite**: Build tooling and development server
- **TypeScript**: Type safety across the stack
- **Tailwind CSS**: Utility-first styling
- **ESBuild**: Fast production builds

## Deployment Strategy

The application is configured for deployment on Replit with:
- Environment variable management for database and API keys
- Development and production build scripts
- Static file serving for the React frontend
- Database migrations through Drizzle

### Build Process
1. Frontend build: `vite build` (React app)
2. Backend build: `esbuild` (Express server)
3. Database setup: `drizzle-kit push` (schema migrations)

### Environment Variables Required
- `DATABASE_URL`: PostgreSQL connection string
- `GEMINI_API_KEY`: Google AI API key
- `JWT_SECRET`: Authentication secret key

## Changelog
- July 03, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.