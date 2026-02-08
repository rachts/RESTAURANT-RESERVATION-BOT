'use client';

import { useEffect, useRef, useState } from 'react';
import { ChatBubble } from './ChatBubble';
import { ChatInput } from './ChatInput';
import { BookingSummary } from './BookingSummary';
import { Button } from '@/components/ui/button';
import {
  type Message,
  type ReservationStep,
  type ReservationData,
  generateBotResponse,
  generateAvailability,
  isMenuQuestion,
  getMenuInfo,
} from '@/lib/chatbot-logic';
import { RotateCcw } from 'lucide-react';

export function ChatContainer() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentStep, setCurrentStep] = useState<ReservationStep>('greeting');
  const [reservationData, setReservationData] = useState<ReservationData>({
    date: null,
    time: null,
    guests: null,
    seating: null,
  });
  const [showSummary, setShowSummary] = useState(false);
  const [bookingRef, setBookingRef] = useState('');
  const [availability] = useState(generateAvailability());
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Initial greeting
  useEffect(() => {
    const timer = setTimeout(() => {
      const greeting = generateBotResponse('greeting', '', reservationData, availability);
      setMessages([
        {
          id: '1',
          sender: 'bot',
          content: greeting.response,
          timestamp: new Date(),
        },
      ]);
      setCurrentStep(greeting.nextStep);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (userInput: string) => {
    // Add user message
    const userMessage: Message = {
      id: Date.now().toString(),
      sender: 'user',
      content: userInput,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    // Simulate bot thinking
    setTimeout(() => {
      // Check if user is asking about menu
      if (isMenuQuestion(userInput)) {
        const menuResponse = getMenuInfo(userInput);
        const botMessage: Message = {
          id: (Date.now() + 1).toString(),
          sender: 'bot',
          content: menuResponse + '\n\nWould you still like to proceed with a reservation?',
          timestamp: new Date(),
        };
        setMessages((prev) => [...prev, botMessage]);
        setIsLoading(false);
        return;
      }

      // Process reservation flow
      const response = generateBotResponse(currentStep, userInput, reservationData, availability);

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        sender: 'bot',
        content: response.response,
        timestamp: new Date(),
      };

      setMessages((prev) => [...prev, botMessage]);
      setCurrentStep(response.nextStep);
      setReservationData(response.updatedData);

      // Check if reservation is confirmed
      if (response.response.includes('Booking Reference:') && response.updatedData.date && response.updatedData.time) {
        const ref = 'RES-' + Date.now().toString().slice(-6);
        setBookingRef(ref);
        setShowSummary(true);
      }

      setIsLoading(false);
    }, 800);
  };

  const handleReset = () => {
    setMessages([]);
    setCurrentStep('greeting');
    setReservationData({
      date: null,
      time: null,
      guests: null,
      seating: null,
    });
    setShowSummary(false);
    setBookingRef('');

    const greeting = generateBotResponse('greeting', '', reservationData, availability);
    setMessages([
      {
        id: '1',
        sender: 'bot',
        content: greeting.response,
        timestamp: new Date(),
      },
    ]);
    setCurrentStep(greeting.nextStep);
  };

  return (
    <div className="flex flex-col h-screen bg-background">
      {/* Header */}
      <div className="bg-primary text-primary-foreground px-4 py-4 md:px-6 md:py-6 shadow-sm">
        <div className="max-w-3xl mx-auto flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold">Restaurant Reserve</h1>
            <p className="text-primary-foreground/80 text-sm md:text-base mt-1">Book your table in seconds</p>
          </div>
          <Button
            onClick={handleReset}
            variant="outline"
            size="sm"
            className="bg-primary-foreground text-primary hover:bg-primary-foreground/90"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            <span className="hidden sm:inline">New Chat</span>
          </Button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-6 md:px-6 space-y-4">
        <div className="max-w-3xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full text-center text-muted-foreground">
              <p>Loading conversation...</p>
            </div>
          ) : (
            <>
              {messages.map((message) => <ChatBubble key={message.id} message={message} />)}
              {showSummary && reservationData.date && reservationData.time && (
                <div className="mt-8 mb-8">
                  <BookingSummary
                    bookingRef={bookingRef}
                    date={reservationData.date}
                    time={reservationData.time}
                    guests={reservationData.guests || 1}
                    seating={reservationData.seating || 'Standard'}
                  />
                </div>
              )}
            </>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input */}
      <div className="border-t border-border bg-card">
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput onSend={handleSendMessage} disabled={isLoading} isLoading={isLoading} />
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-border bg-secondary/50 px-4 py-3 text-center text-xs text-muted-foreground">
        <p>Created by Rachit</p>
      </div>
    </div>
  );
}
