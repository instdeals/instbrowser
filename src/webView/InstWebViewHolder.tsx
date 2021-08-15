import React, { ReactNode, LegacyRef } from 'react';
import { WebViewState, InstWebView, defaultWebViewState, WebViewStateCallback } from './InstWebView';
import { TabView, SceneRendererProps, NavigationState, Route } from 'react-native-tab-view';
// import { TabBar } from '../SimpleViews';
import { Dimensions } from 'react-native';
import WebViewContext, { WebViewContextApi, WebViewContextState } from '../contexts/WebViewContext';

const viewWidth = Dimensions.get('window').width;
const initialLayout = { width: viewWidth };

interface Props {
  hideTabBar?: boolean,
  renderSceneByKey: (key: string,
    onWebViewStateChange: WebViewStateCallback,
    onWebViewCreated: (key: string, webView: InstWebView) => void) => ReactNode | string,
  routes: Array<Route>,
  defaultIndex?: number,
}
export default class InstWebViewHolder extends React.PureComponent<Props> {
  webViews = new Map<string, InstWebView | null>();
  state = { index: this.props.defaultIndex || 0, routes: [...this.props.routes] };

  buildRoutes = (next: Array<Route>, current: Array<Route>, index: number) => {
    const currentRoute = current[index];
    const nextIndex = next.findIndex(r => r.key === currentRoute.key);
    if (nextIndex === -1) {
      const routes = [...next, currentRoute];
      this.setState({ index: routes.length - 1, routes });
    } else {
      this.setState({ index: nextIndex, routes: next });
    }
  }

  componentDidUpdate = (prevProps: Props) => {
    if (prevProps.routes.length != this.props.routes.length) {
      this.buildRoutes(this.props.routes, this.state.routes, this.state.index);
    }
  }

  private getContext() {
    return this.context as { state: WebViewContextState, api: WebViewContextApi };
  }

  passThroughWebViewStateIfCurrent = (key: string, state: WebViewState) => {
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
      if (!!url && (currentUrl === '' || url != currentUrl)) current.goTo(url);
    }
  }
  renderTabBar = (props: SceneRendererProps & { navigationState: NavigationState<Route> }) => {
    return null;
    /*return this.props.hideTabBar ? null : <TabBar onTabPress={(index) => {
      const tabName = this.state.routes[index].title;
      logUiAction(`WebViewTab-${tabName}`, 'switch');
      this.switchTo(index);
    }} {...props} />*/
  }

  private onWebViewCreated = (key: string, webView: InstWebView) => {
    this.webViews.set(key, webView);
    if (key === this.state.routes[this.state.index].key) {
      this.getContext().api.setCurrentWebView(webView);
    }
  }

  renderScene = ({ route }: { route: Route }) => {
    const key = route.key;
    const sceneOrUrl = this.props.renderSceneByKey(
      key, this.passThroughWebViewStateIfCurrent, this.onWebViewCreated);
    if (typeof sceneOrUrl === 'string') {
      const url = sceneOrUrl as string;
      return <InstWebView uri={url} webViewKey={key} key={key}
        onWebViewStateChange={this.passThroughWebViewStateIfCurrent}
        onWebViewCreated={this.onWebViewCreated} />
    } else {
      return sceneOrUrl as ReactNode;
    }
  }

  render() {
    return <TabView
      lazy={true}
      swipeEnabled={false}
      navigationState={this.state}
      renderTabBar={this.renderTabBar}
      renderScene={this.renderScene}
      onIndexChange={this.switchTo}
      initialLayout={initialLayout}
    />;
  }
}

InstWebViewHolder.contextType = WebViewContext;