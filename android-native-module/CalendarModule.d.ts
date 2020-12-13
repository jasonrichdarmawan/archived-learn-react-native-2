export interface CalendarInterface {
  getConstants(): { DEFAULT_EVENT_NAME: string }; // TODO: types.
  createCalendarEvent(
    name: string,
    location: string,
    failureCallback: (error: string) => void,
    successCallback: (eventID: number) => void
  ): void;
}
