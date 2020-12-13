import React from "react";
import { Button } from "react-native";

import CalendarModule from "./CalendarModule";

const { DEFAULT_EVENT_NAME } = CalendarModule.getConstants();

const NewModuleButton = () => {
  const onPress = () => {
    console.log("We will invoke the native module here!");
    console.log(DEFAULT_EVENT_NAME);
    CalendarModule.createCalendarEvent(
      "testName",
      "testLocation",
      (error) => {
        console.error(`Error found! ${error}`);
      },
      (eventID) => {
        console.log(`Created a new event with id ${eventID}`);
      }
    );
  };

  const onPressPromise = async () => {
    try {
      const eventID = await CalendarModule.createCalendarEventPromise(
        "Party",
        "My House"
      );
      console.log(`Created a new event with ID ${eventID}`);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={onPressPromise}
    />
  );
};

export default NewModuleButton;
