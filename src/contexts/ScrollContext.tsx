import React, { ReactNode, useState, PureComponent } from "react";
import { Callback, doNothing } from "../tsCommon/baseTypes";
import { View, Dimensions, LayoutAnimation } from "react-native";
import ArrayUtils from "../tsCommon/ArrayUtils";

const viewWidth = Dimensions.get('window').width;

export interface ScrollContextState {
  onScrollY: Callback<number>,
  onTouchStart: Callback<void>,
  onTouchEnd: Callback<void>,
  registerListener: Callback<Callback<boolean>>,
  unregisterListener: Callback<Callback<boolean>>,
  visibility: boolean,
  setVisibility: Callback<boolean>,
}

const defaultState = {
  onScrollY: doNothing,
  onTouchStart: doNothing,
  onTouchEnd: doNothing,
  registerListener: doNothing,
  unregisterListener: doNothing,
  visibility: true,
  setVisibility: doNothing,
}

const ScrollContext = React.createContext<ScrollContextState>(defaultState);
export default ScrollContext;

interface AutoHideViewProps {
  contentHeight: number,
  children: ReactNode,
}
export class AutoHideView extends PureComponent<AutoHideViewProps> {
  static contextType = ScrollContext;
  visibility = true;
  state = { viewHeight: 0 }

  updateViewHeight = (duration: number = 500) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    const viewHeight = this.visibility ? this.props.contentHeight : 0;
    this.setState({ viewHeight });
  }

  setVisibility = (v: boolean) => {
    this.visibility = v;
    this.updateViewHeight();
  };

  componentDidMount() {
    const scrollState = this.context;
    scrollState.registerListener(this.setVisibility);
    this.updateViewHeight();
  }

  componentWillUnmount() {
    const scrollState = this.context;
    scrollState.unregisterListener(this.setVisibility);
  }

  componentDidUpdate(prevProps: AutoHideViewProps) {
    if (prevProps.contentHeight !== this.props.contentHeight && this.visibility) {
      this.updateViewHeight(100);
    }
  }

  render() {
    return <View style={{ height: this.state.viewHeight, overflow: 'hidden' }}>
      <View style={{
        bottom: 0, width: viewWidth, height: this.props.contentHeight, position: 'absolute'
      }}>
        {this.props.children}
      </View></View>
  }
}

const ScrollThreshold = 40;

class ScrollStateImpl implements ScrollContextState {
  listeners: Array<Callback<boolean>>;
  scrollStartY: number;
  visibility = true;
  touchStarted = false;
  constructor() {
    this.listeners = [];
    this.scrollStartY = 0;
  }
  onScrollY(scrollY: number) {
    if (!this.touchStarted) return;
    if (this.scrollStartY === 0) {
      this.scrollStartY = scrollY;
    } else if (scrollY - this.scrollStartY > ScrollThreshold) {
      this.setVisibility(false);
    } else if (scrollY - this.scrollStartY < -ScrollThreshold) {
      this.setVisibility(true);
    }
  }
  onTouchStart() {
    this.touchStarted = true;
    this.scrollStartY = 0;
  }
  onTouchEnd() {
    // this.touchStarted = false;
  }
  registerListener(listener: Callback<boolean>) {
    this.listeners.push(listener);
  }
  unregisterListener(listener: Callback<boolean>) {
    ArrayUtils.deleteIf(this.listeners, l => l === listener);
  }
  setVisibility(v: boolean) {
    if (v !== this.visibility) {
      console.log("setVisibility:" + v);
      this.visibility = v;
      this.listeners.forEach(l => l(v));
    }
  }
}

export function ScrollViewProvider(props: { children: ReactNode }) {
  const [scrollState] = useState<ScrollContextState>(new ScrollStateImpl());
  return <ScrollContext.Provider value={scrollState}>
    {props.children}
  </ScrollContext.Provider>
}