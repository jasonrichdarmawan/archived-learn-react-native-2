import React from 'react';
import {View, Pressable, Text, PermissionsAndroid} from 'react-native';
import Recording from 'react-native-recording';
import {Client} from '@stomp/stompjs';

const App = () => {
  React.useEffect(() => {
    const stompClient = new Client({
      brokerURL: 'ws://192.168.1.8:8080/websocketApp',
      // debug: (str) => {
      //   console.log(str);
      // },
      forceBinaryWSFrames: true,
      appendMissingNULLonIncoming: true,
    });

    let stompSubscription;

    stompClient.onConnect = (frame) => {
      console.log('onConnect');
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
      stompClient.publish({
        destination: '/app/chat.newUser',
        body: JSON.stringify({
          sender: 'User A',
          type: 'newUser',
        }),
        skipContentLengthHeader: true,
      });
    };

    stompClient.onStompError = (frame) => {
      console.log('onStompError');
    };

    stompClient.activate();

    const listener = Recording.addRecordingEventListener((data) =>
      console.log(data),
    );

    return () => {
      listener.remove();
      stompSubscription.unsubscribe();
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

  return (
    <View>
      <Pressable
        onPressIn={() => startAsync()}
        onPressOut={() => Recording.stop()}>
        <Text>Record</Text>
      </Pressable>
    </View>
  );
};

export default App;
