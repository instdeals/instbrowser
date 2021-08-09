import React from 'react';
import {
  SafeAreaView,
  ScrollView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import WebView from 'react-native-webview';
import BottomBar, { BottomBarIcon } from './src/nativeCommon/BottomBar';
import commonStyles from './src/nativeCommon/commonStyles';
import { doNothing } from './src/tsCommon/baseTypes';

const theme = {
  ...DefaultTheme,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
  },
};

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
  };

  const bottomBar = () => <BottomBar>
    <BottomBarIcon key='backward' name='chevron-left' onPress={doNothing} />
    <BottomBarIcon key='heart' name='heart' onPress={doNothing} />
    <BottomBarIcon key='home' name='home' onPress={doNothing} />
    <BottomBarIcon key='user' name='user' onPress={doNothing} />
  </BottomBar>;

  return <PaperProvider theme={theme}>
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <View style={{
        ...commonStyles.flexCol,
        flex: 1,
      }}>
        <Text>Address Bar Goes Here</Text>
        <WebView style={commonStyles.flex1} source={{ uri: 'http://www.bing.com' }} />
        {bottomBar()}
      </View>
    </SafeAreaView>
  </PaperProvider>
}