# TinyLink - URL Shortener

A full-stack URL shortener application with a React TypeScript frontend and Node.js JavaScript backend.

## Features

- Create short links with custom or auto-generated codes
- View all links in a dashboard
- Track click statistics
- Delete links
- Responsive, modern UI
- Secure URL validation
- Rate limiting
- MongoDB persistence

## Tech Stack

### Frontend
- React 18
- TypeScript
- Vite
- TailwindCSS
- React Router
- Axios
- Lucide React (icons)

### Backend
- Node.js 18+
- Express.js
- MongoDB + Mongoose
- Helmet (security)
- express-rate-limit
- CORS
- validator

## Quick Start

### Prerequisites
- Node.js 18 or higher
- MongoDB (local or Atlas)

### 1. Clone and Install

```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

### 2. Configure Environment

**Backend** - Create `backend/.env`:
```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/tinylink
CORS_ORIGIN=http://localhost:5173
BASE_URL=http://localhost:4000
```

**Frontend** - Create `.env`:
```env
VITE_API_URL=http://localhost:4000
```

### 3. Start MongoDB

```bash
mongod
```

### 4. Run the Application

**Terminal 1 - Backend:**
```bash
cd backend
npm run dev
```

**Terminal 2 - Frontend:**
```bash
npm run dev
```

Open http://localhost:5173 in your browser.

## Project Structure

```
tinylink/
├── backend/                 # Node.js backend
│   ├── models/             # Mongoose schemas
│   ├── routes/             # API routes
│   ├── middleware/         # Express middleware
│   ├── utils/              # Helper functions
│   ├── app.js              # Express app
│   ├── server.js           # Entry point
│   └── package.json
│
├── src/                    # React frontend
│   ├── components/         # React components
│   ├── pages/              # Page components
│   ├── lib/                # API client
│   ├── App.tsx             # Main app component
│   └── main.tsx            # Entry point
│
├── package.json            # Frontend dependencies
└── README.md
```

## API Documentation

### Create Short Link
```http
POST /api/links
Content-Type: application/json

{
  "target": "https://example.com",
  "code": "my-link"  // optional
}
```

### List All Links
```http
GET /api/links
```

### Get Link Stats
```http
GET /api/links/:code
```

### Delete Link
```http
DELETE /api/links/:code
```

### Redirect
```http
GET /r/:code
```

## Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create Web Service on Render
3. Configure:
   - Root Directory: `backend`
   - Build: `npm install`
   - Start: `npm start`
4. Add environment variables
5. Deploy

### Frontend Deployment (Vercel)

1. Push code to GitHub
2. Import project on Vercel
3. Configure:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
4. Add environment variable: `VITE_API_URL`
5. Deploy

### Database (MongoDB Atlas)

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Update `MONGO_URI` in backend environment

## Development

### Frontend Development
```bash
npm run dev          # Start dev server
npm run build        # Build for production
npm run preview      # Preview production build
npm run typecheck    # Type checking
```

### Backend Development
```bash
cd backend
npm run dev          # Start with auto-reload
npm start            # Production mode
```

## Security Features

- URL validation (blocks localhost, private IPs, dangerous protocols)
- Rate limiting on link creation and redirects
- Helmet security headers
- CORS protection
- Input sanitization
- Request size limits

## License

MIT
