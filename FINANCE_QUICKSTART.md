# Finance System - Quick Start Guide

## 🚀 Getting Started

### Prerequisites
- Go 1.21+
- Node.js 18+
- PostgreSQL (optional, in-memory mode works for development)
- Redis (optional, for caching)

### 1. Start the Backend

```bash
cd backend-go

# Install dependencies (if needed)
go mod download

# Run the server
go run ./cmd/server
```

The backend will start on `http://localhost:8080`

**Bootstrap Credentials:**
- Super Admin: `eduplexo@gmail.com` / `Test@123`
- School Admin: `school@gmail.com` / `Test@123`

### 2. Start the Super Admin Frontend

```bash
cd super-admin-app

# Install dependencies
npm install

# Start development server
npm run dev
```

The frontend will start on `http://localhost:5173`

### 3. Login to Super Admin Dashboard

1. Open `http://localhost:5173`
2. Login with: `eduplexo@gmail.com` / `Test@123`
3. Navigate to Finance section

## 📋 Using the Finance System

### Creating a School Package

1. Go to **Packages** menu
2. Click **Add Package**
3. Fill in the form:
   - Select a school
   - Enter package name (e.g., "Premium Plan")
   - Set allowed students (e.g., 500)
   - Set price (e.g., 299.99)
   - Choose duration (monthly, quarterly, yearly, lifetime)
   - Click **Create Package**

### Adding Expenses

1. Go to **Expenses** menu
2. Click **Add Expense**
3. Fill in the form:
   - Enter title (e.g., "AWS Server Renewal")
   - Enter amount (e.g., 120.00)
   - Select expense type (Mutual, Ali, or Abdul Rehman)
   - Add optional note
   - Click **Create Expense**

### Viewing Finance Dashboard

1. Go to **Finance** menu
2. View key metrics:
   - Total Revenue
   - Monthly Revenue
   - Total Expenses
   - Net Profit
3. See expense breakdown by category
4. View quick stats

## 🔌 API Endpoints

### Authentication
All requests require Bearer token:
```
Authorization: Bearer {token}
```

### Packages

**Create Package**
```bash
POST /api/super-admin/packages?school_id=school_1
Content-Type: application/json

{
  "package_name": "Premium",
  "allowed_students": 500,
  "price": 299.99,
  "duration_type": "yearly",
  "start_date": "2025-01-01",
  "is_active": true
}
```

**List Packages**
```bash
GET /api/super-admin/packages
GET /api/super-admin/packages?status=paid
GET /api/super-admin/packages?search=Premium
```

**Update Package**
```bash
PUT /api/super-admin/packages/{id}
Content-Type: application/json

{
  "package_name": "Premium Plus",
  "allowed_students": 1000,
  "price": 399.99
}
```

**Delete Package**
```bash
DELETE /api/super-admin/packages/{id}
```

### Expenses

**Create Expense**
```bash
POST /api/super-admin/expenses
Content-Type: application/json

{
  "title": "Server Renewal",
  "amount": 120.00,
  "expense_type": "mutual",
  "note": "AWS server renewal for 1 month"
}
```

**List Expenses**
```bash
GET /api/super-admin/expenses
GET /api/super-admin/expenses?type=mutual
```

### Dashboard

**Get Finance Dashboard**
```bash
GET /api/super-admin/finance/dashboard
```

Response:
```json
{
  "ok": true,
  "data": {
    "total_revenue": 5999.99,
    "monthly_revenue": 1299.99,
    "total_expenses": 500.00,
    "net_profit": 5499.99,
    "expense_breakdown": {
      "mutual": 300.00,
      "ali": 100.00,
      "abdul_rehman": 100.00
    },
    "total_schools": 5,
    "active_packages": 4
  }
}
```

## 🧪 Testing with cURL

### Get Auth Token

```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "eduplexo@gmail.com",
    "password": "Test@123"
  }'
```

Response:
```json
{
  "ok": true,
  "data": {
    "token": "eyJhbGc...",
    "user": {
      "id": "user_xxx",
      "email": "eduplexo@gmail.com",
      "role": "super_admin"
    }
  }
}
```

### Create Package

```bash
TOKEN="your_token_here"

curl -X POST "http://localhost:8080/api/super-admin/packages?school_id=school_default" \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "package_name": "Standard Plan",
    "allowed_students": 200,
    "price": 199.99,
    "duration_type": "yearly",
    "start_date": "2025-01-01",
    "is_active": true
  }'
```

### Create Expense

```bash
TOKEN="your_token_here"

curl -X POST http://localhost:8080/api/super-admin/expenses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Office Supplies",
    "amount": 50.00,
    "expense_type": "mutual",
    "note": "Monthly office supplies"
  }'
```

### Get Dashboard

```bash
TOKEN="your_token_here"

curl http://localhost:8080/api/super-admin/finance/dashboard \
  -H "Authorization: Bearer $TOKEN"
```

## 📊 Database Schema

### school_packages
```sql
CREATE TABLE school_packages (
  id TEXT PRIMARY KEY,
  school_id TEXT NOT NULL UNIQUE,
  package_name VARCHAR(255) NOT NULL,
  allowed_students INT NOT NULL,
  price DECIMAL(12,2) NOT NULL,
  duration_type VARCHAR(50) NOT NULL,
  start_date DATE NOT NULL,
  expiry_date DATE,
  payment_status VARCHAR(50) NOT NULL,
  is_active BOOLEAN NOT NULL,
  notes TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

### expenses
```sql
CREATE TABLE expenses (
  id TEXT PRIMARY KEY,
  expense_type VARCHAR(50) NOT NULL,
  title VARCHAR(255) NOT NULL,
  amount DECIMAL(12,2) NOT NULL,
  note TEXT,
  created_by TEXT,
  created_at TIMESTAMPTZ NOT NULL,
  updated_at TIMESTAMPTZ NOT NULL
);
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 8080 is in use
lsof -i :8080

# Kill the process if needed
kill -9 <PID>
```

### Frontend won't connect to backend
1. Check `VITE_API_URL` in `.env.local`
2. Ensure backend is running on correct port
3. Check CORS settings in backend

### "School already has a package" error
- Delete the existing package first
- Or update the existing package instead

### Authentication fails
- Verify credentials: `eduplexo@gmail.com` / `Test@123`
- Check token is being sent in Authorization header
- Ensure token hasn't expired

## 📁 Project Structure

```
Eduplexo/
├── backend-go/
│   ├── cmd/
│   │   └── server/main.go
│   ├── internal/
│   │   ├── domain/
│   │   │   └── finance/
│   │   │       └── finance.go
│   │   ├── store/
│   │   │   ├── types_finance.go
│   │   │   └── store.go
│   │   └── server/
│   │       └── router.go
│   └── migrations/
│       └── 002_finance_system.sql
│
└── super-admin-app/
    └── src/
        ├── pages/
        │   ├── FinanceDashboardPage.tsx
        │   ├── PackagesPage.tsx
        │   └── ExpensesPage.tsx
        ├── components/
        │   ├── Layout.tsx
        │   └── PageHeader.tsx
        └── routes.tsx
```

## 🔐 Security Notes

- All endpoints require authentication
- Only super_admin and admin roles can access finance endpoints
- Passwords are hashed before storage
- CORS is configured for allowed origins
- Input validation on all endpoints

## 📞 Support

For detailed documentation, see `FINANCE_SYSTEM.md`

## Next Steps

1. ✅ Create school packages
2. ✅ Track expenses
3. ✅ Monitor revenue
4. 🔜 Integrate payment gateway
5. 🔜 Generate financial reports
6. 🔜 Set up automated billing

---

**Happy tracking! 📈**
