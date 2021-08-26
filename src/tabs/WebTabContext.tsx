import React, { ReactNode, useContext, useMemo, useState } from "react";
import { useEffect } from "react";
import { View } from "react-native";
import { Bookmark } from "../bookmarks/BookmarkModel";
import { createStateApiContext, StateApi } from "../reactCommon/ContextBase";
import TimeUtils from "../tsCommon/TimeUtils";

export interface WebTab {
  key: string;
  loaded: boolean;
  bookmark: Bookmark;
}

export interface State {
  tabs: WebTab[];
}

const defaultState: State = {
  tabs: [],
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
  newTab = () => {
    this.setState({
      tabs: [...this.state.tabs, defaultTab()],
    });
  }

  closeAll = () => {
    this.setState({
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