import React, { SyntheticEvent, PureComponent, RefObject } from 'react';
import { WebView } from 'react-native-webview';
import TsUtils, { DeferredPromise } from '../tsCommon/TsUtils';
import ScrollContext from '../nativeCommon/ScrollContext';
import { Platform } from 'react-native';
import { Callback } from '../tsCommon/baseTypes';

export interface UrlCallback {
  (key: string, url: string, title: string): void
}

export var UserAgent = (__DEV__ && Platform.OS === 'android') ?
  'Mozilla/5.0 (Linux; Android 9; ONEPLUS A3000 Build/PKQ1.181203.001; wv) AppleWebKit/537.36 (KHTML, like Gecko) Version/4.0 Chrome/79.0.3945.136 Mobile Safari/537.36'
  : undefined

export interface WebViewStateCallback {
  (key: string, state: WebViewState): void
}
export interface WebViewState {
  canGoBack: boolean;
  canGoForward: boolean;
  loading: boolean;
  title: string;
  url: string;
  data?: any,
}
export const defaultWebViewState: WebViewState = {
  canGoBack: false,
  canGoForward: false,
  loading: true,
  title: '',
  url: '',
}

function webViewStateEquals(a: WebViewState, b: WebViewState) {
  return a.canGoBack === b.canGoBack &&
    a.canGoForward === b.canGoForward &&
    a.loading === b.loading &&
    a.title === b.title &&
    a.url === b.url;
}

interface Props {
  uri: string;
  style?: Object;
  webViewKey: string;
  onWebViewStateChange?: WebViewStateCallback;
  onWebViewCreated?: (key: string, webView: InstWebView) => void;
}
export class InstWebView extends PureComponent<Props> {
  webView: RefObject<WebView>;
  webViewState: WebViewState = defaultWebViewState;

  state = { uri: this.props.uri };
  constructor(props: Props) {
    super(props);
    console.log('InstWebView created: ' + props.uri);
    this.webView = React.createRef<WebView>();
    props.onWebViewCreated?.call(null, props.webViewKey, this);
  }
  componentDidUpdate(prev: Props) {
    const uri = this.props.uri;
    if (!!uri && uri !== this.state.uri) this.setState({ uri });
  }

  getRef = () => this.webView;

  onMessage = (event: SyntheticEvent) => {
    const newState = event.nativeEvent as WebViewState;
    console.log(newState);
    /*
    if (newState.data) {
      const data = JSON.parse(newState.data) as MessageData;
      console.log('Message Data Type: ' + data.type);
      if (data.type == 'openUrl') {
        this.setState({ uri: data.url! });
      } else if (data.type === 'productDetail') {
        const ts = Date.now();
        const product = data.productDetail;
        if (!product) {
          this.deferredBookmark!.resolve!({
            createTimestamp: ts,
            updateTimestamp: ts,
            uri: newState.url,
            title: newState.title,
          });
        } else {
          console.log('productDetail:' + JSON.stringify(product));
          this.deferredBookmark!.resolve!({
            createTimestamp: ts,
            updateTimestamp: ts,
            uri: newState.url,
            title: product.title,
            icon: product.image,
            productInfo: {
              provider: data.provider!,
              pricingAtCreation: {
                listPrice: product.listPrice,
                dealPrice: product.dealPrice,
              },
              reviewScore: product.reviewScore,
              reviewNum: product.reviewNum,
            }
          });
        }
      }*
      if (this.props.onMessageData) {
        this.props.onMessageData(this.props.webViewKey, data);
      }
    }*/
    if (this.webViewState === null || !webViewStateEquals(this.webViewState, newState)) {
      this.webViewState = newState;
      if (this.props.onWebViewStateChange) this.props.onWebViewStateChange(this.props.webViewKey, newState);
    }
  };

  goTo = (uri: string) => {
    this.setState({ uri });
  }

  goBack = () => {
    this.webView.current?.goBack();
  }
  goForward = () => {
    this.webView.current?.goForward();
  }

  onLoadStart = (event: SyntheticEvent) => {
    this.onMessage(event);
  };
  onLoadEnd = (event: SyntheticEvent) => {
    this.onMessage(event);
  };
  onLoadProgress = (event: SyntheticEvent) => {
    this.onMessage(event);
  }

  url = () => {
    return this.webViewState.url;
  }
  render() {
    return <ScrollContext.Consumer>{(scrollState) => <WebView
      onScroll={(e) => scrollState.onScrollY(e.nativeEvent.contentOffset.y)}
      onTouchStart={(e) => scrollState.onTouchStart()}
      onTouchEnd={(e) => scrollState.onTouchEnd()}
      key={this.props.webViewKey}
      ref={this.webView}
      style={{ flex: 1 }} source={{ uri: this.state.uri }}
      originWhitelist={['*']}
      onLoadEnd={this.onLoadEnd}
      onLoadProgress={this.onLoadEnd}
      userAgent={UserAgent}
      onLoadStart={this.onLoadStart} />}
    </ScrollContext.Consumer>
  }
}