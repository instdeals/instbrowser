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
import { AutoHideView, ScrollViewProvider } from './src/nativeCommon/ScrollContext';
import { doNothing } from './src/tsCommon/baseTypes';
import { InstWebView } from './src/webView/InstWebView';

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
      <ScrollViewProvider>
        <View style={{
          ...commonStyles.flexCol,
          flex: 1,
        }}>
          <AutoHideView contentHeight={25}>
            <Text>Address Bar Goes Here</Text>
          </AutoHideView>
          <InstWebView webViewKey='solo' style={commonStyles.flex1} uri='http://www.bing.com' />
          <AutoHideView contentHeight={40}>
            {bottomBar()}
          </AutoHideView>
        </View>
      </ScrollViewProvider>
    </SafeAreaView>
  </PaperProvider>
}