import React, { ReactNodeArray, useState } from 'react';
import Icon from 'react-native-vector-icons/Feather';
import { View, StyleSheet, Text, Platform } from 'react-native';
import { Callback } from '../tsCommon/baseTypes';
import { logUiAction } from './Analytics';
import NativeUtils from './NativeUtils';
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
  <BottomBarIcon key='showMoreActions' name={showMoreActions ? 'x' : 'more-horizontal'}
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

interface BottomBarIconProps {
  disabled?: boolean,
  name: string,
  label?: string,
  onPress: Callback<void>,
  onLongPress?: Callback<void>,
}
export function BottomBarIcon(props: BottomBarIconProps) {
  const { label, disabled, name, onPress, onLongPress } = props;
  const handlePress = () => {
    logUiAction(`bottomIcon-${name}`, `click-${disabled}`);
    if (!disabled) onPress();
  }
  const handleLongPress = () => {
    if (!disabled && onLongPress) onLongPress();
  }
  if (label) {
    return <View style={{ flexDirection: 'column' }}><Icon style={disabled ? styles.bottomIconDisabled : styles.bottomIcon}
      name={name} size={24} onPress={handlePress} onLongPress={handleLongPress} />
      <Text>{label}</Text>
    </View>
  }
  return <Icon style={disabled ? styles.bottomIconDisabled : styles.bottomIcon}
    name={name} size={24} onPress={handlePress} onLongPress={handleLongPress} />
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