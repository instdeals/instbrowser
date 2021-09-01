import React, { PureComponent } from 'react';
import { useTranslation } from 'react-i18next';
import { TouchableHighlight, Text, ViewStyle, StyleProp } from 'react-native';
import { Callback } from '../../tsCommon/baseTypes';

interface Props {
  option: any;
  styles?: any;
  index: number;
  style?: StyleProp<ViewStyle>;
  fontColor: string;
  buttonHeight: number;
  buttonUnderlayColor: string;
  onPress: Callback<number>;
}
export default function Button(props: Props) {
  const {
    option,
    styles,
    index,
    style,
    fontColor,
    buttonHeight,
    buttonUnderlayColor,
  } = props;
  const { t } = useTranslation();
  const onPress = () => props.onPress(index);

  const height = option.component ? option.height : buttonHeight;

  return <TouchableHighlight
    key={index}
    activeOpacity={1}
    onPress={onPress}
    underlayColor={buttonUnderlayColor}
    style={[styles.buttonContainer, style, { height }]}>
    {option.component ? (
      option.component
    ) : <Text style={[styles.buttonTitle, { color: fontColor }]}>
      {t(option)}
    </Text>
    }
  </TouchableHighlight>
}