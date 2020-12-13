export interface CalendarInterface {
  getConstants(): { DEFAULT_EVENT_NAME: string }; // TODO: types.
  createCalendarEvent(
    name: string,
    location: string,
    failureCallback: (error: string) => void,
    successCallback: (eventID: number) => void
  ): void;
  createCalendarEventPromise(name: string, location: string): Promise<void>;

  /**
   * native modules send event without being invoked.
   */
  testSendEvent(): void;
}
