# OJ-Track

A commission management system for OJ Creatives. OJ-Track provides a centralized dashboard to track projects, clients, payments, and sales analytics — designed specifically for freelance graphic design workflows.

## Tech Stack

- **TypeScript** — Strongly typed JavaScript for safer, scalable code
- **React** — Component-based frontend framework
- **Vite** — Fast build tool and dev server
- **Tailwind CSS** — Utility-first styling for responsive design
- **Shadcn** — UI component library with tailwind + react
- **Express** – Backend framework for building APIs and handling server-side logic
- **MySQL** – Relational database for structured data storage and queries

## Features

### Dashboard Overview
- Total revenue acquired
- Client count
- Project statuses (not started, pending, done)
- Payment tracking (not yet, pending, completed)
- Recent project update
- Monthly client activity graphs

### Client Dashboard
- Project info
- Design status (not started, pending, done)
- Payment status reflected in sales overview

### Reports & Analytics
- Total projects summary
- Total sales
- Total revisions
- Average rate
- Graph comparisons by month
- Exportable insights for workflow and growth

## Project Structure

```
oj-track/
├── app
│   ├── public
│   └── src
│       ├── assets
│       ├── components
│       │   ├── clients
│       │   ├── dashboard
│       │   ├── profile
│       │   ├── reports
│       │   └── ui
│       ├── data
│       ├── hooks
│       ├── layouts
│       ├── lib
│       └── pages
├── backend
│   └── src
│       ├── config
│       ├── controllers
│       └── routes
├── db
└── seed

```

## Installation

### Prerequisites
- Node.js (v16 or higher)
- pnpm (or npm/yarn)

### Setup

```bash
# Clone the repository
git clone https://github.com/ojcreatives/oj-track.git

# FRONTEND Navigate into the project
cd app

# Install dependencies 
npm install

# BACKEND Navigate into the project
cd backend

# Install dependencies
npm install
```

### Start Development Server

```bash
# FRONTEND 
cd app
npm run dev

# The app will be available at `http://localhost:5173`

# BACKEND
cd backend
npm run dev

# The app will be available at `http://localhost:5000`


```



## Environment Setup

Create a `.env` file in the project root with your credentials:


## Roadmap

- [ ] Client crud optimization
- [ ] Role-based access (Admin vs Client view)
- [ ] Client Dashboard
- [ ] Export reports (CSV/PDF)
- [ ] Notifications for payment updates
- [ ] Dark mode toggle

## About OJ Creatives

OJ-Track is part of the OJ Creatives ecosystem — built to streamline design commissions and provide professional insights into client and project management.

## Web Portfolio

Check out my work: [owen-jerusalem.vercel.app](https://owen-jerusalem.vercel.app/)

---

**Questions?** Open an issue on the repository.
