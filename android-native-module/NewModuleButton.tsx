import React from "react";
import {
  Button,
  EmitterSubscription,
  NativeEventEmitter,
  NativeModules,
} from "react-native";

import CalendarModule from "./CalendarModule";
import ImagePickerModule from "./ImagePickerModule";

const { DEFAULT_EVENT_NAME } = CalendarModule.getConstants();

const NewModuleButton = () => {
  let eventListener: EmitterSubscription;

  React.useEffect(() => {
    console.log("re-render");

    // each render reset everything.
    console.log(eventListener === undefined);

    const eventEmitter = new NativeEventEmitter(NativeModules.CalendarModule);
    eventListener = eventEmitter.addListener("EventReminder", (event) => {
      console.log(event.eventProperty); // "someValue"
    });

    // invoked if there is a re-render.
    // render -> remove listener -> re-render.
    return () => {
      console.log("remove listener");
      eventListener.remove();
    };
  }, []);

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

  const getUri = async () => {
    await ImagePickerModule.pickImage()
      .then((uri) => console.log(uri))
      .catch((reason) => console.error(reason));
  };

  return (
    <Button
      title="Click to invoke your native module!"
      color="#841584"
      onPress={getUri}
    />
  );
};

export default NewModuleButton;
