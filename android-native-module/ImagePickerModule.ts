import { NativeModules } from "react-native";

import { ImagePickerInterface } from "./ImagePickerModule.d";

const { ImagePickerModule } = NativeModules;

export default ImagePickerModule as ImagePickerInterface;
