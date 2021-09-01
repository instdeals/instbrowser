import React, { useContext, useMemo } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import BottomBar, { BottomBarItem } from "../nativeCommon/BottomBar";
import commonStyles from "../nativeCommon/commonStyles";
import ArrayUtils from "../tsCommon/ArrayUtils";
import { Callback, StringMap } from "../tsCommon/baseTypes";
import { InstWebView, WebViewStateCallback } from "../webView/InstWebView";
import InstWebViewHolder from "../webView/InstWebViewHolder";
import { WebTab, WebViewTabContext } from "./WebTabContext";

export default function WebTabView() {
  const { state: { tabs } } = useContext(WebViewTabContext)!;
  const routes = useMemo(() => {
    return tabs.filter(t => t.loaded);
  }, [tabs]);

  if (routes.length === 0) return <View />;

  return <InstWebViewHolder
    routes={routes}
    defaultIndex={0} />
}

function WebTabSummaryView(props: { tab: WebTab }) {
  const { tab } = props;
  return <TouchableHighlight >
    <View>
      <Text>{tab.bookmark.uri}</Text>
    </View>
  </TouchableHighlight>
}

export function WebTabSummaryListView(props: {
  onDone: Callback<void>;
}) {
  const { onDone } = props;
  const { state: { tabs }, api } = useContext(WebViewTabContext)!;
  return <View style={commonStyles.flexCol1}>
    {tabs.map(t => <WebTabSummaryView key={t.key} tab={t} />)}
    <BottomBar>
      <BottomBarItem name='x' onPress={api.closeAll} />
      <BottomBarItem name='plus' onPress={api.newTab} />
      <BottomBarItem label='Done' onPress={onDone} />
    </BottomBar>
  </View>
}