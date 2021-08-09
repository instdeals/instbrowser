import firebase from '@react-native-firebase/app';
import analytics from '@react-native-firebase/analytics';

if (firebase.app().utils().isRunningInTestLab) {
  firebase.analytics().setAnalyticsCollectionEnabled(false);
}

export function logEvent(name: string, params?: { [key: string]: string | number | boolean } | {}) {
  analytics().logEvent(name, params);
}

export function logUiAction(uiComponentName: string, action: string) {
  analytics().logEvent('uiAction', {
    component: uiComponentName,
    action: action,
  });
}