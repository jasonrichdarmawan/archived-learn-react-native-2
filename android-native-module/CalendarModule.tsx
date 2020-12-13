import { NativeModules } from "react-native";

import { CalendarInterface } from "./CalendarModule.d";

const { CalendarModule } = NativeModules;

export default CalendarModule as CalendarInterface;
