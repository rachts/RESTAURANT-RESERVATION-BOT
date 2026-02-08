# Architecture Documentation

## System Overview

The Restaurant Reservation Chatbot is built using a client-side React application with Next.js as the framework. It implements a conversational AI pattern through a rule-based response engine.

```
┌─────────────────────────────────────────────────┐
│           User Interface Layer                   │
│  ┌──────────────────────────────────────────┐   │
│  │  ChatContainer (Main Orchestrator)       │   │
│  └──────────────────────────────────────────┘   │
└─────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────┐
│        Component Layer                           │
│  ┌──────────┐  ┌──────────┐  ┌──────────────┐  │
│  │ChatBubble│  │ChatInput │  │BookingSummary│  │
│  └──────────┘  └──────────┘  └──────────────┘  │
└─────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────┐
│        Logic Layer                              │
│  ┌──────────────────────────────────────────┐  │
│  │  Chatbot Logic (Rules & Responses)       │  │
│  │  - Conversation Flow Management          │  │
│  │  - Availability Checking                 │  │
│  │  - Menu Information                      │  │
│  │  - Response Generation                   │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
                        ↕
┌─────────────────────────────────────────────────┐
│        Data Layer                               │
│  ┌──────────────────────────────────────────┐  │
│  │  Mock Data                               │  │
│  │  - Menu Data                             │  │
│  │  - Availability Schedule                 │  │
│  │  - Reservation Data                      │  │
│  └──────────────────────────────────────────┘  │
└─────────────────────────────────────────────────┘
```

## Component Architecture

### ChatContainer (Root Component)
**Location:** `components/ChatContainer.tsx`

**Responsibilities:**
- Manages conversation state (messages, current step, reservation data)
- Orchestrates communication between child components
- Handles message sending and bot response generation
- Manages booking confirmation display
- Reset functionality

**State Management:**
```typescript
const [messages, setMessages] = useState<Message[]>([]);
const [currentStep, setCurrentStep] = useState<ReservationStep>('greeting');
const [reservationData, setReservationData] = useState<ReservationData>({
  date: null,
  time: null,
  guests: null,
  seating: null,
});
const [showSummary, setShowSummary] = useState(false);
const [bookingRef, setBookingRef] = useState('');
```

**Key Methods:**
- `useEffect` - Initializes bot greeting on mount
- `handleSendMessage()` - Processes user input
- `handleReset()` - Clears state for new conversation

### ChatBubble (Message Display)
**Location:** `components/ChatBubble.tsx`

**Props:**
```typescript
interface Props {
  message: Message;
}

interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}
```

**Styling:**
- User messages: Orange-tinted background (primary color)
- Bot messages: Light gray background
- Rounded corners with consistent padding
- Responsive sizing for mobile/desktop

### ChatInput (User Input)
**Location:** `components/ChatInput.tsx`

**Features:**
- Text input field with placeholder
- Send button with loading state
- Keyboard support (Enter to send)
- Input validation
- Loading indicator animation

**Props:**
```typescript
interface Props {
  onSend: (message: string) => void;
  disabled: boolean;
  isLoading: boolean;
}
```

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
- Professional card layout
- Booking reference display
- All reservation details formatted
- Print-friendly styling

## Conversation Flow

### Reservation Step Flow

```
┌─────────┐
│greeting │─── "Welcome! How can I help you today?"
└────┬────┘
     ↓
┌─────────┐
│  date   │─── "What date would you like to book?"
└────┬────┘    (Parses user input: "tomorrow", "Dec 25", etc.)
     ↓
┌─────────┐
│  time   │─── "What time would you prefer?"
└────┬────┘    (Suggests alternatives if unavailable)
     ↓
┌─────────┐
│ guests  │─── "How many guests?"
└────┬────┘
     ↓
┌─────────┐
│seating  │─── "Any seating preference?"
└────┬────┘
     ↓
┌──────────────┐
│confirmation  │─── "Booking confirmed! Reference: RES-XXXX"
└──────────────┘
```

### State Transitions

```typescript
type ReservationStep = 'greeting' | 'date' | 'time' | 'guests' | 'seating' | 'confirmation';
```

Each step validates user input and transitions to the next step:

```typescript
const response = generateBotResponse(
  currentStep,      // Current conversation step
  userInput,        // User's message
  reservationData,  // Accumulated booking data
  availability      // Available slots
);
```

## Logic Layer

### generateBotResponse Function

**Location:** `lib/chatbot-logic.ts`

**Purpose:** Central function handling all bot responses based on conversation step.

**Algorithm:**
1. Parse user input based on current step
2. Validate against availability/constraints
3. Generate contextual response
4. Update reservation data
5. Determine next conversation step

**Example Flow for Date Step:**
```typescript
// Input: "Can I book for tomorrow at 7pm?"
// Parse: Extract date and time (if provided)
// Validate: Check if date is within booking window
// Respond: Confirm date or suggest alternatives
// Next Step: 'time' (if time provided) or ask for time
```

### Menu Handling

The chatbot can answer menu questions at any point in the conversation.

**Menu Categories:**
```typescript
const MENU_DATA = {
  vegetarian: {
    dishes: ['Vegetable Biryani', 'Paneer Tikka Masala', ...],
    priceRange: '$8-$15'
  },
  nonVegetarian: {
    dishes: ['Butter Chicken', 'Tandoori Chicken', ...],
    priceRange: '$12-$20'
  },
  specialties: {
    dishes: ["Chef's Special Thali", 'Biryani Platter', ...],
    priceRange: '$15-$25'
  }
};
```

**Detection:**
```typescript
export const isMenuQuestion = (input: string): boolean => {
  const menuKeywords = ['menu', 'food', 'dishes', 'vegetarian', 
                        'non-veg', 'price', 'cost', 'specialty'];
  return menuKeywords.some(keyword => 
    input.toLowerCase().includes(keyword)
  );
};
```

### Availability System

**generateAvailability()**
- Creates 2-week booking window
- Generates random slots (70% availability)
- Returns dictionary: `{date: [times]}`

**checkAvailability()**
- Validates if specific slot is available
- Returns boolean

**findNearestAvailableTime()**
- When requested slot unavailable
- Calculates closest alternative time
- Returns nearest slot string

## Data Models

### Message Type
```typescript
interface Message {
  id: string;              // Unique message ID
  sender: 'user' | 'bot';  // Message source
  content: string;         // Message text
  timestamp: Date;         // When sent
}
```

### ReservationData Type
```typescript
interface ReservationData {
  date: string | null;     // YYYY-MM-DD format
  time: string | null;     // HH:00 format
  guests: number | null;   // Party size
  seating: string | null;  // Seating type
}
```

### BotResponse Type
```typescript
interface BotResponse {
  response: string;                // Bot's message
  nextStep: ReservationStep;       // Next conversation step
  updatedData: ReservationData;    // Updated booking data
}
```

## Styling Architecture

### Theme System

Colors defined as CSS variables in `app/globals.css`:

```css
:root {
  --primary: 15 100% 52%;        /* Orange/warm restaurant color */
  --background: 0 0% 98%;        /* Off-white background */
  --foreground: 15 100% 20%;     /* Dark brown text */
  --card: 0 0% 100%;             /* White cards */
  --muted: 0 0% 88%;             /* Light gray */
  /* ... more tokens */
}
```

### Responsive Design

**Breakpoints (Tailwind):**
- `sm`: 640px
- `md`: 768px
- `lg`: 1024px
- `xl`: 1280px
- `2xl`: 1536px

**Mobile-First Approach:**
```jsx
<div className="px-4 md:px-6 py-4 md:py-6">
  {/* Mobile default, larger padding on md+ */}
</div>
```

## Rendering Pipeline

### Page Load Sequence

```
1. Next.js serves layout.tsx
2. ChatContainer mounts
3. useEffect triggers
4. Greeting message generated
5. Initial message added to state
6. Component re-renders with message
7. User can start typing
```

### Message Send Flow

```
1. User types and presses Enter
2. ChatInput calls onSend callback
3. ChatContainer receives message
4. User message added to display
5. isLoading set to true
6. generateBotResponse called
7. Bot message generated
8. Response added to messages
9. Step/data updated
10. Auto-scroll to latest message
11. isLoading set to false
```

## Performance Optimizations

- **Minimal Re-renders:** Only ChatContainer re-renders on state changes
- **Message Virtualization Ready:** Can add scroll-area virtualization for long chats
- **Efficient Array Updates:** Uses spread operator for immutable updates
- **Auto-scroll:** Ref-based scrolling without layout recalculation
- **Lazy Loading:** Components imported only when needed

## Browser APIs Used

- **localStorage:** (Future) For chat history persistence
- **Date API:** For date manipulation and validation
- **Refs:** For auto-scroll functionality
- **Hooks:** useState, useEffect, useRef

## Error Handling

Current error handling:
- Input validation before processing
- Graceful fallbacks for unavailable dates
- Bounds checking on array access
- Type safety with TypeScript

## Future Integration Points

### Database Connection
```typescript
// Replace mock availability with:
const availability = await fetchAvailability(restaurantId);
const booking = await saveBooking(reservationData);
```

### API Integration
```typescript
// Add API routes:
POST /api/reservations    // Save booking
GET /api/availability     // Get real slots
POST /api/email           // Send confirmation
```

### Payment Integration
```typescript
// Stripe integration point:
const paymentIntent = await stripe.paymentIntents.create({...});
```

## Security Considerations

For production deployment, implement:
- Input sanitization (XSS prevention)
- CSRF protection
- Rate limiting on API endpoints
- SQL injection prevention (when using database)
- Secure session management
- HTTPS enforcement
