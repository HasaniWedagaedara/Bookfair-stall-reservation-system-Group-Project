# Database Management Guide

##  Seeding the Database

### Run the Seed Script
```bash
cd backend
npx prisma db seed
```

This will create:
- **3 Users** (2 regular + 1 admin)
- **4 Genres** (Fiction, Non-Fiction, Children, Comics & Manga)
- **5 Stalls** (A1, B2, C3, D4, E5)
- **2 Reservations** (with genres assigned)

### Test User Credentials
| Email | Password | Role |
|-------|----------|------|
| abc123@gmail.com | password123 | user |
| stallreservation@gmail.com | password123 | user |
| admin@bookfair.com | password123 | admin |

---

##  Viewing Database Records

### Option 1: Prisma Studio (Recommended - GUI)
```bash
cd backend
npx prisma studio
```
Opens at: **http://localhost:5555**

Features:
- Browse all tables visually
- Edit records directly
- Filter and search data
- See relationships between tables

### Option 2: PostgreSQL Client (psql)
```bash
# Connect to database
docker exec -it bookfair-db psql -U postgres -d bookfair

# View all users
SELECT id, email, name, role FROM users;

# View all stalls
SELECT id, name, size, location, status, price FROM stalls;

# View all reservations with user info
SELECT r.id, u.email, s.name as stall_name, r.status, r."totalAmount" 
FROM reservations r 
JOIN users u ON r."userId" = u.id 
JOIN stalls s ON r."stallId" = s.id;

# View reservation genres
SELECT r.id as reservation_id, u.email, g.name as genre 
FROM reservations r
JOIN users u ON r."userId" = u.id
JOIN reservation_genres rg ON r.id = rg."reservationId"
JOIN genres g ON rg."genreId" = g.id;

# Exit psql
\q
```

### Option 3: pgAdmin (GUI)
1. Open **http://localhost:5050**
2. Login: `admin@admin.com` / `admin`
3. Add Server:
   - Name: `Bookfair DB`
   - Host: `bookfair-db`
   - Port: `5432`
   - Username: `postgres`
   - Password: `postgres`
   - Database: `bookfair`

### Option 4: Direct SQL Query via Prisma
```typescript
// In your NestJS code or Node REPL
const users = await prisma.user.findMany();
const stalls = await prisma.stall.findMany();
const reservations = await prisma.reservation.findMany({
  include: {
    user: true,
    stall: true,
    genres: {
      include: {
        genre: true
      }
    }
  }
});
```

---

##  Common Database Operations

### Clear All Data (Reset)
```bash
cd backend
npx prisma migrate reset
# This will drop all data and re-run migrations
# Then run: npx prisma db seed
```

### Add More Data Manually
```bash
# Via Prisma Studio (easiest)
npx prisma studio
# Click on a table, then "Add record"

# Via SQL
docker exec -it bookfair-db psql -U postgres -d bookfair
# Then run INSERT statements
```

### Check Database Connection
```bash
cd backend
npx prisma db pull
# Should show schema is in sync
```

### View Migration History
```bash
docker exec -it bookfair-db psql -U postgres -d bookfair -c "SELECT * FROM _prisma_migrations ORDER BY finished_at DESC;"
```

---

##  Sample SQL Queries

### Count Records
```sql
SELECT 
  (SELECT COUNT(*) FROM users) as total_users,
  (SELECT COUNT(*) FROM stalls) as total_stalls,
  (SELECT COUNT(*) FROM reservations) as total_reservations,
  (SELECT COUNT(*) FROM genres) as total_genres;
```

### Available Stalls
```sql
SELECT name, size, price, location 
FROM stalls 
WHERE status = 'AVAILABLE'
ORDER BY price;
```

### User Reservations
```sql
SELECT 
  u.email,
  u.name,
  s.name as stall,
  r.status,
  r."totalAmount",
  r."createdAt"
FROM reservations r
JOIN users u ON r."userId" = u.id
JOIN stalls s ON r."stallId" = s.id
WHERE u.email = 'sandali811@gmail.com';
```

### Revenue Summary
```sql
SELECT 
  COUNT(*) as total_reservations,
  SUM("totalAmount") as total_revenue,
  AVG("totalAmount") as avg_reservation_value
FROM reservations
WHERE status = 'CONFIRMED';
```

---

##  Troubleshooting

### "Database not found" error
```bash
# Create database manually
docker exec -it bookfair-db psql -U postgres -c "CREATE DATABASE bookfair;"
cd backend
npx prisma migrate deploy
```

### "Table does not exist" error
```bash
cd backend
npx prisma migrate deploy
```

### Reset everything
```bash
cd backend
npx prisma migrate reset --force
npx prisma db seed
```

### Docker container not running
```bash
cd C:\Users\PC\Bookfair-stall-reservation-system-Group-Project
docker-compose up -d
```

---

##  Quick Start Workflow

1. **Start Docker** (if not running):
   ```bash
   docker-compose up -d
   ```

2. **Seed the database**:
   ```bash
   cd backend
   npx prisma db seed
   ```

3. **View data**:
   ```bash
   npx prisma studio
   # Opens at http://localhost:5555
   ```

4. **Test login** at frontend:
   - Email: `sandali811@gmail.com`
   - Password: `password123`

---

##  Notes

- Seed script uses `upsert` to avoid duplicate entries
- Run seed multiple times safely - won't create duplicates
- All test users have password: `password123`
- QR codes are auto-generated with format: `QR-{timestamp}-{userId}`
- Stall status updates automatically on reservation
