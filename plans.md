# Paladium Tech Case - AI-Powered Image Labeling System

## Project Plan

---

## 🎯 Project Overview

Building a web-based image labeling platform with AI-powered tag suggestions. The system will support admin users who manage images and groups, and normal users who annotate images.

### Tech Stack

- **Frontend + API**: Next.js 14+ (App Router, TypeScript, React)
- **AI Service**: FastAPI (Python) for image analysis and tag suggestions
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: NextAuth.js (simple email/password)
- **Image Storage**: Local filesystem or S3-compatible storage
- **AI Integration**: OpenAI Vision API / HuggingFace (with fallback mock)
- **Containerization**: Docker + docker-compose

---

## 📋 Core Features

### 1. User Management & Authentication

- [ ] Two user roles: Admin and Labeler
- [ ] Simple authentication system (NextAuth.js)
- [ ] Session management
- [ ] Hardcoded initial admin for MVP

### 2. Admin Features

- [ ] **Image Management**
  - Upload images (single/batch)
  - Create and manage image groups
  - Assign groups to specific labelers
  - View all images and their labeling status
- [ ] **Quality Assurance Dashboard**

  - View labeling statistics per user
  - Compare labels across different users for same images
  - Identify labeling divergence
  - Override/correct user labelings
  - Approve or reject user annotations
  - Export QA reports

- [ ] **User Management**
  - Create/edit labeler accounts
  - Assign labelers to groups
  - View labeler performance metrics

### 3. Labeler Features

- [ ] **Image List View**
  - See only assigned group images
  - Filter by status (unlabeled, labeled, reviewed)
  - Progress indicator
- [ ] **Annotation Interface**
  - Full-size image display
  - Tag input with autocomplete
  - Add/edit/remove tags (chip-based UI)
  - "Suggest tags (AI)" button - **Required Feature**
  - Save annotations
  - Navigate between images (prev/next)
  - Mark image as complete

### 4. AI Integration

- [ ] FastAPI service for AI operations
- [ ] Image analysis endpoint
- [ ] Tag suggestion using OpenAI Vision API or HuggingFace
- [ ] Fallback mock responses when API unavailable
- [ ] Caching of AI suggestions to reduce API calls

---

## 🏗️ Architecture

### System Components

```
┌─────────────────────────────────────────────────────────┐
│                     Next.js App                         │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Frontend (React + TypeScript)                    │  │
│  │  - Admin Dashboard                                │  │
│  │  - Labeler Interface                              │  │
│  │  - Authentication UI                              │  │
│  └───────────────────────────────────────────────────┘  │
│  ┌───────────────────────────────────────────────────┐  │
│  │  Backend API Routes (/api/*)                      │  │
│  │  - /api/images (CRUD)                             │  │
│  │  - /api/groups (CRUD)                             │  │
│  │  - /api/tags (CRUD)                               │  │
│  │  - /api/users (management)                        │  │
│  │  - /api/qa (quality assurance)                    │  │
│  └───────────────────────────────────────────────────┘  │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              PostgreSQL Database (Prisma)               │
│  - Users, Groups, Images, Tags, Assignments             │
└─────────────────────────────────────────────────────────┘
                          ↕
┌─────────────────────────────────────────────────────────┐
│              FastAPI AI Service                         │
│  - POST /analyze-image (image → suggested tags)        │
│  - Uses OpenAI Vision API / HuggingFace                │
│  - Mock fallback for testing                           │
└─────────────────────────────────────────────────────────┘
```

### Database Schema (Prisma)

```
User
- id: string (uuid)
- email: string (unique)
- password: string (hashed)
- name: string
- role: enum (ADMIN, LABELER)
- createdAt: DateTime

Group
- id: string (uuid)
- name: string
- description: string?
- createdAt: DateTime
- assignedUsers: User[] (many-to-many)

Image
- id: string (uuid)
- filename: string
- originalName: string
- url: string
- groupId: string (foreign key)
- status: enum (UNLABELED, LABELED, REVIEWED, APPROVED)
- uploadedAt: DateTime
- uploadedBy: string (User.id)

Tag
- id: string (uuid)
- imageId: string (foreign key)
- value: string
- source: enum (USER, AI, ADMIN)
- createdBy: string (User.id)
- isApproved: boolean
- confidence: float? (for AI tags)
- createdAt: DateTime
- updatedAt: DateTime

LabelingSession
- id: string (uuid)
- imageId: string (foreign key)
- userId: string (foreign key)
- startedAt: DateTime
- completedAt: DateTime?
- duration: int (seconds)
```

---

## 🚀 Implementation Phases

### Phase 1: Project Setup & Foundation (Days 1-2)

- [ ] Initialize Next.js project with TypeScript
- [ ] Setup Prisma with PostgreSQL
- [ ] Configure NextAuth.js for authentication
- [ ] Setup FastAPI project structure
- [ ] Create Docker configuration files
- [ ] Setup ESLint, Prettier, and TypeScript strict mode
- [ ] Create basic project structure

**AI Assistant Usage:**

- Generate boilerplate code structures
- Setup configuration files
- Create Prisma schema from requirements

### Phase 2: Authentication & User Management (Day 2-3)

- [ ] Implement NextAuth.js with credentials provider
- [ ] Create login/register pages
- [ ] Setup middleware for route protection
- [ ] Create seed script with initial admin user
- [ ] Implement role-based access control

**AI Assistant Usage:**

- Generate authentication flows
- Create protected route middleware
- Generate seed data scripts

### Phase 3: Admin - Image & Group Management (Days 3-4)

- [ ] Build image upload functionality
- [ ] Create group CRUD operations
- [ ] Implement user-group assignment system
- [ ] Build admin dashboard UI
- [ ] Image storage implementation

**AI Assistant Usage:**

- Generate file upload handlers
- Create CRUD API endpoints
- Build responsive admin UI components

### Phase 4: Labeler Interface (Days 4-5)

- [ ] Build image list view for labelers
- [ ] Create annotation interface
- [ ] Implement tag input with chip UI
- [ ] Add/edit/remove tag functionality
- [ ] Image navigation (prev/next)
- [ ] Progress tracking

**AI Assistant Usage:**

- Generate annotation UI components
- Create interactive tag management
- Build smooth navigation system

### Phase 5: AI Integration (FastAPI Service) (Days 5-6)

- [ ] Setup FastAPI project with proper structure
- [ ] Create image analysis endpoint
- [ ] Integrate OpenAI Vision API
- [ ] Add HuggingFace fallback option
- [ ] Implement mock responses for testing
- [ ] Add request/response validation
- [ ] Setup CORS for Next.js communication
- [ ] Implement caching layer (Redis optional)

**AI Assistant Usage:**

- Generate FastAPI boilerplate
- Create API integration code
- Implement error handling and retries
- Generate test cases

### Phase 6: Quality Assurance Features (Days 6-7)

- [ ] Build QA dashboard for admins
- [ ] Implement label comparison view
- [ ] Create override functionality
- [ ] Add approval/rejection workflow
- [ ] Build labeling statistics
- [ ] Divergence detection algorithm

**AI Assistant Usage:**

- Create complex comparison algorithms
- Generate statistics calculation code
- Build QA UI components

### Phase 7: Polish & Stretch Goals (Days 7-8)

- [ ] Add bulk export (JSON download)
- [ ] Implement filtering and search
- [ ] Add loading states and error handling
- [ ] Mobile responsive design
- [ ] Performance optimization
- [ ] Add unit tests (Jest, React Testing Library)
- [ ] API tests for FastAPI

**AI Assistant Usage:**

- Generate test cases
- Optimize performance bottlenecks
- Create responsive CSS

### Phase 8: Containerization & Deployment (Day 8)

- [ ] Create Dockerfiles for Next.js
- [ ] Create Dockerfile for FastAPI
- [ ] Setup docker-compose.yml
- [ ] Configure environment variables
- [ ] Add health checks
- [ ] Document deployment process

**AI Assistant Usage:**

- Generate Docker configurations
- Create docker-compose orchestration
- Setup production environment configs

### Phase 9: Documentation & Demo (Day 9)

- [ ] Write comprehensive README
- [ ] Document API endpoints
- [ ] Add setup instructions
- [ ] Document AI usage in development
- [ ] Create screen recording demo
- [ ] Prepare code walkthrough

**AI Assistant Usage:**

- Generate documentation
- Create API documentation
- Write clear setup instructions

---

## 📁 Project Structure

```
paladium-case/
├── front/                          # Next.js Application
│   ├── src/
│   │   ├── app/
│   │   │   ├── (auth)/
│   │   │   │   ├── login/
│   │   │   │   └── register/
│   │   │   ├── admin/
│   │   │   │   ├── dashboard/
│   │   │   │   ├── images/
│   │   │   │   ├── groups/
│   │   │   │   ├── users/
│   │   │   │   └── qa/
│   │   │   ├── labeler/
│   │   │   │   ├── images/
│   │   │   │   └── annotate/[id]/
│   │   │   ├── api/
│   │   │   │   ├── auth/
│   │   │   │   ├── images/
│   │   │   │   ├── groups/
│   │   │   │   ├── tags/
│   │   │   │   ├── users/
│   │   │   │   └── qa/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/
│   │   │   ├── ui/              # Shadcn components
│   │   │   ├── admin/
│   │   │   ├── labeler/
│   │   │   └── shared/
│   │   ├── lib/
│   │   │   ├── prisma.ts
│   │   │   ├── auth.ts
│   │   │   └── utils.ts
│   │   └── types/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.ts
│   ├── public/
│   │   └── uploads/
│   ├── Dockerfile
│   ├── package.json
│   └── tsconfig.json
│
├── ai-api/                         # FastAPI Service
│   ├── src/
│   │   ├── main.py              # FastAPI app
│   │   ├── routes/
│   │   │   └── analyze.py
│   │   ├── services/
│   │   │   ├── openai_service.py
│   │   │   ├── huggingface_service.py
│   │   │   └── mock_service.py
│   │   ├── models/
│   │   │   └── schemas.py
│   │   └── config.py
│   ├── tests/
│   ├── requirements.txt
│   └── Dockerfile
│
├── docker-compose.yml
├── .env.example
├── .gitignore
├── README.md
└── plans.md                       # This file
```

---

## 🔧 Key Technical Decisions

### 1. Why Next.js for Both Frontend & Backend?

- **Unified TypeScript**: Same language/types across frontend and backend
- **API Routes**: Built-in API with serverless functions
- **File-based Routing**: Intuitive structure
- **Server Components**: Better performance
- **Easy Deployment**: Vercel-ready

### 2. Why FastAPI for AI Service?

- **Python Ecosystem**: Best for AI/ML libraries
- **Fast & Async**: High performance for I/O operations
- **OpenAPI Docs**: Auto-generated API documentation
- **Type Safety**: Pydantic models
- **Easy Integration**: Works well with AI APIs

### 3. Why PostgreSQL + Prisma?

- **Relational Data**: Complex relationships between users, groups, images, tags
- **Type Safety**: Prisma generates TypeScript types
- **Migrations**: Easy schema evolution
- **Performance**: Efficient queries with relations

### 4. Authentication Strategy

- **NextAuth.js**: Industry standard for Next.js
- **Simple Start**: Credentials provider (can extend to OAuth)
- **JWT Sessions**: Stateless, scalable

---

## 🤖 AI Assistant Integration Plan

### Development Process with AI

1. **Planning**: Use AI to brainstorm architecture and edge cases
2. **Boilerplate**: Generate initial project structures
3. **Components**: Create UI components with AI suggestions
4. **APIs**: Generate API endpoints with proper error handling
5. **Testing**: AI-generated test cases
6. **Documentation**: AI-assisted README and comments
7. **Debugging**: Use AI to identify and fix issues
8. **Optimization**: AI suggestions for performance improvements

### Specific AI Use Cases

- Generate Prisma schema from requirements
- Create API route handlers with proper types
- Build React components with TypeScript
- Generate Docker configurations
- Write unit tests
- Create seed data
- Generate documentation

### Documentation of AI Usage

- Comment in code where AI significantly helped
- Document prompts that worked well
- Note any AI-generated code that needed modification
- Track time saved vs manual coding

---

## 🎨 UI/UX Considerations

### Design System

- Use **shadcn/ui** for consistent, accessible components
- **Tailwind CSS** for styling
- **Lucide Icons** for iconography
- Dark mode support

### Key User Flows

**Admin Flow:**

1. Login → Admin Dashboard
2. Upload images → Create/select group → Assign labelers
3. Monitor progress on QA dashboard
4. Review conflicting labels
5. Approve or override annotations
6. Export results

**Labeler Flow:**

1. Login → See assigned images
2. Click image → Annotation view
3. Add manual tags OR click "Suggest tags (AI)"
4. Review AI suggestions, edit as needed
5. Save and move to next image
6. Track progress

---

## ✅ Acceptance Criteria

### Must Have (Required)

- [x] Admin can upload images and create groups
- [x] Admin can assign groups to labelers
- [x] Labelers can only see their assigned images
- [x] Labelers can add/edit/remove tags
- [x] **"Suggest tags (AI)" button works** (call real API or mock)
- [x] Tags are persisted in database
- [x] Admin QA dashboard to review and override labels
- [x] Basic authentication (admin vs labeler roles)
- [x] Comprehensive README with setup instructions
- [x] Documentation of AI usage in development
- [x] Screen recording demo

### Should Have (Important)

- [x] Docker containerization
- [x] Type safety throughout (TypeScript + Prisma)
- [x] Responsive design
- [x] Error handling and loading states
- [x] Image pagination/navigation
- [x] Progress tracking

### Nice to Have (Stretch)

- [ ] Unit tests (Jest)
- [ ] Bulk export (JSON)
- [ ] Advanced filtering
- [ ] Image preview thumbnails
- [ ] Tag autocomplete from existing tags
- [ ] Keyboard shortcuts for faster labeling
- [ ] Analytics dashboard
- [ ] Multi-language support

---

## 🧪 Testing Strategy

### Unit Tests

- React component tests (React Testing Library)
- API route tests
- Utility function tests

### Integration Tests

- FastAPI endpoint tests (pytest)
- Database operations (Prisma)
- Authentication flows

### Manual Testing

- Cross-browser testing
- Mobile responsiveness
- Full user flows (admin & labeler)

---

## 🚀 Deployment Plan

### Local Development

```bash
# Start PostgreSQL
docker-compose up postgres

# Start FastAPI service
cd ai-api && uvicorn src.main:app --reload

# Start Next.js
cd front && npm run dev
```

### Production Deployment

```bash
# Build and run all services
docker-compose up -d

# Or deploy separately:
# - Next.js → Vercel
# - FastAPI → Railway/Render
# - PostgreSQL → Supabase/Neon
```

---

## 📊 Success Metrics

- **Functionality**: All core features working end-to-end
- **Code Quality**: Clean, typed, well-structured code
- **AI Integration**: Demonstrable use of AI in development + AI feature working
- **Documentation**: Clear README with AI usage notes
- **UX**: Smooth, intuitive interface
- **Completeness**: README, demo video, deployable code

---

## 🎥 Demo Video Outline

1. **Introduction** (30 sec)

   - Project overview
   - Tech stack

2. **Admin Features** (2 min)

   - Login as admin
   - Upload images
   - Create groups
   - Assign labelers
   - Show QA dashboard

3. **Labeler Features** (2 min)

   - Login as labeler
   - View assigned images
   - Annotate image manually
   - **Use "Suggest tags (AI)" button**
   - Save and navigate

4. **AI Development Process** (1 min)

   - Show AI assistant usage
   - Code examples generated by AI
   - Time saved

5. **Technical Highlights** (1 min)
   - Show code structure
   - Docker setup
   - API integration

---

## 📝 README Outline

1. Project Overview
2. Features
3. Tech Stack
4. Architecture Diagram
5. Setup Instructions
   - Prerequisites
   - Environment Variables
   - Docker Setup
   - Manual Setup
6. Usage Guide
   - Admin Guide
   - Labeler Guide
7. AI Integration
   - **How AI was used in development**
   - AI feature implementation
   - API choices
8. API Documentation
9. Testing
10. Deployment
11. Future Improvements
12. License

---

## ⚠️ Potential Challenges & Solutions

| Challenge                    | Solution                                                |
| ---------------------------- | ------------------------------------------------------- |
| Large image uploads          | Implement chunked uploads, image compression            |
| AI API rate limits           | Cache suggestions, implement retry logic, mock fallback |
| Concurrent labeling          | Optimistic locking, conflict resolution UI              |
| Performance with many images | Pagination, lazy loading, CDN for images                |
| User assignment complexity   | Simple many-to-many relationship with Prisma            |
| QA workflow complexity       | Start simple: show all labels, allow override           |

---

## 🎯 Timeline Summary

- **Days 1-2**: Setup & Foundation
- **Days 3-4**: Core Admin Features
- **Days 4-5**: Labeler Interface
- **Days 5-6**: AI Integration
- **Days 6-7**: QA Features
- **Days 7-8**: Polish & Testing
- **Day 8**: Containerization
- **Day 9**: Documentation & Demo

**Total**: ~9 days for full implementation

---

## 📚 Resources & References

### Documentation

- [Next.js App Router](https://nextjs.org/docs)
- [Prisma](https://www.prisma.io/docs)
- [NextAuth.js](https://next-auth.js.org/)
- [FastAPI](https://fastapi.tiangolo.com/)
- [OpenAI Vision API](https://platform.openai.com/docs/guides/vision)
- [shadcn/ui](https://ui.shadcn.com/)

### AI APIs

- **OpenAI Vision**: Best quality, requires API key
- **HuggingFace**: Free inference API, various models
- **Replicate**: Easy to use, pay-per-request
- **Mock**: Fallback for testing without API keys

---

## 🎓 Learning Objectives

By completing this project, you'll demonstrate:

- ✅ Fullstack TypeScript development
- ✅ Modern React patterns (Server Components, App Router)
- ✅ API design and implementation
- ✅ Database modeling and relationships
- ✅ Authentication and authorization
- ✅ AI/ML API integration
- ✅ Docker containerization
- ✅ Effective use of AI coding assistants
- ✅ Product thinking (UX, QA workflows)
- ✅ Technical documentation

---

**Next Steps**: Start with Phase 1 - Project Setup!
