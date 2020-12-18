import React from 'react';
import {View, Pressable, Text, PermissionsAndroid} from 'react-native';
import Recording from 'react-native-recording';

const App = () => {
  React.useEffect(() => {
    const listener = Recording.addRecordingEventListener((data) =>
      console.log(data),
    );
    return () => listener.remove();
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
