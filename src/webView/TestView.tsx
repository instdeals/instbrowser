import React, { useCallback, useRef, useState } from "react";
import { Button, View } from "react-native";
import ActionSheet from "../nativeCommon/actionsheet/ActionSheet";
import commonStyles from "../nativeCommon/commonStyles";
import { WebTab } from '../tabs/WebTabContext';
import ArrayUtils from "../tsCommon/ArrayUtils";
import { WebViewState } from "./InstWebView";
import InstWebViewHolder from "./InstWebViewHolder";

var nextKey = 0;
function newTab(): WebTab {
  nextKey++;
  return {
    key: `${nextKey}`,
    loaded: false,
    bookmark: {
      createTimestamp: 0,
      updateTimestamp: 0,
      uri: 'https://www.bing.com',
      title: 'Bing',
    }
  }
}

export default function TestView() {
  const [routes, setRoutes] = useState<WebTab[]>([newTab()]);
  const addTab = useCallback(() => {
    setRoutes([...routes, newTab()]);
  }, [routes]);
  const tabPicker = useRef<ActionSheet>();
  const viewHolder = useRef<InstWebViewHolder>();
  const switchTab = (index: number) => {
    viewHolder.current?.switchTo(index);
  }
  const closeTab = () => {
    setRoutes(ArrayUtils.removeAt(routes, viewHolder.current!.currentIndex()))
  }
  const onWebViewStateChange = (key: string, wvState: WebViewState) => {
    const newRoutes = [...routes];
    const routeToUpdate = newRoutes.find(r => r.key === key);
    if (routeToUpdate) {
      routeToUpdate.bookmark = {
        ...routeToUpdate.bookmark,
        currentUri: wvState.url,
        title: wvState.title,
      }
      setRoutes(newRoutes);
    }
  }
  return <View style={commonStyles.flex1}>
    <View style={commonStyles.flex}>
      <Button onPress={addTab} title='Add' />
      <Button onPress={closeTab} title='Close' />
      <Button onPress={() => tabPicker.current?.show()} title='Pick' />
      <Button onPress={() => setRoutes(routes.map(r => ({
        key: r.key,
        loaded: false,
        bookmark: r.bookmark,
      })))} title='Copy' />
    </View>
    <InstWebViewHolder routes={routes} defaultIndex={0} ref={viewHolder}
      onWebViewStateChange={onWebViewStateChange} />
    <ActionSheet
      ref={tabPicker}
      title='Choose SMS to send to customer'
      options={routes.map(r => `${r.key}: ${r.bookmark.title}`)}
      onPress={switchTab} />
  </View>
}