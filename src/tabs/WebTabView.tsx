import React, { useContext, useMemo } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import BottomBar, { BottomBarItem } from "../nativeCommon/BottomBar";
import commonStyles from "../nativeCommon/commonStyles";
import InstWebViewHolder from "../webView/InstWebViewHolder";
import { WebTab, WebViewTabContext } from "./WebTabContext";

export default function WebTabView() {
  const { state: { tabs }, api } = useContext(WebViewTabContext)!;
  const routes = useMemo(() => {
    return tabs.filter(t => t.loaded);
  }, [tabs]);

  if (routes.length === 0) return <View />;

  return <InstWebViewHolder ref={api.wvHolder} routes={routes} defaultIndex={0}
    onWebViewStateChange={api.updateWebViewState}
  />
}

function WebTabSummaryView(props: {
  tab: WebTab;
  index: number;
}) {
  const { api } = useContext(WebViewTabContext)!;
  const { tab, index } = props;
  return <TouchableHighlight onPress={() => api.switchTab(index)}>
    <View>
      <Text>{tab.bookmark.title}</Text>
      <Text>{tab.bookmark.currentUri || tab.bookmark.uri}</Text>
    </View>
  </TouchableHighlight>
}

export function WebTabSummaryListView() {
  const { state: { tabs }, api } = useContext(WebViewTabContext)!;
  return <View style={commonStyles.flexCol1}>
    {tabs.map((t, index) => <WebTabSummaryView key={t.key} tab={t} index={index} />)}
    <BottomBar>
      <BottomBarItem name='x' onPress={api.closeAll} />
      <BottomBarItem name='plus' onPress={api.newTab} />
      <BottomBarItem label='Done' onPress={() => api.setTabsShown(false)} />
    </BottomBar>
  </View>
}