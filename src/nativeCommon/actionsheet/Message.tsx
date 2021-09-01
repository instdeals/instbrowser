import React from 'react';
import { useTranslation } from 'react-i18next';
import { View, Text, ViewStyle, StyleProp, TextStyle } from 'react-native';

interface Props {
  text: string;
  style: StyleProp<ViewStyle>;
  titleStyle: StyleProp<TextStyle>;
}
export default function Message(props: Props) {
  const { t } = useTranslation();
  const { text, style, titleStyle } = props;

  if (React.isValidElement(text)) {
    return <View style={style}>{text}</View>;
  }

  return <View style={style}>
    <Text style={titleStyle}>{t(text)}</Text>
  </View>
}
