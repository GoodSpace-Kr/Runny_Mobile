import React from 'react';
import {StatusBar} from 'react-native';
import {SafeAreaProvider} from 'react-native-safe-area-context';

import {PlaygroundScreen} from './src/screens/playground/PlaygroundScreen';

function App() {
  return (
    <SafeAreaProvider>
      <StatusBar barStyle="dark-content" />
      <PlaygroundScreen />
    </SafeAreaProvider>
  );
}

export default App;
