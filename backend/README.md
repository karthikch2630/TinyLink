# TinyLink Backend

Node.js + Express + MongoDB URL Shortener Backend

## Tech Stack

- Node.js 18+
- Express.js
- MongoDB with Mongoose
- Helmet (security headers)
- express-rate-limit
- CORS
- validator

## Setup Instructions

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Create a `.env` file in the `backend` directory:

```env
PORT=4000
MONGO_URI=mongodb://localhost:27017/tinylink
CORS_ORIGIN=http://localhost:5173
BASE_URL=http://localhost:4000
```

### 3. Start MongoDB

Make sure MongoDB is running locally or provide a MongoDB Atlas connection string.

**Local MongoDB:**
```bash
mongod
```

**MongoDB Atlas:**
Update `MONGO_URI` in `.env` with your Atlas connection string.

### 4. Run the Server

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

The server will start on `http://localhost:4000`

## API Endpoints

### Health Check
- `GET /healthz` - Server health check

### Create Short Link
- `POST /api/links`
- Body: `{ "target": "https://example.com", "code": "optional" }`
- Returns the created link with short URL

### List All Links
- `GET /api/links`
- Returns array of all active links

### Get Link Stats
- `GET /api/links/:code`
- Returns detailed stats for a specific link

### Delete Link
- `DELETE /api/links/:code`
- Soft deletes a link (marks as deleted)

### Redirect
- `GET /r/:code`
- Redirects to target URL and increments click count

## Project Structure

```
backend/
├── models/
│   └── Link.js          # MongoDB schema
├── routes/
│   ├── links.js         # CRUD operations
│   └── redirect.js      # Redirect logic
├── middleware/
│   ├── validateUrl.js   # URL validation & security
│   ├── rateLimiter.js   # Rate limiting
│   └── securityHeaders.js # Helmet CSP
├── utils/
│   └── codeGen.js       # Short code generator
├── app.js               # Express app configuration
├── server.js            # Server entry point
└── package.json

```

## Security Features

- Helmet with Content Security Policy
- Rate limiting on create and redirect endpoints
- URL validation (blocks localhost, private IPs, dangerous protocols)
- CORS restricted to frontend origin
- Request size limit (2kb)

## Deployment

### Deploy to Render

1. Create a new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
4. Add environment variables in Render dashboard
5. Deploy

### Deploy to Railway

1. Create a new project on Railway
2. Add MongoDB plugin
3. Connect repository
4. Configure root directory to `backend`
5. Add environment variables
6. Deploy

## Environment Variables for Production

```env
PORT=4000
MONGO_URI=<your-mongodb-connection-string>
CORS_ORIGIN=<your-frontend-url>
BASE_URL=<your-backend-url>
```

## Testing

Test the API with curl:

```bash
# Create link
curl -X POST http://localhost:4000/api/links \
  -H "Content-Type: application/json" \
  -d '{"target": "https://example.com"}'

# List links
curl http://localhost:4000/api/links

# Get stats
curl http://localhost:4000/api/links/abc123

# Test redirect
curl -L http://localhost:4000/r/abc123
```
