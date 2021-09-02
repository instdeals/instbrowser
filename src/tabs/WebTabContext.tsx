import React, { createRef, ReactNode, RefObject, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { View } from "react-native";
import { Bookmark } from "../bookmarks/BookmarkModel";
import { createStateApiContext, StateApi } from "../reactCommon/ContextBase";
import { Callback } from "../tsCommon/baseTypes";
import TimeUtils from "../tsCommon/TimeUtils";
import { WebViewState } from "../webView/InstWebView";
import InstWebViewHolder from "../webView/InstWebViewHolder";

export interface WebTab {
  key: string;
  loaded: boolean;
  bookmark: Bookmark;
}

export interface State {
  tabs: WebTab[];
  tabsShown: boolean;
}

const defaultState: State = {
  tabs: [],
  tabsShown: false,
}

function defaultTab(): WebTab {
  const now = TimeUtils.tsInSeconds();
  return {
    key: `${now}`,
    loaded: true,
    bookmark: {
      createTimestamp: now,
      updateTimestamp: now,
      title: 'Default',
      uri: 'https://www.bing.com',
    }
  }
}

class Api extends StateApi<State> {
  wvHolder: RefObject<InstWebViewHolder>;
  constructor(state: State, setState: Callback<State>) {
    super(state, setState);
    this.wvHolder = createRef<InstWebViewHolder>();
  }

  setTabsShown = (shown: boolean) => {
    this.setState({ ...this.state, tabsShown: shown });
  }

  switchTab = (index: number) => {
    this.wvHolder.current?.switchTo(index);
    this.setTabsShown(false);
  }

  debugState(state: State) {
    // console.log('WebTabContext:' + JSON.stringify(state));
  }
  updateWebViewState = (key: string, state: WebViewState) => {
    const tabs = [...this.state.tabs];
    const index = tabs.findIndex(t => t.key === key);
    if (index === -1) {
      console.log('WebTab key not found', key);
      return;
    }
    tabs[index].bookmark.title = state.title;
    tabs[index].bookmark.currentUri = state.url;
    this.setState({ ...this.state, tabs });
  }

  newTab = () => {
    this.setState({
      ...this.state,
      tabs: [...this.state.tabs, defaultTab()],
    });
  }

  closeAll = () => {
    this.setState({
      ...this.state,
      tabs: [defaultTab()],
    });
  }
}

export const WebViewTabContext = createStateApiContext<State, Api>();

function DefaultTabCreaterView() {
  const { state: { tabs }, api } = useContext(WebViewTabContext)!;
  useEffect(() => {
    if (tabs.length === 0) api.newTab();
  }, [tabs.length]);
  return <View />
}

export function WebTabContextProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(defaultState);
  const api = useMemo(() => new Api(defaultState, setState), []);
  const contextValue = useMemo(() => ({ api, state }), [api, state])

  return <WebViewTabContext.Provider value={contextValue}>
    <DefaultTabCreaterView />
    {props.children}
  </WebViewTabContext.Provider>
}