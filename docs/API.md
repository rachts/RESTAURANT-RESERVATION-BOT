# API and Integration Reference

## Overview

This document describes the current chatbot logic, data structures, and how to extend the application with additional integrations.

## Current Architecture

The chatbot currently runs entirely on the client-side with mock data. No backend API calls are made. All conversation logic is rule-based and runs in `lib/chatbot-logic.ts`.

```
User Input → ChatContainer → generateBotResponse() → Update State → Render
```

## Core Data Structures

### Message Type

```typescript
interface Message {
  id: string;              // Unique identifier (Unix timestamp)
  sender: 'user' | 'bot';  // Who sent the message
  content: string;         // Message text (supports plain text only)
  timestamp: Date;         // When message was sent
}
```

**Example:**
```typescript
const message: Message = {
  id: '1707032400000',
  sender: 'user',
  content: 'Can I book a table for 4 people tomorrow?',
  timestamp: new Date('2024-02-04T12:00:00')
};
```

### ReservationData Type

```typescript
interface ReservationData {
  date: string | null;     // Format: YYYY-MM-DD (e.g., "2024-02-15")
  time: string | null;     // Format: HH:00 (e.g., "19:00")
  guests: number | null;   // Party size (1-12)
  seating: string | null;  // Type: "Standard", "Window", "Quiet Corner"
}
```

**Example:**
```typescript
const reservation: ReservationData = {
  date: '2024-02-15',
  time: '19:00',
  guests: 4,
  seating: 'Window'
};
```

### ReservationStep Type

```typescript
type ReservationStep = 
  | 'greeting'      // Initial greeting
  | 'date'          // Ask for date
  | 'time'          // Ask for time
  | 'guests'        // Ask for party size
  | 'seating'       // Ask for seating preference
  | 'confirmation'; // Confirm booking
```

### BotResponse Interface

```typescript
interface BotResponse {
  response: string;              // Bot's message to user
  nextStep: ReservationStep;     // Next conversation step
  updatedData: ReservationData;  // Updated reservation data
}
```

## Core Functions

### generateBotResponse()

**Signature:**
```typescript
export function generateBotResponse(
  step: ReservationStep,
  userInput: string,
  reservationData: ReservationData,
  availability: Record<string, string[]>
): BotResponse
```

**Purpose:** Main response generation engine based on conversation step

**Parameters:**
- `step` - Current conversation stage
- `userInput` - User's message
- `reservationData` - Accumulated booking data
- `availability` - Available time slots by date

**Returns:** Object with response text, next step, and updated data

**Example Usage:**
```typescript
const response = generateBotResponse(
  'date',
  'I want to book for tomorrow',
  { date: null, time: null, guests: null, seating: null },
  availability
);

console.log(response.response);    // Bot's response text
console.log(response.nextStep);    // 'time'
console.log(response.updatedData); // { date: '2024-02-05', ... }
```

### generateAvailability()

**Signature:**
```typescript
export function generateAvailability(): Record<string, string[]>
```

**Purpose:** Generate mock availability data for 14 days

**Returns:** Object with dates as keys and available times as arrays

**Example Output:**
```typescript
{
  '2024-02-05': ['11:00', '12:00', '18:00', '19:00', '20:00'],
  '2024-02-06': ['11:00', '13:00', '17:00', '19:00', '20:00'],
  // ... 12 more days
}
```

**Customization:**
```typescript
// Change booking window from 14 days to 30 days
for (let i = 0; i < 30; i++) {  // was 14
  
// Change operating hours from 11am-10pm
for (let hour = 9; hour <= 23; hour++) {  // was 11 to 22
```

### checkAvailability()

**Signature:**
```typescript
export function checkAvailability(
  date: string,
  time: string,
  guests: number,
  availability: Record<string, string[]>
): boolean
```

**Purpose:** Check if specific time slot is available

**Parameters:**
- `date` - Desired date (YYYY-MM-DD)
- `time` - Desired time (HH:00)
- `guests` - Party size
- `availability` - Availability data

**Returns:** `true` if slot is available, `false` otherwise

**Example:**
```typescript
const isAvailable = checkAvailability(
  '2024-02-15',
  '19:00',
  4,
  availability
);

if (isAvailable) {
  console.log('Table available!');
} else {
  console.log('Sorry, that slot is booked.');
}
```

### findNearestAvailableTime()

**Signature:**
```typescript
export function findNearestAvailableTime(
  date: string,
  time: string,
  availability: Record<string, string[]>
): string | null
```

**Purpose:** Find closest available time if requested slot is unavailable

**Parameters:**
- `date` - Desired date
- `time` - Desired time (requested, may not exist)
- `availability` - Available slots

**Returns:** Closest available time string or null if no slots

**Example:**
```typescript
const nearest = findNearestAvailableTime(
  '2024-02-15',
  '19:00',  // Not available
  availability
);

console.log(nearest); // '18:45' or '19:30' (whichever is closer)
```

**Algorithm:**
1. Get all available slots for that date
2. Convert requested time to minutes
3. Calculate difference from each available slot
4. Return slot with smallest time difference

### isMenuQuestion()

**Signature:**
```typescript
export function isMenuQuestion(input: string): boolean
```

**Purpose:** Detect if user is asking about menu/food

**Keywords Detected:**
- menu, food, dishes, vegetarian, non-veg, vegan
- price, cost, specialty, special, recommendation

**Example:**
```typescript
isMenuQuestion('What are your vegetarian options?');  // true
isMenuQuestion('Can I book for Friday?');             // false
isMenuQuestion('How much is the Butter Chicken?');    // true
```

### getMenuInfo()

**Signature:**
```typescript
export function getMenuInfo(category: string): string
```

**Purpose:** Retrieve formatted menu information

**Categories:**
- 'vegetarian'
- 'nonVegetarian' or 'non-vegetarian'
- 'specialties' or 'specialty'

**Returns:** Formatted menu string with dishes and prices

**Example:**
```typescript
getMenuInfo('vegetarian');
// Returns:
// "🥗 Vegetarian Options ($8-$15):
// - Vegetable Biryani
// - Paneer Tikka Masala
// - Dal Makhani
// - Chikhalwali"
```

## Menu Data Structure

```typescript
const MENU_DATA = {
  vegetarian: {
    dishes: [
      'Vegetable Biryani',
      'Paneer Tikka Masala',
      'Dal Makhani',
      'Chikhalwali'
    ],
    priceRange: '$8-$15'
  },
  nonVegetarian: {
    dishes: [
      'Butter Chicken',
      'Tandoori Chicken',
      'Lamb Korma',
      'Fish Curry'
    ],
    priceRange: '$12-$20'
  },
  specialties: {
    dishes: [
      "Chef's Special Thali",
      'Biryani Platter',
      'Mixed Grill',
      'Naan Bread Platter'
    ],
    priceRange: '$15-$25'
  }
};
```

**Update Menu:**
```typescript
MENU_DATA.vegetarian.dishes.push('New Dish Name');
MENU_DATA.vegetarian.priceRange = '$10-$18';  // Updated price
```

## Future API Integration Points

### 1. Availability API

Replace mock data with real availability:

```typescript
// Replace generateAvailability() with:
async function getAvailability() {
  const response = await fetch('/api/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      restaurantId: 'rest-123',
      minGuests: 1,
      maxGuests: 12,
      days: 14
    })
  });
  
  return response.json();
  // Expected format: { '2024-02-05': ['11:00', '12:00', ...], ... }
}
```

### 2. Booking API

Create booking in database:

```typescript
async function createBooking(reservationData: ReservationData) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      date: reservationData.date,
      time: reservationData.time,
      guests: reservationData.guests,
      seating: reservationData.seating,
      customerId: getCurrentUser().id,  // After auth added
      timestamp: new Date().toISOString()
    })
  });
  
  const booking = await response.json();
  return booking.reference;  // 'RES-123456'
}
```

### 3. Email Confirmation API

Send booking confirmation:

```typescript
async function sendConfirmation(
  email: string,
  reservationData: ReservationData,
  bookingRef: string
) {
  await fetch('/api/email/send-confirmation', {
    method: 'POST',
    body: JSON.stringify({
      to: email,
      booking: {
        reference: bookingRef,
        date: reservationData.date,
        time: reservationData.time,
        guests: reservationData.guests
      }
    })
  });
}
```

### 4. Payment API

Process deposit:

```typescript
async function processDeposit(
  bookingRef: string,
  amount: number,
  paymentMethod: string  // 'stripe', 'paypal', etc.
) {
  const response = await fetch('/api/payments/process', {
    method: 'POST',
    body: JSON.stringify({
      bookingRef,
      amount,
      currency: 'USD',
      paymentMethod
    })
  });
  
  return response.json();  // { success: true, transactionId: '...' }
}
```

## Example Backend Routes (Future)

```typescript
// app/api/availability/route.ts
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Query database for availability
  // const slots = await db.getAvailableSlots(data);
  
  return NextResponse.json({
    '2024-02-05': ['11:00', '12:00', '19:00'],
    // ... more dates
  });
}

// app/api/bookings/route.ts
export async function POST(request: NextRequest) {
  const data = await request.json();
  
  // Validate booking
  if (!isValidBooking(data)) {
    return NextResponse.json({ error: 'Invalid booking' }, { status: 400 });
  }
  
  // Save to database
  // const booking = await db.bookings.create(data);
  
  return NextResponse.json({
    success: true,
    reference: 'RES-123456',
    confirmation: bookingData
  });
}
```

## Extending the Chatbot

### Add New Conversation Step

```typescript
// 1. Update type
type ReservationStep = 
  | 'greeting'
  | 'date'
  | 'time'
  | 'guests'
  | 'seating'
  | 'specialRequests'  // NEW
  | 'confirmation';

// 2. Add to generateBotResponse()
switch (step) {
  case 'specialRequests':
    if (userInput.toLowerCase().includes('no')) {
      return {
        response: "Perfect! Let me confirm your booking...",
        nextStep: 'confirmation',
        updatedData: { ...reservationData, special: null }
      };
    }
    return {
      response: "What special requests do you have?",
      nextStep: 'specialRequests',
      updatedData: { ...reservationData, special: userInput }
    };
}

// 3. Update ReservationData type
interface ReservationData {
  date: string | null;
  time: string | null;
  guests: number | null;
  seating: string | null;
  special: string | null;  // NEW
}

// 4. Update ChatContainer to handle new field
const [reservationData, setReservationData] = useState<ReservationData>({
  date: null,
  time: null,
  guests: null,
  seating: null,
  special: null  // NEW
});
```

### Add New Menu Category

```typescript
// In lib/chatbot-logic.ts
export const MENU_DATA = {
  vegetarian: { /* ... */ },
  nonVegetarian: { /* ... */ },
  specialties: { /* ... */ },
  beverages: {  // NEW
    dishes: [
      'Indian Chai',
      'Mango Lassi',
      'Kingfisher Beer',
      'Wine Selection'
    ],
    priceRange: '$2-$12'
  }
};
```

### Handle Custom Input Patterns

```typescript
// Detect date patterns
function parseDate(input: string): string | null {
  const today = new Date();
  
  if (input.includes('tomorrow')) {
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  }
  
  if (input.includes('today')) {
    return today.toISOString().split('T')[0];
  }
  
  // Parse explicit dates: "Dec 25", "12/25", "2024-12-25"
  // Implementation details...
  
  return null;
}

// Detect time patterns
function parseTime(input: string): string | null {
  const timeRegex = /(\d{1,2}):?(\d{2})?\s*(am|pm)?/i;
  const match = input.match(timeRegex);
  
  if (match) {
    let hours = parseInt(match[1]);
    const minutes = match[2] ? parseInt(match[2]) : 0;
    
    if (match[3]?.toLowerCase() === 'pm' && hours < 12) {
      hours += 12;
    }
    
    return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
  }
  
  return null;
}
```

## Error Handling

### User Input Validation

```typescript
function validateReservation(data: ReservationData): {
  valid: boolean;
  errors: string[];
} {
  const errors: string[] = [];
  
  if (!data.date) errors.push('Date is required');
  if (!data.time) errors.push('Time is required');
  if (!data.guests || data.guests < 1 || data.guests > 12) {
    errors.push('Guest count must be 1-12');
  }
  if (!data.seating) errors.push('Seating preference required');
  
  return {
    valid: errors.length === 0,
    errors
  };
}
```

### Graceful Degradation

```typescript
// If availability service is down, show message
try {
  const availability = await getAvailability();
  return availability;
} catch (error) {
  console.error('Availability service error:', error);
  return {
    response: 'Sorry, I can\'t check availability right now. Please call us at (555) 123-4567.',
    nextStep: 'greeting',
    updatedData: reservationData
  };
}
```

## Performance Considerations

### Memoization

```typescript
// Cache availability to avoid regenerating
const availabilityCache = useMemo(
  () => generateAvailability(),
  []  // Only generate once on mount
);
```

### Debouncing User Input

```typescript
// Debounce input before processing (future optimization)
const handleSendMessage = useCallback(
  debounce((message: string) => {
    // Process message
  }, 300),
  []
);
```

## Security Considerations

### Input Sanitization

```typescript
function sanitizeInput(input: string): string {
  return input
    .trim()
    .slice(0, 500)  // Limit length
    .replace(/<[^>]*>/g, '');  // Remove HTML tags
}
```

### Rate Limiting (Backend)

```typescript
// Future: Implement rate limiting on API endpoints
app.use(rateLimit({
  windowMs: 15 * 60 * 1000,  // 15 minutes
  max: 100,  // 100 requests per window
  message: 'Too many requests'
}));
```

## Testing API Functions

```typescript
// Example test
import { generateBotResponse, checkAvailability } from '@/lib/chatbot-logic';

test('should parse date correctly', () => {
  const availability = { '2024-02-15': ['19:00'] };
  const response = generateBotResponse(
    'date',
    'I want Feb 15',
    { date: null, time: null, guests: null, seating: null },
    availability
  );
  
  expect(response.updatedData.date).toBe('2024-02-15');
});

test('should check availability', () => {
  const availability = { '2024-02-15': ['19:00'] };
  const isAvailable = checkAvailability(
    '2024-02-15',
    '19:00',
    4,
    availability
  );
  
  expect(isAvailable).toBe(true);
});
```

---

**For production integrations, refer to the deployment documentation in `docs/DEPLOYMENT.md`**
