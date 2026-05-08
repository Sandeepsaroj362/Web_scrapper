# Hacker News Scraper

A full-stack MERN application that automatically scrapes the top 10 stories from Hacker News, stores them in MongoDB, and displays them in a modern, dark-themed React application.

## Features

- Scrapes top 10 stories from Hacker News (Title, URL, Points, Author, Posted Time).
- Trigger scraping automatically on backend startup and via the UI/API.
- User Authentication (Register/Login) with JWT.
- Bookmark your favorite stories.
- Protected routes for bookmarked stories.
- Sleek, premium dark mode UI.

## Technologies Used

- **Frontend:** React, Vite, React Router, Context API, Vanilla CSS, Lucide React (Icons).
- **Backend:** Node.js, Express.js, MongoDB, Mongoose, JWT, bcryptjs, Axios, Cheerio.

## Setup Instructions

### 1. Environment Variables

Create a `.env` file in the `backend/` directory with the following variables:

```
PORT=5000
MONGODB_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_jwt_secret_key
```

### 2. Backend Setup

Navigate to the `backend/` directory, install dependencies, and start the server:

```bash
cd backend
npm install
node server.js
```

### 3. Frontend Setup

Navigate to the `frontend/` directory, install dependencies, and start the development server:

```bash
cd frontend
npm install
npm run dev
```

The frontend will run on `http://localhost:5173` and the backend on `http://localhost:5000`.

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user

### Stories
- `GET /api/stories` - Fetch all stories (supports pagination `?page=1&limit=10`)
- `GET /api/stories/:id` - Fetch a single story
- `POST /api/stories/:id/bookmark` - Toggle bookmark (Requires Auth header)
- `POST /api/scrape` - Trigger the Hacker News scraper manually
