// Types for the chatbot reservation flow
export type ReservationStep = 'greeting' | 'date' | 'time' | 'guests' | 'seating' | 'confirmation';

export interface ReservationData {
  date: string | null;
  time: string | null;
  guests: number | null;
  seating: string | null;
}

export interface Message {
  id: string;
  sender: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

// Compressed menu data with categories
export const MENU_DATA = {
  vegetarian: {
    dishes: ['Vegetable Biryani', 'Paneer Tikka Masala', 'Dal Makhani', 'Chikhalwali'],
    priceRange: '$8-$15'
  },
  nonVegetarian: {
    dishes: ['Butter Chicken', 'Tandoori Chicken', 'Lamb Korma', 'Fish Curry'],
    priceRange: '$12-$20'
  },
  specialties: {
    dishes: ['Chef\'s Special Thali', 'Biryani Platter', 'Mixed Grill', 'Naan Bread Platter'],
    priceRange: '$15-$25'
  }
};

// Mock availability schedule - 2 weeks in advance
export const generateAvailability = () => {
  const availability: Record<string, string[]> = {};
  const today = new Date();

  for (let i = 0; i < 14; i++) {
    const date = new Date(today);
    date.setDate(date.getDate() + i);
    const dateStr = date.toISOString().split('T')[0];

    // Generate time slots
    const slots = [];
    for (let hour = 11; hour <= 22; hour++) {
      const time = `${String(hour).padStart(2, '0')}:00`;
      // Random availability (70% chance of slot being available)
      if (Math.random() > 0.3) {
        slots.push(time);
      }
    }
    availability[dateStr] = slots;
  }

  return availability;
};

// Check if a specific table slot is available
export const checkAvailability = (
  date: string,
  time: string,
  guests: number,
  availability: Record<string, string[]>
): boolean => {
  if (!availability[date]) return false;
  return availability[date].includes(time);
};

// Find nearest available time if requested slot is unavailable
export const findNearestAvailableTime = (
  date: string,
  time: string,
  availability: Record<string, string[]>
): string | null => {
  const availableSlots = availability[date] || [];
  if (availableSlots.length === 0) return null;

  const [hours, mins] = time.split(':').map(Number);
  const targetTime = hours * 60 + mins;

  // Find the closest time slot
  let closest = availableSlots[0];
  let minDiff = Math.abs(parseInt(closest) * 60 - targetTime);

  for (const slot of availableSlots) {
    const slotTime = parseInt(slot) * 60;
    const diff = Math.abs(slotTime - targetTime);
    if (diff < minDiff) {
      minDiff = diff;
      closest = slot;
    }
  }

  return closest;
};

// Chatbot response generator
export const generateBotResponse = (
  step: ReservationStep,
  userInput: string,
  reservationData: ReservationData,
  availability: Record<string, string[]>
): { response: string; nextStep: ReservationStep; updatedData: ReservationData } => {
  const updated = { ...reservationData };

  switch (step) {
    case 'greeting':
      return {
        response: 'Welcome to our restaurant! 🍽️ I\'d be delighted to help you reserve a table. When would you like to dine with us? (Please provide a date, e.g., 2025-02-15)',
        nextStep: 'date',
        updatedData: updated
      };

    case 'date':
      if (/^\d{4}-\d{2}-\d{2}$/.test(userInput)) {
        const selectedDate = userInput;
        if (availability[selectedDate]) {
          updated.date = selectedDate;
          return {
            response: `Great! I found availability on ${new Date(selectedDate).toLocaleDateString()}. What time would you prefer? Available times: ${availability[selectedDate].join(', ')}`,
            nextStep: 'time',
            updatedData: updated
          };
        } else {
          return {
            response: 'Unfortunately, that date is fully booked. Could you choose another date? (Format: YYYY-MM-DD)',
            nextStep: 'date',
            updatedData: updated
          };
        }
      }
      return {
        response: 'Please provide a date in YYYY-MM-DD format (e.g., 2025-02-15)',
        nextStep: 'date',
        updatedData: updated
      };

    case 'time':
      if (/^\d{2}:\d{2}$/.test(userInput)) {
        if (updated.date && checkAvailability(updated.date, userInput, 2, availability)) {
          updated.time = userInput;
          return {
            response: 'Perfect! How many guests will be dining with us?',
            nextStep: 'guests',
            updatedData: updated
          };
        } else if (updated.date) {
          const nearest = findNearestAvailableTime(updated.date, userInput, availability);
          if (nearest) {
            return {
              response: `That time slot is unavailable. We have availability at ${nearest}. Would that work for you?`,
              nextStep: 'time',
              updatedData: updated
            };
          }
        }
      }
      return {
        response: 'Please provide a time in HH:MM format (e.g., 19:30)',
        nextStep: 'time',
        updatedData: updated
      };

    case 'guests':
      const guestCount = parseInt(userInput);
      if (!isNaN(guestCount) && guestCount > 0 && guestCount <= 12) {
        updated.guests = guestCount;
        return {
          response: 'Would you have any seating preferences? (e.g., window, quiet corner, bar) Or just say "no preference"',
          nextStep: 'seating',
          updatedData: updated
        };
      }
      return {
        response: 'Please provide a valid number of guests (1-12)',
        nextStep: 'guests',
        updatedData: updated
      };

    case 'seating':
      if (userInput.toLowerCase() === 'no preference') {
        updated.seating = 'Standard';
      } else {
        updated.seating = userInput;
      }
      return {
        response: `Let me confirm your reservation:\n📅 Date: ${updated.date}\n🕐 Time: ${updated.time}\n👥 Guests: ${updated.guests}\n💺 Seating: ${updated.seating}\n\nShall I proceed with this booking?`,
        nextStep: 'confirmation',
        updatedData: updated
      };

    case 'confirmation':
      if (userInput.toLowerCase() === 'yes' || userInput.toLowerCase() === 'confirm') {
        return {
          response: '✅ Excellent! Your reservation is confirmed!\n\nBooking Reference: RES-' + Date.now().toString().slice(-6) + '\nWe look forward to welcoming you!',
          nextStep: 'greeting',
          updatedData: { date: null, time: null, guests: null, seating: null }
        };
      }
      return {
        response: 'No problem. Would you like to modify anything or start over?',
        nextStep: 'confirmation',
        updatedData: updated
      };

    default:
      return {
        response: 'How can I help you?',
        nextStep: 'greeting',
        updatedData: updated
      };
  }
};

// Detect if user is asking about menu
export const isMenuQuestion = (input: string): boolean => {
  const keywords = ['menu', 'dish', 'food', 'vegetarian', 'veg', 'non-veg', 'price', 'specialty', 'popular'];
  return keywords.some(keyword => input.toLowerCase().includes(keyword));
};

// Generate menu information response
export const getMenuInfo = (category?: string): string => {
  if (category?.toLowerCase().includes('veg')) {
    return `Our vegetarian dishes include: ${MENU_DATA.vegetarian.dishes.join(', ')}\nPrice range: ${MENU_DATA.vegetarian.priceRange}`;
  }
  if (category?.toLowerCase().includes('non-veg')) {
    return `Our non-vegetarian specialties: ${MENU_DATA.nonVegetarian.dishes.join(', ')}\nPrice range: ${MENU_DATA.nonVegetarian.priceRange}`;
  }
  if (category?.toLowerCase().includes('special')) {
    return `Our chef's specialties: ${MENU_DATA.specialties.dishes.join(', ')}\nPrice range: ${MENU_DATA.specialties.priceRange}`;
  }
  return `We offer vegetarian (${MENU_DATA.vegetarian.priceRange}), non-vegetarian (${MENU_DATA.nonVegetarian.priceRange}), and specialty dishes (${MENU_DATA.specialties.priceRange}).`;
};
