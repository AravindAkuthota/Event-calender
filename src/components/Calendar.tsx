import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EventForm } from './EventForm';
import { useCalendar } from '@/hooks/useCalendar';
import { Event } from '@/types/calendar';

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function formatDateForInput(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function Calendar() {
  const { state, days, addEvent, updateEvent, deleteEvent, navigateMonth, selectDate } = useCalendar();
  const [isEventFormOpen, setIsEventFormOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);

  const handleDayClick = (date: Date) => {
    selectDate(date);
    const startDate = new Date(date);
    startDate.setHours(9, 0, 0, 0);
    const endDate = new Date(date);
    endDate.setHours(10, 0, 0, 0);
    
    setSelectedEvent({
      id: '',
      title: '',
      startTime: formatDateForInput(startDate),
      endTime: formatDateForInput(endDate),
      description: '',
      color: 'personal'
    });
    setIsEventFormOpen(true);
  };

  const handleEventSubmit = (eventData: Omit<Event, 'id'>) => {
    if (selectedEvent?.id) {
      updateEvent({ ...eventData, id: selectedEvent.id });
    } else {
      addEvent(eventData);
    }
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };

  const handleEventClick = (event: Event, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedEvent(event);
    setIsEventFormOpen(true);
  };

  const handleEventDelete = (eventId: string) => {
    deleteEvent(eventId);
    setIsEventFormOpen(false);
    setSelectedEvent(null);
  };

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold">
          {state.currentMonth.toLocaleString('default', { month: 'long', year: 'numeric' })}
        </h2>
        <div className="flex items-center space-x-2">
          <Button variant="outline" size="icon" onClick={() => navigateMonth('prev')}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <Button variant="outline" size="icon" onClick={() => navigateMonth('next')}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-px bg-muted rounded-lg overflow-hidden">
        {WEEKDAYS.map(day => (
          <div key={day} className="bg-background p-2 text-center font-medium">
            {day}
          </div>
        ))}
        
        {days.map((day, index) => (
          <div
            key={index}
            onClick={() => handleDayClick(day.date)}
            className={cn(
              'bg-background p-2 min-h-[100px] cursor-pointer transition-colors',
              !day.isCurrentMonth && 'text-muted-foreground',
              day.isToday && 'ring-2 ring-primary',
              'hover:bg-muted'
            )}
          >
            <div className="font-medium mb-1">{day.date.getDate()}</div>
            <div className="space-y-1">
              {day.events.map(event => (
                <div
                  key={event.id}
                  onClick={e => handleEventClick(event, e)}
                  className={cn(
                    'text-xs p-1 rounded truncate',
                    event.color === 'work' && 'bg-blue-100 text-blue-800',
                    event.color === 'personal' && 'bg-green-100 text-green-800',
                    event.color === 'other' && 'bg-purple-100 text-purple-800'
                  )}
                >
                  {event.title}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isEventFormOpen} onOpenChange={setIsEventFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedEvent?.id ? 'Edit Event' : 'Create Event'}
            </DialogTitle>
          </DialogHeader>
          <EventForm
            onSubmit={handleEventSubmit}
            onCancel={() => {
              setIsEventFormOpen(false);
              setSelectedEvent(null);
            }}
            onDelete={handleEventDelete}
            initialData={selectedEvent || undefined}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}