/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 * @flow strict-local
 */

import {
  MediaStates,
  Player,
  Recorder,
} from '@react-native-community/audio-toolkit';
import React from 'react';
import {
  SafeAreaView,
  StyleSheet,
  ScrollView,
  View,
  Text,
  StatusBar,
  Pressable,
} from 'react-native';

import {Colors} from 'react-native/Libraries/NewAppScreen';

const App = () => {
  let recorder = new Recorder('audio.mp3');

  const recorderRecord = () => {
    if (recorder.canPrepare) {
      console.log('recording');
      recorder.record();
    }

    if (
      recorder.state === MediaStates.ERROR ||
      recorder.state === MediaStates.DESTROYED
    ) {
      recorder.destroy();
      console.log('new recorder');
      recorder = new Recorder('audio.mp3');
      recorderRecord();
    }
  };

  const recorderState = () => {
    console.log(
      'recorder state: ' +
        recorder.state +
        '\n' +
        'recorder is recording: ' +
        recorder.isRecording +
        '\n' +
        'fsPath:' +
        recorder.fsPath,
    );
  };

  const recorderStop = () => {
    if (recorder.isRecording) {
      console.log('stopping recorder');
      recorder.stop();
    }
  };

  // const player = new Player(
  //   'https://file-examples-com.github.io/uploads/2017/11/file_example_MP3_700KB.mp3',
  // );

  let player = new Player('audio.mp3');

  const playerPlay = () => {
    if (player.canPrepare || player.canPlay) {
      console.log('playing player');
      player.play();
    }

    if (player.state === MediaStates.ERROR) {
      player.destroy();
      console.log('new player');
      player = new Player('audio.mp3');
      player.play();
    }
  };

  const playerState = () => {
    console.log('recorder state: ' + player.state);
  };

  const playerPause = () => {
    if (player.isPlaying) {
      console.log('pausing player');
      player.pause();
    }
  };

  const playerUnpause = () => {
    if (player.isPaused && player.canPlay) {
      console.log('unpausing player');
      player.play();
    }
  };

  const playerStop = () => {
    if (player.isPlaying && player.canStop) {
      console.log('stopping player');
      player.stop();
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" />
      <SafeAreaView>
        <ScrollView
          contentInsetAdjustmentBehavior="automatic"
          style={styles.scrollView}>
          <View style={styles.body}>
            <View style={styles.sectionContainer}>
              <Pressable
                onPressIn={() => recorderRecord()}
                onPressOut={() => recorderStop()}>
                <Text>Press to record the audio</Text>
              </Pressable>
            </View>
            <View style={styles.sectionContainer}>
              <Pressable onPress={() => recorderRecord()}>
                <Text>Record the audio</Text>
              </Pressable>
            </View>
            <View style={styles.sectionContainer}>
              <Pressable onPress={() => recorderState()}>
                <Text>Get Recorder State</Text>
              </Pressable>
            </View>
            <View style={styles.sectionContainer}>
              <Pressable onPress={() => recorderStop()}>
                <Text>Stop the recorder</Text>
              </Pressable>
            </View>
            <View style={styles.sectionContainer}>
              <Pressable onPress={() => playerPlay()}>
                <Text>Play the audio</Text>
              </Pressable>
            </View>
            <View style={styles.sectionContainer}>
              <Pressable onPress={() => playerState()}>
                <Text>Get the Player State</Text>
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
              <Pressable onPress={() => playerStop()}>
                <Text>Stop the audio</Text>
              </Pressable>
            </View>
          </View>
        </ScrollView>
      </SafeAreaView>
    </>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    backgroundColor: Colors.lighter,
  },
  engine: {
    position: 'absolute',
    right: 0,
  },
  body: {
    backgroundColor: Colors.white,
  },
  sectionContainer: {
    marginTop: 32,
    paddingHorizontal: 24,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    marginTop: 8,
    fontSize: 18,
    fontWeight: '400',
    color: Colors.dark,
  },
  highlight: {
    fontWeight: '700',
  },
  footer: {
    color: Colors.dark,
    fontSize: 12,
    fontWeight: '600',
    padding: 4,
    paddingRight: 12,
    textAlign: 'right',
  },
});

export default App;
