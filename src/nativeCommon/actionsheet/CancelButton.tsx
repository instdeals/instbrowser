import React from 'react';
import { TouchableHighlight, Text, StyleProp, ViewStyle, TextStyle } from 'react-native';
import { Callback } from '../../tsCommon/baseTypes';

interface Props {
  styles: {
    buttonContainer: StyleProp<ViewStyle>;
    cancelButton: StyleProp<ViewStyle>;
    buttonTitle: StyleProp<TextStyle>;
    cancelTitle: StyleProp<TextStyle>;
  };
  onPress: Callback<void>;
  options: any[];
  tintColor: any;
  cancelMargin: number;
  buttonHeight: number;
  buttonUnderlayColor: any;
}
export default function CancelButton(props: Props) {
  const {
    styles,
    onPress,
    options,
    tintColor,
    cancelMargin,
    buttonHeight,
    buttonUnderlayColor,
  } = props;

  return <TouchableHighlight
    activeOpacity={1}
    onPress={onPress as any}
    underlayColor={buttonUnderlayColor}
    style={[
      styles.buttonContainer,
      styles.cancelButton,
      {
        marginTop: cancelMargin,
        height: buttonHeight,
      },
    ]}>
    <Text style={[
      styles.buttonTitle,
      styles.cancelTitle,
      { color: tintColor },
    ]}>Cancel</Text>
  </TouchableHighlight>
}
