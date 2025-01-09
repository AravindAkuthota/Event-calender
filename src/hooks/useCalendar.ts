import { useState, useEffect } from 'react';
import { Event, Day, CalendarState } from '@/types/calendar';

const DAYS_IN_WEEK = 7;
const STORAGE_KEY = 'calendar_events';

export function useCalendar() {
  const [state, setState] = useState<CalendarState>({
    selectedDate: new Date(),
    currentMonth: new Date(),
    events: [],
  });

  // Load events from localStorage on mount
  useEffect(() => {
    const storedEvents = localStorage.getItem(STORAGE_KEY);
    if (storedEvents) {
      setState(prev => ({ ...prev, events: JSON.parse(storedEvents) }));
    }
  }, []);

  // Save events to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state.events));
  }, [state.events]);

  const getDaysInMonth = (date: Date): Day[] => {
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const days: Day[] = [];

    // Previous month's days
    const prevMonthLastDay = new Date(year, month, 0).getDate();
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month - 1, prevMonthLastDay - i);
      days.push({
        date,
        isCurrentMonth: false,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDay(date),
      });
    }

    // Current month's days
    for (let i = 1; i <= daysInMonth; i++) {
      const date = new Date(year, month, i);
      days.push({
        date,
        isCurrentMonth: true,
        isToday: isSameDay(date, new Date()),
        events: getEventsForDay(date),
      });
    }

    // Next month's days
    const remainingDays = DAYS_IN_WEEK - (days.length % DAYS_IN_WEEK);
    if (remainingDays < DAYS_IN_WEEK) {
      for (let i = 1; i <= remainingDays; i++) {
        const date = new Date(year, month + 1, i);
        days.push({
          date,
          isCurrentMonth: false,
          isToday: isSameDay(date, new Date()),
          events: getEventsForDay(date),
        });
      }
    }

    return days;
  };

  const getEventsForDay = (date: Date): Event[] => {
    return state.events.filter(event => {
      const eventDate = new Date(event.startTime);
      return isSameDay(eventDate, date);
    });
  };

  const isSameDay = (date1: Date, date2: Date): boolean => {
    return (
      date1.getDate() === date2.getDate() &&
      date1.getMonth() === date2.getMonth() &&
      date1.getFullYear() === date2.getFullYear()
    );
  };

  const addEvent = (event: Omit<Event, 'id'>) => {
    const newEvent = { ...event, id: crypto.randomUUID() };
    setState(prev => ({
      ...prev,
      events: [...prev.events, newEvent],
    }));
  };

  const updateEvent = (event: Event) => {
    setState(prev => ({
      ...prev,
      events: prev.events.map(e => (e.id === event.id ? event : e)),
    }));
  };

  const deleteEvent = (eventId: string) => {
    setState(prev => ({
      ...prev,
      events: prev.events.filter(e => e.id !== eventId),
    }));
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setState(prev => ({
      ...prev,
      currentMonth: new Date(
        prev.currentMonth.getFullYear(),
        prev.currentMonth.getMonth() + (direction === 'next' ? 1 : -1),
        1
      ),
    }));
  };

  const selectDate = (date: Date) => {
    setState(prev => ({ ...prev, selectedDate: date }));
  };

  return {
    state,
    days: getDaysInMonth(state.currentMonth),
    addEvent,
    updateEvent,
    deleteEvent,
    navigateMonth,
    selectDate,
  };
}