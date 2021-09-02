import React, { useContext, useMemo } from 'react';
import { View, Text, TouchableHighlight, StyleSheet } from 'react-native';
import NavigationContext from '../contexts/NavigationContext';
import WebViewContext from '../contexts/WebViewContext';
import { BookmarkContext } from './BookmarkContext';
import { Bookmark, BookmarkUtil } from './BookmarkModel';

function BookmarkView(props: {
  bookmark: Bookmark;
}) {
  const { bookmark: bm } = props;
  const { state: { currentWebView } } = useContext(WebViewContext)!;
  const { api: navApi } = useContext(NavigationContext)!;
  return <TouchableHighlight onPress={() => {
    currentWebView?.goTo(bm.uri);
    navApi.setShownContent(undefined);
  }}>
    <View style={styles.bookmark}>
      <Text>{bm.title}</Text>
    </View>
  </TouchableHighlight >
}

export default function BookmarkListView() {
  const { state } = useContext(BookmarkContext)!;
  const bookmarks = useMemo(() => {
    return BookmarkUtil.getGroup(state.currentGroupId, state)?.bookmarks;
  }, [state])
  return <View>
    {bookmarks?.map(bm => <BookmarkView bookmark={bm} key={bm.createTimestamp} />)}
  </View>;
}

const styles = StyleSheet.create({
  bookmark: {
    height: 60,
  }
})