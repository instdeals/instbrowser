import React, { useContext, useMemo } from "react";
import { Text, TouchableHighlight, View } from "react-native";
import NavigationContext from "../contexts/NavigationContext";
import BottomBar, { BottomBarItem } from "../views/BottomBar";
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
  const { api: navApi } = useContext(NavigationContext)!;
  const { tab, index } = props;
  return <TouchableHighlight onPress={() => {
    api.switchTab(index);
    navApi.setShownContent(undefined);
  }}>
    <View>
      <Text>{tab.bookmark.title}</Text>
      <Text>{tab.bookmark.currentUri || tab.bookmark.uri}</Text>
    </View>
  </TouchableHighlight>
}

export function WebTabSummaryListView() {
  const { state: { tabs }, api } = useContext(WebViewTabContext)!;
  const { api: navApi } = useContext(NavigationContext)!;
  return <View style={commonStyles.flexCol1}>
    {tabs.map((t, index) => <WebTabSummaryView key={t.key} tab={t} index={index} />)}
    <BottomBar>
      <BottomBarItem name='x' onPress={api.closeAll} />
      <BottomBarItem name='plus' onPress={api.newTab} />
      <BottomBarItem label='Done' onPress={() => navApi.setShownContent(undefined)} />
    </BottomBar>
  </View>
}