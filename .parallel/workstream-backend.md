# Workstream: Backend - Serverless Functions & Data Layer

**Status**: Can start after Shared | **Priority**: High
**Dependencies**: Shared (all types defined)

## Goal
Implement all Netlify serverless functions for CRUD operations and AI integration.

## Deliverables

### 1. Netlify Setup
- `netlify.toml` configuration
- Functions directory: `netlify/functions/`
- Environment variables setup

### 2. Data Layer (`netlify/functions/lib/dataStore.ts`)
Using Netlify Blob store for persistence:
```typescript
// CRUD operations wrapper
getById<T>(collection: string, id: string): Promise<T | null>
getAll<T>(collection: string): Promise<T[]>
query<T>(collection: string, filters: Filter): Promise<T[]>
create<T>(collection: string, data: T): Promise<T>
update<T>(collection: string, id: string, data: Partial<T>): Promise<T>
delete(collection: string, id: string): Promise<void>
```

### 3. API Functions

#### Auth Functions
```typescript
// POST /api/auth/login
handler(event: HandlerEvent): Promise<HandlerResponse>
// Verify credentials, return JWT

// GET /api/auth/me
handler(event: HandlerEvent): Promise<HandlerResponse>
// Verify JWT, return user info
```

#### Employee Functions
```typescript
// GET /api/employees - List all (admin only)
// GET /api/employees?department=X&jobType=Y&category=Z - Search
// POST /api/employees - Create (admin only)
// GET /api/employees/:id - Get one
// PUT /api/employees/:id - Update
// DELETE /api/employees/:id - Delete
```

#### Project Functions
```typescript
// GET /api/projects - List (admin: all, employee: assigned)
// POST /api/projects - Create (admin only)
// GET /api/projects/:id - Get one
// PUT /api/projects/:id - Update
// DELETE /api/projects/:id - Delete
// POST /api/projects/:id/assign - Assign employees
```

#### Task Functions
```typescript
// GET /api/tasks?employeeId=X - List for employee
// GET /api/tasks?projectId=X - List for project
// POST /api/tasks - Create
// PUT /api/tasks/:id - Update
// PUT /api/tasks/:id/complete - Mark complete
// DELETE /api/tasks/:id - Delete
```

#### Calendar Functions
```typescript
// GET /api/calendar?start=X&end=Y - Get events in range
// POST /api/calendar - Create event
// PUT /api/calendar/:id - Update event
// DELETE /api/calendar/:id - Delete event
```

### 4. AI Functions (`netlify/functions/ai/`)

#### Chat Function
```typescript
// POST /api/ai/chat
interface ChatRequest {
  messages: ChatMessage[];
  context?: {
    currentProject?: Project;
    employees?: Employee[];
  };
}

// Use OpenAI/Anthropic API
// Return assistant response
```

#### Recommendation Function
```typescript
// POST /api/ai/recommend
interface RecommendationRequest {
  projectId: string;
  requiredSkills?: string[];
  count?: number;
}

interface RecommendationResponse {
  recommendations: EmployeeRecommendation[];
}

// Fetch project details
// Fetch all available employees
// Send to AI with structured prompt
// Parse and return recommendations
```

### 5. CORS & Security (`netlify/functions/lib/cors.ts`)
```typescript
// CORS headers for all functions
// Security headers (X-Frame-Options, etc.)
```

### 6. Error Handling (`netlify/functions/lib/errors.ts`)
```typescript
class ApiError extends Error {
  statusCode: number;
  code: string;
}

// Error response formatter
formatError(error: Error): HandlerResponse
```

## Environment Variables Required
```
OPENAI_API_KEY=sk-...
JWT_SECRET=your-secret-key
NETLIFY_BLOB_TOKEN=...
```

## Acceptance Criteria
- [ ] All endpoints return proper HTTP status codes
- [ ] JSON responses follow consistent structure: `{ success: boolean, data?: T, error?: string }`
- [ ] CORS configured for Netlify domain
- [ ] AI functions handle API errors gracefully
- [ ] All functions validate input data
- [ ] Admin-only endpoints check role
- [ ] Employee endpoints filter by ownership/assignment

## Data Collections (Blob Store)
- `users` - User accounts
- `employees` - Employee profiles
- `projects` - Project data
- `tasks` - Task data
- `calendar_events` - Calendar events

## Notes
- Use context7 MCP for OpenAI API documentation
- Implement rate limiting on AI endpoints (consider Netlify edge functions)
- Store passwords hashed (work with Auth workstream)
