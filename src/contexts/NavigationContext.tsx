import React, { ReactNode, useState, useContext, useEffect, useMemo } from "react";
import NativeUtils from "../nativeCommon/NativeUtils";
import WebViewContext, { WebViewContextApi } from "./WebViewContext";
import { Callback } from "../tsCommon/baseTypes";
import { createStateApiContext, StateApi } from "../reactCommon/ContextBase";

export interface Navigable {
  canGoBack: () => boolean,
  goBack: Callback<void>,
}

export interface NavigationState {
  webViewAtFront: boolean;
  canGoBack: boolean;
  canGoForward: boolean;
}

const defaultState: NavigationState = {
  canGoBack: false,
  canGoForward: false,
  webViewAtFront: false,
}

export class Api extends StateApi<NavigationState> {
  webViewContextApi: WebViewContextApi;
  constructor(
    webViewContextApi: WebViewContextApi,
    state: NavigationState,
    setState: Callback<NavigationState>) {
    super(state, setState);
    this.webViewContextApi = webViewContextApi;
  }
  debugState(state: NavigationState) {
    console.log('NavigationContext:' + JSON.stringify(state));
  }
  goBack = () => {
    if (this.webViewContextApi.canGoBack()) {
      this.webViewContextApi.goBack();
      return true;
    }
    return false;
  }
  goForward = () => {
    if (this.webViewContextApi.canGoForward()) {
      this.webViewContextApi.goForward();
      return true;
    }
    return false;
  }
  goHome = () => {
    this.setCanGoBackAndForward(false, false);
  }
  goSearch = (searchQuery: string) => {
  }

  setCanGoBackAndForward(canGoBack: boolean, canGoForward: boolean) {
    if (canGoBack !== this.state.canGoBack || canGoForward !== this.state.canGoForward) {
      this.setState({ ...this.state, canGoBack, canGoForward });
    }
  }

  setWebViewAtFront(atFront: boolean) {
    if (atFront !== this.state.webViewAtFront) {
      this.setState({ ...this.state, webViewAtFront: atFront });
    }
  }
}
const NavigationContext = createStateApiContext<NavigationState, Api>();
export default NavigationContext;

export function NavigationContextProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(defaultState);
  const {
    state: { webViewState: { canGoBack: webViewCanGoBack, canGoForward } },
    api: webViewContextApi,
  } = useContext(WebViewContext)!;
  const api = useMemo(() => new Api(webViewContextApi, defaultState, setState), [webViewContextApi]);
  const contextValue = useMemo(() => ({ api, state }), [api, state])

  const webViewAtFront = !!webViewContextApi.state.currentWebView;
  const canGoBack = function () {
    if (webViewCanGoBack) return true;
    return false;
  }();

  useEffect(() => api.setCanGoBackAndForward(canGoBack, canGoForward), [canGoBack, canGoForward]);
  useEffect(() => api.setWebViewAtFront(webViewAtFront), [webViewAtFront]);

  // back handler 
  NativeUtils.useBackButton(() => api.goBack(), [api]);

  return <NavigationContext.Provider value={contextValue}>
    {props.children}
  </NavigationContext.Provider>
}