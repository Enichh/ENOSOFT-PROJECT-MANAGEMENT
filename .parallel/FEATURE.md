# EnoSoft Project Management System

## Overview
A web-based project management application with AI integration, deployed on Netlify. Supports admin and employee roles with CRUD operations, calendar management, and AI-powered recommendations.

## Tech Stack
- **Frontend**: React + TypeScript + TailwindCSS
- **Backend**: Netlify Functions (serverless)
- **Database**: Netlify Blob Store / LocalStorage (client-side persistence for static deployment)
- **AI Integration**: OpenAI/Anthropic API via Netlify Functions
- **Auth**: JWT-based authentication
- **Calendar**: FullCalendar or similar React calendar library

## Architecture
- Static site deployed on Netlify
- Serverless functions for AI API calls and secure operations
- Client-side storage with sync capabilities
- Role-based access control (RBAC)

## Requirements Summary

### Admin Capabilities
- CRUD employees and projects
- Assign employees to projects
- AI chat for project/employee recommendations
- One-click AI employee recommendation
- Employee repository with search (category, department, job type)
- Calendar editing for project deadlines and assigned personnel
- Create employee accounts

### Employee Capabilities
- Login/logout
- View assigned tasks
- Mark tasks as complete
- View project history
- See team members (project-specific visibility)

## Deployment Target
Netlify Static Hosting with serverless functions

## Workstreams
1. **Shared** - Data models, types, API contracts
2. **Auth** - Authentication system (login, roles, JWT)
3. **Backend** - Netlify functions, AI integration, data layer
4. **Frontend-Core** - React app shell, routing, state management
5. **Admin-UI** - Admin dashboard, employee/project CRUD, calendar
6. **Employee-UI** - Employee dashboard, task views, project history
7. **AI-Features** - AI chat interface, recommendation engine

## AI Integration Points
- Recommendation button on project assignment
- Chat interface for admin consulting AI
- AI analyzes: project requirements, employee skills, availability, department

---

## Coordination Notes
- **Shared must complete first** - defines all TypeScript interfaces and API contracts
- **Auth** should be second - required for all protected routes
- **Backend** and **Frontend-Core** can proceed in parallel after Shared
- **Admin-UI**, **Employee-UI**, and **AI-Features** depend on Frontend-Core
- All workstreams follow camelCase naming convention per project rules
