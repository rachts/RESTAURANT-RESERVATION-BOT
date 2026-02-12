# Architecture Documentation

## System Overview

The Restaurant Reservation Chatbot is implemented as a **client-side React application** using **Next.js**. The system follows a layered architecture and implements a **rule-based conversational engine** to guide users through restaurant table reservations while answering contextual menu queries.

The architecture is intentionally designed to be backend-agnostic in its current phase, allowing seamless future integration with APIs for availability, bookings, payments, and notifications.

```
┌─────────────────────────────────────────────────┐
│           User Interface Layer                  │
│  ┌──────────────────────────────────────────┐   │
│  │  ChatContainer (Main Orchestrator)       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────┐
│        Component Layer                          │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐   │
│  │ChatBubble│  │ChatInput │  │BookingSummary│   │
│  └──────────┘  └──────────┘  └──────────────┘   │
└─────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────┐
│        Logic Layer                              │
│  ┌──────────────────────────────────────────┐   │
│  │  Chatbot Logic (Rules & Responses)       │   │
│  │  - Conversation Flow Management          │   │
│  │  - Availability Checking                 │   │
│  │  - Menu Intent Detection                 │   │
│  │  - Response Generation                   │   │
│  └──────────────────────────────────────────┘   │ 
└─────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────┐
│        Data Layer                               │
│  ┌──────────────────────────────────────────┐   │
│  │  Mock Data                               │   │
│  │  - Menu Data                             │   │
│  │  - Availability Schedule                 │   │
│  │  - Reservation State                     │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
```

### Current Limitations

* No persistent storage (conversation resets on refresh)
* No real-time availability synchronization
* No authentication or user identity tracking
* Not safe for concurrent multi-user booking scenarios

---

## Component Architecture

### ChatContainer (Root Component)

**Location:** `components/ChatContainer.tsx`

**Responsibilities:**

* Maintains conversation state (messages, steps, reservation data)
* Orchestrates interaction between UI and logic layers
* Handles message dispatch and bot response resolution
* Controls booking summary rendering and reset behavior

**State Management:**

```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [currentStep, setCurrentStep] = useState<ReservationStep>('greeting');
const [reservationData, setReservationData] = useState<ReservationData>({
  date: null,
  time: null,
  guests: null,
  seating: null,
  specialRequests: null
});
const [showSummary, setShowSummary] = useState(false);
const [bookingRef, setBookingRef] = useState('');
```

**Key Methods:**

* `useEffect()` – Initializes the greeting message on mount
* `handleSendMessage()` – Validates input and triggers bot logic
* `handleReset()` – Resets the conversation state

---

### ChatBubble (Message Display)

**Location:** `components/ChatBubble.tsx`

**Props:**

```typescript
interface Props {
  message: Message;
}
```

**Styling Characteristics:**

* User messages: primary (orange-tinted) background
* Bot messages: neutral light-gray background
* Rounded corners and consistent spacing
* Responsive layout across screen sizes

---

### ChatInput (User Input)

**Location:** `components/ChatInput.tsx`

**Features:**

* Text input with placeholder hints
* Keyboard support (Enter to send)
* Disabled/loading states during bot processing
* Basic client-side input validation

**Props:**

```typescript
interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  isLoading: boolean;
}
```

---

### BookingSummary (Confirmation Card)

**Location:** `components/BookingSummary.tsx`

**Props:**

```typescript
interface Props {
  bookingRef: string;
  date: string;
  time: string;
  guests: number;
  seating: string;
}
```

**Features:**

* Clean, print-friendly card layout
* Displays booking reference and reservation details
* Intended as a terminal confirmation UI

---

## Conversation Flow

### Reservation State Machine

```
┌─────────┐
│greeting │
└────┬────┘
     ↓
┌─────────┐
│  date   │
└────┬────┘
     ↓
┌─────────┐
│  time   │
└────┬────┘
     ↓
┌─────────┐
│ guests  │
└────┬────┘
     ↓
┌─────────┐
│seating  │
└────┬────┘
     ↓
┌────────────────┐
│confirmation    │
└────┬───────────┘
     ↓
┌──────────┐
│completed │
└──────────┘
```

### ReservationStep Type

```typescript
type ReservationStep =
  | 'greeting'
  | 'date'
  | 'time'
  | 'guests'
  | 'seating'
  | 'specialRequests'
  | 'confirmation'
  | 'completed';
```

Each step validates user input before transitioning to the next state.

---

## Logic Layer

### generateBotResponse()

**Location:** `lib/chatbot-logic.ts`

**Purpose:** Central rule-based decision engine that drives the chatbot behavior.

**Processing Pipeline:**

1. Parse user input (date, time, guests, etc.)
2. Validate against constraints and availability
3. Generate contextual response text
4. Update reservation state
5. Resolve next conversation step

Invalid or ambiguous inputs result in clarification prompts without state mutation.

---

### Menu Intent Handling

Menu queries are supported at most stages of the conversation, except during final confirmation.

```typescript
export const isMenuQuestion = (input: string): boolean => {
  const keywords = ['menu', 'food', 'dishes', 'vegetarian', 'non-veg', 'price', 'cost', 'special'];
  return keywords.some(k => input.toLowerCase().includes(k));
};
```

**Note:** Menu intent should be deprioritized during confirmation to avoid accidental flow disruption.

---

### Availability System

* **generateAvailability():** Produces mock availability for a fixed booking window
* **checkAvailability():** Verifies requested slot existence
* **findNearestAvailableTime():** Suggests closest available hourly alternative

Availability data is represented as:

```typescript
Record<string, string[]> // { 'YYYY-MM-DD': ['18:00', '19:00'] }
```

---

## Data Models

### Message

```typescript
interface Message {
  id: string;              // UUID or timestamp-based identifier
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}
```

### ReservationData

```typescript
type SeatingType = 'Standard' | 'Window' | 'Quiet Corner';

interface ReservationData {
  date: string | null;
  time: string | null;
  guests: number | null;
  seating: SeatingType | null;
  specialRequests: string | null;
}
```

### BotResponse

```typescript
interface BotResponse {
  response: string;
  nextStep: ReservationStep;
  updatedData: ReservationData;
  error?: string;
}
```

---

## Styling Architecture

### Theme Tokens

Defined in `app/globals.css` using CSS variables:

```css
:root {
  --primary: 15 100% 52%;
  --background: 0 0% 98%;
  --foreground: 15 100% 20%;
  --card: 0 0% 100%;
  --muted: 0 0% 88%;
}
```

### Responsive Strategy

* Mobile-first design
* Tailwind CSS breakpoints
* Adaptive spacing and font scaling

---

## Rendering Pipeline

### Initial Load

1. Next.js serves `layout.tsx`
2. `ChatContainer` mounts
3. Greeting generated via `useEffect`
4. Initial message rendered

### Message Dispatch Flow

1. User submits message
2. Input validation
3. Bot logic executed
4. State updated
5. UI re-rendered
6. Auto-scroll to latest message

---

## Performance Considerations

* Minimal re-renders (state centralized in ChatContainer)
* Immutable state updates
* Memoization-ready availability data
* Auto-scroll via refs without layout thrashing

---

## Error Handling Strategy

* Input validation at each conversation step
* Graceful fallback for unavailable slots
* Defensive checks for undefined data
* Strong compile-time guarantees via TypeScript

---

## Future Integration Points

### Backend Services

* Availability API
* Booking persistence
* Email/SMS notifications
* Payment gateway integration (e.g., Stripe)

### Security (Production)

* Input sanitization (XSS prevention)
* CSRF protection
* Rate limiting via middleware or gateway
* Secure session and HTTPS enforcement

---

This architecture is designed to scale from a client-only prototype to a production-ready, API-driven conversational reservation system.
