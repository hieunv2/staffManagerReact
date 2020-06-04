import i18n from 'i18next';
import {initReactI18next} from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

import en from '../i18n/en_US.json';
import ja from '../i18n/ja_JP.json';
//-------------------------------------

export const languagesLabel = [
  {
    code: 'en-US',
    text: 'English',
  },
  {
    code: 'ja-JP',
    text: '日本語',
  },
];

i18n
  .use(initReactI18next)
  .use(LanguageDetector)
  .init({
    interpolation: {escapeValue: false},
    fallbackLng: 'ja',
    resources: {
      en: {
        translation: en,
      },
      ja: {
        translation: ja,
      },
    },
  });

export default i18n;
