import React, { useContext, useEffect, useState, useMemo } from "react";
import { View } from "react-native";
import { Bookmark, BookmarkUtil, BookmarkState, initialState, BookmarkGroup } from "./BookmarkModel";
import { createStateApiContext, StateApi } from "../reactCommon/ContextBase";
import { loadStateByKey, saveStateByKey } from "../nativeCommon/PersistedState";

export const BookmarkContext = createStateApiContext<BookmarkState, BookmarkApi>();

export class BookmarkApi extends StateApi<BookmarkState> {
  debugState(state: BookmarkState) {
    console.log('BookmarkContext:' + JSON.stringify(state.currentModel));
  }
  addBookmark(bookmark: Bookmark) {
    this.setState(BookmarkUtil.addBookmark(bookmark, this.state));
  }

  deleteBookmark(bookmark: Bookmark) {
    this.setState(BookmarkUtil.deleteBookmark(bookmark.createTimestamp, this.state));
  }

  clearCurrentGroup() {
    this.setState(BookmarkUtil.deleteAllBookmarks(this.state.currentGroupId, this.state));
  }

  setGroupName(name: string) {
    this.setState(BookmarkUtil.setGroupName(this.state.currentGroupId, name, this.state));
  }

  getCurrentBookmarks() {
    return this.getCurrentGroup()?.bookmarks || [];
  }

  getCurrentGroup() {
    return BookmarkUtil.getGroup(this.state.currentGroupId, this.state);
  }

  addGroup() {
    this.setState(BookmarkUtil.addGroup(this.state));
  }
  deleteGroup(group: BookmarkGroup) {
    this.setState(BookmarkUtil.deleteGroup(group.createTimestamp, this.state));
  }

  setCurrentGroup(groupId: number) {
    this.setState({ ...this.state, currentGroupId: groupId });
  }

  getGroups() {
    return BookmarkUtil.getGroups(this.state);
  }

  shouldSync() {
    return BookmarkUtil.shouldSync(this.state);
  }
  sync(token: string) {
    BookmarkUtil.sync(this.state, token).then(newState => {
      this.setState(newState);
    });
  }
}

export const BookmarkContextProvider = (props: any) => {
  const { children } = props;
  const [state, setState] = useState<BookmarkState>(initialState);
  const api = useMemo(() => new BookmarkApi(initialState, setState), []);
  const contextValue = useMemo(() => ({ api, state }), [api, state]);
  const [stateLoaded, setStateLoaded] = useState(false);

  function StateSaver() {
    const { state } = useContext(BookmarkContext)!;
    useEffect(() => saveStateByKey('bookmarks', state), [state]);
    return <View />;
  }

  useEffect(() => {
    loadStateByKey<BookmarkState>('bookmarks').then(s => {
      if (s) api.setState(s);
      setStateLoaded(true);
    })
  }, []);

  return <BookmarkContext.Provider value={contextValue}>
    {stateLoaded && <StateSaver />}
    {children}
  </BookmarkContext.Provider>;
}