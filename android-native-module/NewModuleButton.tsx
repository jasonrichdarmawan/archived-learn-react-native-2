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

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={onPress}
    />
  );
};

export default NewModuleButton;
