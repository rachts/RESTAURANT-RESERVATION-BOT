import { Card } from '@/components/ui/card';
import { CheckCircle2, Calendar, Clock, Users, Armchair, Ticket } from 'lucide-react';

interface BookingSummaryProps {
  bookingRef: string;
  date: string;
  time: string;
  guests: number;
  seating: string;
}

export function BookingSummary({ bookingRef, date, time, guests, seating }: BookingSummaryProps) {
  const displayDate = new Date(date).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <Card className="w-full bg-gradient-to-br from-primary/5 to-accent/5 border-primary/20 p-6 md:p-8">
      <div className="flex items-center gap-3 mb-6">
        <CheckCircle2 className="w-8 h-8 text-primary flex-shrink-0" />
        <h2 className="text-2xl md:text-3xl font-bold text-primary">Booking Confirmed!</h2>
      </div>

      <div className="space-y-4">
        <div className="bg-card rounded-lg p-4 border border-border">
          <div className="flex items-center gap-3 mb-3">
            <Ticket className="w-5 h-5 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">Booking Reference</span>
          </div>
          <p className="text-2xl font-mono font-bold text-foreground tracking-wider">{bookingRef}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Date</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{displayDate}</p>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Time</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{time}</p>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Users className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Guests</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{guests} {guests === 1 ? 'person' : 'people'}</p>
          </div>

          <div className="bg-card rounded-lg p-4 border border-border">
            <div className="flex items-center gap-2 mb-2">
              <Armchair className="w-5 h-5 text-primary" />
              <span className="text-sm font-medium text-muted-foreground">Seating</span>
            </div>
            <p className="text-lg font-semibold text-foreground">{seating}</p>
          </div>
        </div>

        <div className="bg-primary/10 border border-primary/30 rounded-lg p-4 mt-6">
          <p className="text-sm text-foreground">
            We look forward to welcoming you! Please arrive 10-15 minutes before your reservation time. If you need to cancel or modify your booking, please contact us at least 24 hours in advance.
          </p>
        </div>
      </div>
    </Card>
  );
}
