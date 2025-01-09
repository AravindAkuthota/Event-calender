export interface Event {
  id: string;
  title: string;
  startTime: string;
  endTime: string;
  description?: string;
  color?: 'work' | 'personal' | 'other';
}

export interface Day {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: Event[];
}

export interface CalendarState {
  selectedDate: Date;
  currentMonth: Date;
  events: Event[];
}