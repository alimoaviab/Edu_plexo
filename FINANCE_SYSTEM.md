# Finance Management System - Complete Implementation

## Overview

The Finance Management System is a comprehensive solution for managing school packages, revenue tracking, and expense management in the Eduplexo SaaS platform. This system allows Super Admins to:

- Create and manage custom packages for schools
- Track revenue from school subscriptions
- Manage business expenses (categorized by owner)
- View financial analytics and dashboards
- Monitor profit and loss

## Architecture

### Backend (Go)

#### Database Schema
Located in: `/backend-go/migrations/002_finance_system.sql`

**Tables:**
1. **school_packages** - Custom packages assigned to schools
   - Tracks student limits, pricing, and subscription details
   - Supports multiple duration types (monthly, quarterly, yearly, lifetime)
   - Payment status tracking (pending, paid, overdue, cancelled)

2. **expenses** - Business expense records
   - Categorized by type (mutual, ali, abdul_rehman)
   - Tracks amount, title, and notes
   - Audit trail with created_by and timestamps

3. **revenue_records** - Revenue tracking for analytics
   - Links to school packages
   - Tracks revenue type (package, addon, other)

4. **invoices** - Billing invoices (prepared for future payment integration)
   - Invoice number tracking
   - Status management (draft, sent, paid, overdue, cancelled)

5. **transactions** - Payment transactions (prepared for future payment integration)
   - Payment method tracking
   - Reference number for reconciliation

6. **subscriptions** - School subscription management (prepared for future)
   - Auto-renewal settings
   - Subscription lifecycle management

#### Store Types
Located in: `/backend-go/internal/store/types_finance.go`

Defines Go structs for all finance entities with proper JSON serialization.

#### API Handler
Located in: `/backend-go/internal/domain/finance/finance.go`

**Endpoints:**

**Package Management:**
- `POST /api/super-admin/packages?school_id={id}` - Create package
- `GET /api/super-admin/packages` - List packages (with filters)
- `PUT /api/super-admin/packages/{id}` - Update package
- `DELETE /api/super-admin/packages/{id}` - Delete package

**Expense Management:**
- `POST /api/super-admin/expenses` - Create expense
- `GET /api/super-admin/expenses` - List expenses (with type filter)

**Analytics:**
- `GET /api/super-admin/finance/dashboard` - Get finance dashboard data

**Response Format:**
```json
{
  "ok": true,
  "data": {
    // Response data
  }
}
```

### Frontend (React + TypeScript)

Located in: `/super-admin-app/src/pages/`

#### Pages

1. **FinanceDashboardPage.tsx** (`/finance`)
   - Main finance dashboard
   - Displays key metrics:
     - Total Revenue
     - Monthly Revenue
     - Total Expenses
     - Net Profit
   - Expense breakdown by category
   - Quick stats (total schools, active packages, profit margin)
   - Navigation buttons to manage packages and expenses

2. **PackagesPage.tsx** (`/packages`)
   - List all school packages
   - Create new packages with form
   - Edit existing packages
   - Delete packages
   - Filter by status
   - Display student utilization (current/allowed)

3. **ExpensesPage.tsx** (`/expenses`)
   - List all expenses
   - Create new expenses
   - Filter by expense type
   - Summary cards for each expense category
   - Expense history with dates

#### Components

**PageHeader.tsx** - Reusable page header component with title and description

#### Routing

Routes added to `/super-admin-app/src/routes.tsx`:
- `/finance` - Finance Dashboard
- `/packages` - Package Management
- `/expenses` - Expense Management

#### Navigation

Updated `/super-admin-app/src/components/Layout.tsx` with new menu items:
- Finance (trending_up icon)
- Packages (inventory_2 icon)
- Expenses (receipt_long icon)

## API Integration

### Authentication
All endpoints require Bearer token authentication:
```
Authorization: Bearer {token}
```

### Environment Variables
```
VITE_API_URL=http://localhost:8080  # Backend API URL
```

### Error Handling
- Validation errors return 400 with error details
- Authorization errors return 403
- Not found errors return 404
- Server errors return 500

## Features

### 1. Package Management

**Create Package:**
- Select school
- Set package name
- Define student limit
- Set price
- Choose duration type (auto-calculates expiry)
- Add notes
- Toggle active status

**Package Validation:**
- School can only have one active package
- Student limit must be positive
- Price must be non-negative
- Duration type must be valid

**Package Expiry:**
- Automatically calculated based on duration type
- Can be manually overridden
- Lifetime packages set to 2099-12-31

### 2. Expense Management

**Expense Categories:**
- **Mutual** - Shared expenses
- **Ali** - Ali's personal expenses
- **Abdul Rehman** - Abdul Rehman's personal expenses

**Expense Tracking:**
- Title and amount required
- Optional notes
- Automatic timestamp
- Created by tracking

**Expense Analytics:**
- Total expenses by category
- Monthly expense tracking
- Expense breakdown visualization

### 3. Financial Analytics

**Dashboard Metrics:**
- Total lifetime revenue
- Current month revenue
- Total expenses
- Net profit calculation
- Expense breakdown by category
- Profit margin percentage

**Data Aggregation:**
- Real-time calculations
- Efficient filtering
- Pagination support

## Security

### Authorization
- Only `super_admin` and `admin` roles can access finance endpoints
- Role-based access control enforced at handler level

### Data Validation
- Input validation on all endpoints
- Type checking for numeric fields
- Date format validation (YYYY-MM-DD)
- Enum validation for categorical fields

### Audit Trail
- All operations tracked with `created_by` and timestamps
- Update timestamps maintained
- Soft delete support prepared

## Database Indexes

For optimal performance:
```sql
CREATE INDEX idx_school_packages_school ON school_packages(school_id);
CREATE INDEX idx_school_packages_status ON school_packages(payment_status);
CREATE INDEX idx_school_packages_expiry ON school_packages(expiry_date);
CREATE INDEX idx_expenses_type ON expenses(expense_type);
CREATE INDEX idx_expenses_created ON expenses(created_at);
CREATE INDEX idx_revenue_school ON revenue_records(school_id);
CREATE INDEX idx_revenue_recorded ON revenue_records(recorded_at);
CREATE INDEX idx_invoices_school ON invoices(school_id);
CREATE INDEX idx_invoices_status ON invoices(status);
CREATE INDEX idx_transactions_school ON transactions(school_id);
CREATE INDEX idx_transactions_status ON transactions(status);
CREATE INDEX idx_subscriptions_school ON subscriptions(school_id);
CREATE INDEX idx_subscriptions_status ON subscriptions(status);
```

## Future Enhancements

### Payment Integration
- Stripe/PayPal integration for online payments
- Automated invoice generation
- Payment reconciliation
- Refund management

### Advanced Analytics
- Monthly revenue trends
- Expense forecasting
- Profit margin analysis
- School-wise revenue breakdown
- Payment collection reports

### Automation
- Auto-renewal of subscriptions
- Overdue payment notifications
- Expense categorization automation
- Financial report generation

### Compliance
- Tax report generation
- Audit log export
- Financial statement generation
- Compliance reporting

## Testing

### Manual Testing Checklist

**Package Management:**
- [ ] Create package for a school
- [ ] Verify student limit validation
- [ ] Test package expiry calculation
- [ ] Update package details
- [ ] Delete package
- [ ] List packages with filters
- [ ] Verify duplicate package prevention

**Expense Management:**
- [ ] Create expense for each category
- [ ] Verify expense type validation
- [ ] List expenses with type filter
- [ ] Verify expense totals calculation
- [ ] Test pagination

**Dashboard:**
- [ ] Verify revenue calculation
- [ ] Verify expense breakdown
- [ ] Check profit calculation
- [ ] Verify quick stats

### API Testing

Using curl:
```bash
# Create package
curl -X POST http://localhost:8080/api/super-admin/packages?school_id=school_1 \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "package_name": "Premium",
    "allowed_students": 500,
    "price": 299.99,
    "duration_type": "yearly",
    "start_date": "2025-01-01",
    "is_active": true
  }'

# List packages
curl http://localhost:8080/api/super-admin/packages \
  -H "Authorization: Bearer {token}"

# Create expense
curl -X POST http://localhost:8080/api/super-admin/expenses \
  -H "Authorization: Bearer {token}" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Server Renewal",
    "amount": 120.00,
    "expense_type": "mutual",
    "note": "AWS server renewal"
  }'

# Get finance dashboard
curl http://localhost:8080/api/super-admin/finance/dashboard \
  -H "Authorization: Bearer {token}"
```

## Deployment

### Backend
1. Run migrations: `go run ./cmd/seed`
2. Start server: `go run ./cmd/server`
3. Server listens on port 8080 (configurable via PORT env var)

### Frontend
1. Build: `npm run build`
2. Deploy dist folder to Vercel/hosting
3. Set `VITE_API_URL` environment variable

## Troubleshooting

### Common Issues

**"School already has a package" error**
- Solution: Delete existing package first or update it

**"Invalid duration type" error**
- Solution: Use one of: monthly, quarterly, yearly, lifetime

**"Student limit exceeded" error**
- Solution: Increase allowed_students in package or delete students

**Dashboard shows $0 revenue**
- Solution: Ensure packages have payment_status = "paid"

## Support

For issues or questions:
1. Check the API response error messages
2. Verify authentication token is valid
3. Ensure role is super_admin or admin
4. Check database connectivity
5. Review server logs for detailed errors

## Files Modified/Created

### Backend
- `/backend-go/migrations/002_finance_system.sql` - Database schema
- `/backend-go/internal/store/types_finance.go` - Go types
- `/backend-go/internal/domain/finance/finance.go` - API handlers
- `/backend-go/internal/store/store.go` - Updated MemStore
- `/backend-go/internal/server/router.go` - Added routes

### Frontend
- `/super-admin-app/src/pages/FinanceDashboardPage.tsx` - Dashboard page
- `/super-admin-app/src/pages/PackagesPage.tsx` - Packages page
- `/super-admin-app/src/pages/ExpensesPage.tsx` - Expenses page
- `/super-admin-app/src/components/PageHeader.tsx` - Header component
- `/super-admin-app/src/routes.tsx` - Updated routes
- `/super-admin-app/src/components/Layout.tsx` - Updated navigation

## Version History

- **v1.0.0** (2025-05-16) - Initial implementation
  - Package management
  - Expense tracking
  - Financial dashboard
  - Basic analytics
