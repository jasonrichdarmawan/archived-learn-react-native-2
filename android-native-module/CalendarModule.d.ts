export interface CalendarInterface {
  getConstants(): { DEFAULT_EVENT_NAME: string }; // TODO: types.
  createCalendarEvent(name: string, location: string): void;
}
