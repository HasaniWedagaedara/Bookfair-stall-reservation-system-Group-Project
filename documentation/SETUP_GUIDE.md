# 📚 Bookfair Stall Reservation System - Setup Guide

Complete step-by-step guide to run this project from scratch.

---

##  Prerequisites

Before starting, ensure you have installed:

- **Node.js** (v20 or higher) - [Download](https://nodejs.org/)
- **Docker Desktop** - [Download](https://www.docker.com/products/docker-desktop/)
- **Git** - [Download](https://git-scm.com/)

---

##  Step-by-Step Setup

### Step 1: Clone the Repository

```bash
git clone https://github.com/HasaniWedagaedara/Bookfair-stall-reservation-system-Group-Project.git
cd Bookfair-stall-reservation-system-Group-Project
```

### Step 2: Checkout the Branch

```bash
git checkout sandali/QR
```

---

##  Database Setup

### Step 3: Start Docker Containers

```bash
docker-compose up -d
```

This starts:
- **PostgreSQL** database on port `5432`
- **pgAdmin** on port `5050` (optional GUI)

**Verify containers are running:**
```bash
docker ps
```

You should see `bookfair-db` and `pgadmin` containers.

### Step 4: Configure Environment Variables

Create `.env` file in the `backend` folder:

```bash
cd backend
```

Create `backend/.env` with this content:

```env
# Database
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/bookfair?schema=public"

# JWT
JWT_SECRET="your-secret-key-change-this-in-production"

# SMTP Email Configuration
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=587
SMTP_SECURE=false
SMTP_USER="your-email@gmail.com"
SMTP_PASS="your-app-specific-password"
SMTP_FROM="Bookfair Reservation <your-email@gmail.com>"
```

**Important:** For Gmail SMTP:
1. Enable 2-Factor Authentication on your Google account
2. Generate an [App Password](https://myaccount.google.com/apppasswords)
3. Use the app password in `SMTP_PASS`

---

##  Backend Setup

### Step 5: Install Backend Dependencies

```bash
cd backend
npm install
```

### Step 6: Run Database Migrations

```bash
npx prisma generate
npx prisma migrate deploy
```

### Step 7: Seed the Database

```bash
npx ts-node --transpile-only prisma/seed.ts
```

This creates:
- 3 test users
- 4 genres
- 5 stalls
- 2 sample reservations

**Test User Credentials:**
| Email | Password | Role |
|-------|----------|------|
| abc123@gmail.com | password123 | user |
| stallreservation@gmail.com | password123 | user |
| admin@bookfair.com | password123 | admin |

### Step 8: Start Backend Server

```bash
npm run start:dev
```

Backend will run on: **http://localhost:5000**

**Verify backend is running:**
- You should see: ` Server running on http://localhost:5000`
- Check logs for: `[NestApplication] Nest application successfully started`

---

##  Frontend Setup

### Step 9: Install Frontend Dependencies

Open a **new terminal** window:

```bash
cd Frontend
npm install
```

### Step 10: Start Frontend Development Server

```bash
npm run dev
```

Frontend will run on: **http://localhost:3000**

**Verify frontend is running:**
- Browser should automatically open
- Or manually navigate to: http://localhost:3000

---

##  Verification Steps

### Step 11: Test the Application

1. **Open Frontend:** http://localhost:3000

2. **Register/Login:**
   - Click "Login"
   - Use email: `sandali811@gmail.com`
   - Password: `password123`

3. **View Dashboard:**
   - After login, you should see your reservations
   - Test QR code download (3 options: Image, PDF, Email)

4. **Test QR Email Feature:**
   - Click "Download Your QR Pass" button
   - Select "Send to Email"
   - Check your email for QR code

### Step 12: View Database (Optional)

**Option A: Prisma Studio (Recommended)**
```bash
cd backend
npx prisma studio
```
Opens at: http://localhost:5555

**Option B: pgAdmin**
1. Open: http://localhost:5050
2. Login: `admin@admin.com` / `admin`
3. Add server:
   - Host: `bookfair-db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `bookfair`

---

##  Quick Start Commands

### Full Stack Startup

**Terminal 1 - Docker & Backend:**
```bash
docker-compose up -d
cd backend
npm run start:dev
```

**Terminal 2 - Frontend:**
```bash
cd Frontend
npm run dev
```

**Terminal 3 - View Database (Optional):**
```bash
cd backend
npx prisma studio
```

---

##  Troubleshooting

### Issue: "Database not found"

```bash
docker exec -it bookfair-db psql -U postgres -c "CREATE DATABASE bookfair;"
cd backend
npx prisma migrate deploy
```

### Issue: "Port 5000 already in use"

```bash
# Windows - Kill process on port 5000
Get-Process -Id (Get-NetTCPConnection -LocalPort 5000).OwningProcess | Stop-Process -Force

# Linux/Mac
lsof -ti:5000 | xargs kill
```

### Issue: "Module not found" errors

```bash
# Backend
cd backend
rm -rf node_modules package-lock.json
npm install

# Frontend
cd Frontend
rm -rf node_modules package-lock.json
npm install
```

### Issue: Prisma client errors

```bash
cd backend
rm -rf node_modules/.prisma
npx prisma generate
```

### Issue: Email not sending

Check:
1. `.env` file has correct SMTP credentials
2. Gmail App Password is generated (not regular password)
3. Less secure app access enabled (if not using App Password)
4. Check backend logs for email errors

### Issue: Docker container won't start

```bash
# Stop all containers
docker-compose down

# Remove volumes (WARNING: Deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

---

##  Project Structure

```
Bookfair-stall-reservation-system-Group-Project/
├── backend/
│   ├── src/
│   │   ├── auth/              # Authentication module
│   │   ├── reservation/       # Reservation management
│   │   ├── stall/            # Stall management
│   │   ├── genre/            # Genre management
│   │   ├── notification/     # Email & QR services
│   │   └── prisma/           # Database service
│   ├── prisma/
│   │   ├── schema.prisma     # Database schema
│   │   ├── seed.ts           # Test data seeder
│   │   └── migrations/       # Database migrations
│   └── .env                  # Environment variables
│
├── Frontend/
│   ├── src/
│   │   ├── pages/            # React pages
│   │   ├── components/       # Reusable components
│   │   ├── utils/            # Utility functions (QR codes)
│   │   └── store/            # State management
│   └── package.json
│
├── docker-compose.yml         # Docker configuration
└── README.md
```

---

##  Application URLs

| Service | URL | Credentials |
|---------|-----|-------------|
| Frontend | http://localhost:3000 | - |
| Backend API | http://localhost:5000 | - |
| Prisma Studio | http://localhost:5555 | - |
| pgAdmin | http://localhost:5050 | admin@admin.com / admin |
| PostgreSQL | localhost:5432 | postgres / postgres |

---

##  API Endpoints

### Authentication
- `POST /auth/register` - Register new user
- `POST /auth/user/login` - User login
- `POST /auth/admin/login` - Admin login
- `GET /auth/me` - Get current user
- `GET /auth/logout` - Logout

### Reservations
- `POST /reservations` - Create reservation
- `GET /reservations/my-reservations` - Get user's reservations
- `GET /reservations` - Get all reservations (admin)
- `POST /reservations/:id/send-qr-email` - Send QR code via email
- `PUT /reservations/:id/cancel` - Cancel reservation

### Stalls
- `GET /stalls` - Get all stalls
- `GET /stalls/available` - Get available stalls
- `GET /stalls/size` - Get stalls by size
- `POST /stalls` - Create stall (admin)

### Genres
- `GET /genres` - Get all genres
- `POST /genres` - Create genre (admin)
- `PUT /genres/:id` - Update genre (admin)
- `DELETE /genres/:id` - Delete genre (admin)

---

##  Features

### User Features
-  User registration and login
-  Browse available stalls
-  Make reservations (max 3 active)
-  View reservation dashboard
-  Download QR code (Image/PDF)
-  Receive QR code via email
-  Add genres to reservations
-  Multiple active reservations support

### Admin Features
-  Admin dashboard
-  Manage stalls (CRUD)
-  Manage genres (CRUD)
-  View all reservations
-  View statistics

### Technical Features
-  JWT authentication with httpOnly cookies
-  Email notifications with QR codes
-  Multi-reservation support
-  Genre management
-  PostgreSQL database with Prisma ORM
-  Docker containerization
-  TypeScript (backend & frontend)

---

##  Development Workflow

### Making Database Changes

1. **Update schema:**
   ```bash
   # Edit backend/prisma/schema.prisma
   ```

2. **Create migration:**
   ```bash
   cd backend
   npx prisma migrate dev --name your_migration_name
   ```

3. **Generate Prisma client:**
   ```bash
   npx prisma generate
   ```

### Adding New Features

1. Create module in `backend/src/`
2. Add routes in controller
3. Implement service logic
4. Update frontend components
5. Test thoroughly

### Running Tests

```bash
# Backend
cd backend
npm run test

# Frontend
cd Frontend
npm run test
```

---

##  Database Reset

**Warning:** This deletes all data!

```bash
cd backend
npx prisma migrate reset
npx ts-node --transpile-only prisma/seed.ts
```

---

##  Additional Resources

- [NestJS Documentation](https://docs.nestjs.com/)
- [Prisma Documentation](https://www.prisma.io/docs)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [Docker Documentation](https://docs.docker.com/)

---

##  Support

If you encounter issues:
1. Check the troubleshooting section above
2. Review backend logs for errors
3. Check browser console for frontend errors
4. Verify all services are running: `docker ps`
5. Ensure ports 3000, 5000, 5432, 5050, 5555 are available

---

##  Quick Reference

### Stop All Services
```bash
# Stop frontend (Ctrl+C in frontend terminal)
# Stop backend (Ctrl+C in backend terminal)
docker-compose down
```

### Restart Services
```bash
docker-compose restart
cd backend && npm run start:dev
cd Frontend && npm run dev
```

### View Logs
```bash
# Docker logs
docker-compose logs -f

# Specific container
docker logs bookfair-db -f
```

---

** You're all set! The application should now be running successfully.**

For questions or issues, please check the repository issues page.
