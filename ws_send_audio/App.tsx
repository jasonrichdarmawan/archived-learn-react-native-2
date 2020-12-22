import React from 'react';
import {
  View,
  Pressable,
  Text,
  PermissionsAndroid,
  StyleSheet,
} from 'react-native';
import Recording from 'react-native-recording';
import {Client, StompSubscription} from '@stomp/stompjs';
import RNSaveAudio from 'rnsaveaudio';
import {Player} from '@react-native-community/audio-toolkit';

var RNFS = require('react-native-fs');

/**
 * @todo create custom native module for:
 * 1. Record audio
 * 2. Save audio
 * 3. Play audio
 * make sure the record audio support AudioManager.startBluetoothSco().
 *
 * @todo Audio bit rate is too big / 8236 bytes per 93 milliseconds.
 * Severity: Major, the audio data should be 8 bytes per 1 seconds.
 */
const App = () => {
  let audioInt16: number[] = [];
  let stompClient: Client;
  let listener;

  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/exhaustive-deps
    stompClient = new Client({
      brokerURL: 'ws://192.168.1.8:8080/websocketApp',
      // debug: (str) => {
      //   console.log(str);
      // },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    let stompSubscription: StompSubscription;

    stompClient.onConnect = () => {
      console.log('stompClient.onConnect');
      stompSubscription = stompClient.subscribe(
        '/topic/javainuse',
        (message) => {
          if (message.body) {
            console.log('got message with body ' + message.body);
          } else {
            console.log('got empty message');
          }
        },
      );
    };

    stompClient.onStompError = (frame) => {
      console.log('Broker reported error: ' + frame.headers.message);
      console.log('Additional details: ' + frame.body);
    };

    stompClient.activate();

    // eslint-disable-next-line react-hooks/exhaustive-deps
    listener = Recording.addRecordingEventListener((data: number[]) => {
      console.log('record', data.length);
      // eslint-disable-next-line react-hooks/exhaustive-deps
      audioInt16 = audioInt16.concat(data);
    });

    return () => {
      listener.remove();
      stompSubscription.unsubscribe();
      console.log('remove, unsubscribe');
    };
  });

  const startAsync = async () => {
    await PermissionsAndroid.requestMultiple([
      PermissionsAndroid.PERMISSIONS.RECORD_AUDIO,
    ]);

    Recording.init({
      bufferSize: 4096,
      sampleRate: 44100,
      bitsPerChannel: 16,
      channelsPerFrame: 1,
    });

    Recording.start();
  };

  const publish = () => {
    console.log('stompClient.publish');
    stompClient.publish({
      destination: '/app/chat.newUser',
      body: JSON.stringify({
        sender: 'User A',
        type: 'newUser',
      }),
      headers: {
        Authorization: 'Bearer a',
      },
      skipContentLengthHeader: true,
    });
  };

  const path = RNFS.DocumentDirectoryPath + '/test.wav';

  const saveAudio = async () => {
    const promise = await RNSaveAudio.saveWav(path, audioInt16);
    console.log('save audio', promise, path);
  };

  let player = new Player(path);

  const playAudio = () => {
    if (player.canPrepare || player.canPlay) {
      player.prepare((err) => {
        if (err) {
          console.log(err);
        }
        console.log('play audio', player.duration);
        player.play();
      });
    }

    // try {
    //   console.log('play audio');
    //   SoundPlayer.playSoundFile(RNFS.DocumentDirectoryPath + 'test2', 'wav');
    //   // SoundPlayer.playUrl(
    //   //   'https://www2.cs.uic.edu/~i101/SoundFiles/CantinaBand3.wav',
    //   // );
    // } catch (e) {
    //   console.error('cannot play the sound file', e);
    // }
  };

  const readDir = () => {
    console.log('read dir');
    RNFS.readDir(RNFS.DocumentDirectoryPath) // On Android, use "RNFS.DocumentDirectoryPath" (MainBundlePath is not defined)
      .then((result) => {
        console.log('GOT RESULT', result);

        // stat the first file
        return Promise.all([RNFS.stat(result[0].path), result[0].path]);
      })
      .then((statResult) => {
        if (statResult[0].isFile()) {
          // if we have a file, read it
          return RNFS.readFile(statResult[1], 'utf8');
        }

        return 'no file';
      })
      .then((contents) => {
        // log the file contents
        console.log(contents);
      })
      .catch((err) => {
        console.log(err.message, err.code);
      });
  };

  return (
    <View>
      <View style={styles.sectionContainer}>
        <Pressable
          onPressIn={() => startAsync()}
          onPressOut={() => Recording.stop()}>
          <Text>Record</Text>
        </Pressable>
      </View>
      <View style={styles.sectionContainer}>
        <Pressable onPress={() => publish()}>
          <Text>WebSocket Publish</Text>
        </Pressable>
      </View>
      <View style={styles.sectionContainer}>
        <Pressable onPress={() => saveAudio()}>
          <Text>Save Audio</Text>
        </Pressable>
      </View>
      <View style={styles.sectionContainer}>
        <Pressable onPress={() => playAudio()}>
          <Text>Play Audio</Text>
        </Pressable>
      </View>
      <View style={styles.sectionContainer}>
        <Pressable onPress={() => readDir()}>
          <Text>Read Dir</Text>
        </Pressable>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
});

export default App;
