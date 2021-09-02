import * as RNLocalize from 'react-native-localize';
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
const languageDetector = {
  type: 'languageDetector',
  async: true,
  detect: (cb) => {
    const locale = RNLocalize.getLocales()[0];
    cb(`${locale.languageCode}-${locale.countryCode}`);
  },
  init: () => { },
  cacheUserLanguage: () => { },
};

export function i18nInit(resources: any) {
  i18n.use(languageDetector).use(initReactI18next).init({
    fallbackLng: 'en',
    resources,
  });
}