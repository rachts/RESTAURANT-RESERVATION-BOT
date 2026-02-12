# API and Integration Reference

## Overview

This document describes the chatbot’s conversation logic, core data structures, and integration points for a restaurant table reservation system. The chatbot is designed to guide users through table booking, handle availability checks, respond to menu-related queries, and provide a foundation for future backend, payment, and notification integrations.

## Current Architecture

The chatbot currently runs entirely on the client side using mock data. No backend API calls are made in the present implementation. All conversation logic is rule-based and resides in `lib/chatbot-logic.ts`.

```
User Input → ChatContainer → generateBotResponse() → Update State → Render
```

**Current Limitations:**

* No persistent storage (state resets on refresh)
* No real-time availability synchronization
* No authentication or user identity tracking
* Not suitable for concurrent multi-user bookings

## Core Data Structures

### Message Type

```typescript
interface Message {
  id: string;              // Unique identifier (UUID or timestamp + random suffix)
  sender: 'user' | 'bot';  // Who sent the message
  content: string;         // Message text (plain text only)
  timestamp: Date;         // When message was sent
}
```

### ReservationData Type

```typescript
type SeatingType = 'Standard' | 'Window' | 'Quiet Corner';

interface ReservationData {
  date: string | null;           // YYYY-MM-DD
  time: string | null;           // HH:00
  guests: number | null;         // 1–12
  seating: SeatingType | null;   // Seating preference
  specialRequests: string | null; // Optional notes
}
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

### BotResponse Interface

```typescript
interface BotResponse {
  response: string;              // Bot reply
  nextStep: ReservationStep;     // Next conversation step
  updatedData: ReservationData;  // Updated reservation state
  error?: string;                // Optional validation/parsing error
}
```

## Core Functions

### generateBotResponse()

```typescript
export function generateBotResponse(
  step: ReservationStep,
  userInput: string,
  reservationData: ReservationData,
  availability: Record<string, string[]>
): BotResponse
```

**Purpose:** Main rule-based conversation engine.

**Behavior Notes:**

* Invalid or ambiguous input triggers clarification
* State remains unchanged on parsing failure
* Errors are communicated via optional `error` field

---

### generateAvailability()

Generates mock availability data for a configurable booking window.

```typescript
export function generateAvailability(): Record<string, string[]>
```

Customization example:

```typescript
// Extend booking window to 30 days
for (let i = 0; i < 30; i++) { }

// Operating hours: 09:00–23:00
for (let hour = 9; hour <= 23; hour++) { }
```

---

### checkAvailability()

```typescript
export function checkAvailability(
  date: string,
  time: string,
  guests: number,
  availability: Record<string, string[]>
): boolean
```

Returns `true` if the requested slot exists for the given date.

---

### findNearestAvailableTime()

```typescript
export function findNearestAvailableTime(
  date: string,
  time: string,
  availability: Record<string, string[]>
): string | null
```

Returns the closest available hourly slot (e.g., `18:00` or `20:00`).

---

### Menu Detection

```typescript
export function isMenuQuestion(input: string): boolean
```

**Note:** Menu intent detection should be disabled or deprioritized during active booking confirmation to avoid false positives.

---

### Menu Retrieval

```typescript
export function getMenuInfo(category: string): string
```

**Currency Note:** Prices are placeholders and assume USD. Currency localization should be handled at the UI or API layer.

## Menu Data Structure

```typescript
export const MENU_DATA = {
  vegetarian: {
    dishes: ['Vegetable Biryani', 'Paneer Tikka Masala', 'Dal Makhani', 'Chikhalwali'],
    priceRange: '$8–$15'
  },
  nonVegetarian: {
    dishes: ['Butter Chicken', 'Tandoori Chicken', 'Lamb Korma', 'Fish Curry'],
    priceRange: '$12–$20'
  },
  specialties: {
    dishes: ["Chef’s Special Thali", 'Biryani Platter', 'Mixed Grill', 'Naan Bread Platter'],
    priceRange: '$15–$25'
  }
};
```

## Future API Integration Points

### Availability API

Replace mock generation with server-side availability:

```typescript
async function getAvailability() {
  const response = await fetch('/api/availability', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ restaurantId: 'rest-123', days: 14 })
  });
  return response.json();
}
```

### Booking API

```typescript
async function createBooking(reservationData: ReservationData) {
  const response = await fetch('/api/bookings', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Idempotency-Key': crypto.randomUUID()
    },
    body: JSON.stringify(reservationData)
  });

  const booking = await response.json();
  return booking.reference;
}
```

### Email Confirmation API

```typescript
async function sendConfirmation(email: string, reservationData: ReservationData, bookingRef: string) {
  await fetch('/api/email/send-confirmation', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, reservationData, bookingRef })
  });
}
```

### Payment API

```typescript
async function processDeposit(bookingRef: string, amount: number) {
  const response = await fetch('/api/payments/process', {
    method: 'POST',
    body: JSON.stringify({ bookingRef, amount, currency: 'USD' })
  });
  return response.json();
}
```

Possible responses:

* `{ success: true, transactionId: string }`
* `{ success: false, error: string }`

## Error Handling

```typescript
function validateReservation(data: ReservationData) {
  const errors: string[] = [];
  if (!data.date) errors.push('Date required');
  if (!data.time) errors.push('Time required');
  if (!data.guests || data.guests < 1 || data.guests > 12) errors.push('Guests must be 1–12');
  if (!data.seating) errors.push('Seating required');
  return { valid: errors.length === 0, errors };
}
```

**Note:** Availability service failures should be handled at the conversation layer, not within the availability service itself.

## Performance Considerations

* Memoize availability data
* Debounce user input
* Avoid recomputing parsing logic

## Security Considerations

* Sanitize user input
* Enforce input length limits
* Implement rate limiting via Next.js middleware or API gateway

## Testing

**Recommended Coverage:**

* Conversation transitions
* Date/time parsing edge cases
* Availability conflicts
* Menu intent accuracy
* API failure scenarios

---

For production deployment, refer to `docs/DEPLOYMENT.md`
