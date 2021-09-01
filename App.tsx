import React, { LegacyRef, useContext } from 'react';
import { useState } from 'react';
import { useCallback } from 'react';
import {
  Dimensions,
  SafeAreaView,
  StatusBar,
  StyleSheet,
  Text,
  useColorScheme,
  View,
} from 'react-native';

import { Provider as PaperProvider, DefaultTheme } from 'react-native-paper';
import { BookmarkContext, BookmarkContextProvider } from './src/bookmarks/BookmarkContext';
import NavigationContext, { NavigationContextProvider } from './src/contexts/NavigationContext';
import WebViewContext, { WebViewContextProvider } from './src/contexts/WebViewContext';
import BottomBar, { BottomBarItem } from './src/nativeCommon/BottomBar';
import commonStyles from './src/nativeCommon/commonStyles';
import { AutoHideView, ScrollViewProvider } from './src/nativeCommon/ScrollContext';
import { WebTabContextProvider } from './src/tabs/WebTabContext';
import WebTabView, { WebTabSummaryListView } from './src/tabs/WebTabView';
import { doNothing } from './src/tsCommon/baseTypes';
import TestView from './src/webView/TestView';

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
  const [tabsShown, setTabsShown] = useState(false);

  const showTabs = useCallback(() => {
    setTabsShown(true);
  }, []);
  const bottomBar = () => <BottomBar>
    <BottomBarItem key='backward' name='chevron-left' onPress={navigation.goBack}
      disabled={!navState.canGoBack} />
    <BottomBarItem key='forward' name='chevron-right' onPress={navigation.goForward}
      disabled={!navState.canGoForward} />
    <BottomBarItem key='heart' name='heart' onPress={addBookmark} disabled={!currentWebView} />
    <BottomBarItem key='tabs' name='plus-square' onPress={showTabs} />
    <BottomBarItem key='user' name='user' onPress={doNothing} />
  </BottomBar>;

  return <ScrollViewProvider>
    {tabsShown && <View style={styles.secondaryContent}>
      <WebTabSummaryListView onDone={() => setTabsShown(false)} />
    </View>}
    <View style={commonStyles.flexCol1}>
      <AutoHideView contentHeight={25}>
        <Text>Address Bar Goes Here</Text>
      </AutoHideView>
      <TestView />
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

const viewHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  secondaryContent: {
    backgroundColor: 'white',
    height: viewHeight,
    width: '100%',
  }
})