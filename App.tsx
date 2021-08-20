import React, { LegacyRef, useContext } from 'react';
import { useCallback } from 'react';
import {
  SafeAreaView,
  StatusBar,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { BookmarkContext, BookmarkContextProvider } from './src/bookmarks/BookmarkContext';
import NavigationContext, { NavigationContextProvider } from './src/contexts/NavigationContext';
import WebViewContext, { WebViewContextProvider } from './src/contexts/WebViewContext';
import BottomBar, { BottomBarIcon } from './src/nativeCommon/BottomBar';
import commonStyles from './src/nativeCommon/commonStyles';
import { AutoHideView, ScrollViewProvider } from './src/nativeCommon/ScrollContext';
import { doNothing } from './src/tsCommon/baseTypes';
import { InstWebView, WebViewStateCallback } from './src/webView/InstWebView';
import InstWebViewHolder from './src/webView/InstWebViewHolder';

const theme = {
  ...DefaultTheme,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
  },
};

function AppInner() {
  const { api: navigation, state: navState } = useContext(NavigationContext)!;
  const { state: { currentWebView } } = useContext(WebViewContext)!;
  const { api: bookmarkApi } = useContext(BookmarkContext)!;
  const addBookmark = useCallback(() => {
    currentWebView?.getBookmark().then(bm => {
      bookmarkApi.addBookmark(bm);
    });
  }, [currentWebView]);
  const bottomBar = () => <BottomBar>
    <BottomBarIcon key='backward' name='chevron-left' onPress={navigation.goBack}
      disabled={!navState.canGoBack} />
    <BottomBarIcon key='heart' name='heart' onPress={addBookmark} disabled={!currentWebView} />
    <BottomBarIcon key='home' name='home' onPress={doNothing} />
    <BottomBarIcon key='user' name='user' onPress={doNothing} />
  </BottomBar>;

  const routes = [
    { key: 'Main', title: 'main' }
  ];

  const renderSceneByKey = (key: string,
    onWebViewStateChange: WebViewStateCallback,
    ref: LegacyRef<InstWebView>) => {
    return 'https://bing.com';
  }

  return <ScrollViewProvider>
    <View style={commonStyles.flexCol1}>
      <AutoHideView contentHeight={25}>
        <Text>Address Bar Goes Here</Text>
      </AutoHideView>
      <InstWebViewHolder
        routes={routes}
        defaultIndex={0}
        hideTabBar={true}
        renderSceneByKey={renderSceneByKey}
      />
      <AutoHideView contentHeight={40}>
        {bottomBar()}
      </AutoHideView>
    </View>
  </ScrollViewProvider>
}

export default function App() {
  const isDarkMode = useColorScheme() === 'dark';

  const backgroundStyle = {
    backgroundColor: DefaultTheme.colors.background,
    flex: 1,
  };

  return <PaperProvider theme={theme}>
    <SafeAreaView style={backgroundStyle}>
      <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
      <WebViewContextProvider><NavigationContextProvider><BookmarkContextProvider>
        <AppInner />
      </BookmarkContextProvider></NavigationContextProvider></WebViewContextProvider>
    </SafeAreaView>
  </PaperProvider>
}