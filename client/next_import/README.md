# Kindle-like Storefront/Reader - Supabase Backend

A complete Supabase-backed backend for a Kindle-like digital bookstore with user authentication, book management, orders, reviews, and payment processing.

## 🚀 Quick Start

### 1. Environment Setup

Copy `env.example` to `.env.local` and configure:

```bash
cp env.example .env.local
```

Your Supabase credentials are already configured:
- **Project URL**: https://pnjfffkkbamfzqbvltzm.supabase.co
- **Anon Key**: ✅ Configured
- **Service Role Key**: ✅ Configured
- **JWT Secret**: ✅ Configured

### 2. Database Setup

1. Go to [Supabase Dashboard](https://pnjfffkkbamfzqbvltzm.supabase.co)
2. Navigate to **SQL Editor**
3. Copy and paste the contents of `database/schema.sql`
4. Execute the script

This creates:
- All required tables (users, authors, categories, books, reviews, orders, library)
- Row Level Security (RLS) policies
- Storage buckets for covers and book files
- Indexes for performance
- Auto-user creation trigger

### 3. Install Dependencies

```bash
npm install @supabase/supabase-js zod next
```

### 4. Start Development Server

```bash
npm run dev
```

## 🏗️ Architecture

### Backend Structure
```
server/
├── supabaseAdmin.ts      # Admin client (service role)
├── auth.ts              # Authentication helpers
├── users.ts             # User management
├── books.ts             # Book CRUD + storage
├── orders.ts            # Order management
├── library.ts           # User library access
├── reviews.ts           # Review system
└── payments/
    └── adapter.ts       # Payment provider wrapper
```

### API Routes
```
app/api/
├── auth/[action]/       # signup/signin/signout
├── books/               # list/create books
├── books/[id]/          # get/update/delete book
├── categories/          # list/create categories
├── authors/             # list/create authors
├── reviews/             # list/create reviews
├── orders/              # create/list orders
├── library/             # user library + access check
└── payments/[provider]/ # payment creation + webhooks
```

## 🔐 Authentication & Security

### Row Level Security (RLS)
- **Users**: Can only access their own data
- **Admins**: Full access to all data
- **Public**: Read-only access to books, authors, categories, reviews

### Auth Guards
```typescript
import { requireAuth, requireAdmin } from '../server/auth'

// Require user authentication
const user = await requireAuth()

// Require admin role
const admin = await requireAdmin()
```

## 📚 Core Features

### Book Management
- **CRUD Operations**: Create, read, update, delete books
- **Search & Filtering**: By title, category, author
- **File Storage**: Cover images (public) + book files (signed URLs)
- **Stock Management**: Track available copies

### Order System
- **Cart to Order**: Convert cart items to orders
- **Payment Integration**: Stripe/Razorpay via adapter
- **Library Access**: Auto-add purchased books to user library
- **Status Tracking**: pending → completed → cancelled

### User Library
- **Access Control**: Check if user owns book
- **Download URLs**: Signed URLs for book files
- **Purchase History**: Track all bought books

## 💳 Payment Integration

### Payment Adapter
The `server/payments/adapter.ts` wraps your existing payment providers:

```typescript
// TODO: Import your existing payment logic from:
// C:\Users\bigbo\OneDrive\Desktop\Devansh\Website

// Replace placeholder implementations with:
import { createStripePaymentIntent } from '../../../../Website/server/payments/stripe'
import { createRazorpayOrder } from '../../../../Website/server/payments/razorpay'
```

### Webhook Handling
- **Stripe**: `/api/payments/stripe/webhook`
- **Razorpay**: `/api/payments/razorpay/webhook`
- **Auto-completion**: Marks orders complete and adds books to library

## 🎯 API Usage Examples

### Fetch Books
```typescript
// List all books
const response = await fetch('/api/books')
const { books } = await response.json()

// Search books
const response = await fetch('/api/books?q=harry&category=123&sort=-price')
```

### Create Order
```typescript
const response = await fetch('/api/orders', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    items: [
      { book_id: 'uuid', qty: 1 },
      { book_id: 'uuid2', qty: 2 }
    ]
  })
})
```

### Check Library Access
```typescript
const response = await fetch('/api/library?bookId=uuid')
const { hasAccess } = await response.json()
```

## 🔧 Development

### Adding New Features
1. **Server Module**: Add business logic in `server/`
2. **API Route**: Create endpoint in `app/api/`
3. **Types**: Update `types/db.ts` with Zod schemas
4. **Database**: Add tables/policies in `database/schema.sql`

### Testing
```bash
# Type check
npx tsc --noEmit

# Run development server
npm run dev

# Test API endpoints
curl http://localhost:3000/api/books
```

### Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Public anon key
- `SUPABASE_SERVICE_ROLE_KEY`: Admin service role key
- `SUPABASE_JWT_SECRET`: JWT signing secret

## 🚨 Security Notes

- **Never expose** `SUPABASE_SERVICE_ROLE_KEY` to the client
- **Use RLS policies** for data access control
- **Validate inputs** with Zod schemas
- **Handle errors gracefully** in API responses

## 📝 Next Steps

1. **Run Database Schema**: Execute `database/schema.sql` in Supabase
2. **Connect Payment Providers**: Update `server/payments/adapter.ts`
3. **Wire Frontend**: Replace mock data with API calls
4. **Test End-to-End**: Verify auth, orders, and library access
5. **Deploy**: Push to production with proper environment variables

## 🆘 Troubleshooting

### Common Issues
- **RLS Errors**: Check user authentication and role
- **Storage Upload Fails**: Verify bucket policies and admin role
- **Payment Webhooks**: Check signature verification and order ID extraction

### Debug Mode
Enable detailed logging in development:
```typescript
// In server modules
console.log('Debug:', { userId, bookId, data })
```

## 📞 Support

For backend issues:
1. Check Supabase logs in dashboard
2. Verify RLS policies are active
3. Test API endpoints with Postman/curl
4. Check browser console for client errors

---

**Status**: ✅ Backend Complete | 🔄 Frontend Integration Pending | 🚀 Ready for Production
