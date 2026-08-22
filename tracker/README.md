# TraceLog

A full-stack web platform for centrally tracking media content — books, movies, courses, and podcasts — with a social layer of comments, reactions, notifications, and follows.

**Repository:** [github.com/Maryna32/Diploma/tree/main/tracker](https://github.com/Maryna32/Diploma/tree/main/tracker)
**Live demo:** [diploma-pink.vercel.app](https://diploma-pink.vercel.app/) 

## Overview

TraceLog lets users keep one central log of everything they're reading, watching, or listening to — books, movies, courses, podcasts — instead of scattering it across separate apps. On top of personal tracking, it adds a social layer so users can interact around what they're consuming: commenting, reacting, following others, and getting notified of activity.

Built as a graduation (diploma) project at Kharkiv National University of Radio Electronics.

## Features

-  User authentication and profile management
- Track books, movies, courses, and podcasts in one place
- Comments and reactions on tracked content
- Notifications for social activity
- Follow system to connect with other users
- Responsive UI built with Tailwind CSS
- Type-safe data layer with PostgreSQL and Prisma ORM

## Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | Next.js, React, Tailwind CSS |
| Backend | Next.js API routes |
| Database | PostgreSQL, Prisma ORM |
| Deployment | Vercel |

## Getting Started

```bash
# Clone the repository
git clone https://github.com/Maryna32/Diploma.git
cd Diploma/tracker

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env.local
# Fill in your database credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view it in your browser.

## Project Background

Developed as a Bachelor's graduation project (Computer Engineering, KhNURE, 2023–2026), focused on building a full-stack social platform from database schema to deployed product — including authentication, relational data modeling, and real-time social features.

## Author

**Maryna Burda** — [GitHub](https://github.com/Maryna32)
