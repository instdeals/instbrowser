import React, { useContext } from 'react';
import { View, Text, StyleSheet, TextInput } from 'react-native';
import { nativeAppConfig } from "../AppConfig";
import WebViewContext from '../contexts/WebViewContext';
import commonStyles from '../nativeCommon/commonStyles';

export default function AddressBar() {
  const { api } = useContext(WebViewContext)!;
  return <View style={styles.addressBar}>
    <View style={commonStyles.flexGrow1}>
      <TextInput style={styles.textInput}
        onSubmitEditing={(e) => api.goTo(e.nativeEvent.text)}
      />
    </View>
  </View>
}

const styles = StyleSheet.create({
  addressBar: {
    flexDirection: 'row',
    height: 40,
    alignItems: 'center',
    backgroundColor: nativeAppConfig.defaultBgColor,
    paddingLeft: 16,
    paddingRight: 12,
    paddingBottom: 6,
  },
  textInput: {
    height: 32,
    backgroundColor: '#fff',
    color: 'black',
    marginLeft: 8,
    marginRight: 12,
    paddingLeft: 14,
    fontSize: 11,
    borderColor: '#aaa',
    borderWidth: 0.2,
    borderRadius: 4,
  },
});