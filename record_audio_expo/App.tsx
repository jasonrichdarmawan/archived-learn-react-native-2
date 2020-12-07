import React from "react";
import {
  Pressable,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { Audio } from "expo-av";
// import * as FileSystem from "expo-file-system";
import RNBluetoothClassic from "react-native-bluetooth-classic";

export default function App() {
  let recorder = new Audio.Recording();
  let uri: string | null;

  const recorderRecord = async () => {
    const status = await recorder.getStatusAsync();
    if (status.isDoneRecording === true) {
      recorder = new Audio.Recording();
      console.log("recorderRecord(): new recorder object");
    }
    if (status.canRecord === false) {
      try {
        await recorder.prepareToRecordAsync(
          Audio.RECORDING_OPTIONS_PRESET_LOW_QUALITY
        );
        uri = recorder.getURI();
        console.log(`recorder is prepared: ${uri}`);
        await recorder.startAsync();
        console.log("recorder is recording");
      } catch (error) {
        console.error(`recorderRecord(): ${error}`);
        const status = await Audio.getPermissionsAsync();
        if (status.canAskAgain === true && status.granted === false) {
          await Audio.requestPermissionsAsync();
        }
      }
    }
  };

  /**
   * // TODO: fix Error: Cannot unload a Recording that has already been unloaded. || Error: Cannot unload a Recording that has not been prepared.
   * Steps to reproduce: Spam the 'Press to record the audio' button
   * Severity: Minor
   *
   * https://github.com/expo/expo/issues/1709
   */
  const recorderStop = async () => {
    await new Promise((resolve) => setTimeout(resolve, 1000)); // handle Error: Stop encountered an error: recording not stopped
    const status = await recorder.getStatusAsync();
    if (status.isRecording === true) {
      try {
        await recorder.stopAndUnloadAsync();
        console.log("recorder stopped");
      } catch (error) {
        if (
          error.message.includes(
            "Stop encountered an error: recording not stopped"
          )
        ) {
          await recorder._cleanupForUnloadedRecorder({
            canRecord: false,
            durationMillis: 0,
            isRecording: false,
            isDoneRecording: false,
          });
          console.log(`recorderStop() error handler: ${error}`);
        } else if (
          error.message.includes(
            "Cannot unload a Recording that has already been unloaded."
          ) ||
          error.message.includes(
            "Cannot unload a Recording that has not been prepared."
          )
        ) {
          console.log(`recorderStop() to do error handler: ${error}`);
        } else {
          console.error(`recorderStop(): ${error}`);
        }
      }
    }
  };

  let player = new Audio.Sound();

  const playerPlay = async (uri: string) => {
    const status = await player.getStatusAsync();
    if (status.isLoaded === true) {
      await playerStop();
    }
    try {
      await player.loadAsync({
        uri,
      });
      await player.playAsync();
      console.log("player is playing");
    } catch (error) {
      if (error.message.includes("The Sound is already loading.")) {
        player = new Audio.Sound();
        console.log("new player");
        await playerPlay(uri);
      } else {
        console.error(`playerPlay(): ${error}`);
      }
    }
  };

  const playerPause = async () => {
    try {
      await player.pauseAsync();
      console.log("player paused");
    } catch (error) {
      console.error(`playerPause(): ${error}`);
    }
  };

  const playerUnpause = async () => {
    try {
      await player.playAsync();
    } catch (error) {
      console.error(`playerUnpause(): ${error}`);
    }
  };

  const playerStop = async () => {
    try {
      await player.unloadAsync();
      console.log("player unloaded");
    } catch (error) {
      console.error(`playerStop(): ${error}`);
    }
  };

  const bluetoothIsEnabled = async () => {
    try {
      const enabled = await RNBluetoothClassic.isBluetoothEnabled();
      console.log(`bluetooth is enabled: ${enabled}`);
      return enabled;
    } catch (error) {
      console.error(`bluetoothIsEnabled(): ${error}`);
      return false;
    }
  };

  /**
   * // TODO: fix bluetooth is connected although bluetooth is not enabled.
   * Steps to reproduce: Connect to a bluetooth device -> disable the bluetooth -> use method bluetoothIsConnected();
   * Severity: Minor
   */
  const bluetoothIsConnected = async (address: string) => {
    try {
      const connected = await RNBluetoothClassic.isDeviceConnected(address);
      console.log(`bluetooth is connected: ${connected}`);
      return connected;
    } catch (error) {
      console.error(`bluetoothIsConnected(): ${error}`);
      return false;
    }
  };

  let bluetoothAddress = "00:13:04:84:03:07"; // TODO: let the user choose.

  const bluetoothConnect = async (address: string) => {
    const enabled = await bluetoothIsEnabled();
    if (enabled === true) {
      try {
        const connected = await bluetoothIsConnected(address);
        if (connected === false) {
          await RNBluetoothClassic.connectToDevice(address);
          const result = await bluetoothIsConnected(address);
          console.log(
            `connected to bluetooth device with address '${address}': ${result}`
          );
        }
      } catch (error) {
        console.error(`bluetoothConnect(): ${error}`);
      }
    }
  };

  const bluetoothBondedDevices = async () => {
    try {
      const list = await RNBluetoothClassic.getBondedDevices();
      console.log(list);
    } catch (error) {
      console.error(`bluetoothList(): ${error}`);
    }
  };

  React.useEffect(() => {
    console.log("re-render");
  });

  return (
    <SafeAreaView>
      <ScrollView style={styles.scrollView}>
        <View style={styles.body}>
          <View style={styles.sectionContainer}>
            <Pressable
              onPressIn={() => recorderRecord()}
              onPressOut={() => recorderStop()}
            >
              <Text>Press to record the audio</Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={() => {
                if (uri !== null) {
                  playerPlay(uri);
                }
              }}
            >
              <Text>Play the audio</Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable onPress={() => playerPause()}>
              <Text>Pause the audio</Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable onPress={() => playerUnpause()}>
              <Text>Unpause the audio</Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable onPress={() => bluetoothBondedDevices()}>
              <Text>Bluetooth List</Text>
            </Pressable>
          </View>
          <View style={styles.sectionContainer}>
            <Pressable
              onPress={() => {
                if (bluetoothAddress !== null) {
                  bluetoothConnect(bluetoothAddress);
                }
              }}
            >
              <Text>Bluetooth Connect</Text>
            </Pressable>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});
