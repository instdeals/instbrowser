import React, { useCallback, useContext, useMemo, useState } from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';
import { Route, TabView } from 'react-native-tab-view';
import NavigationContext from './contexts/NavigationContext';
import { WebTabSummaryListView } from './tabs/WebTabView';
import BookmarkListView from './bookmarks/BookmarkListView';

const routes = [
  {
    key: 'tabs',
    title: 'Tabs',
  },
  {
    key: 'bookmarks',
    title: 'Bookmarks',
  },
];

export default function SecondaryContentView() {
  const { api: navApi, state: { shownContent } } = useContext(NavigationContext)!;
  const [navState, setNavState] = useState({
    index: 0,
    routes,
  });
  const switchTo = useCallback((index: number) => {
    setNavState({ index, routes });
  }, []);
  const renderScene = useCallback(({ route }: { route: Route }) => {
    if (route.key === 'tabs') return <WebTabSummaryListView />
    return <BookmarkListView />
  }, []);
  if (!shownContent) return null;
  return <View style={styles.secondaryContent}>
    <TabView
      lazy={true}
      swipeEnabled={true}
      navigationState={navState}
      renderScene={renderScene}
      onIndexChange={switchTo}
    />
  </View>
}

const viewHeight = Dimensions.get('window').height;
const styles = StyleSheet.create({
  secondaryContent: {
    backgroundColor: 'white',
    height: viewHeight,
    width: '100%',
  }
})