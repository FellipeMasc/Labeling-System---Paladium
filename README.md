# Paladium - AI-Powered Image Labeling System

A fullstack web application for collaborative image annotation with AI-powered tag suggestions, role-based access control, and quality assurance workflows.

## 🎯 Overview

This system enables teams to efficiently label and manage large image datasets. Administrators upload images and manage groups, while labelers annotate images with AI assistance. The platform tracks user performance using likelihood scoring based on semantic similarity.

## ✨ Features

### Admin Features

- Upload images to AWS S3 (single/batch)
- Create and manage image groups
- Assign users to groups (manual or AI-powered auto-assignment)
- Review and approve user annotations
- Dashboard with analytics and statistics
- Track labeler performance via likelihood scores

### Labeler Features

- View assigned image groups
- Annotate images with manual tags
- Get AI-powered tag suggestions (GPT-4 Vision)
- Real-time likelihood scoring feedback
- Track annotation progress

### AI Features

- GPT-4.1-mini Vision API for contextual tag suggestions
- Semantic embeddings (OpenAI text-embedding-3-small, 1536-dim)
- Cosine similarity scoring for user performance
- Intelligent user assignment based on workload and accuracy

## 🏗️ Tech Stack

### Frontend

- **Next.js 16** - React framework with App Router
- **TypeScript 5** - Type safety
- **Tailwind CSS 4** - Styling
- **Shadcn UI** - Accessible component primitives
- **Better Auth** - Authentication
- **Prisma 6** - Database ORM
- **Zustand** - State management
- **AWS SDK** - S3 integration

### Backend (AI API)

- **FastAPI** - Python web framework
- **OpenAI API** - GPT-4 Vision & embeddings
- **PostgreSQL** - Database with connection pooling
- **psycopg2** - PostgreSQL adapter
- **NumPy** - Cosine similarity calculations

### Infrastructure

- **PostgreSQL 15** - Relational database
- **AWS S3** - Image storage
- **Docker** - Containerization

## 🚀 Quick Start

### Prerequisites

- Docker & Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)
- AWS account with S3 bucket
- OpenAI API key

### 1. Clone Repository

```bash
git clone <repository-url>
cd Paladium-case
```

### 2. Environment Setup

Create `.env` files for each service:

**`front/.env`**

```bash
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/postgres
NEXT_PUBLIC_URL=http://localhost:3000
AWS_REGION=us-east-1
AWS_BUCKET_NAME=your-bucket-name
AWS_ACCESS_KEY_ID=your-access-key
AWS_SECRET_ACCESS_KEY=your-secret-key
AI_API_URL=http://ai-api:8080
BETTER_AUTH_SECRET=your-random-secret-key
```

**`ai-api/.env`**

```bash
DB_HOST=postgres
DB_PORT=5432
DB_NAME=postgres
DB_USER=postgres
DB_PASSWORD=postgres
DB_MAXCONN=20
DB_SCHEMA=public
OPENAI_API_KEY=sk-...
NEXT_PUBLIC_URL=http://localhost:3000
```

### 3. Start All Services

```bash
# Start all containers (PostgreSQL, Frontend, AI API)
docker-compose up -d

```

Services will be available at:

- **Frontend:** http://localhost:3000
- **AI API:** http://localhost:8080
- **PostgreSQL:** localhost:5432

### 4. Create First Admin User

1. Navigate to http://localhost:3000/login
2. Click "Sign Up"
3. Enter username, email, password
4. Check "I am an admin" checkbox
5. Create account
6. You'll be redirected to admin dashboard

## 📁 Project Structure

```
Paladium-case/
├── front/                    # Next.js frontend
│   ├── src/
│   │   ├── app/             # App Router pages
│   │   │   ├── (auth)/      # Authentication pages
│   │   │   ├── (home)/      # User dashboard & annotation
│   │   │   ├── admin/       # Admin pages
│   │   │   └── api/         # API routes (auth, S3)
│   │   ├── actions/         # Server actions (CRUD)
│   │   ├── lib/             # Utilities (auth, prisma, S3)
│   │   ├── store/           # Zustand state management
│   │   └── components/      # React components
│   ├── prisma/              # Database schema & migrations
│   ├── Dockerfile
│   └── README.md            # Frontend documentation
│
├── ai-api/                  # FastAPI AI service
│   ├── app/
│   │   ├── routers/         # API endpoints (users, admins)
│   │   ├── deps/            # Dependencies (auth, database, AI)
│   │   └── schemas/         # Pydantic models
│   ├── main.py              # FastAPI app entry
│   ├── Dockerfile
│   └── README.md            # AI API documentation
│
├── docker-compose.yml       # Service orchestration
├── plans.md                 # Original project plan
└── README.md                # This file
```

## 🗄️ Database Schema

Key models (see `front/prisma/schema.prisma`):

- **User** - Accounts with `admin` flag and `likelihoodScore`
- **Session** - Better Auth sessions
- **Group** - Image collections
- **GroupMember** - User-group assignments
- **Image** - S3 URLs with status (UNLABELED/LABELED/REVIEWED)
- **Tag** - Labels with source (USER/AI/ADMIN) and likelihood scores
- **imageContext** - AI-generated embeddings (1536-dim vectors)
- **LabelerUsage** - User activity tracking

## 🔑 Authentication

The system uses **Better Auth** with email/password:

- Cookie-based sessions stored in PostgreSQL
- Role-based access control (admin vs user)
- Middleware protects routes automatically
- Session tokens passed as Bearer tokens to AI API

## 🤖 AI Integration in Development

This project extensively leveraged AI assistance during development:

### 1. Code Generation & Autocomplete

- **Cursor AI** provided intelligent autocomplete for:
  - React components (annotation UI, admin dashboard, dialogs)
  - Server actions (CRUD operations, image handling)
  - TypeScript types and interfaces
  - API route handlers
  - Tailwind CSS styling

### 2. Database Schema Design

- AI assisted in designing the Prisma schema:
  - Normalized relationships (users, groups, images, tags)
  - Optimal indexes for performance
  - Enum types for status fields
  - Migration generation

### 3. Documentation

- Generated comprehensive READMEs for:
  - Frontend architecture and tech stack
  - AI API endpoints and data flows
  - Project overview (this file)
- Created the initial project plan (`plans.md`)

### 4. Problem Solving

- Debugged authentication issues:
  - Middleware intercepting server actions
  - Better Auth session configuration
  - Router navigation after signup
- Resolved CORS and API integration challenges
- Fixed TypeScript type errors

### 5. Code Refactoring

- Converted complex class components to functional components
- Optimized database queries with Prisma
- Improved error handling patterns
- Enhanced UI/UX with loading states

**Estimated Time Saved:** ~40% of development time through AI assistance

## 📖 User Guide

### For Labelers

1. **Login** at `/login`
2. **View Groups** - See assigned image groups on dashboard
3. **Annotate Images:**
   - Click on a group to see images
   - Click "Annotate" on an image
   - Add tags manually or click "Get AI Suggestions"
   - Confirm tags and navigate to next image
4. **Track Progress** - View your likelihood score on dashboard

### For Admins

1. **Login** at `/login` with admin account
2. **Manage Groups:**
   - Create groups with descriptions
   - Assign users manually or use auto-assignment
3. **Upload Images:**
   - Select group and upload images to S3
   - Enable auto-assignment for smart user distribution
4. **Review Annotations:**
   - View all user tags
   - Approve or override incorrect labels
   - Generate embeddings for quality scoring
5. **Analytics** - View dashboard with system statistics

## 🧪 API Endpoints

### AI API (Python FastAPI)

**User Endpoints:**

- `POST /users/infer-tags` - Get AI tag suggestions
- `POST /users/update-likelihood-score` - Calculate user accuracy

**Admin Endpoints:**

- `POST /admins/auto-users-assign` - Smart user assignment
- `POST /admins/update-likelihood-score` - Generate embeddings

**Docs:** http://localhost:8080/docs

### Frontend API Routes

**Auth:**

- `POST /api/auth/[...better-auth]` - Better Auth handlers
- `GET /api/auth/verify-admin` - Admin verification
- `GET /api/auth/verify-user` - User verification

**S3:**

- `POST /api/s3` - Upload images to S3

## 🎯 How It Works

### User Annotation Flow

```
User selects image → Clicks "Get AI Suggestions"
  ↓
Frontend calls AI API with image URL and group context
  ↓
GPT-4 Vision analyzes image → Returns 3 contextual tags
  ↓
User confirms/modifies tags → Saved with source=USER
  ↓
Backend calculates cosine similarity vs admin embedding
  ↓
User's likelihood score updated (weighted average)
```

### Admin Review Flow

```
Admin reviews user tags → Adds/approves with source=ADMIN
  ↓
AI generates description of image + combines with tags
  ↓
Creates 1536-dim embedding via OpenAI API
  ↓
Embedding stored in image_context table
  ↓
Used as ground truth for scoring future user submissions
```

### Smart User Assignment

```
Admin enables auto-assignment → AI API queries users
  ↓
Sorts by: (1) fewest annotations, (2) highest accuracy
  ↓
Assigns top N users to group for balanced workload
```

## 🐳 Docker Configuration

### Services

**PostgreSQL** (`postgres:15`)

- Port: 5432
- User: postgres
- Database: postgres

**Frontend** (`front/`)

- Port: 3000
- Depends on: PostgreSQL
- Volumes: Hot-reload enabled

**AI API** (`ai-api/`)

- Port: 8080
- Depends on: PostgreSQL
- Volumes: Hot-reload enabled

### Commands

```bash
# Build without cache
docker-compose build --no-cache

# Start specific service
docker-compose up -d postgres


```

## 🙏 Acknowledgments

- **Cursor AI** - Intelligent code completion and refactoring
- **OpenAI** - GPT-4 Vision and embeddings API
- **Better Auth** - Excellent authentication library
- **Shadcn UI** - Beautiful component primitives
- **Prisma** - Type-safe database toolkit

---

**Built with ❤️ and AI assistance**

For detailed documentation:

- [Frontend README](front/README.md)
- [AI API README](ai-api/README.md)
- [Project Plan](plans.md)
