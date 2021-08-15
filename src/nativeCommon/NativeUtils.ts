import { DependencyList, useEffect } from 'react';
import { BackHandler, Platform } from 'react-native';
import { DefaultTheme } from 'react-native-paper';

export default class NativeUtils {
  // shadowColor: 'black',
  // shadowOffset: { width: 0, height: 3 },
  // shadowOpacity: 0.8,
  static shadowStyle(edge: 'bottom' | 'top') {
    const iosStyle = edge === 'bottom'
      ? {
        backgroundColor: DefaultTheme.colors.background,
        borderBottomColor: '#999',
        borderBottomWidth: 0.5,
      }
      : {
        backgroundColor: DefaultTheme.colors.background,
        borderTopColor: '#999',
        borderTopWidth: 0.5,
      };

    return Platform.select({
      ios: iosStyle,
      android: {
        elevation: 1,
        borderBottomWidth: 0,
      },
    });
  }

  static useBackButton(handler: () => boolean, deps?: DependencyList) {
    useEffect(() => {
      BackHandler.addEventListener("hardwareBackPress", handler);
      return () => {
        BackHandler.removeEventListener("hardwareBackPress", handler);
      };
    }, deps);
  }
}