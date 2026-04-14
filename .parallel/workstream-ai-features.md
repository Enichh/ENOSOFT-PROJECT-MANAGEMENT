# Workstream: AI-Features - AI Chat & Recommendation UI

**Status**: Can start after Frontend-Core, Backend | **Priority**: Medium
**Dependencies**: Frontend-Core, Backend (AI functions)

## Goal
Implement AI chat interface and recommendation components with smooth UX.

## Deliverables

### 1. AI Chat Interface

#### Chat Component (`src/components/ai/ChatInterface.tsx`)
```typescript
interface ChatInterfaceProps {
  context?: {
    currentProject?: Project;
    availableEmployees?: Employee[];
  };
  height?: string;
}

// Features:
// - Message list (user + assistant)
// - Typing indicator while AI responds
// - Auto-scroll to latest message
// - Timestamp per message
// - Markdown rendering for responses
```

#### Chat Message Components
```typescript
// UserMessage.tsx
interface UserMessageProps {
  content: string;
  timestamp: string;
}

// AssistantMessage.tsx
interface AssistantMessageProps {
  content: string;
  timestamp: string;
  isLoading?: boolean;
}

// SystemMessage.tsx (for context/disclaimers)
```

#### Chat Input (`src/components/ai/ChatInput.tsx`)
```typescript
interface ChatInputProps {
  onSend: (message: string) => void;
  isLoading: boolean;
  placeholder?: string;
}

// Features:
// - Text input with auto-resize
// - Send button (disabled when empty or loading)
// - Enter to send, Shift+Enter for new line
// - Character limit indicator (optional)
```

#### Chat Sidebar/Panel (`src/components/ai/ChatPanel.tsx`)
```typescript
// Collapsible panel for admin dashboard
// Can be opened from any admin page
// Maintains conversation history during session
```

### 2. Recommendation UI

#### Recommendation Button (`src/components/ai/RecommendButton.tsx`)
```typescript
interface RecommendButtonProps {
  projectId: string;
  requiredSkills?: string[];
  onRecommendations: (recommendations: EmployeeRecommendation[]) => void;
  variant?: 'button' | 'icon';
}

// States:
// - Default: "Get AI Recommendations"
// - Loading: Spinner + "Analyzing..."
// - Success: Checkmark (brief)
// - Error: Retry option
```

#### Recommendations Panel (`src/components/ai/RecommendationsPanel.tsx`)
```typescript
interface RecommendationsPanelProps {
  projectId: string;
  isOpen: boolean;
  onClose: () => void;
}

// Layout:
// - Header with project name
// - List of recommendations
// - "Accept All" button (optional)
// - Close button
```

#### Recommendation Card (`src/components/ai/RecommendationCard.tsx`)
```typescript
interface RecommendationCardProps {
  recommendation: EmployeeRecommendation;
  onAccept: () => void;
  onReject: () => void;
  isAccepted?: boolean;
}

// Visual:
// - Employee avatar + name
// - Confidence badge (high=green, medium=yellow, low=orange)
// - Reasoning text (expandable if long)
// - Skill match tags
// - Accept/Reject buttons
// - Accepted state (checkmark, disabled buttons)
```

### 3. AI Status & Feedback

#### AI Status Indicator (`src/components/ai/AiStatus.tsx`)
```typescript
// Small indicator showing AI service status
// - Green: Available
// - Yellow: Slow/Loading
// - Red: Error/Unavailable
```

#### Feedback Buttons (`src/components/ai/FeedbackButtons.tsx`)
```typescript
interface FeedbackButtonsProps {
  onThumbsUp: () => void;
  onThumbsDown: () => void;
  showLabels?: boolean;
}

// Simple thumbs up/down for recommendation quality
```

### 4. Prompt Suggestions

#### Suggestion Chips (`src/components/ai/SuggestionChips.tsx`)
```typescript
interface SuggestionChipsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
}

// Pre-written prompts for common queries:
// - "Who should I assign to this project?"
// - "What's the optimal team size?"
// - "When should this project deadline be?"
// - "Which employees have availability?"
```

### 5. Integration Points

#### Project Assignment Integration
```typescript
// Location: Assignment Panel
// - AI button appears next to manual assignment
// - Clicking opens Recommendations Panel
// - Accepting adds employee to assignment list
```

#### Admin Chat Integration
```typescript
// Location: Admin Layout (floating or sidebar)
// - Chat icon in header
// - Opens chat panel with context
// - Context includes: current project, employees, tasks
```

## State Management
```typescript
// chatStore.ts
interface ChatStore {
  messages: ChatMessage[];
  isLoading: boolean;
  context: ChatContext;
  sendMessage: (content: string) => Promise<void>;
  clearChat: () => void;
}

// recommendationsStore.ts
interface RecommendationsStore {
  currentRecommendations: EmployeeRecommendation[];
  isLoading: boolean;
  fetchRecommendations: (projectId: string) => Promise<void>;
  acceptRecommendation: (employeeId: string) => void;
}
```

## Acceptance Criteria
- [ ] Chat interface sends/receives messages
- [ ] AI responses formatted with markdown
- [ ] Typing indicator shown during API calls
- [ ] Recommendation button shows loading state
- [ ] Recommendations display with reasoning
- [ ] Accept/Reject functionality works
- [ ] Chat maintains history during session
- [ ] Error states handled gracefully

## API Dependencies
- POST /api/ai/chat
- POST /api/ai/recommend

## Environment Variables
```
VITE_AI_TIMEOUT=30000
```

## Notes
- Implement exponential backoff for retries
- Cache recommendations to prevent duplicate API calls
- Truncate long reasoning text with "Read more"
- Use context7 MCP for OpenAI integration patterns
- All components use camelCase naming
