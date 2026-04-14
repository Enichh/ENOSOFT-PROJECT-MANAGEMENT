# Workstream: Auth - Authentication System

**Status**: Can start after Shared | **Priority**: High
**Dependencies**: Shared (User types defined)

## Goal
Implement complete JWT-based authentication with role-based access control.

## Deliverables

### 1. Auth Utilities (`src/auth/utils.ts`)
```typescript
// Hash password using bcryptjs
hashPassword(password: string): Promise<string>

// Verify password
verifyPassword(password: string, hash: string): Promise<boolean>

// Generate JWT token
generateToken(payload: TokenPayload): string

// Verify JWT token
verifyToken(token: string): TokenPayload

// Parse token from request
getTokenFromHeader(header: string): string | null
```

### 2. Auth Context (`src/auth/AuthContext.tsx`)
```typescript
interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  hasPermission: (permission: string) => boolean;
}
```

### 3. Protected Route Component (`src/auth/ProtectedRoute.tsx`)
```typescript
interface ProtectedRouteProps {
  requiredRole?: 'admin' | 'employee';
  children: React.ReactNode;
}
```

### 4. Role-Based Hook (`src/auth/useRole.ts`)
```typescript
// Hook for checking user role
useRole(): { isAdmin: boolean; isEmployee: boolean; role: Role | null }

// Hook for permission checking
usePermission(permission: string): boolean
```

### 5. Login/Logout Logic (`src/auth/authService.ts`)
```typescript
// Call Netlify function for login
login(credentials: LoginRequest): Promise<LoginResponse>

// Clear local storage and context on logout
logout(): void

// Check if token is valid on app load
validateSession(): Promise<boolean>
```

### 6. Storage Utilities (`src/auth/storage.ts`)
```typescript
// Secure token storage (localStorage with validation)
setAuthToken(token: string): void
getAuthToken(): string | null
clearAuthToken(): void
```

## Acceptance Criteria
- [ ] JWT tokens properly signed and verified
- [ ] Passwords hashed with bcryptjs (salt rounds: 10)
- [ ] Protected routes redirect unauthenticated users to login
- [ ] Role checks prevent unauthorized access
- [ ] Auth state persists across page reloads
- [ ] Logout clears all auth data

## API Endpoints to Expect from Backend
- POST `/api/auth/login` - Returns JWT token + user info
- POST `/api/auth/logout` - Server-side cleanup (optional)
- GET `/api/auth/me` - Returns current user info

## Environment Variables
```
VITE_JWT_SECRET=your-jwt-secret-key
VITE_TOKEN_EXPIRY=24h
```

## Notes
- Store minimal data in localStorage (just token)
- User details fetched from `/api/auth/me` on load
- Handle token expiration gracefully
- Use guard clauses for all auth checks
