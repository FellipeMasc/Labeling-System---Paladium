# AI API - Image Labeling Intelligence

FastAPI microservice providing AI-powered image analysis and user performance scoring.

## Tech Stack

- **FastAPI** (0.120.0) + **Uvicorn** - Web framework and ASGI server
- **PostgreSQL** + **psycopg2-binary** - Database with connection pooling
- **OpenAI API** (2.6.1) - GPT-4.1-mini for vision, text-embedding-3-small for embeddings
- **NumPy** - Cosine similarity calculations
- **Pydantic** - Data validation

## Architecture

```
ai-api/
├── main.py                          # FastAPI app entry point
├── app/
│   ├── routers/
│   │   ├── users.py                # Tag inference, user scoring
│   │   └── admins.py               # Auto-assignment, embeddings
│   ├── deps/
│   │   ├── auth.py                 # Bearer token authentication
│   │   ├── database.py             # PostgreSQL connection pool
│   │   ├── inference_agent.py      # OpenAI client singleton
│   │   └── calculate_likelihood.py # Cosine similarity scoring
│   └── schemas/
│       ├── agent_schema.py         # AI models
│       └── api_dtos.py             # API DTOs
```

## Key Features

### 1. AI Tag Inference

- Analyzes images with GPT-4.1-mini vision API
- Returns 3 contextual tag suggestions based on group context

### 2. Likelihood Scoring

- Generates 1536-dim embeddings from admin-labeled images
- Scores user tags via cosine similarity against embeddings
- Updates user performance score (weighted: 70% old, 30% new)

### 3. Auto User Assignment

- Assigns users to groups based on workload and performance
- Prioritizes users with fewer tags and higher accuracy scores

### 4. Authentication

- Two-tier: regular users and admins
- Bearer token validation against PostgreSQL session table

## API Endpoints

### Users (`/users`)

- `POST /infer-tags` - Get AI tag suggestions for image
- `POST /update-likelihood-score` - Score user tag accuracy

### Admins (`/admins`)

- `POST /auto-users-assign` - Intelligently assign users to groups
- `POST /update-likelihood-score` - Generate embeddings for admin-labeled images

## Running

### Local

```bash
# Set environment variables
export DB_HOST=localhost DB_PORT=5432 DB_NAME=paladium
export DB_USER=postgres DB_PASSWORD=pass
export OPENAI_API_KEY=sk-...

# Install and run
pip install -r requirements.txt
uvicorn main:app --host 0.0.0.0 --port 8080
```

### Docker

```bash
docker build -t ai-api .
docker run -p 8080:8080 --env-file .env ai-api
```

## Environment Variables

```bash
DB_HOST, DB_PORT, DB_NAME, DB_USER, DB_PASSWORD
DB_MAXCONN=20          # Connection pool size
DB_SCHEMA=public
OPENAI_API_KEY         # Required
NEXT_PUBLIC_URL        # CORS origin
```

## Authentication

All endpoints require Bearer token:

```http
Authorization: Bearer <session_token>
```

## Database Tables

- `user` - Accounts with `admin` flag and `likelihoodScore`
- `session` - Active sessions with tokens
- `group`, `image`, `tag` - Core labeling entities
- `image_context` - Embedding vectors (float[])
- `group_member` - User-group assignments

## How It Works

**Tag Inference:** Image URL → OpenAI Vision API → 3 suggested tags

**Scoring:** User tag → Generate embedding → Compare to admin embedding → Cosine similarity → Update user score

**Auto-Assignment:** Query users by (lowest tag count, highest score) → Assign to group
