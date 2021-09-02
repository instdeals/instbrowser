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
import I18nResources from './src/I18nResources';
import BottomBar, { BottomBarItem } from './src/nativeCommon/BottomBar';
import commonStyles from './src/nativeCommon/commonStyles';
import { i18nInit } from './src/nativeCommon/i18n';
import { AutoHideView, ScrollViewProvider } from './src/nativeCommon/ScrollContext';
import SecondaryContentView from './src/SecondaryContentView';
import { WebTabContextProvider, WebViewTabContext } from './src/tabs/WebTabContext';
import WebTabView from './src/tabs/WebTabView';
import { doNothing } from './src/tsCommon/baseTypes';

i18nInit(I18nResources);

const theme = {
  ...DefaultTheme,
  roundness: 4,
  colors: {
    ...DefaultTheme.colors,
    primary: '#007AFF',
  },
};

function AppInner() {
  const { api: navApi, state: navState } = useContext(NavigationContext)!;
  const { state: { currentWebView } } = useContext(WebViewContext)!;
  const { api: bookmarkApi } = useContext(BookmarkContext)!;
  const { api: tabApi } = useContext(WebViewTabContext)!;
  const addBookmark = useCallback(() => {
    currentWebView?.getBookmark().then(bm => {
      bookmarkApi.addBookmark(bm);
    });
  }, [currentWebView]);

  const bottomBar = () => <BottomBar>
    <BottomBarItem key='backward' name='chevron-left' onPress={navApi.goBack}
      disabled={!navState.canGoBack} />
    <BottomBarItem key='forward' name='chevron-right' onPress={navApi.goForward}
      disabled={!navState.canGoForward} />
    <BottomBarItem key='heart' name='heart'
      onPress={() => navApi.setShownContent('bookmarks')}
      onLongPress={addBookmark} disabled={!currentWebView} />
    <BottomBarItem key='tabs' name='plus-square' onPress={() => navApi.setShownContent('tabs')} />
    <BottomBarItem key='user' name='user' onPress={doNothing} />
  </BottomBar>;

  return <ScrollViewProvider>
    <SecondaryContentView />
    <View style={commonStyles.flexCol1}>
      <AutoHideView contentHeight={25}>
        <Text>Address Bar Goes Here</Text>
      </AutoHideView>
      <WebTabView />
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
      <WebViewContextProvider><NavigationContextProvider><BookmarkContextProvider><WebTabContextProvider>
        <AppInner />
      </WebTabContextProvider></BookmarkContextProvider></NavigationContextProvider></WebViewContextProvider>
    </SafeAreaView>
  </PaperProvider>
}

