# Frontend - Image Labeling System

Next.js 16 application for AI-assisted image labeling with role-based access control.

## Tech Stack

- **Next.js** 16.0.0 - React framework with App Router
- **React** 19.2.0 - UI library
- **TypeScript** 5 - Type safety
- **Prisma** 6.18.0 - Database ORM (PostgreSQL)
- **Better Auth** 1.3.29 - Authentication system
- **AWS SDK** - S3 image storage
- **Tailwind CSS** 4 - Styling
- **Shadcn UI** - Accessible component primitives
- **Zustand** 5.0.8 - State management
- **Zod** 4.1.12 - Schema validation
- **Sonner** - Toast notifications

## Architecture

```
front/
├── src/
│   ├── app/
│   │   ├── (auth)/login/              # Authentication pages
│   │   ├── (home)/                    # User dashboard & annotation
│   │   │   ├── annotate/              # Image labeling interface
│   │   │   └── groups/                # User's assigned groups
│   │   ├── admin/                     # Admin dashboard & management
│   │   │   ├── dashboard/             # Stats & analytics
│   │   │   ├── groups/                # Group & user management
│   │   │   └── annotate/              # Admin review interface
│   │   └── api/
│   │       ├── auth/[...better-auth]/ # Auth endpoints
│   │       └── s3/                    # Image upload handler
│   ├── actions/                       # Server actions
│   │   ├── admin_actions.ts           # Admin user management
│   │   ├── admin_stats_actions.ts     # Analytics queries
│   │   ├── group_actions.ts           # Group CRUD
│   │   ├── image_actions.ts           # Image & tag operations
│   │   └── labeler_actions.ts         # User activity tracking
│   ├── lib/
│   │   ├── auth.ts                    # Better Auth server config
│   │   ├── auth-client.ts             # Better Auth client hooks
│   │   ├── prisma.ts                  # Database client
│   │   ├── s3-lib.ts                  # S3 singleton client
│   │   └── api-call.ts                # AI API utility
│   ├── store/
│   │   └── admin_store.ts             # Zustand global state
│   └── middleware.ts                  # Route protection
├── prisma/
│   └── schema.prisma                  # Database schema
└── next.config.ts                     # Next.js config
```

## Key Features

### 1. Authentication System (`auth.ts`, `auth-client.ts`)

- **Better Auth** with email/password
- PostgreSQL session storage via Prisma adapter
- Cookie-based sessions
- Client hooks: `signIn`, `signUp`, `signOut`, `useSession`

### 2. Route Protection (`middleware.ts`)

- Two-tier access: user routes (`/`) and admin routes (`/admin`)
- Cookie-based session validation
- Auto-redirect based on user role
- Protected routes: `/`, `/admin/*`, public: `/login`

### 3. Role-Based Access Control

**Users:**

- View assigned groups
- Annotate images with AI suggestions
- See their likelihood score

**Admins:**

- Manage groups and users
- Upload images to S3
- Review and approve tags
- View analytics dashboard

### 4. Server Actions Pattern

All data mutations use Next.js server actions:

- `group_actions.ts` - CRUD for groups, user assignments
- `image_actions.ts` - Image upload, tag management, AI inference calls
- `admin_stats_actions.ts` - Dashboard analytics

### 5. AWS S3 Integration (`s3-lib.ts`, `api/s3/route.ts`)

- Singleton S3 client pattern
- Direct upload from admin interface
- Automatic URL generation for Prisma storage
- Image deletion cleanup

### 6. AI Integration (`api-call.ts`, `image_actions.ts`)

Calls to Python AI API:

- `POST /users/infer-tags` - Get AI tag suggestions
- `POST /users/update-likelihood-score` - Score user accuracy
- `POST /admins/update-likelihood-score` - Generate embeddings
- `POST /admins/auto-users-assign` - Smart user assignment

### 7. State Management (`admin_store.ts`)

Zustand store for admin dashboard:

- Global stats (users, groups, images, scores)
- Current group data
- Loading states
- Auto-refresh on mutations

## Database Schema (Prisma)

Key models:

- `User` - Accounts with `admin` flag and `likelihoodScore`
- `Session` - Better Auth sessions
- `Group` - Image collections
- `GroupMember` - User-group assignments
- `Image` - S3 URLs with status (UNLABELED/LABELED/REVIEWED)
- `Tag` - Labels with source (USER/AI/ADMIN) and likelihood scores
- `imageContext` - AI-generated embeddings for scoring
- `LabelerUsage` - Tracks user activity per image

## Routes

### Public

- `/login` - Sign in/up with email/password

### User Routes (`/`)

- `/` - Dashboard with assigned groups
- `/annotate` - Image labeling interface with AI suggestions
- `/groups` - View group details

### Admin Routes (`/admin`)

- `/admin` - Admin landing page
- `/admin/dashboard` - Analytics & statistics
- `/admin/groups` - Manage groups, upload images, assign users
- `/admin/annotate` - Review user tags, approve/reject

## Running

### Local Development

```bash
# Environment variables
DATABASE_URL=postgresql://user:pass@localhost:5432/db
NEXT_PUBLIC_URL=http://localhost:3000
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket
AWS_ACCESS_KEY_ID=your-key
AWS_SECRET_ACCESS_KEY=your-secret
AI_API_URL=http://localhost:8080

# Install dependencies
npm install

# Generate Prisma client
npx prisma generate

# Run migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

### Production

```bash
npm run build
npm start
```

### Docker

```dockerfile
docker build -t frontend .
docker run -p 3000:3000 --env-file .env frontend
```

## Environment Variables

```bash
# Database
DATABASE_URL                # PostgreSQL connection string

# AWS S3
AWS_REGION                  # S3 region
AWS_BUCKET_NAME             # S3 bucket name
AWS_ACCESS_KEY_ID           # AWS credentials
AWS_SECRET_ACCESS_KEY       # AWS credentials

# External APIs
AI_API_URL                  # Python AI API endpoint
NEXT_PUBLIC_URL             # Frontend base URL (for CORS)

# Auth (optional)
BETTER_AUTH_SECRET          # Session encryption key
```

## Key Workflows

### User Annotation Flow

1. User logs in → Redirected to `/` (dashboard)
2. Selects group → View unlabeled images
3. Clicks annotate → AI suggests 3 tags
4. User confirms/modifies → Tags saved with source=USER
5. Likelihood score calculated against admin embeddings

### Admin Upload Flow

1. Admin uploads images → S3 via `api/s3/route.ts`
2. Image records created in Prisma
3. Optional: Auto-assign users via AI API
4. Users notified of new group assignments

### Admin Review Flow

1. Admin reviews user tags
2. Approves/adds tags with source=ADMIN
3. AI generates embedding from admin tags
4. Embedding used to score future user submissions

## Data Flow

**Client → Server Actions → Prisma → PostgreSQL**

```
User action → Server action → Prisma query → Database
            ↓
    Revalidate cache → Update UI
```

**Client → API Routes → S3**

```
Upload files → Next.js API → S3 SDK → AWS S3
              ↓
        Create Prisma record
```

**Client → AI API**

```
Request tags → apiCall() → Python FastAPI → OpenAI
              ↓
        Return suggestions
```

## Prisma Commands

```bash
# Generate client after schema changes
npx prisma generate

# Create migration
npx prisma migrate dev --name description

# Apply migrations (production)
npx prisma migrate deploy

```

## Authentication Flow

1. User signs up → Better Auth creates user + session
2. Session cookie set (`better-auth.session_token`)
3. Middleware validates cookie on protected routes
4. Server actions access session via Better Auth helpers
5. AI API calls include session token as Bearer token

## Performance Optimizations

- **Server Actions** - No client-side API layer overhead
- **Prisma Connection Pooling** - Efficient database connections
- **S3 Singleton** - Reuse AWS SDK client
- **Middleware Caching** - Session validation at edge
- **Zustand** - Minimal re-renders with selective subscriptions
- **Next.js Image** - Optimized S3 image loading
