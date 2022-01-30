import NativeAppConfig, { reactAppConfigForNative } from "./nativeCommon/NativeAppConfig";
import { Platform } from "react-native";

export const reactAppConfig =
  reactAppConfigForNative('https://deliver.tuandudu.com');

export const nativeAppConfig: NativeAppConfig = {
  googleWebClientId:
    '978716970789-h94g5j3tbhkvd4927gm7j8v6e4hk4ogu.apps.googleusercontent.com',
  defaultBgColor: '#F7F7F7',
  bottomIconColor: '#444',
};

export const clientInfo = `${Platform.OS}-${require('../package.json').version}`;

