# FitPlanHub

A fitness platform connecting trainers with users. Trainers create workout plans, users subscribe to them.

## Features

### Authentication & User Management

- ✅ User signup (User/Trainer roles)
- ✅ User login with JWT
- ✅ Logout functionality
- ✅ Token refresh mechanism
- ✅ Get current user info (/auth/me)
- ✅ Password stored with bcrypt hashing
- ✅ Cookie-based authentication

### Plans (Workout Plans)

- ✅ View all plans
- ✅ View individual plan details by ID
- ✅ Create plans (Trainer only)
- ✅ Update plans (Trainer only)
- ✅ Delete plans (Trainer only)
- ✅ Plans include: title, description, price, duration, workout details
- ✅ Preview mode for plans

### Subscriptions

- ✅ Subscribe to a plan (User only)
- ✅ View user's active subscriptions
- ✅ Link between users and plans they've subscribed to

### Trainer Features

- ✅ View all trainers
- ✅ View individual trainer profile
- ✅ Follow trainers (User can follow any trainer)
- ✅ Unfollow trainers (User can unfollow)
- ✅ View list of trainers you're following
- ✅ See trainer's plan count and plan as well

### Feed

- ✅ Personalized feed showing plans from followed trainers

### Frontend Pages

- ✅ Landing page with hero, features, plans list
- ✅ Trainers discovery page
- ✅ Signup page 
- ✅ Login page 
- ✅ Trainer dashboard 
- ✅ User dashboard 

## Tech Stack

**Frontend:**
- Next.js 16.0.10 - React framework with App Router
- React 19.2.1 - UI library
- TypeScript 5 - Type safety
- Tailwind CSS 4 - Utility-first CSS framework
- shadcn/ui - Re-usable component library (Radix UI primitives)
- Axios 1.13.2 - HTTP client
- React Hook Form 7.68 - Form state management
- Zod 4.1.13 - Schema validation
- Lucide React 0.561 - Icon library

**Backend:**
- Node.js - JavaScript runtime
- Express 5.2.1 - Web framework
- TypeScript 5.9.3 - Type safety
- MongoDB - NoSQL database
- Mongoose 9.0.1 - MongoDB ODM
- JWT (jsonwebtoken 9.0.3) - Authentication tokens
- bcryptjs 3.0.3 - Password hashing
- Zod 4.1.13 - Request validation
- cookie-parser 1.4.7 - Cookie handling
- cors 2.8.5 - Cross-origin resource sharing
- helmet 8.1.0 - Security headers
- express-rate-limit 8.2.1 - API rate limiting
- dotenv 17.2.3 - Environment variables

## Prerequisites

Make sure you have these installed:
- Node.js 18+ 
- MongoDB 
- npm 

## Setup Instructions

## 1. Clone / Download the Repository

### Using Git

```bash
git clone <your-repo-url>
cd fitplanhub
```

### Using ZIP

1. Download and extract the ZIP file
2. Open terminal / command prompt
3. Navigate to the extracted folder:

```bash
cd fitplanhub
```

---

## 2. Install Dependencies

> **IMPORTANT:** This is a **monorepo**.
>
> * Frontend → root folder
> * Backend → `backend/` folder

### Install Frontend Dependencies (root folder)

```bash
npm install
```

### Install Backend Dependencies

```bash
cd backend
npm install
cd ..
```

---

## 3. Environment Setup

### Frontend Environment Variables

Create a `.env` file in the **root folder** (same level as `package.json`):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api/v1
```

---

### Backend Environment Variables

Create a `.env` file inside the **backend/** folder:

```env
PORT=5000

MONGODB_URI=enter your mongodb uri here

JWT_ACCESS_SECRET=enter your jwt access secret here
JWT_REFRESH_SECRET=enter your jwt refresh secret here

NODE_ENV=development
FRONTEND_URL=http://localhost:3000
```

---

## 4. Run the Application

### Start Backend Server

```bash
cd backend
npm run dev
```

### Start Frontend Server (new terminal)

```bash
npm run dev
```

---

## 5. Access the App

* Frontend: [http://localhost:3000](http://localhost:3000)
* Backend API: [http://localhost:5000/api/v1](http://localhost:5000/api/v1)

---

## API Endpoints

### Authentication
```
POST   /api/v1/auth/signup      - Create account
POST   /api/v1/auth/login       - Login
POST   /api/v1/auth/logout      - Logout
GET    /api/v1/auth/me          - Get current user
POST   /api/v1/auth/refresh     - Refresh token
```

### Plans
```
GET    /api/v1/plans            - Get all plans (public)
GET    /api/v1/plans/:id        - Get plan by ID
POST   /api/v1/plans            - Create plan (trainer only)
PUT    /api/v1/plans/:id        - Update plan (trainer only)
DELETE /api/v1/plans/:id        - Delete plan (trainer only)
```

### Subscriptions
```
POST   /api/v1/subscriptions/subscribe        - Subscribe to plan
GET    /api/v1/subscriptions/my-subscriptions - Get user's subscriptions
```

### Trainers
```
GET    /api/v1/trainers              - Get all trainers
GET    /api/v1/trainers/:id          - Get trainer by ID
POST   /api/v1/trainers/:id/follow   - Follow trainer
DELETE /api/v1/trainers/:id/unfollow - Unfollow trainer
GET    /api/v1/trainers/following    - Get followed trainers
```

### Feed
```
GET    /api/v1/feed - Get personalized feed (plans from followed trainers)
```

## Testing with Postman

Import the Postman collection (if you have one exported) or use these sample requests:

**Create Trainer:**
```bash
curl -X POST http://localhost:5000/api/v1/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "email": "trainer@test.com",
    "password": "Test123!",
    "name": "John Trainer",
    "role": "trainer"
  }'
```

**Create Plan:**
```bash
curl -X POST http://localhost:5000/api/v1/plans \
  -H "Content-Type: application/json" \
  -H "Cookie: your-auth-cookie" \
  -d '{
    "title": "Beginner Strength Plan",
    "description": "Build strength from scratch",
    "price": 999,
    "duration": 30,
    "workoutDetails": {
      "type": "Strength",
      "level": "Beginner"
    }
  }'
```
