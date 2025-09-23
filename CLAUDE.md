# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Memorial is a birthday and anniversary management web application built with React and Supabase. The app focuses on managing important dates for people you care about, with person-centered organization of anniversaries and events.

## Technology Stack

- **Frontend**: React 18 + Vite
- **Backend**: Supabase (Database, Auth, Storage)
- **Styling**: Tailwind CSS
- **State Management**: Zustand + React Query
- **Form Management**: React Hook Form + Zod
- **Calendar**: React Big Calendar
- **Date Utilities**: date-fns
- **UI Components**: Headless UI + Heroicons

## Development Commands

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Lint code
npm run lint
```

## Project Structure

```
src/
├── components/
│   ├── common/          # Shared components
│   ├── persons/         # Person management components
│   └── events/          # Event management components
├── pages/               # Page components
├── hooks/               # Custom React hooks
├── lib/                 # Utilities and configurations
└── stores/              # State management
```

## Key Features to Implement

1. **Authentication**: Supabase Auth with email/password and Google OAuth
2. **Person Management**: CRUD operations for people with relationships
3. **Event Management**: Birthday and anniversary tracking
4. **Dashboard**: Upcoming events and person overview
5. **Calendar View**: Visual calendar with events
6. **Timeline View**: Chronological event listing
7. **Notifications**: Email and browser notifications

## Database Schema

The app uses Supabase with two main tables:
- `persons`: User's contacts with relationships and basic info
- `events`: Events tied to persons with dates and notification settings

## Environment Variables

Required environment variables:
- `VITE_SUPABASE_URL`: Supabase project URL
- `VITE_SUPABASE_ANON_KEY`: Supabase anonymous key

## Documentation

Detailed requirements are available in `docs/requirements.md`.