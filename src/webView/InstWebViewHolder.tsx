import React from 'react';
import { WebViewState, InstWebView, defaultWebViewState, WebViewStateCallback } from './InstWebView';
import { TabView, Route } from 'react-native-tab-view';
import { Dimensions } from 'react-native';
import WebViewContext, { WebViewContextApi, WebViewContextState } from '../contexts/WebViewContext';
import { doNothing } from '../tsCommon/baseTypes';
import { WebTab } from '../tabs/WebTabContext';

const viewWidth = Dimensions.get('window').width;
const initialLayout = { width: viewWidth };

interface Props {
  routes: Array<WebTab>;
  defaultIndex?: number;
  onWebViewStateChange?: WebViewStateCallback;
}
export default class InstWebViewHolder extends React.PureComponent<Props> {
  webViews = new Map<string, InstWebView | null>();
  state = {
    index: this.props.defaultIndex || 0,
    routes: [...this.props.routes],
  };

  buildRoutes = (next: Array<Route>, current: Array<Route>, index: number) => {
    const currentRoute = current[index];
    let nextIndex = next.findIndex(r => r.key === currentRoute.key);
    if (nextIndex === -1) nextIndex = next.length - 1;
    this.setState({ index: nextIndex, routes: next });
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.routes.length !== this.props.routes.length) {
      this.buildRoutes(this.props.routes, this.state.routes, this.state.index);
    }
  }

  private getContext() {
    return this.context as { state: WebViewContextState, api: WebViewContextApi };
  }

  passThroughWebViewStateIfCurrent = (key: string, state: WebViewState) => {
    this.props.onWebViewStateChange?.call(null, key, state);
    if (key === this.state.routes[this.state.index].key) {
      // console.log(state);
      this.getContext().api.setWebViewState(state);
    }
  }
  switchTo = (index: number, url?: string) => {
    if (index >= this.state.routes.length || index < 0) return;
    this.setState({ ...this.state, index });
    const key = this.state.routes[index].key;
    const current = this.webViews.get(key)!;
    const { api } = this.getContext();
    if (!current) {
      api.setWebViewState(defaultWebViewState);
      api.setCurrentWebView(undefined);
    } else {
      api.setWebViewState(current.webViewState);
      api.setCurrentWebView(current);
      const currentUrl = current.url();
      if (!!url && url != currentUrl) current.goTo(url);
    }
  }

  currentIndex = () => this.state.index;

  private onWebViewCreated = (key: string, webView: InstWebView) => {
    this.webViews.set(key, webView);
    if (key === this.state.routes[this.state.index].key) {
      this.getContext().api.setCurrentWebView(webView);
    }
  }

  renderScene = ({ route }: { route: WebTab }) => {
    const key = route.key;
    const url = route.bookmark.uri;
    return <InstWebView uri={url} webViewKey={key} key={key}
      onWebViewStateChange={this.passThroughWebViewStateIfCurrent}
      onWebViewCreated={this.onWebViewCreated} />
  }

  render() {
    return <TabView
      lazy={true}
      swipeEnabled={false}
      navigationState={this.state}
      renderTabBar={doNothing}
      renderScene={this.renderScene}
      onIndexChange={this.switchTo}
      initialLayout={initialLayout}
    />;
  }
}

InstWebViewHolder.contextType = WebViewContext;