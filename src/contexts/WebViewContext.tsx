import React, { ReactNode, useMemo, useState } from "react";
import { InstWebView, WebViewState, defaultWebViewState } from "../webView/InstWebView";
import { createStateApiContext, StateApi } from "../reactCommon/ContextBase";

export interface WebViewContextState {
  currentWebView?: InstWebView;
  webViewState: WebViewState;
}
const defaultState: WebViewContextState = {
  webViewState: defaultWebViewState,
}
export class WebViewContextApi extends StateApi<WebViewContextState> {
  debugState(state: WebViewContextState) {
    console.log('WebViewContext:' + JSON.stringify(state.webViewState));
  }

  canGoBack() {
    return this.state.webViewState.canGoBack;
  }

  goBack() {
    this.state.currentWebView?.goBack();
  }

  canGoForward() {
    return this.state.webViewState.canGoForward;
  }

  goForward() {
    this.state.currentWebView?.goForward();
  }

  setCurrentWebView(webView: InstWebView | undefined) {
    if (webView !== this.state.currentWebView) {
      this.setState({ ...this.state, currentWebView: webView });
    }
  }

  setWebViewState(state: WebViewState) {
    this.setState({ ...this.state, webViewState: state });
  }
}

const WebViewContext = createStateApiContext<WebViewContextState, WebViewContextApi>();
export default WebViewContext;

export function WebViewContextProvider(props: { children: ReactNode }) {
  const [state, setState] = useState(defaultState);
  const api = useMemo(() => new WebViewContextApi(defaultState, setState), []);
  const contextValue = useMemo(() => ({ api, state }), [api, state])

  return <WebViewContext.Provider value={contextValue}>
    {props.children}
  </WebViewContext.Provider>
}