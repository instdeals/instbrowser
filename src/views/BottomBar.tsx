import React, { ReactNodeArray, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { View, StyleSheet, Text, Platform, TouchableHighlight } from 'react-native';
import { Callback } from '../tsCommon/baseTypes';
import { logUiAction } from '../nativeCommon/Analytics';
import NativeUtils from '../nativeCommon/NativeUtils';
interface Props {
  children: ReactNodeArray,
  maxNumChildren?: number,
}

export let BottomIconColor = '#444';

export default function BottomBar(props: Props) {
  const [showMoreActions, setShowMoreActions] = useState(false);
  const maxNumChildren = props.maxNumChildren || 5;
  const children = props.children;
  if (maxNumChildren >= children.length) {
    return <View style={styles.bottomBar}>{children}</View>;
  }

  const firstBatch = [...children.slice(0, 2),
  <BottomBarItem key='showMoreActions' name={showMoreActions ? 'x' : 'more-horizontal'}
    onPress={() => setShowMoreActions(!showMoreActions)} />,
  ...children.slice(2, 4)];
  if (!showMoreActions) {
    return <View style={styles.bottomBar}>{firstBatch}</View>;
  }
  const secondBatch = [...children.slice(4)];
  return <View style={styles.bottomBarWithMoreActions}>
    <View style={{ ...styles.bottomBarInner, height: 56 }}>{secondBatch}</View>
    <View style={styles.bottomBarInner}>{firstBatch}</View>
  </View>;
}

interface BottomBarItemProps {
  disabled?: boolean,
  name?: string,
  label?: string,
  onPress: Callback<void>,
  onLongPress?: Callback<void>,
}
export function BottomBarItem(props: BottomBarItemProps) {
  const { label, disabled, name, onPress, onLongPress } = props;
  const handlePress = () => {
    logUiAction(`bottomIcon-${name}`, `click-${disabled}`);
    if (!disabled) onPress();
  }
  const handleLongPress = () => {
    if (!disabled && onLongPress) onLongPress();
  }
  return <TouchableHighlight onPress={handlePress} onLongPress={handleLongPress} >
    <View style={{ flexDirection: 'column' }}>
      {name && <Icon style={disabled ? styles.bottomIconDisabled : styles.bottomIcon}
        name={name} size={24} />}
      {label && <Text>{label}</Text>}
    </View>
  </TouchableHighlight>;
}

const styles = StyleSheet.create({
  bottomBarWithMoreActions: {
    flexDirection: 'column',
    ...NativeUtils.shadowStyle('top'),
  },
  bottomBar: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-around',
    ...NativeUtils.shadowStyle('top'),
  },
  bottomBarInner: {
    flexDirection: 'row',
    height: 48,
    justifyContent: 'space-around',
  },
  bottomIcon: {
    padding: 8,
    color: BottomIconColor,
  },
  bottomIconDisabled: {
    padding: 8,
    color: '#777',
  },
});