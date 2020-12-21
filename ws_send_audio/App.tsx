import React from 'react';
import {View, Pressable, Text, PermissionsAndroid} from 'react-native';
import Recording from 'react-native-recording';
import {Client, StompSubscription} from '@stomp/stompjs';

const App = () => {
  let stompClient: Client;

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

    const listener = Recording.addRecordingEventListener((data) => {
      console.log(data);
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

  return (
    <View>
      <Pressable
        onPressIn={() => startAsync()}
        onPressOut={() => Recording.stop()}>
        <Text>Record</Text>
      </Pressable>
      <Pressable onPress={() => publish()}>
        <Text>WebSocket Publish</Text>
      </Pressable>
    </View>
  );
};

export default App;
